

## Problem

Section 2 ("Introduce the Device") dumps 5 dense paragraphs of text (lines 204-218) — roughly 2 full mobile scrolls of unbroken reading before the product image and Add to Cart. The content is good but the format guarantees nobody reads it.

## Plan — Convert Section 2 text wall into scannable visual blocks

### What changes

**Replace the 5 paragraphs (lines 204-218) with 3 compact visual cards** arranged in a horizontal row on desktop, vertical stack on mobile. Each card has an icon/emoji, a bold 1-line title, and 1-2 short sentences max:

| Card | Icon | Title | Content (condensed) |
|------|------|-------|---------------------|
| 1 | 🔬 | Same tech as hospitals | Uses light sensors like the pulse oximeter from COVID — reads blood flow through your fingertip |
| 2 | 📸 | Train it in days | Snap your glucometer + meal photos for a few days. Nera AI learns YOUR body's patterns |
| 3 | ✅ | Then just scan | One touch, 15 seconds → Metabolic Score 0-100. No strip. No blood. Glucometer becomes optional |

**Keep the intro text above (lines 196-202)** — the rhetorical questions + "Meet EasyTouch Wellness" headline + tagline. These are short and effective.

**Remove the duplicate product image** (line 221-223) since it's already in the hero now.

**Move the "Not just a reading. An explanation." line** to sit as a bold closer below the 3 cards.

### Result

- Section 2 goes from ~5 scrolls on mobile to ~1.5
- Key information preserved but scannable
- User reaches Add to Cart much faster

### File to edit

- `src/pages/products/EasyTouchWellnessProduct.tsx` — Section 2 only (lines 192-259)

