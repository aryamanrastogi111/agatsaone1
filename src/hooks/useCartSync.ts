// Syncs the Zustand cart store to Supabase cart_sessions table.
// Drop this in App.tsx inside the Router so it has access to cart state.
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function getCartSessionId(): string {
  let id = localStorage.getItem("agatsa_cart_session");
  if (!id) {
    id = `cs_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("agatsa_cart_session", id);
  }
  return id;
}

export function useCartSync() {
  const items = useCart((s) => s.items);
  const location = useLocation();
  const sessionId = useRef(getCartSessionId());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounce sync — don't spam on rapid add/remove
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const item_count = items.reduce((sum, i) => sum + i.quantity, 0);

      if (item_count === 0) return; // don't sync empty carts

      await db.from("cart_sessions").upsert(
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
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [items, location.pathname]);
}
