## Goal
Communicate "International shipping: flat ₹2000" everywhere on the site, and automatically add ₹2000 to checkout when the shipping address is outside India.

## 1. Policy & marketing copy (display only)
Update these pages/components to state: *"International shipping: flat ₹2000 to all countries. Free shipping within India."*

- `src/pages/ShippingPolicy.tsx` — rewrite "International Shipping" and "Shipping Charges" sections with the flat ₹2000 rule.
- `src/pages/ReturnPolicy.tsx` — note that international return shipping is customer-borne; outbound ₹2000 is non-refundable.
- `src/components/SiteFooter.tsx` — add a small line "International shipping ₹2000 flat" under the support column (optional, low-key).
- `src/components/home-new/DeviceShowcaseSection.tsx` and any product page that prints "Free shipping" — append "(India). International ₹2000 flat." Touch: `src/pages/products/*Product.tsx` headers that mention shipping, and `src/lib/shipDate.ts` label consumers.
- `src/pages/Checkout.tsx` order summary — render a "Shipping" row (₹0 India / ₹2000 International).

## 2. Checkout: detect international address
Currently `Checkout.tsx` is India-only (forces 6-digit pincode, no country field).

- Add a **Country** `<Select>` above the pincode field (default: India). Use a small country list (India + ~30 common destinations + "Other").
- When country ≠ India:
  - Replace the 6-digit pincode validator with a generic postal-code text field (3–10 chars).
  - Skip the `postalpincode.in` auto-fill lookup.
  - Show State as free-text instead of auto-filled.
  - Add a flat **₹2000 international shipping** line to the order summary.
- When country = India: behavior unchanged.

## 3. Charging the surcharge (backend)
`razorpay-create-order` currently forwards items to an external API (`agatsa-one-api...`) which computes `totalAmountPaise`. The client cannot unilaterally add ₹2000 without breaking the Razorpay signature.

Approach: have the **edge function** add the surcharge after the backend returns the total, then re-create the Razorpay order at the new amount using `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` directly.

Steps in `supabase/functions/razorpay-create-order/index.ts`:
1. Accept new fields: `country`, `postalCode` (in addition to existing `pincode`).
2. Call backend as today to get item totals + coupon math → `baseTotalPaise`.
3. If `country` is provided and ≠ `"IN"`/`"India"`, compute `finalTotalPaise = baseTotalPaise + 200000`.
4. Create a fresh Razorpay order via `POST https://api.razorpay.com/v1/orders` with `amount: finalTotalPaise` using basic auth (`RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET`). Return that new `id` as `razorpayOrderId`.
5. Persist `shipping_country` and `shipping_surcharge` (₹2000 or 0) on the `orders` insert. Requires a tiny migration adding `shipping_country TEXT` and `shipping_surcharge NUMERIC DEFAULT 0` to `public.orders`.
6. For Indian orders, keep forwarding the original backend `razorpayOrderId` unchanged (no regression).

Verification: existing verify function (`razorpay-verify-payment`) only checks signature against the order id we hand back to the client, so swapping in our new Razorpay order id is safe.

## 4. Client wiring
- Pass `country` and `postalCode` from `Checkout.tsx` to the edge function call.
- Display the surcharge in the order summary and on the post-payment success screen.
- Update `src/integrations/supabase/types.ts` will regenerate after the migration.

## 5. Out of scope (call out for user)
- Tax / GST recalculation for exports (currently no GST line shown — fine).
- International courier selection / live rates (flat ₹2000 only, as requested).
- COD is not offered internationally (Razorpay prepaid only — already the case).

## Files touched
- `src/pages/ShippingPolicy.tsx`
- `src/pages/ReturnPolicy.tsx`
- `src/components/SiteFooter.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/products/*Product.tsx` (only places that state "Free shipping")
- `supabase/functions/razorpay-create-order/index.ts`
- New migration: add `shipping_country`, `shipping_surcharge` to `orders`.

## Confirm before I build
1. Flat ₹2000 to **every** country outside India (no exclusions / no restricted list)?
2. OK with the edge function creating the final Razorpay order directly (so the surcharge is actually charged), instead of routing through the external `agatsa-one-api` backend?
3. Should the ₹2000 also apply to free / 99%-off coupon orders (i.e. surcharge is always added on top, never waived)?
