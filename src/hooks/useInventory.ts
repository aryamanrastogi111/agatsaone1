import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InventoryItem {
  variantId: string;
  productId: string;
  productSlug: string;
  quantity: number;
}

// Module-level cache with TTL
let cache: Record<string, number> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30_000; // 30 seconds — keeps marketing pages fresh w/ admin changes
let inflight: Promise<Record<string, number>> | null = null;
let cacheListeners: Array<() => void> = [];
let realtimeSubscribed = false;

async function fetchInventoryFromDB(): Promise<Record<string, number>> {
  const sb = supabase as any;
  const { data } = await sb
    .from("product_variants")
    .select("id, inventory_quantity, products(id, slug, name)");

  const map: Record<string, number> = {};
  if (data) {
    data.forEach((v: any) => {
      map[v.id] = v.inventory_quantity ?? 0;
      const slug = v.products?.slug;
      if (slug) map[slug] = (map[slug] ?? 0) + (v.inventory_quantity ?? 0);
      const pid = v.products?.id;
      if (pid) map[pid] = (map[pid] ?? 0) + (v.inventory_quantity ?? 0);
    });
  }
  return map;
}

function ensureRealtime() {
  if (realtimeSubscribed) return;
  realtimeSubscribed = true;
  const sb = supabase as any;
  sb.channel("product_variants_inventory")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "product_variants" },
      () => {
        // Invalidate so next consumer refetches; also trigger immediate refresh.
        cache = null;
        cacheTimestamp = 0;
        fetchInventoryFromDB().then((map) => {
          cache = map;
          cacheTimestamp = Date.now();
          cacheListeners.forEach((fn) => fn());
        });
      }
    )
    .subscribe();
}

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, number>>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  const loadInventory = useCallback(async (force = false) => {
    const fresh = cache && Date.now() - cacheTimestamp < CACHE_TTL_MS;
    if (fresh && !force) {
      setInventory({ ...cache! });
      setLoading(false);
      return;
    }
    if (!inflight) {
      inflight = fetchInventoryFromDB().finally(() => {
        // clear inflight after resolution below
      });
    }
    setLoading(!cache);
    try {
      const map = await inflight;
      cache = map;
      cacheTimestamp = Date.now();
      setInventory(map);
      cacheListeners.forEach((fn) => fn());
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const listener = () => { if (cache) setInventory({ ...cache }); };
    cacheListeners.push(listener);
    ensureRealtime();
    loadInventory();
    return () => {
      cacheListeners = cacheListeners.filter((l) => l !== listener);
    };
  }, [loadInventory]);

  const isOutOfStock = (key: string): boolean => {
    const qty = inventory[key];
    return qty !== undefined && qty <= 0;
  };

  const isLowStock = (key: string, threshold = 10): boolean => {
    const qty = inventory[key];
    return qty !== undefined && qty > 0 && qty <= threshold;
  };

  const getQuantity = (key: string): number | null => {
    const qty = inventory[key];
    return qty !== undefined ? qty : null;
  };

  return { inventory, loading, isOutOfStock, isLowStock, getQuantity, reload: () => loadInventory(true) };
}

export function invalidateInventoryCache() {
  cache = null;
  cacheTimestamp = 0;
  cacheListeners.forEach((fn) => fn());
}
