## Goal
Add a new visual section to `src/pages/products/SanketLifeECGProduct.tsx` immediately below the "What SanketLife Detects" section, titled around "12-Lead ECG at home — hospital grade", featuring a 3-stage CSS/Framer Motion animation that storytells how the device is used.

## Section placement
Insert directly after line 250 (close of detection section), before the "Why early checks matter" section.

## Animation concept (3 sequential stages, looping)

```text
Stage 1 (0–2s):   Device alone, centered, gentle float.
                  Two small sensor circles glow/pulse on its face.

Stage 2 (2–4s):   Camera "pans out": device scales down + shifts left.
                  Two thumb shapes slide in from below and rest on
                  the two sensor circles. A subtle pulse ripple
                  emanates from each thumb contact point.

Stage 3 (4–7s):   A phone slides in from the right next to the
                  device. Inside the phone screen, an animated ECG
                  waveline draws across (SVG stroke-dashoffset),
                  with a moving heartbeat dot.

Loop back to Stage 1.
```

All built in pure React + Tailwind + Framer Motion. No new assets, no Lottie. The device, thumbs, and phone are simple stylized SVG/div shapes (consistent with the existing minimal mockup style used across the site, e.g. the home hero CSS iPhone). The ECG line is an SVG path animated with `pathLength` via Framer Motion — a clean, hospital-monitor-style trace.

## Section layout

```text
┌──────────────────────────────────────────────────────────┐
│   eyebrow:  HOW IT'S TAKEN                               │
│   H2:       12-lead ECG at home. Hospital-grade.         │
│   sub:      Two thumbs. 30 seconds. A full ECG on        │
│             your phone — ready to share with any doctor. │
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │                                                  │   │
│   │            [ ANIMATED SCENE STAGE ]              │   │
│   │       device → +thumbs → +phone with ECG         │   │
│   │                                                  │   │
│   └──────────────────────────────────────────────────┘   │
│                                                          │
│   3 small step chips below the scene:                    │
│   1. Hold device     2. Place both thumbs    3. ECG on phone │
└──────────────────────────────────────────────────────────┘
```

Background: soft gradient (`from-primary/5 via-background to-background`) to make the scene feel like a clean clinical canvas. Stage container has rounded-3xl card with subtle border.

## Animation technical details

- Scene wrapped in a single Framer Motion timeline using `useEffect` + `useAnimation` controls (or a simple looping `animate` prop with `times` array driven by a state cycle).
- Total loop: ~7s, repeats infinitely, pauses on `prefers-reduced-motion` (use `useReducedMotion` from framer-motion → render a static final composition with all 3 elements visible).
- Mobile: scene scales down (`scale-90`) and re-centers; thumbs shrink; phone overlaps less. Container height: `h-[360px] md:h-[440px]`.
- Colors: device uses `bg-foreground/90` body with `bg-destructive` and `bg-primary` sensor dots that pulse. Phone uses `bg-card` frame with dark screen. ECG line in `stroke-destructive` with a glowing dot.
- All semantic tokens — no raw hex.
- Step chips below use `Check` icons in primary, same styling pattern as existing scannable content sections.

## Files to edit
- `src/pages/products/SanketLifeECGProduct.tsx` — add ~120 lines for the new section + a small `<HowItsTakenAnimation />` sub-component defined in the same file (kept local since it's page-specific).

No new dependencies. No new assets.
