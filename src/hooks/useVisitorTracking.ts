// Tracks visitor presence via Supabase Realtime.
// Logs page views with UTM params, manages visitor sessions for audience quality.
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/supabase/db";

interface GeoInfo {
  city: string | null;
  region: string | null;
}

let cachedGeo: GeoInfo | null = null;
let cachedIsBot: boolean | null = null;

/** Detect bots via user-agent patterns, webdriver flag, and missing browser features */
function isBot(): boolean {
  if (cachedIsBot !== null) return cachedIsBot;
  try {
    const ua = navigator.userAgent.toLowerCase();
    const botPatterns = /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|googlebot|yandex|baidu|duckduck|semrush|ahref|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|headlesschrome|phantomjs|prerender|lighthouse|pagespeed|pingdom|uptimerobot|statuspage|monitoring|screaming|dataforseo|zoominfobot|applebot|twitterbot|linkedinbot|discordbot|telegrambot|whatsapp|mediapartners|adsbot|feedfetcher|site24x7|newrelic|datadog|catchpoint|gtmetrix|webpagetest|chrome-lighthouse/;
    if (botPatterns.test(ua)) { cachedIsBot = true; return true; }
    // Headless / automated browsers
    if ((navigator as any).webdriver === true) { cachedIsBot = true; return true; }
    // Very short or missing user-agent
    if (!ua || ua.length < 20) { cachedIsBot = true; return true; }
    // No language set (common in bots)
    if (!navigator.language) { cachedIsBot = true; return true; }
    // No plugins and zero screen dimensions (headless indicators)
    if (navigator.plugins && navigator.plugins.length === 0 && screen.width === 0) { cachedIsBot = true; return true; }
    // No pointer device (synthetic environments)
    if (typeof window.matchMedia === "function" && !window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(pointer: coarse)").matches) { cachedIsBot = true; return true; }
  } catch {
    // If navigator isn't available, skip
  }
  cachedIsBot = false;
  return false;
}

async function fetchGeoInfo(): Promise<GeoInfo> {
  if (cachedGeo) return cachedGeo;
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      cachedGeo = { city: data.city || null, region: data.region || null };
      return cachedGeo;
    }
  } catch {
    // Geolocation not critical
  }
  return { city: null, region: null };
}

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
async function incrementDailyVisitor() {
  // Use IST date to match the snapshot edge function
  const now = new Date();
  const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const today = istDate.toISOString().split("T")[0];
  const key = `agatsa_counted_${today}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  const { error } = await supabase.rpc("increment_daily_visitor", { target_date: today });
  if (error) {
    console.error("[Tracking] increment_daily_visitor failed:", error.message);
    // Remove flag so it retries next navigation
    sessionStorage.removeItem(key);
  }
}

// Create or update visitor session
async function upsertSession(sessionId: string, pagePath: string, isFirst: boolean) {
  const utm = getUtmParams();
  const device = window.innerWidth < 768 ? "mobile" : "desktop";
  const referrer = document.referrer
    ? document.referrer.includes(window.location.hostname) ? "internal" : new URL(document.referrer).hostname
    : "direct";
  const geo = await fetchGeoInfo();

  if (isFirst) {
    const { error } = await db.from("visitor_sessions").upsert({
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
      city: geo.city,
      region: geo.region,
    }, { onConflict: "session_id" });
    if (error) console.error("[Tracking] upsert session failed:", error.message);
  } else {
    const { data, error: readErr } = await db
      .from("visitor_sessions")
      .select("page_count")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (readErr) {
      console.error("[Tracking] read session failed:", readErr.message);
      return;
    }
    if (data) {
      const { error: updErr } = await db
        .from("visitor_sessions")
        .update({
          last_seen_at: new Date().toISOString(),
          exit_page: pagePath,
          page_count: (data.page_count || 1) + 1,
        })
        .eq("session_id", sessionId);
      if (updErr) console.error("[Tracking] update session failed:", updErr.message);
    }
  }
}

// Log page view
async function logPageView(pagePath: string, sessionId: string) {
  const utm = getUtmParams();
  const { error } = await db.from("page_views").insert({
    page_path: pagePath,
    session_id: sessionId,
    ...utm,
  });
  if (error) console.error("[Tracking] page_view insert failed:", error.message);
}

// Periodically update last_seen for accurate session duration
function setupBeaconTracking(sessionId: string) {
  const key = `agatsa_beacon_set`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  const interval = setInterval(() => {
    db.from("visitor_sessions")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("session_id", sessionId)
      .then(({ error }: { error: { message: string } | null }) => {
        if (error) console.error("[Tracking] heartbeat failed:", error.message);
      });
  }, 30000);

  window.addEventListener("beforeunload", () => {
    clearInterval(interval);
  });
}

export function useVisitorTracking() {
  const location = useLocation();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const sessionId = useRef(getSessionId());
  const subscribedRef = useRef(false);
  const isFirstPage = useRef(true);
  const isAdminRef = useRef(false);
  const geoRef = useRef<GeoInfo>({ city: null, region: null });

  const device = typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";

  isAdminRef.current =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/sdk");

  const trackPage = useCallback((pathname: string) => {
    if (!channelRef.current || !subscribedRef.current) return;
    channelRef.current.track({
      session_id: sessionId.current,
      current_page: pathname,
      device,
      city: geoRef.current.city || undefined,
      region: geoRef.current.region || undefined,
      referrer: document.referrer
        ? document.referrer.includes(window.location.hostname) ? "internal" : document.referrer
        : "direct",
      started_at: sessionStorage.getItem("agatsa_vsid_start") ?? new Date().toISOString(),
    });
  }, [device]);

  // Subscribe once on mount (for public pages) — deferred to avoid blocking first paint
  useEffect(() => {
    if (isAdminRef.current || isBot()) return;

    captureUtmParams();

    // Defer all tracking work until after first paint
    const schedule = typeof requestIdleCallback === "function"
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 1500);

    const handle = schedule(() => {
      incrementDailyVisitor();

      // Fetch geo info
      fetchGeoInfo().then((geo) => {
        geoRef.current = geo;
      });

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

      upsertSession(sessionId.current, location.pathname, true);
      setupBeaconTracking(sessionId.current);
    });

    return () => {
      if (typeof cancelIdleCallback === "function" && typeof handle === "number") {
        cancelIdleCallback(handle);
      }
      subscribedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update presence and log page view on every navigation
  useEffect(() => {
    if (isAdminRef.current || isBot()) return;
    trackPage(location.pathname);
    logPageView(location.pathname, sessionId.current);

    if (isFirstPage.current) {
      isFirstPage.current = false;
    } else {
      upsertSession(sessionId.current, location.pathname, false);
    }
  }, [location.pathname, trackPage]);
}
