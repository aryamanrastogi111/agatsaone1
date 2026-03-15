import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InventoryItem {
  variantId: string;
  productId: string;
  productSlug: string;
  quantity: number;
}

// Module-level cache
let cache: Record<string, number> | null = null;
let cacheListeners: Array<() => void> = [];

async function fetchInventoryFromDB(): Promise<Record<string, number>> {
  const sb = supabase as any;
  const { data } = await sb
    .from("product_variants")
    .select("id, inventory_quantity, products(id, slug, name)");

  const map: Record<string, number> = {};
  if (data) {
    data.forEach((v: any) => {
      // Key by variant id
      map[v.id] = v.inventory_quantity ?? 0;
      // Key by product slug (sum across all variants)
      const slug = v.products?.slug;
      if (slug) map[slug] = (map[slug] ?? 0) + (v.inventory_quantity ?? 0);
      // Key by product id
      const pid = v.products?.id;
      if (pid) map[pid] = (map[pid] ?? 0) + (v.inventory_quantity ?? 0);
    });
  }
  return map;
}

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, number>>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    const map = await fetchInventoryFromDB();
    cache = map;
    setInventory(map);
    cacheListeners.forEach((fn) => fn());
    setLoading(false);
  }, []);

  useEffect(() => {
    const listener = () => { if (cache) setInventory({ ...cache }); };
    cacheListeners.push(listener);

    if (!cache) {
      loadInventory();
    } else {
      setInventory({ ...cache });
      setLoading(false);
    }

    return () => {
      cacheListeners = cacheListeners.filter((l) => l !== listener);
    };
  }, [loadInventory]);

  /** Check if a product/variant is out of stock by its slug, product id, or variant id */
  const isOutOfStock = (key: string): boolean => {
    const qty = inventory[key];
    return qty !== undefined && qty <= 0;
  };

  /** Check if a product/variant is low stock (qty > 0 and <= threshold, default 10) */
  const isLowStock = (key: string, threshold = 10): boolean => {
    const qty = inventory[key];
    return qty !== undefined && qty > 0 && qty <= threshold;
  };

  /** Get available quantity for a key */
  const getQuantity = (key: string): number | null => {
    const qty = inventory[key];
    return qty !== undefined ? qty : null;
  };

  return { inventory, loading, isOutOfStock, isLowStock, getQuantity, reload: loadInventory };
}

export function invalidateInventoryCache() {
  cache = null;
  cacheListeners.forEach((fn) => fn());
}
