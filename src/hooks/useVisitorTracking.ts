// Tracks visitor presence via Supabase Realtime — no DB writes needed.
// Each browser tab joins the 'live-visitors' presence channel.
import { useEffect, useRef } from "react";
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

  // Skip tracking for admin and SDK portal routes
  const isAdminOrInternal =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/sdk");

  useEffect(() => {
    if (isAdminOrInternal) return;

    subscribedRef.current = false;

    const device = window.innerWidth < 768 ? "mobile" : "desktop";
    const referrer = document.referrer
      ? document.referrer.includes(window.location.hostname)
        ? "internal"
        : document.referrer
      : "direct";

    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: sessionId.current } },
    });

    channelRef.current = channel;

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        subscribedRef.current = true;
        await channel.track({
          session_id: sessionId.current,
          current_page: location.pathname,
          device,
          referrer,
          started_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      subscribedRef.current = false;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [isAdminOrInternal]); // re-init when switching between admin/public

  // Update presence on page navigation (public pages only)
  useEffect(() => {
    if (isAdminOrInternal) return;
    if (channelRef.current && subscribedRef.current) {
      channelRef.current.track({
        session_id: sessionId.current,
        current_page: location.pathname,
        device: window.innerWidth < 768 ? "mobile" : "desktop",
        referrer: document.referrer || "direct",
        started_at: sessionStorage.getItem("agatsa_vsid_start") ?? new Date().toISOString(),
      });
    }
  }, [location.pathname, isAdminOrInternal]);
}
