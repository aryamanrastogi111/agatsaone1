# Agatsa Corporate Website Redesign — Strategy and Design Proposal

Strategy only. No code changes until you approve. Existing commerce (cart, checkout, pricing, NERA trial terms, stock behaviour, tracking) stays as it is; the redesign changes structure, storytelling and visuals.

Copy rules carried over: say "sugar response / metabolic trend", never "glucose"; no regulatory badge text outside /pricing; no "Inclusive of GST"; no medical claims for wellness devices.

---

## 1. Sitemap

```text
Home
├── Devices (overview + compare)
│   ├── SanketLife 2.0        (personal 12-lead ECG)
│   ├── SanketLife Pro+       (professional ECG)
│   ├── EasyTouch Wellness    (metabolic wellness)
│   ├── EasyTouch Rhythm Band (wearable)
│   ├── CoreBalance           (body composition)
│   └── Bundles / Kits
├── NERA AI
│   ├── How it works
│   ├── Plans (Premium trial per device)
│   └── Privacy & data
├── For Healthcare
│   ├── Clinics & Doctors
│   ├── Hospitals & Telehealth
│   └── Clinical evidence (studies, publications)
├── Partners
│   ├── Distributors
│   ├── OEM / White-label
│   ├── SDK & API (₹18,999 dev kit)
│   └── Research collaborations
├── Science (research hub, publications PDFs, methodology)
├── Company
│   ├── About / Leadership
│   ├── Media & Recognition
│   ├── Careers
│   └── Contact
├── Journal (blog)
├── Support (setup, app download, FAQs, warranty, returns, shipping)
└── Cart / Checkout / Order success   (unchanged)
```

Global utility: region/currency indicator (India / International ₹3,000 shipping), app download, cart.

---

## 2. Homepage wireframe

```text
[ Top bar: logo · Devices · NERA AI · Healthcare · Partners · Science · Company | Cart · Buy ]

1 HERO — full-bleed product still life, calm light background
  "Personal health. Powered by AI."
  Sub: Clinical-grade devices, intelligence that learns you.
  [Explore devices]  [For healthcare & partners]

2 AUDIENCE SPLIT — 3 quiet cards
  For you · For clinicians · For partners  → each routes to its journey

3 ECOSYSTEM — one horizontal device rail (5 devices) with
  name, one-line purpose, price or "Talk to us", Learn more

4 NERA AI STORY — scroll chapter: device → signal → insight
  Real app screens, not mock graphics

5 PROOF STRIP — numbers that are sourced (records analysed,
  studies, cities/countries) + media logos

6 CLINICAL EVIDENCE — 2–3 study cards with real figures, link to Science

7 FEATURED DEVICE — rotating spotlight (e.g. SanketLife 2.0) with
  compact buy stack (price, trial, delivery)

8 PEOPLE — 3 real testimonials (customer, doctor, partner)

9 B2B BAND — dark section: Distributors · OEM · SDK · Research → Partner form

10 JOURNAL — 3 latest articles with images

11 FINAL CTA + FOOTER (contact, legal, social, app badges)
```

---

## 3. Design system

**Direction:** "Clinical calm" — warm off-white space, one confident accent, precise type, real photography. Premium through restraint, not gradients.

- **Colour tokens:** background warm white; foreground near-black ink; primary Agatsa purple (kept from brand) used sparingly for actions; secondary deep navy for B2B/dark sections; data accents (heart red, metabolic amber, wellness green) only inside charts and device cues; muted greys tested for AA contrast (no unreadable grey body text).
- **Typography:** a characterful grotesk for headlines (e.g. Manrope or General Sans style), a highly legible text face for body; numeric tabular figures for data. Scale: Display 64/72, H1 48, H2 36, H3 24, Body 17, Small 14.
- **Grid & spacing:** 12-col desktop, 4-col mobile; 8-pt spacing; generous but not empty section rhythm (96px desktop / 56px mobile).
- **Components:** Nav + mega menu, mobile sheet nav, device card, compare table, price/buy stack, audience card, stat block (always with source), study card, chart card, testimonial, logo strip, lead form (B2B), FAQ accordion, sticky cart bar (existing), footer.
- **Imagery:** product on neutral surfaces; real people in Indian and international homes and clinics; real app screens; no stock "AI brain" art.
- **Motion:** subtle fade/slide on scroll, one scroll-driven chapter per page max; respects reduced-motion.
- **Accessibility:** WCAG AA contrast, 44px touch targets, focus states, alt text, readable sizes for older users.
- **Voice:** clear, confident, plain English; evidence before adjectives.

---

## 4. User journeys

**Consumer (e.g. person checking heart or meal response)**
```text
Ad / search / social → Device page (problem-first story)
→ proof (evidence, reviews) → NERA trial explained
→ Add to cart → Checkout → Order success → App download & pairing
```
Support moments: compare devices, EMI/shipping info, WhatsApp/lead capture on hesitation, abandoned-checkout follow-up (existing).

**Doctor / hospital**
```text
Search / referral → For Healthcare → Clinical evidence
→ SanketLife Pro+ → Book demo / request pricing form
→ Sales follow-up → Pilot → Order
```

**Distributor / OEM / tech partner**
```text
LinkedIn / event → Partners hub → choose path (Distributor · OEM · SDK)
→ capabilities + brochure download (lead) → Partner enquiry form
→ SDK: buy dev kit directly
```

**Research organisation**
```text
Publication / conference → Science hub → studies & methodology
→ Research collaboration form
```

---

## 5. Conversion goals by page

| Page | Primary goal | Secondary goal |
|---|---|---|
| Home | Click into a device or audience path | Partner enquiry |
| Devices overview | Open a device page | Compare / buy bundle |
| Each consumer device | Add to cart / Buy now | WhatsApp lead, app download |
| SanketLife Pro+ | Demo / pricing request | Brochure download |
| NERA AI | Buy a device with trial | Plan page view |
| For Healthcare | Book a demo | Evidence download |
| Partners / Distributors / OEM | Partner enquiry | Brochure download |
| SDK & API | Buy dev kit | Docs / contact |
| Science | Research enquiry | PDF download |
| Media / About | Trust → device visit | Press contact |
| Journal | Read → device page click | Newsletter |
| Support | Self-serve resolution | Contact |
| Checkout | Pay Now completion | — |

Measured with existing analytics and Meta events; no change to when purchase events fire.

---

## 6. Mobile navigation strategy

- **Top bar:** logo left, cart + menu right; hides on scroll down, returns on scroll up.
- **Menu sheet (full height):** first row asks "I'm here for…" — Myself · Healthcare · Partnership — then grouped links; devices shown as a thumbnail list with prices.
- **Contextual sticky bar:** on device pages the existing sticky buy bar (price + Buy); on B2B pages a sticky "Talk to us" button; none on content pages.
- **Thumb-zone actions:** primary buttons full-width at bottom of each section.
- **In-page chapter chips** (horizontally scrollable) on long device pages.
- **Footer as secondary nav:** accordion groups for all links.

---

## Questions to settle before building
- CoreBalance: is this the renamed Smart Scale (currently out of stock) or a new product?
- SanketLife Pro+: sold online with price, or enquiry only?
- Should MultiVital and Zlu (on the current homepage) stay in the device lineup?

## Rollout (after approval)
1. Design tokens, type and shared components.
2. New navigation (desktop mega menu + mobile sheet).
3. Homepage rebuild.
4. Healthcare, Partners and Science hubs.
5. Device pages re-skinned to the new system (commerce logic untouched).
6. Accessibility, mobile and performance checks.
