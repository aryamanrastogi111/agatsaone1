// Plays a short Shopify-style "cha-ching" chime when a new order is inserted.
// Admin-panel only. Uses WebAudio (no asset files), and Supabase Realtime.
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

function playChime() {
  try {
    const Ctx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();

    const now = ctx.currentTime;
    // Two-note bell: E6 -> A6 (Shopify-ish)
    const notes: Array<[number, number]> = [
      [1318.51, 0.0],
      [1760.0, 0.12],
    ];

    notes.forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;

      const start = now + delay;
      const dur = 0.45;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.05);
    });

    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch {
    /* no-op */
  }
}

export function useNewOrderSound(enabled: boolean = true) {
  const mountedAt = useRef<string>(new Date().toISOString());

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel("admin-new-orders-sound")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          // Ignore orders created before this admin session started
          const createdAt = (payload.new as any)?.created_at as
            | string
            | undefined;
          if (createdAt && createdAt < mountedAt.current) return;
          playChime();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled]);
}
