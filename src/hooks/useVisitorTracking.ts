// Tracks visitor presence via Supabase Realtime — no DB writes needed.
// Each browser tab joins the 'live-visitors' presence channel.
// Also increments today's total_visitors count once per unique session per day.
import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  let id = sessionStorage.getItem("agatsa_vsid");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("agatsa_vsid", id);
  }
  return id;
}

// Increment total_visitors once per unique visitor per day
function incrementDailyVisitor() {
  const today = new Date().toISOString().split("T")[0];
  const key = `agatsa_counted_${today}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  // Try to read current value then upsert with +1
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

export function useVisitorTracking() {
  const location = useLocation();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const sessionId = useRef(getSessionId());
  const subscribedRef = useRef(false);

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

    // Count this visitor for today's total
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

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminOrInternal]);

  // Update presence on EVERY page navigation
  useEffect(() => {
    if (isAdminOrInternal) return;
    trackPage(location.pathname);
  }, [location.pathname, isAdminOrInternal, trackPage]);
}
