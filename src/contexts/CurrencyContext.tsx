import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type Currency,
  currencyForCountry,
  fetchCountryCode,
  fetchUsdRate,
  formatPaise,
  formatPrice,
} from "@/lib/currency";

interface CurrencyContextValue {
  /** Display currency for this visitor. */
  currency: Currency;
  /** Live USD per 1 INR (always populated; falls back to constant on failure). */
  rate: number;
  /** Visitor country code from ipapi.co (e.g. "IN", "US"). May be null. */
  country: string | null;
  /** Manually switch currency (overrides geo detection, persisted to localStorage). */
  setCurrency: (c: Currency) => void;
  /** Format a value in INR rupees in the visitor's display currency. */
  format: (rupees: number) => string;
  /** Format a value in paise (1 INR = 100 paise) in the visitor's display currency. */
  formatPaise: (paise: number) => string;
  /** True until geo detection + FX rate fetch complete. */
  loading: boolean;
}

const OVERRIDE_KEY = "agatsa-currency-override";
const FALLBACK_RATE = 0.012;

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readOverride(): Currency | null {
  // URL param wins (great for testing without a VPN).
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    const param = url.searchParams.get("currency")?.toUpperCase();
    if (param === "INR" || param === "USD") {
      try {
        localStorage.setItem(OVERRIDE_KEY, param);
      } catch {
        /* ignore */
      }
      return param;
    }
    try {
      const stored = localStorage.getItem(OVERRIDE_KEY);
      if (stored === "INR" || stored === "USD") return stored;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const override = readOverride();
  const [currency, setCurrencyState] = useState<Currency>(override ?? "INR");
  const [country, setCountry] = useState<string | null>(null);
  const [rate, setRate] = useState<number>(FALLBACK_RATE);
  const [loading, setLoading] = useState(true);

  // Detect country + resolve currency on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const code = await fetchCountryCode();
      if (cancelled) return;
      setCountry(code);
      // Only auto-set currency when there's no manual override.
      if (!override) {
        setCurrencyState(currencyForCountry(code));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch live FX rate (always fetch — cheap, cached, and we may switch to USD later).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await fetchUsdRate();
      if (cancelled) return;
      setRate(r);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(OVERRIDE_KEY, c);
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      rate,
      country,
      setCurrency,
      format: (rupees: number) => formatPrice(rupees, currency, rate),
      formatPaise: (paise: number) => formatPaise(paise, currency, rate),
      loading,
    }),
    [currency, rate, country, loading],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * Safe to use anywhere — returns INR-only defaults if no provider is mounted.
 */
export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (ctx) return ctx;
  return {
    currency: "INR",
    rate: FALLBACK_RATE,
    country: null,
    setCurrency: () => {},
    format: (rupees: number) => formatPrice(rupees, "INR", FALLBACK_RATE),
    formatPaise: (paise: number) => formatPaise(paise, "INR", FALLBACK_RATE),
    loading: false,
  };
}
