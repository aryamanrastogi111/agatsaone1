# Complete Health Kit Bundle Landing Page

Build a dedicated landing page for the 4-device bundle (SanketLife ECG + EasyTouch Wellness + Rhythm Band + Smart Scale) priced at ₹14,999 (MRP ₹18,999) with a bundled 3-month Nera AI subscription.

## 1. Route & nav

- New route `/complete-health-kit` registered in `src/App.tsx` (lazy).
- Add `Bundle` link in `src/components/Nav.tsx` (both desktop and mobile menu) pointing to `/complete-health-kit`, placed before `Partner with Us`.

## 2. Landing page — `src/pages/CompleteHealthKit.tsx`

Design mirrors the uploaded creative (attached image): AGATSA ONE + NERA AI badge → "Complete Device Bundle" chip → bold headline → devices hero group → 4 feature chips (ECG · Glucose Trends · Sleep · Recovery) → primary CTA.

Sections in order:
1. **Hero** — Badge chip, headline `"Your Heart, Glucose Trends, Sleep & Recovery — reads your body 24/7."`, sub-copy `"Agatsa devices track the signals. NERA AI connects the patterns."`, hero image (4 devices grouped — reuse existing device images composed in a grid), price block `₹14,999` with `₹18,999` strike + `Save ₹4,000` pill, EMI line, `Buy Bundle` primary CTA + `Learn what's inside` secondary anchor.
2. **What you get** — 4 cards, one per device (image + name + one-line value). Uses existing images from `src/assets`.
3. **Free 3-month Nera AI Premium** — Highlight banner with feature list (weekly reports, voice assistant, anomaly alerts, care programmes access).
4. **Bundle math** — Table: individual prices summed vs. bundle price, showing the ₹4,000 savings.
5. **How it works** — Reuse the 4-step "capture → sync → analyse → doctor" pipeline pattern from Devices page.
6. **Trust row** — CDSCO / 2.1 Lac+ users / clinically validated badges.
7. **FAQ** — 5-6 items (shipping, warranty, Nera AI activation, individual vs bundle, EMI, returns).
8. **Sticky mobile buy bar** with price + CTA.

CTAs route to `/checkout?sku=complete_kit`.

## 3. New bundle SKU

Add `complete_kit` SKU wired throughout:

- `src/hooks/useDevicePricing.ts` — extend `DeviceSku` union; add `complete_kit: 14999` to `FALLBACK_PRICES` and `complete_kit: 18999` to `MRP_PRICES`.
- `src/pages/Checkout.tsx` — add `complete_kit: "Complete Health Kit (4 Devices + Nera AI 3 months)"` to `DEVICE_NAMES`. No other checkout logic changes needed — it flows through existing quantity/quote logic.
- The external pricing API may not know this SKU; the checkout will fall back to local FALLBACK_PRICES, which is already the current behaviour for unknown SKUs. Coupon/quote endpoint call still runs; if it 404s we already gracefully keep local totals (verify in `fetchQuote`).

## 4. Nera AI 3-month auto-activation

- `supabase/functions/razorpay-verify-payment/index.ts` — after successful payment verification, if any order line has `sku === 'complete_kit'`, write a subscription record so the user gets 90 days of Nera AI Premium.
- New table `nera_ai_grants` (migration): columns `id uuid pk`, `order_id uuid`, `email text`, `phone text`, `plan text` (`'premium'`), `duration_days int` (90), `activated_at timestamptz default now()`, `expires_at timestamptz`, `source text` (`'complete_kit_bundle'`), `status text` (`'pending'|'active'`). Grants + RLS: service_role full; authenticated select own by email.
- Order confirmation email (`send-order-confirmation`) — when bundle detected, append a "Your 3-month Nera AI Premium is active" block with instructions to sign in with the same phone/email in the Agatsa One app.

## 5. Bundle image asset

Compose the hero visual by reusing existing device product PNGs (`sanketlife-hero-v2.png`, `easytouch-wellness-hero.webp`, `band-olive-hero.png`, `corebalance-hero.webp`) in a flex row on a light gradient background — no new image generation needed. Keeps parity with attached creative style.

## 6. Cross-links

- Devices page (`src/pages/Devices.tsx`) — existing bundle banner points to a multi-sku URL; update it to link to `/complete-health-kit` at the new ₹14,999 price with `Save ₹4,000`.
- Homepage `DeviceShowcaseSection` — add a subtle "See the Complete Kit →" link.

## Technical notes

- No changes to Razorpay create-order function needed; it accepts arbitrary SKUs and the price is resolved via the pricing hook + client-computed paise total, then verified by the quote endpoint (falls back locally on API failure).
- The Nera AI grant is written server-side in the verify-payment function using the service role client, so it's tamper-proof.
- SEO: title `"Complete Health Kit — 4 Devices + Nera AI | Agatsa One"`, description mentioning ₹14,999 and 3-month Nera AI.

## Out of scope

- Individual device pages, existing checkout UI, and payment logic remain unchanged.
- No admin UI for viewing `nera_ai_grants` in this pass (data captured for later).
