## Goal

Make `https://agatsaone.com/lose-belly` return fully-rendered HTML in the initial server response — so ChatGPT, Meta/Facebook, LinkedIn, Slack, and other JS-less crawlers can read the headline, benefits, FAQ, testimonials, and CTAs as real text.

The rest of the site (home, products, admin, checkout) stays as a normal SPA — no behavior change.

## Approach: Prerender only `/lose-belly` at build time

After Vite builds the SPA, a headless Chrome instance loads `/lose-belly`, waits for React to render, captures the final DOM, and writes it to `dist/lose-belly/index.html`. When a crawler requests `/lose-belly`, the host serves that static HTML file directly (it takes precedence over the SPA fallback). When a real user lands on it, React hydrates on top and the page becomes interactive as normal.

No source-code rewrite of `LoseBelly.tsx` needed. No Next.js. No SSR runtime.

## Changes

1. **Add dependencies** (dev):
   - `@prerenderer/rollup-plugin`
   - `@prerenderer/renderer-puppeteer`
   - `puppeteer` (downloads bundled Chromium at install)

2. **Update `vite.config.ts`** — add the prerender plugin, configured to prerender only the `/lose-belly` route, with a 2s wait for animations/images to settle.

3. **Verify the build output** — confirm `dist/lose-belly/index.html` contains the headline ("Lose your belly…"), CTA, benefits, FAQ as plain HTML by grepping the built file.

4. **No changes to `LoseBelly.tsx`** — the page already renders real HTML; we're just snapshotting it at build time.

## Risks & mitigations

- **Puppeteer install size (~170 MB)** — only a devDependency, doesn't ship to users. Build time will increase by ~10–30s.
- **Puppeteer may fail in Lovable's build sandbox** — if Chromium can't launch, the build will fail. If that happens, fall back to writing a hand-authored static `public/lose-belly.html` with the same SEO content (no JS render needed, but loses single-source-of-truth).
- **Hydration mismatches** — if any code in the LoseBelly tree behaves differently between SSR-snapshot time and client hydration (e.g. `Date.now()`, randomness), React will warn in console and re-render. We'll keep the page deterministic.
- **Other routes unaffected** — only `/lose-belly` is in the prerender list.

## Out of scope

- Prerendering other product pages (can extend later once `/lose-belly` is verified working).
- Full SSR (Next.js / Remix migration).
- Per-route og:image generation.

## Verification

After build: `grep -c "Lose your belly" dist/lose-belly/index.html` should return a non-zero count, and `curl -s https://agatsaone.com/lose-belly | grep -i "lose your belly"` should return matches once deployed.
