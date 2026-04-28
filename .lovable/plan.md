# Make EasyTouch Wellness feel custom-designed

## The problem
Right now ~10 of the page's sections use the same formula: centered heading → grid of white cards → icon-in-circle + bold title + gray paragraph → alternating `bg-background` / `bg-muted/30`. That repetition is what makes it feel AI-generated. Content is strong — the **containers** need personality.

## Principle
Keep all copy and structure. Change how each section **looks** so the eye registers a new "shape" every time it scrolls. No new images or illustrations — just layout, color, typography and small visual motifs built from what we already have.

## Section-by-section treatment

**1. Problem — "You've Been Eating Blindfolded"**
Replace the neutral 3-card grid with a **"3 blind spots" stacked list on a dark/navy tinted panel** (evokes blindfold). Each item = large numbered serif glyph ("01", "02", "03"), bold question in white, thin divider, muted answer. Resolution pill stays.

**2. Food Fingerprint — 6 feature cards**
Break the uniform 3-col grid. Use a **bento layout**: 1 large hero card (Food Fingerprint, the signature feature) + 5 smaller cards of varied sizes. The hero card gets a faint fingerprint SVG watermark in the background.

**3. Technology behind EasyTouch — 3 cards**
Convert the 3 identical cards into a **horizontal connected flow** with arrows/dashed lines between them: `Same tech → Train it → Just scan`. Numbered pills, no boxes, sits on a subtle grid-paper background (references "lab / science" tone).

**4. How it works — "Snap. Scan. See."**
Current layout is already a good vertical list — upgrade it to a **vertical timeline with a connecting line** down the left, each step's number sitting on the line, and a small mono-styled caption like `// step_01` above each title. Gives it a "developer log / medical chart" feel distinct from every other section.

**5. Metabolic Load Zones — 4 colored circle cards**
Replace 4 equal boxes with a **horizontal gradient meter** (green → blue → amber → red) running across the section, with the 4 zone cards docking onto the bar at their correct position. Keeps color coding but becomes a single "instrument panel" instead of a card grid.

**6. Know before you eat — 4 steps**
Drop the 4-card grid. Show it as **a phone-shaped mockup frame** on the left with 4 stacked "app notification" style rows on the right (rounded, subtle shadow, small timestamp). Mimics the actual app experience it's describing.

**7. Nera AI — chat quotes (dark section)**
Keep the dark gradient but restyle the 3 quote cards as **iMessage-style chat bubbles** with a small "Nera AI" avatar dot and timestamp. Much more memorable than the current `bg-white/5` rectangles, and reinforces the "plain language companion" copy.

**8. Who is this for — checklist**
Current: 5 identical check-rows. Change to a **2-column "persona chip" layout** where each qualifier becomes a pill-style tag (`✓ You check your sugar often`, `✓ You're pre-diabetic`...) that visually reads like selectable filters — lighter, more scannable.

**9. What's in the box**
Transform the 2-col list into a **"receipt / packing slip" card**: single bordered panel with dashed top/bottom edges, monospace font, each item on its own line with a check and a faint SKU-style label. One distinctive card instead of 6 identical mini-cards.

**10. Testimonials — "What Users Discovered"**
Change 3 uniform quote cards to **offset/staggered cards** (slightly different vertical offsets + subtle rotation like -1°, 0°, +1°) with a large decorative opening quote mark in the brand color bleeding off the top of each card. Feels human, not templated.

**11. Objection handling (FAQ accordion)**
Already different (accordion). Small upgrade only: add a faint "Q." / "A." serif display letter next to each trigger/content, and a thin vertical primary-colored bar on the left edge of the expanded content. Makes it feel like an editorial Q&A.

**Untouched:** Hero (already unique), Awards strip, Video grid, Guarantee banner (already unique), mid-page CTA, final CTA, Reviews section (lazy component). These already have distinct identities.

## Cross-cutting polish
- **Section separators:** instead of only flipping between `bg-background` and `bg-muted/30`, introduce **3 more surface treatments** rotated through the page: a subtle radial-gradient backdrop, a thin top-border divider with a small brand dot centered, and one dark/navy section (Problem) to anchor the first third.
- **Typography rhythm:** currently every section uses the same H2 size. Vary: Problem uses a tighter condensed tracking, Fingerprint uses a display serif or italicized word, How-it-works keeps the current bold sans. Small changes, big perceived difference.
- **Micro-motifs:** a 2-px primary underline swoosh on one keyword per section heading (already used in hero — extend consistently). Different keyword, same motif → visual thread that ties the page together.

## Technical notes
- All changes stay inside `src/pages/products/EasyTouchWellnessProduct.tsx`.
- Zero new dependencies. No new images. Icons already imported from `lucide-react`.
- All colors via existing semantic tokens (`primary`, `foreground`, `muted`, `card`, `border`). No hard-coded hex except the already-existing dark Nera AI gradient and the zone colors (kept as-is).
- Framer Motion `fadeUp` reused; no new animation libs.
- Responsive: every new layout collapses to single-column on mobile (bento → stack, timeline stays vertical, meter becomes vertical on `<sm`, staggered testimonials reset to aligned on mobile).
- Copy is **not** changed in any section.

## Out of scope
- No new images, illustrations or 3D assets.
- No changes to cart, pricing, stock, or CTA behaviour.
- No changes to other product pages or shared components.

Approve and I'll implement all 11 section treatments in one pass.
