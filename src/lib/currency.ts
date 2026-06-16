// Multi-currency display helpers.
// INR is the base. USD is converted using a live FX rate fetched from
// Frankfurter (free, no API key, ECB-sourced daily rates) with a fallback
// to exchangerate.host and finally a constant if both fail.

export type Currency = "INR" | "USD";

const FX_CACHE_KEY = "agatsa-fx-usd";
const FX_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const FALLBACK_USD_PER_INR = 0.012; // safety net (~₹83/$)

interface FxCache {
  rate: number; // USD per 1 INR
  fetchedAt: number;
}

function readCache(): FxCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FX_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FxCache;
  } catch {
    return null;
  }
}

function writeCache(rate: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      FX_CACHE_KEY,
      JSON.stringify({ rate, fetchedAt: Date.now() } satisfies FxCache),
    );
  } catch {
    /* ignore quota errors */
  }
}

async function fetchFromFrankfurter(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=INR&to=USD",
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.USD;
    return typeof rate === "number" && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

async function fetchFromExchangerateHost(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=INR&symbols=USD",
    );
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.rates?.USD;
    return typeof rate === "number" && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

/**
 * Resolve the live INR→USD rate.
 *
 * Order:
 *   1. Fresh cache (<12h) → return immediately.
 *   2. Frankfurter API → cache and return.
 *   3. exchangerate.host → cache and return.
 *   4. Stale cache (any age) → return.
 *   5. Hardcoded fallback constant.
 */
export async function fetchUsdRate(): Promise<number> {
  const cached = readCache();
  if (cached && Date.now() - cached.fetchedAt < FX_TTL_MS) {
    return cached.rate;
  }

  const fresh =
    (await fetchFromFrankfurter()) ?? (await fetchFromExchangerateHost());
  if (fresh) {
    writeCache(fresh);
    return fresh;
  }

  if (cached) return cached.rate;
  return FALLBACK_USD_PER_INR;
}

/**
 * Format a price held in INR rupees, converted to the visitor's currency.
 * USD rounds to whole dollars so we never show ugly $59.94 prices.
 */
export function formatPrice(
  rupees: number,
  currency: Currency,
  usdRate: number,
): string {
  if (currency === "USD") {
    const usd = Math.max(1, Math.round(rupees * usdRate));
    return "$" + usd.toLocaleString("en-US");
  }
  return "₹" + Math.round(rupees).toLocaleString("en-IN");
}

/** Same as formatPrice but for a value already in paise (1 INR = 100 paise). */
export function formatPaise(
  paise: number,
  currency: Currency,
  usdRate: number,
): string {
  return formatPrice(paise / 100, currency, usdRate);
}

const GEO_CACHE_KEY = "agatsa-geo-country";

/**
 * Resolve the visitor country code (ISO-2 like "IN", "US") via ipapi.co.
 * Cached in sessionStorage so we never hit the API twice in one session.
 */
export async function fetchCountryCode(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) return cached;
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = await res.json();
    const code: string | undefined = data?.country_code;
    if (code) {
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, code);
      } catch {
        /* ignore */
      }
      return code;
    }
    return null;
  } catch {
    return null;
  }
}

/** IN visitors see INR; everyone else (or detection failure) sees USD. */
export function currencyForCountry(code: string | null): Currency {
  if (code && code.toUpperCase() === "IN") return "INR";
  return "USD";
}
