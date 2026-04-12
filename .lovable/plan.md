

## Problem

The "Know before you eat" section (lines 348-360) is another wall of 4 paragraphs of plain text. After the user just scrolled through the Metabolic Score zones, they hit more dense reading. The content is valuable but the format doesn't match the scannable pattern we've established above.

## Plan — Convert "Know before you eat" into a visual step flow

### What changes

**Replace the 4 paragraphs with a compact 4-step visual flow** — horizontal on desktop, vertical on mobile. Each step gets an icon, a bold micro-title, and one short sentence:

| Step | Icon | Title | Content |
|------|------|-------|---------|
| 1 | Camera | Snap your plate | Open the app, take a photo of your meal |
| 2 | Brain/Sparkles | Get a prediction | Nera AI estimates your metabolic response — before you eat |
| 3 | ScanLine | Scan after 90 min | Take a quick EasyTouch reading to see how your body actually responded |
| 4 | TrendingUp | See your patterns | Learn which foods keep you Calm vs push you Elevated — for YOUR body |

**Add a bold closer line** below: *"Not a generic diet chart. Your chart."*

### Result

- Section goes from ~4 paragraphs to a scannable 4-step grid
- Consistent with the card-based pattern from Section 2
- Key message preserved in ~40% of the space

### File to edit

- `src/pages/products/EasyTouchWellnessProduct.tsx` — Section 5 only (lines 348-360)

