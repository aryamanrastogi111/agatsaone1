import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface InventoryVariant {
  id: string;
  sku: string | null;
  inventory_quantity: number;
  low_stock_threshold: number;
  product_id: string;
  product_name: string;
  product_image: string | null;
}

// Global cache so all product pages can share inventory state
let cache: Record<string, number> | null = null;
let cacheListeners: Array<() => void> = [];

export function useInventory() {
  const [inventory, setInventory] = useState<Record<string, number>>(cache ?? {});
  const [loading, setLoading] = useState(!cache);

  const loadInventory = useCallback(async () => {
    const sb = supabase as any;
    const { data } = await sb
      .from("product_variants")
      .select("id, sku, inventory_quantity, products(id, name)");

    if (data) {
      const map: Record<string, number> = {};
      data.forEach((v: any) => {
        // key by product id and by product name slug for easy lookup
        if (v.products?.id) map[v.products.id] = (map[v.products.id] ?? 0) + v.inventory_quantity;
        if (v.products?.name) {
          const slug = v.products.name.toLowerCase().replace(/\s+/g, "-");
          map[slug] = (map[slug] ?? 0) + v.inventory_quantity;
        }
        map[v.id] = v.inventory_quantity;
      });
      cache = map;
      setInventory(map);
      cacheListeners.forEach((fn) => fn());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!cache) {
      loadInventory();
    }
    const listener = () => setInventory({ ...cache! });
    cacheListeners.push(listener);
    return () => {
      cacheListeners = cacheListeners.filter((l) => l !== listener);
    };
  }, [loadInventory]);

  const isOutOfStock = (productIdOrSlug: string): boolean => {
    const qty = inventory[productIdOrSlug];
    return qty !== undefined && qty <= 0;
  };

  const getQuantity = (productIdOrSlug: string): number | null => {
    const qty = inventory[productIdOrSlug];
    return qty !== undefined ? qty : null;
  };

  return { inventory, loading, isOutOfStock, getQuantity, reload: loadInventory };
}

export function invalidateInventoryCache() {
  cache = null;
}
