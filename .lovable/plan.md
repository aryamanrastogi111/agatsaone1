## Goal

Make `https://agatsaone.com/lose-belly` return fully-rendered HTML in the initial server response — so ChatGPT, Meta/Facebook, LinkedIn, Slack, and other JS-less crawlers can read the headline, benefits, FAQ, testimonials, and CTAs as real text.

The rest of the site (home, products, admin, checkout) stays as a normal SPA — no behavior change.

## Approach: Generate static crawler HTML for `/lose-belly` at build time

After Vite builds the SPA, a small build plugin writes `dist/lose-belly/index.html` with real readable landing-page copy inside `#root`. When a crawler requests `/lose-belly`, the host serves that static HTML file directly (it takes precedence over the SPA fallback). When a real user lands on it, React hydrates on top and the normal interactive page becomes visible.

No source-code rewrite of `LoseBelly.tsx` needed. No Next.js. No SSR runtime. No Puppeteer dependency.

## Changes

1. **Update `vite.config.ts`** — add a deterministic Vite build plugin that creates only `/lose-belly/index.html` with crawler-readable copy and route-specific head tags.

2. **Remove fragile prerender dependencies** — Puppeteer-based prerendering was not producing live readable HTML reliably.

3. **Verify the build output** — confirm `dist/lose-belly/index.html` contains the headline, CTA, benefits, FAQ as plain HTML by grepping the built file.

## Risks & mitigations

- **Crawler HTML can drift from React copy** — keep the static crawler copy aligned when major `/lose-belly` content changes.
- **Hydration mismatches** — if any code in the LoseBelly tree behaves differently between SSR-snapshot time and client hydration (e.g. `Date.now()`, randomness), React will warn in console and re-render. We'll keep the page deterministic.
- **Other routes unaffected** — only `/lose-belly` is in the prerender list.

## Out of scope

- Prerendering other product pages (can extend later once `/lose-belly` is verified working).
- Full SSR (Next.js / Remix migration).
- Per-route og:image generation.

## Verification

After build: `grep -c "Lose your belly" dist/lose-belly/index.html` should return a non-zero count, and `curl -s https://agatsaone.com/lose-belly | grep -i "lose your belly"` should return matches once deployed.
