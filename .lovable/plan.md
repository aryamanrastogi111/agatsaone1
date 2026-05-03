## Changes to `src/pages/products/SanketLifeECGProduct.tsx`

### 1. Move "Watch It In Action" section to near bottom
Currently lines 155–170, sits as Section 2 right after hero. Move it to just before the "Final Trust Reinforcement" + Final CTA block (insert after line 854, i.e. after the offer-framing section, before Section 14).

No styling changes — keep the same dark `bg-gray-950` block, hero video + 3 supporting videos + YouTube channel link.

### 2. Add new "What SanketLife Detects" section
Insert in the spot vacated by the videos section (right after the hero, before "Most heart symptoms don't happen inside hospitals").

Content — a clinically-framed, scannable grid showing the heart conditions a 12-lead ECG can help flag. Group into 3 categories:

**Life-threatening events**
- STEMI (ST-Elevation Myocardial Infarction) — full-thickness heart attack pattern
- NSTEMI / Ischemia indicators — ST depression, T-wave inversion
- Ventricular Tachycardia / Ventricular Fibrillation patterns

**Rhythm disorders (Arrhythmias)**
- Atrial Fibrillation (AFib)
- Atrial Flutter
- Supraventricular Tachycardia (SVT)
- Bradycardia & Tachycardia
- Premature beats (PVC, PAC)

**Conduction & structural clues**
- 1st / 2nd / 3rd degree AV blocks
- Bundle Branch Blocks (LBBB / RBBB)
- Long QT / Short QT intervals
- Left Ventricular Hypertrophy (LVH) signs
- Pericarditis patterns

**Layout (matches existing design system):**
- Section: `py-12 bg-background` (or `bg-muted/30` to alternate with neighbors)
- Heading: `text-3xl md:text-4xl font-bold` — "One device. A full clinical picture of your heart."
- Subhead: short line about 12-lead ECG capturing what single-lead watches miss
- 3-column grid (`grid md:grid-cols-3 gap-6`) of cards using existing `bg-card border border-border rounded-2xl p-6` pattern
- Each card: Lucide icon (HeartPulse / Activity / Zap / AlertTriangle already imported), category title, bullet list of conditions with `Check` icons
- Compliance footer line: "SanketLife provides ECG waveforms for review. Diagnosis and treatment decisions are made by your doctor." — matches existing CDSCO-safe tone used elsewhere on the page.

### 3. No other changes
- No edits to UI tokens, animations, hero, pricing, or CTAs.
- Imports: reuse already-imported lucide icons; add `Activity` or `Zap` only if not already present.

### Order after changes
1. Hero
2. **NEW: What SanketLife Detects**
3. Most heart symptoms don't happen inside hospitals
4. … (rest of existing flow unchanged) …
13. Offer framing
14. **MOVED: Watch It In Action**
15. Final trust reinforcement
16. Final CTA
17. What's in the box / Related devices / Reviews
