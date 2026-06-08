
## What's actually happening

I traced the checkout flow end-to-end:

1. **Confirmation emails** — The `send-order-confirmation` edge function is working (latest run 14:08:49 returned `success: true` for both customer + team). The real problem is in `src/pages/Checkout.tsx`:
   - The **email field is optional**. When a user skips it, the code falls back to `${phone}@noemail.agatsa.com` (line 362). Emails get "sent" successfully to a fake address — so the buyer never receives anything. Most recent paid orders are exactly this pattern (e.g. `7678459923@noemail.agatsa.com`, `9717234008@noemail.agatsa.com`).
   - Email sending is fired from the **browser** after Razorpay's `handler` runs. If the user closes the tab, loses network, or the external `/v1/orders/website/verify` call hangs, the email is never queued.

2. **Blank screen after payment** — In `Checkout.tsx`:
   - The handler does `clearCart()` + `setSearchParams({}, { replace: true })` before `setPageState("success")`. If React commits the URL change first on a slow render path, the component re-evaluates with no SKUs and shows the success screen — but if the verify call throws *before* `setPageState` runs (e.g. external API is slow or returns non-JSON), nothing transitions and the user is stuck on the previous frame (which already had the Razorpay modal closed). There is no timeout, no fallback, and the only error path requires the verify fetch to actually return.
   - Same goes for a failed payment: Razorpay's `modal.ondismiss` is the only failure exit. If Razorpay throws an inline error after `rzp.open()` (e.g. invalid order id, blocked popup), neither `handler` nor `ondismiss` runs and the page stays in `"form"` with no feedback. Recent orders are all `confirmed`, so we can't see the failure trail.

## Plan

### 1. Make confirmation emails reliable

- **Make the email field required** in step 2 (`step2Valid` must include a valid email regex). Remove the `noemail.agatsa.com` fallback for the customer-facing send (still OK to keep as a placeholder for the external API if it requires a value, but never send a real confirmation to it).
- **Move the email trigger server-side**: in `supabase/functions/razorpay-verify-payment/index.ts` we already fire `send-order-confirmation` after signature verification. Update the **client verify path** (`/v1/orders/website/verify` in `Checkout.tsx`) to *also* call our `razorpay-verify-payment` edge function (or call `send-order-confirmation` from a small new edge function triggered by an order row insert) so that email delivery does not depend on the browser staying open.
- Guard against duplicate emails using `razorpay_payment_id` as an idempotency key inside `send-order-confirmation`.

### 2. Fix the post-payment blank screen

In `src/pages/Checkout.tsx` `handlePay`:

- Set `pageState` **before** any side-effect that changes URL/cart. New order: `setPageState("success")` → `clearCart()` → `setSearchParams({}, { replace: true })`.
- Wrap the Razorpay open in a try/catch so a synchronous `rzp.open()` failure routes to `pageState="error"` with a clear message.
- Add a `payment.failed` listener (`rzp.on("payment.failed", ...)`), in addition to `modal.ondismiss`, so card-declined / network-fail cases land on the error screen with the gateway's reason.
- Add a 30s timeout around the `/v1/orders/website/verify` fetch; on timeout, show the error screen with a "Your payment may still have succeeded — we'll email you once confirmed. Reference: {payment_id}" message instead of leaving the user stuck.
- Make the verify fetch tolerant of non-JSON responses (text fallback so `await res.json()` doesn't throw an unhandled rejection).

### 3. Light diagnostics

- Add `console.error` lines at every catch in `handlePay` with the step name (`quote`, `create`, `razorpay-open`, `verify`, `db-sync`, `email`) so the next failure shows up immediately in browser logs.
- Surface the order id and payment id on the success screen so support can trace a customer if email delivery ever fails downstream.

## Files touched

- `src/pages/Checkout.tsx` — email required, reordered state transitions, Razorpay error listener, verify timeout, logs, success screen reference id.
- `supabase/functions/razorpay-verify-payment/index.ts` *(optional, only if we route verify through our own function)* — idempotent email trigger.
- `supabase/functions/send-order-confirmation/index.ts` — short-circuit if recipient ends with `@noemail.agatsa.com`, idempotency by `razorpay_payment_id`.

## What I'm not changing

- The external `agatsa-one-api` order/verify/coupon endpoints (still the source of truth for pricing + fulfillment).
- The admin coupon table mismatch from the previous thread — not in scope here.

## Confirm before I build

- OK to make **email required**? (Currently optional — this is the single biggest cause of "no confirmation email".)
- OK to also fire `send-order-confirmation` from `razorpay-verify-payment` (server-side, won't depend on browser)? Risk: tiny chance of a duplicate email until the idempotency guard lands — I'll add the guard in the same change.
