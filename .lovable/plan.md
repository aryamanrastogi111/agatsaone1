## Goal

Edit-only pass on `src/pages/products/EasyTouchWellnessProduct.tsx`. No UI, layout, structure, sections, components, classes, icons, or images change. Only string content is rewritten — keeping ~70%+ of the original wording intact, while blending in metabolic-response, body-signal, HRV / blood-flow / post-meal stress language.

No other files are touched. No new sections, no removed sections, no reordered cards.

## Rewrite map (file: `src/pages/products/EasyTouchWellnessProduct.tsx`)

Each item below is a targeted text-only edit. Original phrasing is mostly preserved; the additions (in italics here, plain text in code) extend the idea instead of replacing it.

### 1. Hero (lines 154–158, 170–172, 197–202)

- Keep H1 lines exactly: "Your Body Responds Differently / to Every Meal. / Now You Can See How." — already perfectly on-message, no change.
- Subheadline (170–172 and 200–202): keep wording, add a short tail clause:
  - "...so you stop guessing and start knowing exactly what food does to your body — *and how your body quietly responds to it.*"

### 2. Zones array (lines 39–41)

- Active: keep "after food, light activity, or normal daily stress" → add: "*Your heart rhythm and blood flow are responding the way they should.*"
- Elevated: keep "heavy meal, poor sleep, or building stress" → add: "*A sign your body is taking longer than usual to settle after what you ate.*"
- High: keep existing → add: "*Your post-meal recovery and pulse signals are under noticeable strain.*"

### 3. `whoIsThisFor` (lines 47–49)

- Line 48: "You want to see how food, sleep, and stress are silently shaping your body" → "...are silently shaping your body — *not just on the scale, but inside it.*"

### 4. `fingerprintCards` (lines 64–69)

- Daily Load Score (64): keep, append: "*It captures how your body is reacting right now — not just to food, but to sleep, stress and activity.*"
- Your Body Pattern (65): keep, append: "*Because two people can eat the same meal and react completely differently inside.*"
- Smart Reminders (66): keep, append: "*Same meal, different day — your body's response can change. The right scan timing reveals it.*"
- Trends Over Time (69): keep "Sleep, food, and stress all leave a mark on your score" → add: "*Your real health signal is the pattern over weeks, not a single meal.*"

### 5. Testimonial (line 75)

- Keep the resident wording; tweak final sentence: "...lighter dinners — it's consistently above 74. *I didn't change what I ate as much as I learned how my body was reacting to it.* I just listened to the signals."

### 6. FAQ block (lines 81–82, 115–118)

- Q: light through finger / sugar (81–82): keep entire answer; tighten the second-to-last paragraph: "EasyTouch does not measure sugar molecules the way a strip test does. It reads how your body is coping — *your heart rhythm, your blood flow, your internal stress response after a meal.*"
- 115: keep "It's designed to help you understand food's effect on your body over time" → "*to help you understand how your body responds to food, sleep and stress over time*".
- 116: keep — "Food Fingerprint" naming is a product feature, leave intact.
- 117: keep "track their metabolic responses to different foods" → "*track how their body responds to different foods, and to daily stress and sleep,*".
- 118: keep — feature names ("Food Fingerprint", "Meal Impact Score") are product names, leave intact.

### 7. SEO title/desc (line 144)

- Keep title intact ("Personal Food Fingerprint & Metabolic Tracking" already balanced).
- Description: keep "Discover how your body responds to every meal" → add a phrase: "Discover how your body responds to every meal — *and to sleep, stress and daily load* — with EasyTouch Wellness and Nera AI..."

### 8. Problem section (lines 279–283, 297–298, 308–319)

- H2 (279): keep "You've Been Eating Blindfolded." (it's the section's identity).
- 282: keep, append: "...still feel sluggish, bloated, or drained. You don't know why. *The food isn't the only story — how your body reacts to it is.*"
- 297–298: keep "Metabolic response is personal. The same bowl of rice that barely moves your friend's numbers can spike yours." → add muted line: "*Same plate. Same portion. Two completely different bodies inside.*"
- 308–319 cards: keep titles; extend descriptions:
  - "Which foods drain you?" → "...drain you vs. energize you — *because your body's reaction is the real signal.*"
  - "Light vs. Heavy?" → "...between a Light meal and a Heavy one — on your body. *Same meal, different day, different response.*"
  - "Your baseline?" → keep, append: "*And how far each meal pulls you away from it.*"

### 9. "Why everyone needs this" (lines 365–368, 377–403, 449–464)

- 365–366 H2: keep "The silent problem hiding in everyday meals" — append a short kicker line just by extending the paragraph at 367–369:
  - "...and most don't know until it's serious. EasyTouch Wellness catches the early signals, every single day — *in your heart rhythm, your blood flow and how you recover after meals.*"
- Problem→Solution rows (377–403), keep all 6 titles; light extensions to the "solution" copy only:
  - 378: "...so you can swap them out. *And see when the same meal hits you harder than usual.*"
  - 383: "...through metabolic patterns *that show up in your pulse, not just on your plate.*"
  - 388: "...your body reacts differently than others. *The food may be the same — your response isn't.*"
  - 393: "...quietly stalls your fitness goals. *The kind that builds long before sugar tests notice.*"
  - 398: keep — already non-food.
  - 403: "...Metabolic Score 0–100 *that reflects how your whole body is coping today, not just what you ate.*"
- "Who needs this?" list (444–450): keep all 6 lines word-for-word.
- 462–464 closing: keep "everyone who eats" → change tagline at 464: "Because *what you eat matters — but how your body responds to it matters more.*"

### 10. Meal Intelligence section (lines 628–643, 736–738, 772–774)

- 628–633 header: keep wording; append to 633: "...affected *your* body — flagged Light or Heavy. *Because the same meal can be Light for one body and Heavy for another.*"
- 641–643 cards: keep all titles and tags; extend desc text:
  - 641: "...flags overshoots vs WHO targets. *So you see both what's on your plate and what it's doing inside.*"
  - 642: keep — already on-message.
  - 643: "...not after a year. *And see how your body actually carries that load.*"
- 737–738 Food Fingerprint card: keep H3; extend 738: "...vs your fasting baseline. *So you can tell which meals settle quickly — and which ones leave your body working overtime.*"
- 772–774 ("Six features..."): keep H2; extend 773: "...your body's personal response to food *— and to the sleep, stress and recovery wrapped around it.*"

## Constraints honoured

- No JSX structure, props, classNames, icons, imports, or component changes.
- No new sections, no removed sections.
- All "Food Fingerprint" / "Meal Impact Score" / "Meal Intelligence" product names retained.
- ~70%+ of original wording preserved per sentence; additions are short tail clauses.
- Tone, casing, punctuation style and em-dash voice preserved.

## Out of scope

- Other product pages, devices grid, home, FAQ pages.
- Images, mockup data inside the phone UIs (numbers like "40g sugar", "biryani", "Calories" labels stay — they're UI labels, not narrative).
- SEO restructuring beyond the small description tweak.

## Result

Same page, same look, same flow — but every sentence that today reads "food / eating / diet" now also tells the user that **their body's response is the real signal**.