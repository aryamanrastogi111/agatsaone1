// Tracks visitor presence via Supabase Realtime — no DB writes needed.
// Each browser tab joins the 'live-visitors' presence channel.
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

    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: sessionId.current } },
    });
    channelRef.current = channel;

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        subscribedRef.current = true;
        // Track initial page
        trackPage(location.pathname);
      }
    });

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
    // Only re-init when switching between admin/public
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminOrInternal]);

  // Update presence on EVERY page navigation
  useEffect(() => {
    if (isAdminOrInternal) return;
    trackPage(location.pathname);
  }, [location.pathname, isAdminOrInternal, trackPage]);
}
