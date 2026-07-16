import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check, ArrowRight, Sparkles, MoonStar, Activity, HeartPulse,
  Flame, Wind, ShieldCheck, Zap,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { usePricing } from "@/hooks/useDevicePricing";
import { useCartStore } from "@/stores/cartStore";
import { useSEO } from "@/hooks/useSEO";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { toast } from "sonner";

import rhythmHero from "@/assets/easytouch-rhythm-new.webp";
import rhythmPortrait1 from "@/assets/rhythm-portrait-1.jpg";
import rhythmPortrait2 from "@/assets/rhythm-portrait-2.jpg";
import rhythmPortrait3 from "@/assets/rhythm-portrait-3.jpg";
import rhythmPortrait4 from "@/assets/rhythm-portrait-4.jpg";
import rhythmAppScore from "@/assets/rhythm-app-score.jpeg.asset.json";
import rhythmAppSystems from "@/assets/rhythm-app-systems.jpeg.asset.json";
import rhythmAppOverloaded from "@/assets/rhythm-app-overloaded.jpeg.asset.json";
import { easytouchRhythmReviews } from "@/data/easytouchRhythmReviews";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const COLORS = [
  { id: "olive",      name: "Olive",      hex: "#6B7A3A" },
  { id: "graphite",   name: "Graphite",   hex: "#2E2E2E" },
  { id: "khaki",      name: "Khaki",      hex: "#B8A55C" },
  { id: "slate",      name: "Slate",      hex: "#6B7BA8" },
  { id: "rosewood",   name: "Rosewood",   hex: "#8E3B4E" },
  { id: "terracotta", name: "Terracotta", hex: "#C1502E" },
  { id: "teal",       name: "Teal",       hex: "#1F6F86" },
];

const CAPABILITIES = [
  { icon: HeartPulse, title: "Heart & Circulation", copy: "Resting HR, HRV, cardiac load — read as a rhythm, not a chart." },
  { icon: MoonStar,   title: "Sleep & Recovery",    copy: "Sleep stages, night HRV, morning readiness — before you get out of bed." },
  { icon: Flame,      title: "Metabolic Load",      copy: "Glucose trend nudges, energy rises, crash moments, food impact." },
  { icon: Activity,   title: "Movement",            copy: "Steps, activity minutes, strain — weighted, not just counted." },
  { icon: Wind,       title: "Autonomic Calm",      copy: "Stress signals, breath, recovery — how balanced your nervous system is." },
];

const COMPARE = [
  { row: "24/7 heart & HRV",         whoop: true, ultra: true, apple: true, levels: false, ours: true },
  { row: "Sleep staging",            whoop: true, ultra: true, apple: true, levels: false, ours: true },
  { row: "Recovery / strain score",  whoop: true, ultra: true, apple: false, levels: false, ours: true },
  { row: "Biological age",           whoop: false, ultra: true, apple: false, levels: false, ours: true },
  { row: "Sugar-response insights",  whoop: false, ultra: false, apple: false, levels: true,  ours: true },
  { row: "AI health conversation",   whoop: false, ultra: false, apple: false, levels: false, ours: true },
  { row: "Clinical device pairing (ECG, Wellness)", whoop: false, ultra: false, apple: false, levels: false, ours: true },
  { row: "No monthly subscription lock-in",         whoop: false, ultra: false, apple: true,  levels: false, ours: true },
];

const FAQS = [
  { q: "Is this a smartwatch?", a: "No. It's a screenless band. Nothing to check, nothing to notify. It reads your body 24/7 and Nera AI turns that into one daily answer." },
  { q: "How is sugar tracking done without a CGM?", a: "Nera AI learns your body's rhythm — HRV, temperature, sleep, activity, meal timing — and surfaces likely energy dips and food-impact patterns. Pair with a CGM or Agatsa EasyTouch for a fuller picture." },
  { q: "Do I need the other Agatsa devices?", a: "No. Rhythm Band works fully standalone with Nera AI. Pair with SanketLife ECG or EasyTouch Wellness later and the AI gets sharper." },
  { q: "Battery?", a: "Up to 7 days of continuous 24/7 monitoring on a single charge. Magnetic charging." },
  { q: "Water?", a: "IP67. Sweat, rain, handwashing — all fine. Avoid swimming for now." },
  { q: "What's included with the band?", a: "Rhythm Band, magnetic charger, quick-start card, and a 7-day Nera AI Premium free trial that activates the moment you pair the device in Agatsa One." },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RhythmBandPro() {
  const { prices, fmt } = usePricing();
  const price = prices.band_sub;
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useSEO({
    title: "Rhythm — AI Body Intelligence System | Agatsa",
    description:
      "Rhythm is not a fitness band. It's an AI body intelligence system — Nera AI reads your heart, sleep, metabolism, movement and calm as one daily answer.",
  });
  useMetaPixelViewContent("RHYTHM_BAND", "EasyTouch Rhythm Band", price);

  const addToCart = () => {
    useCartStore.getState().addItem({
      productId: "band_sub",
      productName: "EasyTouch Rhythm Band",
      variantTitle: selectedColor.name,
      price,
      quantity: 1,
    });
    toast.success(`Rhythm Band · ${selectedColor.name} added`, { position: "top-center" });
    if (typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq("track", "AddToCart", {
          content_ids: ["band_sub"],
          content_name: `EasyTouch Rhythm Band (${selectedColor.name})`,
          content_type: "product",
          value: price,
          currency: "INR",
        });
      } catch {}
    }
  };

  return (
    <SiteLayout>
      <div className="bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
        {/* 1. HERO ---------------------------------------------------- */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(90,120,200,0.35),transparent),radial-gradient(800px_500px_at_80%_90%,rgba(200,80,60,0.20),transparent)]" />
          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[11px] md:text-xs tracking-[0.28em] uppercase text-white/60 mb-6"
            >
              Introducing Rhythm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.03em] leading-[0.95]"
            >
              Not a fitness band.
              <br />
              <span className="text-white/50">An AI body</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                intelligence system.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-white/60 leading-relaxed"
            >
              WHOOP-grade recovery. Ultrahuman-style sleep. Apple-quality vitals. Sugar-response
              intelligence. One screenless band. One daily answer — from Nera AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
            >
              <Button
                size="lg"
                onClick={addToCart}
                className="rounded-full bg-white text-black hover:bg-white/90 h-12 px-8 text-sm font-medium"
              >
                Buy — {fmt(price)}
              </Button>
              <a
                href="#capabilities"
                className="rounded-full h-12 px-6 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative mt-16 md:mt-20"
            >
              <div className="absolute inset-x-0 -bottom-6 h-40 bg-[radial-gradient(closest-side,rgba(255,255,255,0.15),transparent)] blur-2xl" />
              <img
                src={rhythmHero}
                alt="Rhythm Band"
                className="relative mx-auto max-w-lg md:max-w-2xl w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </div>
        </section>

        {/* 2. STATEMENT ---------------------------------------------- */}
        <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.02em] leading-tight"
          >
            Your body speaks in rhythms.
            <span className="block text-white/50 mt-2">Nera AI translates them.</span>
          </motion.h2>
          <motion.p {...fadeUp} className="mt-8 text-lg text-white/60 leading-relaxed">
            Heart rate. Sleep. Metabolism. Movement. Calm. Five systems, one signal.
            Instead of showing you five dashboards, Rhythm gives you the one thing that matters:
            <span className="text-white"> what your body needs today.</span>
          </motion.p>
        </section>

        {/* 3. CAPABILITIES ------------------------------------------- */}
        <section id="capabilities" className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <motion.p {...fadeUp} className="text-[11px] tracking-[0.28em] uppercase text-white/50 text-center">
              Five systems. One rhythm.
            </motion.p>
            <motion.h3 {...fadeUp} className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-center">
              Everything your body is doing, all at once.
            </motion.h3>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {CAPABILITIES.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 hover:bg-white/[0.05] hover:border-white/20 transition-all"
                >
                  <c.icon className="h-5 w-5 text-white/80 mb-4" />
                  <h4 className="text-base font-medium">{c.title}</h4>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{c.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. COMPARISON --------------------------------------------- */}
        <section className="border-t border-white/5 bg-[#0d0d0d]">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <motion.h3 {...fadeUp} className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-center">
              One band. What used to take four.
            </motion.h3>
            <motion.p {...fadeUp} className="mt-4 text-center text-white/50 max-w-xl mx-auto">
              A quiet comparison against the categories people compare us to.
            </motion.p>

            <motion.div {...fadeUp} className="mt-14 overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="text-left text-white/40 text-xs uppercase tracking-wider">
                    <th className="py-4 font-normal">Capability</th>
                    <th className="py-4 font-normal text-center">Recovery Bands</th>
                    <th className="py-4 font-normal text-center">Sleep Rings</th>
                    <th className="py-4 font-normal text-center">Smartwatches</th>
                    <th className="py-4 font-normal text-center">CGM Patches</th>
                    <th className="py-4 font-normal text-center text-white">Rhythm</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => (
                    <tr key={row.row} className="border-t border-white/5">
                      <td className="py-4 text-white/85">{row.row}</td>
                      <Cell on={row.whoop} />
                      <Cell on={row.ultra} />
                      <Cell on={row.apple} />
                      <Cell on={row.levels} />
                      <Cell on={row.ours} highlight />
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* 5. NERA AI CONVERSATION ---------------------------------- */}
        <section className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <p className="text-[11px] tracking-[0.28em] uppercase text-white/50">Nera AI</p>
              <h3 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
                Not a dashboard.
                <span className="block text-white/50">A conversation.</span>
              </h3>
              <p className="mt-6 text-white/60 text-lg leading-relaxed">
                Ask "why am I tired?" and Nera answers with your last night's HRV, your sugar
                trend, your training load and yesterday's late meal — in one sentence.
              </p>
              <ul className="mt-8 space-y-3 text-white/70">
                {[
                  "Daily Rhythm Score across 5 systems",
                  "Biological Age estimate, updated weekly",
                  "Loaded / Balanced / Overloaded state",
                  "Personalised nudges instead of raw charts",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <Check className="h-4 w-4 mt-1 text-white/60" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} className="relative">
              <div className="absolute -inset-8 bg-[radial-gradient(closest-side,rgba(120,140,220,0.25),transparent)] blur-2xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <img src={rhythmAppScore.url}      alt="Rhythm score" className="rounded-2xl border border-white/10 col-span-2" />
                <img src={rhythmAppSystems.url}    alt="Systems"      className="rounded-2xl border border-white/10" />
                <img src={rhythmAppOverloaded.url} alt="Overloaded"   className="rounded-2xl border border-white/10" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 6. SUGAR RESPONSE ---------------------------------------- */}
        <section className="border-t border-white/5 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} className="order-2 md:order-1 relative">
              <div className="absolute -inset-8 bg-[radial-gradient(closest-side,rgba(200,80,60,0.20),transparent)] blur-2xl" />
              <img
                src={rhythmPortrait2}
                alt="Sugar response"
                className="relative rounded-3xl border border-white/10 w-full object-cover"
              />
            </motion.div>
            <motion.div {...fadeUp} className="order-1 md:order-2">
              <p className="text-[11px] tracking-[0.28em] uppercase text-white/50">Sugar response</p>
              <h3 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
                Know your energy rises.
                <span className="block text-white/50">And your crashes.</span>
              </h3>
              <p className="mt-6 text-white/60 text-lg leading-relaxed">
                Nera AI reads your body's response signals — HRV shifts, temperature, sleep debt,
                activity — and surfaces likely glucose trends, energy dips and food impact.
                Nudges when it matters. Silent when it doesn't.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 7. DESIGN ------------------------------------------------- */}
        <section className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <motion.h3 {...fadeUp} className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-center">
              Designed to be worn.
              <span className="block text-white/50">Forgotten. Trusted.</span>
            </motion.h3>
            <div className="mt-14 grid md:grid-cols-4 gap-2">
              {[rhythmPortrait1, rhythmPortrait2, rhythmPortrait3, rhythmPortrait4].map((src, i) => (
                <motion.img
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  src={src}
                  alt=""
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
              ))}
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-4 text-center">
              {[
                { icon: ShieldCheck, t: "IP67", s: "Sweat, rain, handwash" },
                { icon: Zap,         t: "7-day battery", s: "Continuous 24/7 monitoring" },
                { icon: Sparkles,    t: "Screenless", s: "Nothing to check. Nothing to notify." },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
                  <f.icon className="h-5 w-5 text-white/70 mx-auto" />
                  <p className="mt-3 text-base font-medium">{f.t}</p>
                  <p className="mt-1 text-sm text-white/50">{f.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. COLOURS ------------------------------------------------ */}
        <section id="colours" className="border-t border-white/5 bg-[#0d0d0d]">
          <div className="max-w-5xl mx-auto px-6 py-24 text-center">
            <motion.p {...fadeUp} className="text-[11px] tracking-[0.28em] uppercase text-white/50">
              The collection
            </motion.p>
            <motion.h3 {...fadeUp} className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em]">
              Seven colours. One system.
            </motion.h3>
            <motion.p {...fadeUp} className="mt-4 text-white/50">
              Currently: <span className="text-white">{selectedColor.name}</span>
            </motion.p>

            <div className="mt-14 flex flex-wrap justify-center gap-5 md:gap-8">
              {COLORS.map((c) => {
                const active = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className="group flex flex-col items-center gap-3 focus:outline-none"
                    aria-label={`Choose ${c.name}`}
                  >
                    <span
                      className={`h-16 w-16 md:h-20 md:w-20 rounded-full transition-all duration-300 ${
                        active
                          ? "ring-2 ring-white ring-offset-4 ring-offset-[#0d0d0d] scale-105"
                          : "ring-1 ring-white/15 group-hover:ring-white/40"
                      }`}
                      style={{ backgroundColor: c.hex, boxShadow: `0 8px 24px ${c.hex}55` }}
                    />
                    <span className={`text-xs md:text-sm ${active ? "text-white" : "text-white/50"}`}>
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. REVIEWS ------------------------------------------------ */}
        <section className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <motion.h3 {...fadeUp} className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-center">
              People wear it. And keep wearing it.
            </motion.h3>
            <div className="mt-14 grid md:grid-cols-3 gap-4">
              {easytouchRhythmReviews.slice(0, 6).map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <div className="text-white/70 text-xs tracking-wider">★★★★★</div>
                  <p className="mt-3 text-white/80 text-sm leading-relaxed">"{r.review}"</p>
                  <p className="mt-4 text-white/40 text-xs">— {r.name}{r.location ? `, ${r.location}` : ""}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. FAQ --------------------------------------------------- */}
        <section className="border-t border-white/5 bg-[#0d0d0d]">
          <div className="max-w-3xl mx-auto px-6 py-24">
            <motion.h3 {...fadeUp} className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-center">
              Questions.
            </motion.h3>
            <div className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`f-${i}`} className="border-white/10">
                    <AccordionTrigger className="text-left text-white hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* 11. BUY --------------------------------------------------- */}
        <section id="buy" className="border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
            <motion.h3 {...fadeUp} className="text-4xl md:text-6xl font-semibold tracking-[-0.02em]">
              Rhythm Band.
            </motion.h3>
            <motion.p {...fadeUp} className="mt-4 text-white/60 text-lg">
              {selectedColor.name} · 7-day Nera AI Premium free
            </motion.p>

            <motion.div {...fadeUp} className="mt-10 inline-flex flex-col items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-semibold">{fmt(price)}</span>
                <span className="text-lg text-white/40 line-through">{fmt(5499)}</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={addToCart}
                  className="rounded-full bg-white text-black hover:bg-white/90 h-12 px-8 text-sm font-medium"
                >
                  Add to bag
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white text-sm font-medium"
                >
                  <Link to="/checkout?sku=band_sub">Buy now</Link>
                </Button>
              </div>

              <p className="text-xs text-white/40">
                Free shipping in India · 7-day return · 1-year warranty
              </p>
            </motion.div>

            <motion.p {...fadeUp} className="mt-16 text-white/40 text-sm">
              Prefer the classic experience?{" "}
              <Link to="/devices/rhythm-band" className="text-white/70 underline underline-offset-4 hover:text-white">
                See the original page
              </Link>
            </motion.p>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

function Cell({ on, highlight = false }: { on: boolean; highlight?: boolean }) {
  return (
    <td className={`py-4 text-center ${highlight ? "bg-white/[0.03]" : ""}`}>
      {on ? (
        <Check className={`inline h-4 w-4 ${highlight ? "text-white" : "text-white/70"}`} />
      ) : (
        <span className="text-white/20">—</span>
      )}
    </td>
  );
}
