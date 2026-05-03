## Goal
Two changes to `src/pages/products/SanketLifeECGProduct.tsx`:

1. **Make "Life-threatening events" card visually pop** in the "What SanketLife Detects" section.
2. **Simplify the page** — too many sections, too much copy. Consolidate from ~15 sections to ~9, keep all the proof but shorten the prose.

---

## 1. Life-threatening card — visual emphasis

Currently all 3 category cards look identical. Change so the destructive card is clearly the headline:

- Make it span 2 columns on desktop (`md:col-span-2`), other two stack to the right (`md:col-span-1` each, on top of one another) — OR keep 3-up grid but apply a stronger treatment to card #1.
- Going with the simpler stronger-treatment route to keep the section compact:
  - Background: `bg-destructive/5 border-destructive/30 ring-1 ring-destructive/20`
  - Larger icon in a filled circle: `bg-destructive/10` chip with `AlertTriangle` in destructive
  - Add a small red "URGENT" pill above the title
  - Title in `text-destructive` instead of foreground
  - Bullets get a red dot instead of purple Check
- Other two cards stay neutral (current style) so the contrast does the talking.

---

## 2. Page simplification

Current order (15 sections + extras) is exhausting. Collapse to this leaner flow:

```text
1. Hero (keep)
2. What SanketLife Detects (keep — already added; with new emphasis on life-threatening)
3. Why early checks matter  ← MERGE current "Most heart symptoms don't happen inside hospitals" + "Early detection saves lives"
   - 4 short pain-point cards + one tight stat row underneath
4. How it works (keep — 3 simple steps, trim copy)
5. Trusted by hospitals + Social proof  ← MERGE current Trust/Medical Authority + Social Proof
6. Nera AI section (keep — it's the differentiator)
7. SanketLife vs hospital ECG vs smartwatch  ← KEEP comparison, drop the separate "Parent Care" + "Features" sections; fold their best points as 3 bullets under the comparison table
8. FAQ (keep — but trim to 6 questions max)
9. Watch It In Action (keep where it is — near bottom)
10. Final CTA + What's in the box + Related devices (keep)
```

**Sections being removed/merged:**
- Section 3 ("Most heart symptoms don't happen inside hospitals") merges into "Why early checks matter"
- Section 4 (PRODUCT INTRODUCTION) — redundant after hero + detects section, REMOVE
- Section 9 (PARENT CARE) — fold one line into hero subtext or comparison; REMOVE the full section
- Section 11 (FEATURES) — pick top 3 features, fold as a small strip under comparison; REMOVE the full section
- Section 13 (OFFER FRAMING) — redundant with Final CTA; REMOVE
- The two mid-page primary CTA bands (lines 334 + 688 + 857) — keep only ONE mid-page primary CTA band (after Nera AI)
- Section 14 (FINAL TRUST REINFORCEMENT 3-card) — fold the 3 chips into the Final CTA section as a small inline trust strip

**Copy tightening rules applied throughout:**
- Headlines stay; cut paragraph subtext to ≤2 sentences each.
- Bullet lists: max 4 items per card.
- Remove repeated phrases like "Check Your Heart Anytime" appearing on every CTA — vary or shorten.

**No changes to:**
- Hero layout, pricing, sticky add-to-cart
- Nera AI section internals
- Reviews / Awards / TrustVideos sections at the very bottom
- Color tokens, fonts, animation patterns

---

## Technical notes

- All edits in one file: `src/pages/products/SanketLifeECGProduct.tsx`
- Use existing imported icons; no new imports expected.
- Preserve all `motion.div` `fadeUp` patterns for consistency.
- Keep semantic tokens (`bg-destructive/5`, `text-destructive`, `bg-card`, etc.) — no raw hex colors in JSX.
- Net result: file shrinks from ~1015 lines to roughly ~700 lines.
