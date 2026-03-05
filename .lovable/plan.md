
## Add EasyTouch+ Product Page

### Overview
Create a new standalone product page at `/products/easytouch-plus` following the same pattern as ZluProduct.tsx and EasyTouchRhythmProduct.tsx. Add it to the header quick links, products data, and App.tsx routing.

### Files to Create
- `src/pages/products/EasyTouchPlusProduct.tsx` — full landing page with all 14 sections

### Files to Modify
- `src/App.tsx` — add route `/products/easytouch-plus`
- `src/components/layout/Header.tsx` — add EasyTouch+ quick link (teal, Zap icon) in the product quick links strip
- `src/data/products.ts` — add EasyTouch+ entry to the products array

### Page Sections (in order)
1. **Hero** — gradient blue/teal background, headline "See How Your Food Affects Your Body", two CTAs, large product image placeholder
2. **Problem** — "Why Does The Same Food Affect People Differently?" with 3 icon cards
3. **Solution** — "Meet EasyTouch+" centered product mockup, 5 response factors
4. **How It Works** — 3-step horizontal flow with icons
5. **Benefits** — "What You Can Discover" — 5 rounded cards grid
6. **Lifestyle Experiment** — "Turn Your Body Into A Personal Experiment Lab" with Meal → Device → Insight illustration
7. **Target Audience** — audience chips/cards
8. **Credibility** — "Built By Health Technology Innovators" with Agatsa brand text
9. **Comparison Table** — Without vs With EasyTouch+
10. **Early Access** — limited batch CTA
11. **Pricing** — single product card with features list
12. **FAQ** — Accordion with 3 Q&As
13. **Final CTA** — "Your Body Is Unique. Start Understanding It"
14. **Disclaimer footer strip**

### Design
- White background, teal (`teal-600`) accent color matching brand
- Framer Motion `AnimatedSection` wrapper (same as ZluProduct)
- Radix UI Accordion for FAQ
- Uses existing `Layout`, `Button`, `StickyAddToCart` components
- No product images available yet — use styled placeholder divs with gradient backgrounds
- Sticky header: relies on existing `Layout` + `Header` sticky behavior
- Mobile responsive with Tailwind grid breakpoints

### Header Quick Link
Add after SanketLife:
```text
<Zap icon, teal-500 color> EasyTouch+  →  /products/easytouch-plus
```

### Route
```text
<Route path="/products/easytouch-plus" element={<EasyTouchPlusProduct />} />
```
