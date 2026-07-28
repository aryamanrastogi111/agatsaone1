// Syncs the active checkout/cart state to the cart_sessions table.
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function getVisitorSessionId(): string {
  let id = sessionStorage.getItem("agatsa_vsid");
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("agatsa_vsid", id);
    sessionStorage.setItem("agatsa_vsid_start", new Date().toISOString());
  }
  return id;
}

export function useCartSync() {
  const items = useCartStore((s) => s.items);
  const location = useLocation();
  const sessionId = useRef(getVisitorSessionId());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounce sync — don't spam on rapid add/remove
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const subtotal = items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0);
      const item_count = items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);

      if (item_count === 0) return; // don't sync empty carts

      const { error } = await db.from("cart_sessions").upsert(
        {
          session_id: sessionId.current,
          items,
          subtotal,
          item_count,
          last_page: location.pathname,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );
      if (error) console.error("[CartSync] cart_sessions upsert failed:", error.message);
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [items, location.pathname]);
}
