import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "node:fs";
import { componentTagger } from "lovable-tagger";

const loseBellyCrawlerContent = String.raw`
<main id="lose-belly-crawler-content" aria-label="Lose Your Belly 90" style="font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0B2A4A; background: #ffffff;">
  <header style="padding: 56px 20px; background: #F7FAFC;">
    <div style="max-width: 1120px; margin: 0 auto; display: grid; gap: 28px;">
      <p style="margin: 0 0 12px; color: #1F7A4D; font-weight: 700;">90-day money-back guarantee</p>
      <h1 style="margin: 0; max-width: 820px; font-size: 48px; line-height: 1.05; letter-spacing: 0;">Lose 5 cm in 90 days. Or your money back.</h1>
      <p style="margin: 18px 0 0; max-width: 740px; color: #4A5568; font-size: 20px; line-height: 1.55;">India's first body-measured programme. Snap your meals. Step on your scale. Watch your visceral fat drop. Powered by Nera AI.</p>
      <p style="margin: 22px 0 0; font-weight: 700;">Start your 90 days — ₹4,999</p>
      <p style="margin: 10px 0 0; color: #4A5568;">No subscription · 90-day money-back · Smart scale included</p>
    </div>
  </header>
  <section style="padding: 44px 20px; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
    <div style="max-width: 1120px; margin: 0 auto; display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); text-align: center;">
      <div><strong style="display: block; font-size: 30px;">21,400+</strong><span>Indians enrolled</span></div>
      <div><strong style="display: block; font-size: 30px;">94%</strong><span>hit goal in 90 days</span></div>
      <div><strong style="display: block; font-size: 30px;">4.8/5</strong><span>average rating</span></div>
      <div><strong style="display: block; font-size: 30px;">−4.6 cm</strong><span>average waist loss</span></div>
    </div>
  </section>
  <section style="padding: 56px 20px;">
    <div style="max-width: 920px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; margin: 0 0 18px;">You've tried everything.</h2>
      <p style="font-size: 18px; line-height: 1.65; color: #4A5568;">The gym. The keto. The 16:8. The ₹15,000 nutritionist who gave you a PDF. Your belly is still there.</p>
      <p style="font-size: 18px; line-height: 1.65; color: #4A5568;">Here's why none of it worked: you've been losing the wrong fat. The fat that matters — visceral fat, the kind around your organs — is the fat your scale never showed you. Until now.</p>
    </div>
  </section>
  <section style="padding: 56px 20px; background: #F7FAFC;">
    <div style="max-width: 1120px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; text-align: center; margin: 0 0 32px;">Three numbers. Three promises. One refund button.</h2>
      <div style="display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
        <article><h3>−5 cm waist</h3><p>Measured at navel weekly.</p></article>
        <article><h3>−2 levels visceral fat</h3><p>Measured with Agatsa Smart Scale BIA reading.</p></article>
        <article><h3>−4 to 8 kg weight</h3><p>Varies by starting BMI.</p></article>
      </div>
      <p style="margin-top: 30px; font-weight: 700; text-align: center;">If your Day 90 scan misses 2 of 3, we refund the full ₹4,999.</p>
    </div>
  </section>
  <section style="padding: 56px 20px;">
    <div style="max-width: 1120px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; text-align: center; margin: 0 0 32px;">How it works</h2>
      <ol style="display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); padding-left: 20px;">
        <li><strong>Day 0: Baseline.</strong> Step on your Agatsa Smart Scale, measure your waist, take a photo, and lock your goal.</li>
        <li><strong>Days 1–90: Daily.</strong> Snap your meals, get body-aware feedback, do 60-second voice check-ins from Nera AI, and weigh in weekly.</li>
        <li><strong>Day 90: Verdict.</strong> Final scan. Hit your goals and graduate, or miss them and receive an automatic refund.</li>
      </ol>
    </div>
  </section>
  <section style="padding: 56px 20px; background: #F7FAFC;">
    <div style="max-width: 1120px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; text-align: center; margin: 0 0 32px;">Real Indians. Real 90 days.</h2>
      <div style="display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <blockquote>“I had given up. The scale showed me the fat my eyes couldn't see.” — Vipul S., Bangalore, −6.4 cm waist</blockquote>
        <blockquote>“After two kids and 4 failed diets, this was the first thing that worked.” — Pooja R., Gurgaon, −5.1 cm waist</blockquote>
        <blockquote>“My doctor said my fatty liver markers improved. The scale moving was just a bonus.” — Suresh K., Hyderabad, −8.2 cm waist</blockquote>
      </div>
    </div>
  </section>
  <section style="padding: 56px 20px;">
    <div style="max-width: 1120px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; text-align: center; margin: 0 0 32px;">What lands at your door</h2>
      <ul style="display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding-left: 20px;">
        <li>Agatsa Smart Scale with BIA-enabled body composition measurement.</li>
        <li>Body tape and wall chart to track waist, hips, and thighs weekly.</li>
        <li>Nera AI app access for photo meal logging, voice check-ins, and weekly visceral-fat insights.</li>
        <li>Printed 90-day playbook included with Plus.</li>
      </ul>
    </div>
  </section>
  <section id="pricing" style="padding: 56px 20px; background: #F7FAFC;">
    <div style="max-width: 920px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; text-align: center; margin: 0 0 24px;">Choose your plan</h2>
      <article><h3>Standard — ₹4,999</h3><p>Smart Scale rented free, body tape, wall chart, 90-day AI meal logging, weekly visceral-fat insights, 1 year Nera AI Premium app access, and full money-back refund if 2 of 3 goals are missed at Day 90.</p></article>
      <article><h3>Plus — ₹9,999</h3><p>Smart Scale yours to keep, body tape, wall chart, printed 90-day playbook, 4 nutritionist 1:1 video calls, 90-day AI support, 1 year Nera AI Premium app access, and the same full money-back guarantee.</p></article>
    </div>
  </section>
  <section style="padding: 56px 20px;">
    <div style="max-width: 920px; margin: 0 auto;">
      <h2 style="font-size: 34px; line-height: 1.15; margin: 0 0 24px;">Frequently asked questions</h2>
      <h3>What happens if I miss the target?</h3><p>If your Day 90 scan misses 2 of 3 promised outcomes, Agatsa refunds the full ₹4,999.</p>
      <h3>Do I need a subscription?</h3><p>No subscription is required. The programme includes 1 year of Nera AI Premium app access.</p>
      <h3>How do I track progress?</h3><p>You use the Agatsa Smart Scale, weekly waist measurements, meal photos, and Nera AI insights.</p>
      <h3>Who is this for?</h3><p>Adults who want a measurable 90-day belly-fat programme with body composition tracking and daily AI support.</p>
    </div>
  </section>
</main>`;

function replaceOrInsertHeadTag(html: string, matcher: RegExp, tag: string) {
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace("</head>", `    ${tag}\n</head>`);
}

function createLoseBellyHtml(indexHtml: string) {
  let html = indexHtml.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${loseBellyCrawlerContent}</div>`,
  );

  html = replaceOrInsertHeadTag(html, /<title>[\s\S]*?<\/title>/, "<title>Lose 5 cm in 90 days — Agatsa One</title>");
  html = replaceOrInsertHeadTag(
    html,
    /<meta name="description" content="[^"]*"\s*\/?\s*>/,
    '<meta name="description" content="Lose Your Belly 90 is a body-measured 90-day programme with Agatsa Smart Scale, Nera AI support, and a money-back guarantee.">',
  );
  html = replaceOrInsertHeadTag(html, /<link rel="canonical" href="[^"]*"\s*\/?\s*>/, '<link rel="canonical" href="https://agatsaone.com/lose-belly">');
  html = replaceOrInsertHeadTag(html, /<meta property="og:title" content="[^"]*"\s*\/?\s*>/, '<meta property="og:title" content="Lose 5 cm in 90 days — Agatsa One">');
  html = replaceOrInsertHeadTag(html, /<meta property="og:description" content="[^"]*"\s*\/?\s*>/, '<meta property="og:description" content="A body-measured 90-day belly-fat programme with smart scale tracking, Nera AI support, and a money-back guarantee.">');
  html = replaceOrInsertHeadTag(html, /<meta property="og:url" content="[^"]*"\s*\/?\s*>/, '<meta property="og:url" content="https://agatsaone.com/lose-belly">');
  html = replaceOrInsertHeadTag(html, /<meta property="og:type" content="[^"]*"\s*\/?\s*>/, '<meta property="og:type" content="product">');
  html = replaceOrInsertHeadTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?\s*>/, '<meta name="twitter:title" content="Lose 5 cm in 90 days — Agatsa One">');
  html = replaceOrInsertHeadTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?\s*>/, '<meta name="twitter:description" content="A body-measured 90-day belly-fat programme with smart scale tracking, Nera AI support, and a money-back guarantee.">');

  return html;
}

function loseBellyStaticRoutePlugin() {
  let outDir = "dist";

  return {
    name: "agatsa-lose-belly-static-route",
    apply: "build" as const,
    configResolved(config: { root: string; build: { outDir: string } }) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const routeDir = path.join(outDir, "lose-belly");
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(
        path.join(routeDir, "index.html"),
        createLoseBellyHtml(fs.readFileSync(indexPath, "utf8")),
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode !== "development" && loseBellyStaticRoutePlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
