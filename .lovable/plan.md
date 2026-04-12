

## Problem

On mobile (375px), the hero section stacks ~12 elements vertically before the product image appears: headline, stats, subheadline, "Show Me How" button, guarantee badge, price block, EMI, urgency bar, shipping, Add to Cart, free bonus badge, then finally the image. This creates a wall of text/buttons spanning 2+ full scrolls before the user sees the product. On desktop this is fine because the split-column layout shows text and image side by side.

## Plan — Streamline mobile hero only (no desktop changes)

### Changes to `src/pages/products/EasyTouchWellnessProduct.tsx`

**1. Reorder: move product image above the pricing block on mobile**
- Use CSS `order` classes to place the image between the subheadline/CTA area and the pricing block on mobile only
- Wrap the grid in `flex flex-col md:grid md:grid-cols-2` so we can control mobile ordering
- Image gets `order-1 md:order-none` to appear after headline + CTA but before price details on mobile

**2. Hide non-essential elements on mobile**
- Hide the "Show Me How" scroll button on mobile (`hidden md:flex`) — the Add to Cart is right there, no need for a scroll prompt
- Hide the EMI line on mobile (`hidden md:block`) — secondary info
- Hide the shipping date line on mobile (`hidden md:flex`) — it's in the checkout section below too
- Keep: headline, stats, subheadline, guarantee badge, price, urgency bar, Add to Cart, free badge

**3. Compact mobile image**
- Add `max-w-[200px] md:max-w-sm` to the product image so it's smaller on mobile, keeping the scroll depth tight

### Mobile layout after changes (top to bottom)

```text
Headline (smaller: text-3xl on mobile)
Stats strip (2 items)
Subheadline ("You know your number...")
Guarantee badge
── Product Image (compact, ~200px) ──
Price (₹3,999 with strike)
Urgency bar
Add to Cart button
Free Nera AI badge
```

### What stays untouched
- All desktop styles (everything behind `md:` breakpoints)
- All sections below the hero
- All functionality (buttons, cart logic, tracking)

### File to edit
- `src/pages/products/EasyTouchWellnessProduct.tsx` — Section 1 (hero) only, lines 137-213

