import { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";

const API_URL = "https://agatsa-one-api-651017108992.asia-south1.run.app/v1/devices/catalog";
const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

export type DeviceSku = "ecg_bundle" | "wellness_sub" | "band_sub" | "scale_sub" | "bundle_ecg_band" | "multivital" | "lb90_standard" | "lb90_plus" | "heartguard_starter" | "er30_standard" | "complete_kit";

// Fallback prices in INR (matches last known backend prices)
const FALLBACK_PRICES: Record<DeviceSku, number> = {
  ecg_bundle: 4999,
  wellness_sub: 3999,
  band_sub: 3999,
  scale_sub: 1899,
  bundle_ecg_band: 5999,
  multivital: 5999,
  lb90_standard: 4999,
  lb90_plus: 9999,
  heartguard_starter: 24999,
  er30_standard: 4999,
  complete_kit: 12999,
};

// MRP (Maximum Retail Price) — rounded figures for strikethrough display
export const MRP_PRICES: Record<DeviceSku, number> = {
  ecg_bundle: 6999,
  wellness_sub: 5499,
  band_sub: 5499,
  scale_sub: 2999,
  bundle_ecg_band: 7999,
  multivital: 7999,
  lb90_standard: 7999,
  lb90_plus: 14999,
  heartguard_starter: 44990,
  er30_standard: 6999,
  complete_kit: 18999,
};

export interface DevicePricingState {
  /** Price in INR for each SKU */
  prices: Record<DeviceSku, number>;
  /** True while the very first fetch is in-flight */
  loading: boolean;
  /** Format a number as ₹X,XXX */
  fmt: (amount: number) => string;
  /** Calculate no-cost EMI (12-month) display string */
  emi: (amount: number) => string;
}

export function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function emiString(amount: number): string {
  return `No-cost EMI from ₹${Math.round(amount / 12).toLocaleString("en-IN")}/month`;
}

/** Raw hook — prefer using the context provider + usePricing() in components */
export function useDevicePricingFetch(): DevicePricingState {
  const [prices, setPrices] = useState<Record<DeviceSku, number>>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPrices = useCallback(async (isFirst: boolean) => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const devices: { sku: string; priceInr: number }[] = data?.devices || [];
      const next = { ...FALLBACK_PRICES };
      for (const d of devices) {
        if (d.sku in next) {
          (next as any)[d.sku] = d.priceInr;
        }
      }
      setPrices(next);
    } catch (e) {
      console.warn("Device pricing fetch failed, keeping current prices", e);
    } finally {
      if (isFirst) {
        setLoading(false);
        setHasFetched(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchPrices(true);
    const id = setInterval(() => fetchPrices(false), REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchPrices]);

  return { prices, loading: loading && !hasFetched, fmt: formatINR, emi: emiString };
}

// ─── React Context so we fetch once at app root ────────────────
const PricingContext = createContext<DevicePricingState | null>(null);

export const PricingProvider = PricingContext.Provider;

/**
 * Currency-aware pricing accessor.
 * Prices stay in INR (the source of truth) but fmt/emi auto-convert to
 * the visitor's display currency (USD outside India). EMI hides for USD
 * since no-cost EMI is an India-only Razorpay offer.
 */
export function usePricing(): DevicePricingState {
  const ctx = useContext(PricingContext);
  const { currency, rate } = useCurrency();

  const prices = ctx?.prices ?? FALLBACK_PRICES;
  const loading = ctx?.loading ?? false;

  return useMemo<DevicePricingState>(() => {
    const fmt = (amount: number) => formatPrice(amount, currency, rate);
    const emi = (amount: number) => {
      if (currency !== "INR") {
        // For non-INR display, show the converted full price as the "monthly"
        // hook is India-only. Hide the EMI line by returning empty string so
        // callers can conditionally render.
        return "";
      }
      return emiString(amount);
    };
    return { prices, loading, fmt, emi };
  }, [prices, loading, currency, rate]);
}
