Update flat international shipping surcharge from ₹2000 to ₹3000 across the site and backend.

## Changes

1. **Edge function** `supabase/functions/razorpay-create-order/index.ts`
   - `INTERNATIONAL_SHIPPING_PAISE`: `200000` → `300000`

2. **Frontend surcharge logic** — search for `2000` in shipping/checkout context and update:
   - `src/pages/Checkout.tsx` (surcharge constant + any UI copy)
   - `src/contexts/CurrencyContext.tsx` if it references the amount

3. **Copy updates** — replace "₹2000 flat" wording with "₹3000 flat" in:
   - `src/components/SiteFooter.tsx` (if mentioned)
   - `src/pages/ShippingPolicy.tsx`
   - `src/pages/ReturnPolicy.tsx` / other policy pages that reference it
   - Any checkout tooltip/banner text

I'll grep for `2000` and "international shipping" to catch every occurrence before editing.

No DB or schema changes needed — `shipping_surcharge` column already stores the value dynamically.