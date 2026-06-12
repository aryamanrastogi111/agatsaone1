## Meet Priya — A Real NERA AI Report

Rebuild the middle of `/nera-ai` as one continuous, narrative case study. The 5 app screenshots stop being a gallery and start being **the report itself** — each one anchoring a chapter of Priya's story.

### Persona (sensible default — easy to tweak later)

**Priya Sharma, 34, Bengaluru.** Product manager. Sleeps ~5h, skips workouts, late dinners after 10pm. Owns SanketLife ECG, EasyTouch Wellness and Rhythm Band. Connects them to Agatsa One on Day 1. NERA AI builds her report over 7 days.

### New section structure (replaces `CombinedIntelligence` + `SampleInsights`)

One section, `PriyaReportStory`, dark theme, scroll-anchored chapters. Each chapter = left column narrative + right column real screenshot in a phone frame. Alternate sides for rhythm.

**Chapter 0 — Cover card**
- Eyebrow: "A Real NERA Report"
- Headline: "This is Priya's report. Yours will look like this in 7 days."
- Persona chip: avatar initial · Priya, 34 · Bengaluru · 3 connected devices
- Day counter pill: "Day 7 · Report ready"

**Chapter 1 — The verdict** → `nera-score.jpeg`
- Heading: "Day 7: NERA gives Priya a score of 49."
- Body: "Not a number she wanted to see. But for the first time, she understands *why*. Lifestyle 50 · Cardiac 65 · Metabolic 22 · Food 53 — four pillars, one honest picture."
- Pull-quote callout: "Some signals need attention."

**Chapter 2 — The 9 signals** → `nera-signals.jpeg`
- Heading: "NERA read 9 of 9 health signals. Most apps read 2."
- Body explains how each device contributes: Rhythm Band → Sleep/Activity/HRV. SanketLife ECG → Cardiac. EasyTouch Wellness → Metabolic Zone & sugar response. Self-logged → Food.
- Three inline data callouts pulled from the screenshot: Sleep 35/100 (1.5h avg), Metabolic Zone 22/100, Body Composition 90/100.

**Chapter 3 — The risk estimate** → `nera-risk.jpeg`
- Heading: "Then NERA does the math no single device can."
- Body: "Cardiac risk 29% · moderate. Metabolic / diabetes risk 52% · elevated. Clinical thresholds — Rodbard, Monnier — applied to 124 sugar readings across 6 days. Not a diagnosis. A direction."
- Worth-watching strip echoing the screenshot's amber alert: "Time in optimal metabolic zone is lower than ideal."

**Chapter 4 — Ranked actions** → `nera-actions.jpeg`
- Heading: "Then it tells Priya exactly what to do — ranked by impact."
- Body: "Not 30 generic tips. Two changes, weighed by points she'll actually recover."
- Two action rows mirroring the screenshot: #1 Sleep 7–8 hrs (+44 pts, highest single impact). #2 Add 4,897 more steps daily (reduces metabolic + cardiac risk).

**Chapter 5 — The outcome (6 weeks later)**
- Heading: "Six weeks later, Priya's NERA score climbed from 49 → 72."
- Three small metric cards (no screenshot — pure data viz built in code): Sleep 35 → 71 · Metabolic Zone 22 → 58 · Diabetes risk 52% → 31%.
- Closing line: "Same devices. Same body. New understanding."

**Chapter 6 — How to start your own report** → `nera-plans.jpeg`
- Heading: "Your report is 7 days away."
- Body: short list of what unlocks with NERA AI Premium (weekly report, daily nudges, predictive warnings, 3-day recovery forecast, unlimited correlations).
- CTA buttons: "Activate NERA AI" → /pricing, "Browse Devices" → /devices.

### What gets removed

- `AppShowcase` section (the gallery I just added)
- `CombinedIntelligence` section (abstract correlation cards + network diagram)
- `SampleInsights` section (generic insight cards)

### What stays

- Hero, `WhyNeraExists`, the three device sections (ECG/Wellness/Rhythm), `FutureHealth`, `WhySubscribe`, `FinalCTA`. The narrative replaces only the abstract middle.

### Disclaimer

Add a small footnote under Chapter 5: "Priya is an illustrative composite based on typical NERA reports. Not a medical case. Individual results vary."

### Technical notes

- Single new component `PriyaReportStory` in `src/pages/NeraAI.tsx` (keeps file self-contained, same pattern as other sections).
- Reuse existing phone-frame styling from the removed `AppShowcase`, but each screenshot sits inside a larger narrative card (not standalone).
- Framer Motion `fadeUp` per chapter on scroll, alternating image side via CSS order.
- All existing imports (`neraScore`, `neraSignals`, `neraRisk`, `neraActions`, `neraPlans`) stay — just used inside `PriyaReportStory` instead of the gallery.
- No new routes, no backend, no copy that mentions "glucose" (use "sugar reading/response/zone" per project core rules).
