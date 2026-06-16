# Multi-Currency Display (Live FX: INR for India, USD for Everyone Else)

Display-only conversion. Razorpay still charges in INR. No DB changes.

## Detection
- Call `ipapi.co/json/` once on first visit, read `country_code`, cache in `sessionStorage`.
- `IN` → currency = `INR` (₹), no switcher.
- anything else (or detection fails on a non-IN preview) → `USD` ($).
- Manual override via `?currency=INR|USD` URL param (handy for testing without a VPN).

## Live FX rate (the part you asked to fix)
- Fetch live INR→USD rate from **Frankfurter** (`https://api.frankfurter.app/latest?from=INR&to=USD`) — free, no API key, no rate limit, ECB-sourced daily rates.
- Cache result in `localStorage` for 12 hours so we don't refetch on every page nav (rates only update once a day anyway).
- Fallback chain if Frankfurter is down:
  1. Try **exchangerate.host** as backup (also free, no key).
  2. If both fail, use last cached rate (even if expired).
  3. If no cache exists at all, fall back to `0.012` so prices never break.
- Cached object: `{ rate: 0.01198, fetchedAt: 1750000000000 }` under key `agatsa-fx-usd`.

## What gets built

**New: `src/lib/currency.ts`**
- `type Currency = "INR" | "USD"`
- `fetchUsdRate(): Promise<number>` — Frankfurter → exchangerate.host → cache → constant fallback.
- `formatPrice(rupees, currency, rate)`:
  - `INR` → `₹4,999` (Indian grouping)
  - `USD` → `$60` (rounded to whole dollar so prices don't look like `$59.94`)

**New: `src/contexts/CurrencyContext.tsx`**
- On mount: resolves currency (URL param → sessionStorage → ipapi.co).
- If currency is `USD`, kicks off `fetchUsdRate()` and stores in state.
- Exposes `{ currency, rate, format(rupees), loading }`. Wrapped in `src/App.tsx`.

**Edits — one touchpoint cascades everywhere**
- `src/hooks/useDevicePricing.ts` — `fmt()` becomes currency-aware. Every price across the site (home, /devices, /pricing, all product pages, sticky cart, checkout summary) already flows through this, so they all switch automatically.
- `src/components/StrikePrice.tsx` and `src/components/EmiLine.tsx` — use the currency-aware formatter. EMI line hides for USD (no-cost EMI is an India-only offer).
- `src/components/shop/StickyCartBar.tsx`, `src/pages/Checkout.tsx` — use the formatter. Checkout shows a persistent note when currency is USD:
  > "Final charge is in INR (₹X,XXX) by Razorpay at today's rate (1 USD ≈ ₹Y). Your bank converts to USD on your statement."

## Out of scope
- GBP / EUR (USD only for non-IN, as you said).
- Per-country pricing or true USD settlement (Razorpay would need separate Stripe-style setup).
- Translating product copy or PDF invoices.

## Testing
1. **Force USD in the preview:** add `?currency=USD` to any URL — e.g. `/devices?currency=USD`. All prices flip to live-converted USD.
2. **Force INR:** `?currency=INR` or default (the preview's IP is in India).
3. **Real geo test:** open the published URL through a free VPN (Proton VPN free, Opera VPN, 1.1.1.1 WARP set to US). Site auto-picks USD with no override.
4. **Check the rate is live:** open DevTools → Network and filter for `frankfurter.app` on first non-IN load. You'll see the rate response. Refresh within 12h → no new call (served from cache). Clear `localStorage.agatsa-fx-usd` to force a refresh.
5. **Razorpay sanity check:** on a USD session go to checkout, open Razorpay modal — the charge amount must still read `₹…` (we only convert *display*, not the actual charge). Don't complete payment.

## Files touched
- New: `src/lib/currency.ts`, `src/contexts/CurrencyContext.tsx`
- Edited: `src/App.tsx`, `src/hooks/useDevicePricing.ts`, `src/components/StrikePrice.tsx`, `src/components/EmiLine.tsx`, `src/components/shop/StickyCartBar.tsx`, `src/pages/Checkout.tsx`
