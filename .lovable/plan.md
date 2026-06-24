## Goal

Remove every mention of "1 year free Nera AI" (and related "3-month" / "1 month free" Nera language) across the marketing site, product pages, checkout, activation flow and transactional surfaces, and replace with the new per-device offer:

| Device | New free Nera AI offer |
|---|---|
| SanketLife ECG | **Nera AI included + 14 days of Nera AI Premium free** |
| EasyTouch Wellness | **Device + 7 days Nera AI subscription free** |
| EasyTouch Rhythm Band | **Device + 7 days Nera AI Premium free** |
| Agatsa Smart Scale | **Device + 7 days Nera AI free** |

## Single source of truth

Rewrite `src/lib/neraAiPlan.ts` so every component that already imports `getNeraAiPlan` / `getNeraAiLabel` picks up the new copy automatically. New shape per SKU: `{ plan, trialDuration, trialLabel, badgeShort, badgeLong }`, e.g.
- `ecg_bundle / sanketlife-ecg / bundle_ecg_band` → `Nera AI included + 14-day Premium trial free`
- `wellness_sub / easytouch-wellness` → `7-day Nera AI subscription free`
- `band_sub / rhythm-band` → `7-day Nera AI Premium free`
- `scale_sub / smart-scale` → `7-day Nera AI free`

Add a tiny helper `getNeraTrialBadge(sku)` returning the short string used in cards/CTAs and a longer one for hero stacks.

## Files to update (hardcoded copy)

Replace the hardcoded "1 year" / "1-year" / "12 month" / "3 month" Nera lines with the new wording (or call the helper):

- Product pages:
  - `src/pages/products/SanketLifeECGProduct.tsx` (lines 150, 555, 687) → "Nera AI Premium — 14 days free"
  - `src/pages/products/EasyTouchWellnessProduct.tsx` (943, 981) → "7-day Nera AI subscription FREE"
  - `src/pages/products/RhythmBandProduct.tsx` (178, 246, 895) → "7-day Nera AI Premium free"
  - `src/pages/products/EasyTouchRhythmProduct.tsx` → same as Rhythm Band
  - `src/pages/products/SmartScaleProduct.tsx` (140, 243) → "Nera AI — 7 days free"
  - `src/pages/products/EasyTouchPlusProduct.tsx` (audit/replace)
  - `src/pages/MyEasyTouchLanding.tsx` (69, 141, 320) → 7-day wording
- Listing / cross-sell / catalog:
  - `src/pages/Devices.tsx` (350 banner: replace "Free 1-year Nera AI included" with a generic "Free Nera AI trial with every device — see product page for length")
  - `src/pages/Checkout.tsx` (824 "Free 1-year Nera AI Plan") → derive from cart line SKU via helper; show "+ Free Nera AI trial" with per-item duration in the order summary line.
- Marketing pages:
  - `src/pages/LoseBelly.tsx` (467 row "1 year free") → wording aligned to bundled device (Wellness = 7 days).
  - `src/pages/WakeUpLike25.tsx` (164, 509, 559) and `src/data/wakeUpLike25Reviews.ts` (17) — this campaign currently bundles "1 year Nera AI Premium" as the offer; user wording is only about device + trial. **Question: do you want to keep this campaign's standalone 1-year Premium bundle, or also collapse it to the 7-day Rhythm Band offer?** (See open question below — default plan: leave WakeUpLike25 unchanged because it's a programme bundle, not a device freebie.)
  - `src/pages/Referral.tsx` (66, 80 "1 month of Nera AI free") — out of scope, this is the referral incentive, not a device freebie. Leave untouched unless you say otherwise.
  - `src/pages/HeartGuard.tsx` (604, 1470 "1 Year Free" doctor portal) — out of scope, this is the doctor portal not Nera AI. Leave untouched.
  - `src/pages/NeraAI.tsx` (728 "12 months" price-lock) — keep (this is subscription price-lock language, not a free trial).
  - `src/pages/Pricing.tsx` (96 "Price locked for 12 months") — keep.
- Support copy:
  - `src/data/supportIssues.ts` (124, 311, 325) → rename "1-year free Nera AI" issues to "free Nera AI trial".
- Components:
  - `src/components/nera/NeraDevicesCTA.tsx` (replace "3 months NERA AI free" badge on each card with per-device trial: 14-day for ECG, 7-day for Wellness/Rhythm).
  - Audit `src/components/home-new/*` and `src/components/home/*` for hardcoded "1 year" / "3 months" Nera badges — none found in the scan above, but any new mentions added inline will get the helper.
- Reviews data (`src/data/easytouchRhythmReviews.ts`, `src/data/smartScaleReviews.ts`) — `3 months` references are real user-time durations ("3 months of monitoring"), NOT Nera AI freebies. Leave untouched.

## Activation flow

`src/pages/DeviceActivation.tsx` line 174 currently says:

> "Your device code … will activate your 3-month Nera AI subscription automatically"

Replace with a per-device line read from `getNeraAiPlan(productKey)`:

- ECG: "…will activate your **14-day Nera AI Premium trial** automatically. After 14 days, Nera AI continues on the free plan unless you upgrade."
- Wellness: "…will activate your **7-day Nera AI trial** automatically."
- Rhythm Band: "…will activate your **7-day Nera AI Premium trial** automatically."
- Smart Scale: "…will activate your **7-day Nera AI trial** automatically."

The activation page already routes by `device` slug, so wiring this to the helper is one switch.

## Emails

Today the order confirmation (`supabase/functions/send-order-confirmation/index.ts`) and the invoice/delivery-slip PDFs do **not** mention "1 year Nera AI" anywhere — confirmed by scan. Two small additions to keep emails consistent with the new promise:

1. **Order confirmation HTML/text body** — add a "What's included" line per ordered SKU using the same helper duration string (e.g. "SanketLife ECG — includes 14-day Nera AI Premium trial").
2. **Activation reminder text** at the bottom of the email — "Your Nera AI trial activates the moment you pair the device in Agatsa One."

No changes to the invoice PDF (legal/tax document) or delivery slip.

Edge function will be redeployed after the edit.

## Memory

Update `mem://tech/nera-ai/plan-duration` (currently "1 year hardcoded") to record the new device → trial-duration mapping so future copy stays consistent.

## Out of scope (confirm if you want these changed too)

1. `WakeUpLike25` programme bundle's standalone "1 Year Nera AI Premium" offer.
2. `Referral.tsx` referral incentive ("1 month of Nera AI free").
3. `HeartGuard.tsx` "Doctor Portal — 1 Year Free" (not Nera AI).
4. `NeraAI.tsx` / `Pricing.tsx` "12 months price lock" (subscription pricing, not a freebie).

Tell me if any of those four should also change and I'll fold them into the plan.
