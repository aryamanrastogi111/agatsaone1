// Tracks visitor presence via Supabase Realtime.
// Logs page views with UTM params, manages visitor sessions for audience quality.
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function getSessionId(): string {
  let id = sessionStorage.getItem("agatsa_vsid");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("agatsa_vsid", id);
    sessionStorage.setItem("agatsa_vsid_start", new Date().toISOString());
  }
  return id;
}

function getUtmParams() {
  const url = new URL(window.location.href);
  return {
    utm_source: url.searchParams.get("utm_source") || sessionStorage.getItem("agatsa_utm_source") || null,
    utm_medium: url.searchParams.get("utm_medium") || sessionStorage.getItem("agatsa_utm_medium") || null,
    utm_campaign: url.searchParams.get("utm_campaign") || sessionStorage.getItem("agatsa_utm_campaign") || null,
  };
}

// Persist UTM params from first landing
function captureUtmParams() {
  const url = new URL(window.location.href);
  const src = url.searchParams.get("utm_source");
  const med = url.searchParams.get("utm_medium");
  const camp = url.searchParams.get("utm_campaign");
  if (src) sessionStorage.setItem("agatsa_utm_source", src);
  if (med) sessionStorage.setItem("agatsa_utm_medium", med);
  if (camp) sessionStorage.setItem("agatsa_utm_campaign", camp);
}

// Increment total_visitors once per unique visitor per day
function incrementDailyVisitor() {
  const today = new Date().toISOString().split("T")[0];
  const key = `agatsa_counted_${today}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  db.from("daily_stats")
    .select("total_visitors")
    .eq("stat_date", today)
    .maybeSingle()
    .then(({ data }: { data: { total_visitors: number } | null }) => {
      const current = data?.total_visitors ?? 0;
      db.from("daily_stats").upsert(
        { stat_date: today, total_visitors: current + 1 },
        { onConflict: "stat_date" }
      );
    });
}

// Create or update visitor session
function upsertSession(sessionId: string, pagePath: string, isFirst: boolean) {
  const utm = getUtmParams();
  const device = window.innerWidth < 768 ? "mobile" : "desktop";
  const referrer = document.referrer
    ? document.referrer.includes(window.location.hostname) ? "internal" : new URL(document.referrer).hostname
    : "direct";

  if (isFirst) {
    db.from("visitor_sessions").upsert({
      session_id: sessionId,
      started_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      page_count: 1,
      entry_page: pagePath,
      exit_page: pagePath,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      device,
      referrer,
    }, { onConflict: "session_id" });
  } else {
    // Update last_seen_at, exit_page, and increment page_count
    db.from("visitor_sessions")
      .select("page_count")
      .eq("session_id", sessionId)
      .maybeSingle()
      .then(({ data }: { data: { page_count: number } | null }) => {
        if (data) {
          db.from("visitor_sessions")
            .update({
              last_seen_at: new Date().toISOString(),
              exit_page: pagePath,
              page_count: (data.page_count || 1) + 1,
            })
            .eq("session_id", sessionId)
            .then(() => {});
        }
      });
  }
}

// Log page view
function logPageView(pagePath: string, sessionId: string) {
  const utm = getUtmParams();
  db.from("page_views").insert({
    page_path: pagePath,
    session_id: sessionId,
    ...utm,
  });
}

// Update last_seen on beforeunload for accurate session duration
function setupBeaconTracking(sessionId: string) {
  const key = `agatsa_beacon_set`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  // Periodically update last_seen (every 30s) for accurate duration
  const interval = setInterval(() => {
    db.from("visitor_sessions")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("session_id", sessionId)
      .then(() => {});
  }, 30000);

  window.addEventListener("beforeunload", () => {
    clearInterval(interval);
    // Final update via sendBeacon if available
    const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/visitor_sessions?session_id=eq.${sessionId}`;
    const body = JSON.stringify({ last_seen_at: new Date().toISOString() });
    try {
      navigator.sendBeacon(url, ""); // beacon doesn't support PATCH well, rely on interval
    } catch { /* ignore */ }
  });
}

export function useVisitorTracking() {
  const location = useLocation();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const sessionId = useRef(getSessionId());
  const subscribedRef = useRef(false);
  const isFirstPage = useRef(true);

  const isAdminOrInternal =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/sdk");

  const device = typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";

  const trackPage = useCallback((pathname: string) => {
    if (!channelRef.current || !subscribedRef.current) return;
    channelRef.current.track({
      session_id: sessionId.current,
      current_page: pathname,
      device,
      referrer: document.referrer
        ? document.referrer.includes(window.location.hostname) ? "internal" : document.referrer
        : "direct",
      started_at: sessionStorage.getItem("agatsa_vsid_start") ?? new Date().toISOString(),
    });
  }, [device]);

  // Subscribe once on mount (for public pages)
  useEffect(() => {
    if (isAdminOrInternal) return;

    captureUtmParams();
    incrementDailyVisitor();

    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: sessionId.current } },
    });
    channelRef.current = channel;

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        subscribedRef.current = true;
        trackPage(location.pathname);
      }
    });

    // Create session record
    upsertSession(sessionId.current, location.pathname, true);
    setupBeaconTracking(sessionId.current);

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminOrInternal]);

  // Update presence and log page view on every navigation
  useEffect(() => {
    if (isAdminOrInternal) return;
    trackPage(location.pathname);
    logPageView(location.pathname, sessionId.current);

    if (isFirstPage.current) {
      isFirstPage.current = false;
    } else {
      upsertSession(sessionId.current, location.pathname, false);
    }
  }, [location.pathname, isAdminOrInternal, trackPage]);
}
