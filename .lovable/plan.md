

## Problem Analysis

**Issue 1 — Hero doesn't look good**: The entire first viewport is pure text — five giant words stacked vertically with no product image, no visual anchor. On desktop, the massive typography fills the entire screen with nothing else. On mobile, the social proof strip wraps awkwardly ("50% fewer pricks" breaks to 2 lines).

**Issue 2 — Text bombardment causing drop-offs**: After the headline, there are 4 consecutive text-only blocks before the user sees anything visual (the product image is buried in Section 2). That's ~3 full scrolls of text on mobile before any imagery. Users bail.

---

## Plan

### 1. Redesign the hero into a split layout (desktop) / stacked layout (mobile)

- **Left side (desktop) / Top (mobile)**: Keep the punchy "Needle. Blood. Strip. Repeat." headline but reduce font size slightly. Add the social proof strip and the single killer line: "You know your number. But you still don't know why it goes up."
- **Right side (desktop) / Below headline (mobile)**: Show the EasyTouch Wellness device image prominently with a subtle floating animation. Add a CTA button ("Show Me How") right here.
- **Remove** the 3 rhetorical questions block and the "There is a better way" block from the hero. These create scroll fatigue. The "why" questions can move into Section 2 as a compact intro.

### 2. Fix mobile social proof wrapping

- On screens below `md`, hide "50% fewer pricks in 30 days" and show only "20,000+ users" and "⭐ 4.6 rating"
- The guarantee badge already covers the "50% fewer pricks" message, so no information is lost

### 3. Condense the text-heavy intro

- Merge the rhetorical questions ("Why did it spike…") into Section 2's intro as a short 2-line block, not 4 separate paragraphs
- Move the guarantee badge to sit alongside the CTA in the hero, not as a separate block below

### Summary of changes

| What | Before | After |
|------|--------|-------|
| Hero layout | Full-width centered text only | Split: text + product image |
| First fold content | 5-word headline + stats + 2 paragraphs + 3 questions + CTA + badge | Headline + stats + 1 line + product image + CTA with badge |
| Mobile social proof | 3 stats wrapping | 2 stats, clean single row |
| Text before first image | ~3 full scrolls | Image visible in first viewport |

### Files to edit

- `src/pages/products/EasyTouchWellnessProduct.tsx` — restructure Section 1 (hero) only

