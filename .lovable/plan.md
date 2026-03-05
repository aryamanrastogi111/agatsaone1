
## Additive changes only — EasyTouchPlusProduct.tsx

The current page stays intact. We add 4 new sections/components inline, slotted into the right positions:

### What to ADD (no existing content removed):

**1. New hero headline + subline (replace only the h1/p in section 1)**
- H1: "Your glucometer tells you a number. EasyTouch+ tells you the story."
- Sub: "Track your metabolic signal across the 22 hours your glucometer misses — no strips, no pricks."
- Keep both CTAs, keep visual placeholder

**2. Insert after section 2 (Problem) — new "The 22-Hour Gap" section**
A visual day timeline showing:
- `7am — Glucometer: 118` → EasyTouch+ continuous → `3pm spike caught` → `9pm — Glucometer: 142`
- Message: "You're blind for 22 hours a day. EasyTouch+ watches the gaps."

**3. Insert after section 4 (How It Works) — new "Calibration Story" section**
4-step mini-flow: 
- Take 4 glucometer readings → Pair with EasyTouch+ PPG → Algorithm builds your model → All future readings show "Metabolic Index: 72"
- Framing: "EasyTouch+ learns YOUR metabolic fingerprint — not an average person's."
- Metabolic Index mockup: circular badge showing "72 | Elevated Zone"

**4. Insert after section 8 (Credibility) — new "3 Levels of Knowing" section**
Three cards stacked/horizontal:
- Level 1: Glucometer → "My sugar is 148 right now" (gray)
- Level 2: EasyTouch+ → "My signal spikes every day at 3pm" (teal)
- Level 3: AI → "This pattern will normalise in 11 weeks" (gradient, future state)

**5. Update comparison table (section 9) rows** to the objection-killer version:
- Without: "Guess how food affects you / ₹50 per glucometer strip / No continuous data / Generic advice"
- With: "Observe your body's response / ₹0 per EasyTouch+ reading / 22-hour continuous tracking / Calibrated to your body"

**6. Update disclaimer** to include: "Metabolic Index is a wellness indicator derived from PPG signals and personal calibration data. It is not a substitute for clinical blood glucose measurement."

**7. Update target audience** — add 2 new chips: "Pre-diabetics & Borderline Cases" and "People with Family History of Diabetes"

### Files to modify
- `src/pages/products/EasyTouchPlusProduct.tsx` only — pure additions/small tweaks, no deletions of existing sections
