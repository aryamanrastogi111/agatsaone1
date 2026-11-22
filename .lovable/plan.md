# Premium homepage rebuild (navy / teal / mint)

Replaces the current dark luxury homepage with the light editorial direction in your brief. Only the homepage, the shared header and the shared footer change.

## Look
- Colours: deep navy #0F233D, teal #12A8A1, soft mint #DFF5F0, off-white #F7F9FB, white canvas. Scoped to the homepage theme so other pages stay as they are.
- Manrope headings, Inter body (already loaded).
- Generous whitespace, editorial alternating layouts, real Agatsa device photos and app screenshots already in the project.
- Subtle motion: fade/slide section reveals, a thin animated ECG line in the hero and NERA section, gentle hover lifts. No gradients-heavy glass, no cartoons, no stock doctors.

## Sections
1. Header: transparent over hero, turns white on scroll. Logo, Devices, NERA AI, Healthcare, Science, About, Support, plus "Shop Devices" button and cart. Mobile: full-screen menu with large tap targets and the Shop button pinned.
2. Hero (full screen): "Your Health. A Bigger Picture." + supporting line, buttons Explore Devices / Partner With Us. Right side: composition of SanketLife, EasyTouch and Rhythm Band photos with a real Agatsa One screenshot. (This replaces "Leading the way in AI-powered personal health.")
3. Editorial showcase: three large alternating image/text blocks — SanketLife, EasyTouch Wellness, Rhythm Band — each with price, trial note (14-day / 7-day Nera AI) and Buy / Learn more.
4. "Connected by NERA AI" (dark navy): real app trend screens + three short points on how the intelligence layer works.
5. Evidence: links to existing published research PDFs and studies already on the site; credentials shown only where we already state them (ISO 13485, Made in India). Empty slots marked as editable placeholders.
6. Company story: short timeline of Agatsa's journey with placeholder years/milestones for you to fill.
7. Two-column CTA: "For you" (shop) and "For healthcare partners" (Partner with us / demo).
8. Footer: products, company, support, policies, contact info@agatsa.com, "FUTURE IS NEAR".

## Content rules
- No new invented numbers, testimonials or certifications. Existing claims (2.1 Lac+ users, 1.5 Cr+ readings, 98.15% sensitivity) are dropped from the homepage unless you confirm them; testimonials section removed.
- No CDSCO/BIS, no "glucose", no Smart Scale.

## Technical
- New components under `src/components/home-v3/`, new `theme="clinical"` scope in `src/index.css`; Home.tsx swaps to them. Old home sections kept on disk.
- Header/footer updated in shared Nav and SiteFooter (affects all pages' header/footer only).
- Verify desktop + phone with screenshots.
