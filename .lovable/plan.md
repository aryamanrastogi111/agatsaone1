

## Smart Scale Page Redesign

### Current page flow
1. Hero (image + price + CTA)
2. **Videos** ← too early, should move down
3. Stats strip (14 metrics / 5 sec / 10 profiles)
4. 14 metrics grid
5. How it works (3 steps)
6. Nera AI section
7. What's included
8. FAQ
9. Related devices
10. Final CTA
11. Trust videos + Awards + Reviews

### Proposed new flow (inspired by EasyTouch Wellness)

```text
1. Hero (keep as-is, already strong)
2. NEW — Problem section: "Your scale only tells you half the story"
   - 3-card grid explaining why weight alone is dangerous
   - Card 1: "Weight hides the real problem" (you can lose weight and gain visceral fat)
   - Card 2: "BMI lies" (two people, same BMI, totally different health)
   - Card 3: "Your doctor needs more than a number" (body composition matters)
   - Punchline: "Not just weight. The full picture."
3. Stats strip (keep — 14 metrics / 5 sec / 10 profiles)
4. How it works (move UP, before the metrics grid)
5. 14 metrics grid (keep)
6. NEW — Mid-page CTA (price + Add to Cart + Nera AI badge)
7. Awards & Trust section
8. Nera AI section (keep, already strong — visceral fat focus)
9. What's included (fix: still says "3-month Nera AI" → update to 1 year)
10. NEW — "This is for you if..." section
    - Fitness-focused people who want body recomposition tracking
    - Anyone whose doctor told them to lose weight but never said how to measure progress
    - Families wanting one device for everyone
    - People tired of scales that only show a number
11. Videos (moved down here)
12. FAQ
13. Related devices
14. Final CTA
15. Trust videos + Reviews
```

### Specific changes in `SmartScaleProduct.tsx`

1. **Add Problem section** after hero — 3 scannable cards with Lucide icons explaining why weight alone is misleading
2. **Move "Watch It In Action" videos** from position 2 to after "This is for you if..." (much lower)
3. **Reorder**: How it works moves before the 14-metrics grid
4. **Add mid-page CTA** between metrics grid and Awards — same pattern as EasyTouch Wellness (price, urgency bar, Add to Cart, Nera AI badge, trust bar)
5. **Add Awards section** (lazy-loaded `AwardsTrustSection`) after mid-page CTA
6. **Add "This is for you if..." section** with checkmark list (6 items)
7. **Fix "What's included"** — update the Nera AI line from "3-month" to "1-year, No subscription needed"
8. **Lazy-load** heavy below-fold components (AwardsTrustSection, TrustVideosSection, ProductReviewsSection) like EasyTouch does

### Files to edit
- `src/pages/products/SmartScaleProduct.tsx` — all changes in this single file

