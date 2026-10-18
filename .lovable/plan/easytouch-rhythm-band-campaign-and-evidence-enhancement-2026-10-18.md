# EasyTouch Rhythm Band: campaign and evidence enhancement

## Scope and approval

Enhance the existing `/rhythm` page, not replace the website. Build an unpublished preview after approval of this plan. Preserve Agatsa branding, real product images, six displayed colors, actual app screenshots/video, food storytelling, screenless positioning and existing cart/payment flow. Do not publish or change commercial terms without explicit approval.

## Audit findings

- **Correct page:** `src/App.tsx` maps `/rhythm` to `src/pages/RhythmBandPro.tsx`; other Rhythm product pages are separate and will not be redesigned.
- **Current design:** `/rhythm` overrides the shared white/purple design system with black/emerald, extensive glows, glass panels and oversized spacing. Its hero image was broken in the local browser check; phone and product media need an asset-delivery check before redesign. No horizontal overflow or runtime exceptions were observed in that initial desktop/phone check.
- **Price:** the live catalog confirms **₹4,999** and **7-day NERA Premium**. The local fallback is ₹3,999, a discrepancy to flag rather than silently change. Existing currency detection displayed USD in the sandbox; use India/INR preview checks without removing international currency behavior.
- **Colors and commerce:** this page displays Olive, Graphite, Khaki, Slate, Rosewood and Teal. Shared color configuration contains an additional Terracotta entry; preserve the six on this page without deleting another page's configuration. This page already passes the selected color and quantity to checkout. It uses the persistent cart store, existing checkout, Agatsa order API and Razorpay; leave that behavior intact.
- **Product availability:** the live catalog confirms HR, HRV, SpO₂, sleep stages, Bluetooth sync and lifestyle/recovery insights. Marketing pages/screenshots do not establish released meal-photo analysis, precise meal classification, skin-temperature interpretation or automatic insulin-spike detection. Confirm these before making those promises.
- **Current claims:** the named food-response stories contain hard-coded curves and outcomes, not verified customer measurements. Reviews are previously written samples. The recent-purchase popup randomly generates names/cities and labels them verified. Inventory urgency, by contrast, reads stock records.
- **Subscriptions:** the page currently says “no subscription needed for now” and “free Nera AI”; these are ambiguous against the catalog's seven-day trial and footer's Premium pricing. Clarify the included trial with existing helpers, without inventing renewal benefits or auto-renew terms.
- **Unrelated programme:** `index.html` includes a separate Lose Your Belly 90 block outside the React app. JavaScript hides it visually, but it remains in raw/extracted HTML; browser inspection found its extra H1. The programme also has its own route/static generator in `vite.config.ts`. Report this, preserve it, and do not merge or delete it in this pass.
- **Analytics:** existing GTM, Meta Pixel, browser/server Conversions API and visitor tracking are present. UTMs and click IDs are retained in visitor analytics, but angle and order-level attribution need an explicit path. InitiateCheckout belongs on actual Pay Now. Preserve shared event IDs for browser/server Purchase deduplication; inspect externally configured tags for duplicates where accessible.

## 1. Campaign hero and customer goals

- Support `/rhythm?angle=weight`, `?angle=food` and `?angle=sugar` with the brief's exact headlines and supporting copy.
- Campaign CTAs say **Get Started — ₹4,999**, using the current catalog value rather than a separate hard-coded price, and lead to the existing purchase section.
- No angle or an invalid angle retains the existing default hero wording; improve its spacing/media presentation without changing its promise in this pass. Record unsupported wording as awaiting evidence, not as validated.
- Add “What would you like to understand better?” immediately below the hero, with the three requested options and short supporting explanation. Selection updates campaign state and the angle parameter while preserving UTMs and other URL parameters.
- Campaign selection never changes price, inventory, subscription, shipping, warranty or checkout behavior.

## 2. Editorial presentation and existing story

- Use white and light neutral sections, charcoal text and restrained teal/green accents, while retaining the Agatsa header/footer identity. Scope new semantic tokens to Rhythm so other pages are not restyled.
- Keep real product photography visible early, with readable pricing and CTA on phones. Remove decorative glows, excessive glass framing, repeated grid compositions and unnecessary animation from this page.
- Retain food curiosity, Personal Food Profile, actual app screens, recording, wellness timeline, comparison, six-color selection and screenless design. Use approved real Indian food imagery in place of decorative emoji-heavy tiles where suitable.
- Preserve the “same food, different bodies” concept, but explicitly identify the named examples as illustrations and remove invented measured curves. Qualify unverified meal-response and insulin claims.
- Do not display sample quotes as verified customers. Keep previously supplied samples visibly labeled as examples until real testimonials are supplied. Stop rendering fabricated verified-purchase notifications on `/rhythm`; do not change other pages' popup behavior.
- Replace the explanation with four minimal icon-led steps: photograph a meal **only if confirmed available**, track with the band, understand patterns, make practical choices. If photo analysis is not confirmed, use the supported meal-logging action instead and state that limitation in the preview summary.
- Add the brief's short “Small Changes. Better Daily Habits.” editorial sequence.

## 3. Science and research

Place a compact science feature after the personalization story, with swipeable mobile paper entries and clear original-source links. Five references were checked:

1. **Zeevi, Cell 2015:** 800 participants, 46,898 meals; individual variation in responses.
2. **Berry, Nature Medicine 2020:** 1,002 participants; variation after identical meals.
3. **Reynolds, Diabetologia 2016:** the supplied PubMed link correctly points to post-meal walking in adults with type 2 diabetes. Keep that clinical-population limitation.
4. **Gardner, JAMA 2018:** 609 participants; no significant average weight-loss difference between the tested healthy low-fat and low-carbohydrate approaches. Avoid implying this proves every personalized diet works.
5. **Bannuru, Journal of Diabetes Science and Technology 2025:** the supplied PMC link was directly confirmed; 21 trials involving 2,734 adults with type 2 diabetes studied CGM plus nutrition/lifestyle education. This is CGM evidence, not Rhythm validation.

Use plain-language paraphrases, not invented quotations. State clearly that none of these papers tested or endorsed Rhythm Band.

### Agatsa's own research

- Separate this visually from published nutrition literature. Check existing local study PDFs before using numbers or public downloads.
- Present the supplied Apple Watch/Rhythm/Samsung observation and user counts only with their verified source: 19,379/145, 83,090/128 and 2,939/28; total 105,408 observations. Do not sum users into a unique cohort; cohorts may overlap.
- Include the retrospective/no CGM-matched-reference limitation. Do not call these studies peer-reviewed, clinically validated or endorsements.
- The **20 participants / 8,344 held-out windows / first-day calibration / Libre 2 reference** CGM study is not substantiated by a supplied complete report. Reserve its position, but omit the public summary and “View Study Details” link until the complete approved report is provided and checked. Do not invent accuracy metrics or publish confidential presentation slides.

## 4. Purchase, FAQ and attribution

- Retain current Add to Cart, Buy Now, selected color, quantity, stock behavior and sticky purchase actions. Keep free shipping in India and verify existing warranty/return wording against current policies.
- Expand FAQ for food habits, weight management without guarantees, sugar measurement limitations, CGM/glucometer non-replacement, NERA, meal logging, included items, seven-day trial, compatible phones, battery and warranty/returns. Unconfirmed behavior must not receive invented answers.
- Persist original campaign attribution separately from current goal selection and pass it through existing order metadata where supported, without altering payment totals or business logic.
- Track landing/product views, hero CTA, goal selection, AddToCart, actual InitiateCheckout and verified Purchase. Use neutral campaign codes in advertising events; sanitize event-source URLs so health-related angle text or sensitive UTMs cannot leak to Meta. Never send meal details, diagnoses or health conditions.
- Preserve verified Purchase value/currency and shared browser/server event ID. Any backend metadata change requires checking existing API acceptance first; no schema/payment changes by assumption.

## Technical files

**Main page and focused new modules**
- `src/pages/RhythmBandPro.tsx`
- New `src/components/rhythm/*` for goals, published science and limited research summaries
- New `src/data/rhythmResearch.ts` and `src/lib/rhythmCampaign.ts`, with small behavioral tests
- `src/index.css`, `tailwind.config.ts` for scoped semantic tokens; `AGENTS.md` for new structural rules

**Touch only when necessary for media, layout or attribution**
- Existing `src/assets/bands/*.asset.json`, app media pointers and publication imports
- `src/components/SiteLayout.tsx`, `src/components/shop/StickyAddToCart.tsx`
- `src/lib/analytics.ts`, `src/lib/metaCapi.ts`, `src/hooks/useVisitorTracking.ts`, `src/hooks/useMetaPixelViewContent.ts`
- `src/pages/Checkout.tsx`, `supabase/functions/meta-capi/index.ts`, `supabase/functions/send-order-confirmation/index.ts` only for supported attribution/privacy integration; preserve payment behavior

Do not redesign unrelated pages, change the shared price fallback, remove programme HTML, or refactor parallel cart systems in this pass.

## Preview and QA

- Show desktop/mobile default and all three campaigns, plus science-section previews.
- Test missing/invalid angles, goal changes, UTM preservation, six color selections, quantities, Add to Cart, Buy Now and checkout readback.
- Add behavioral tests for angle fallback, neutral identifiers, commercial invariance, attribution preservation and event deduplication where changed.
- Check India/INR and existing international behavior, image/video loading, mobile sticky actions, no obscuring popups, overflow, keyboard access, reduced motion and page errors.
- Verify event payloads without sending test purchases to production. A real paid transaction and externally managed campaign-tag configuration remain unverified unless an approved safe testing path is available.
- Obtain founder approval separately before any publication.

## Evidence needed before related claims go public

- Released meal-photo analysis and detailed wearable-feature confirmation.
- Full CGM comparison report, methodology, limitations, ethics/status details and permission for a public summary.
- October 2026 cross-device presentation or confirmation that existing public study PDFs substantiate the supplied counts.
- Real testimonials if replacing labeled samples; precise renewal and warranty/return details where existing sources disagree.