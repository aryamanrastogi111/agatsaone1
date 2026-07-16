import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { encodeVariantsParam, BAND_SKU } from "@/lib/bandColors";
import {
  Check, X, ArrowRight, HeartPulse, MoonStar, Flame, Activity, Wind, Sparkles,
  Thermometer, Waves, Footprints,
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
import appWearable from "@/assets/rhythm-app-wearable.png.asset.json";
import appMeals from "@/assets/rhythm-app-meals.jpg.asset.json";
import appMetabolic from "@/assets/rhythm-app-metabolic.jpg.asset.json";

/* ------------------------------------------------------------------ */
/* Theme: Black + Emerald. Apple keynote pacing.                       */
/* ------------------------------------------------------------------ */

const EMERALD = "#10b981";

const COLORS = [
  { id: "olive",      name: "Olive",      hex: "#6B7A3A" },
  { id: "graphite",   name: "Graphite",   hex: "#2E2E2E" },
  { id: "khaki",      name: "Khaki",      hex: "#B8A55C" },
  { id: "slate",      name: "Slate",      hex: "#6B7BA8" },
  { id: "rosewood",   name: "Rosewood",   hex: "#8E3B4E" },
  { id: "terracotta", name: "Terracotta", hex: "#C1502E" },
  { id: "teal",       name: "Teal",       hex: "#1F6F86" },
];

const MYSTERY_FOODS = [
  { emoji: "🍚", label: "Rice" },
  { emoji: "🥭", label: "Mango" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "☕", label: "Chai" },
  { emoji: "🍌", label: "Banana" },
  { emoji: "🍦", label: "Ice cream" },
];

const FOOD_PROFILE = [
  { emoji: "🍕", label: "Pizza",     tone: "high",  note: "Larger response" },
  { emoji: "🍚", label: "Rice",      tone: "mid",   note: "Moderate" },
  { emoji: "🧀", label: "Paneer",    tone: "low",   note: "Smaller" },
  { emoji: "☕", label: "Tea",       tone: "low",   note: "Smaller" },
  { emoji: "🥭", label: "Mango",     tone: "mid",   note: "Moderate" },
  { emoji: "🍦", label: "Ice cream", tone: "high",  note: "Larger response" },
];

const CAPABILITIES = [
  { icon: HeartPulse,  title: "Heart",             copy: "Continuous heart insights. Resting HR, rhythm patterns, cardiac load." },
  { icon: Waves,       title: "HRV & Readiness",   copy: "Overnight HRV, autonomic balance and morning readiness score." },
  { icon: MoonStar,    title: "Sleep",             copy: "Deep · REM · Light · Sleep Score · Sleep Trends." },
  { icon: Sparkles,    title: "Recovery",          copy: "Recovery Score · Strain · Morning Recovery · Trend graphs." },
  { icon: Wind,        title: "Stress",            copy: "Stress · Calm · Breathing · Recovery windows." },
  { icon: Thermometer, title: "Skin Temperature",  copy: "24/7 wrist temperature — early illness and cycle signals." },
  { icon: Footprints,  title: "Activity & Movement", copy: "Steps, active minutes, calories and daily movement load." },
  { icon: Flame,       title: "Food Intelligence", copy: "Sugar-response patterns · Personal Food Profile · Meal discoveries." },
  { icon: Activity,    title: "Nera AI",           copy: "Daily insights · Weekly reports · Health coach · Predictions." },
];

const COMPARE = [
  { row: "Sugar-response insights",              others: false, ours: true },
  { row: "Personalised food profile (AI-learned)", others: false, ours: true },
  { row: "AI health conversation",               others: false, ours: true },
  { row: "24/7 heart & HRV",                     others: true,  ours: true },
  { row: "Sleep staging",                        others: true,  ours: true },
  { row: "Recovery / strain",                    others: true,  ours: true },
  { row: "Screenless, no notifications",         others: false, ours: true },
  { row: "No subscription lock-in",              others: false, ours: true },
];

const TIMELINE = [
  { time: "07:12", label: "Wake up",       note: "Recovery Score 82" },
  { time: "08:30", label: "Breakfast",     note: "Sugar-response logged" },
  { time: "11:00", label: "Deep work",     note: "Stress rising" },
  { time: "13:45", label: "Lunch walk",    note: "Response improves" },
  { time: "19:30", label: "Dinner",        note: "Meal impact recorded" },
  { time: "23:10", label: "Sleep",         note: "Tomorrow's Body Score forming" },
];

const FAQS = [
  { q: "Is this a CGM?", a: "No. Rhythm Band is non-invasive. Nera AI learns your personal sugar-response patterns from your heart, sleep, temperature, movement and meal timing — no needles, no strips. Pair with a CGM or Agatsa EasyTouch later for even sharper insight." },
  { q: "How does it discover which foods spike my sugar?", a: "Every meal you log is matched against how your body actually responded — HRV, resting heart rate, energy dips, sleep quality that night. Nera AI turns that into a personal Food Profile that gets more accurate the longer you wear it." },
  { q: "Is this a smartwatch?", a: "No screen. No notifications. Nothing to check. The band reads your body 24/7 in silence — the answers live in the app, once a day." },
  { q: "Battery?", a: "Up to 7 days on a single charge. Magnetic charging in under 90 minutes." },
  { q: "Water?", a: "IP67. Sweat, rain and handwashing are fine. Skip the pool for now." },
  { q: "What's in the box?", a: "Rhythm Band, magnetic charger, quick-start card, and a 7-day Nera AI Premium free trial that activates the moment you pair the device." },
];

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px -40px rgba(16,185,129,0.25)" }}
    >
      {children}
    </div>
  );
}

function ToneDot({ tone }: { tone: "low" | "mid" | "high" }) {
  const color = tone === "low" ? "#10b981" : tone === "mid" ? "#f59e0b" : "#ef4444";
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RhythmBandPro() {
  const { prices, fmt } = usePricing();
  const price = prices.band_sub;
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  useSEO({
    title: "Discover Which Foods Spike YOUR Sugar — EasyTouch Rhythm Band",
    description:
      "Most people know what they eat. Almost nobody knows how their body responds to it. EasyTouch Rhythm Band and Nera AI reveal your personal sugar-response, sleep, recovery and heart patterns.",
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
      <div className="bg-black text-white selection:bg-emerald-400 selection:text-black">

        {/* 1. HERO ---------------------------------------------------- */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px 700px at 50% -10%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(600px 400px at 80% 90%, rgba(16,185,129,0.15), transparent 70%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-24 md:pt-40 md:pb-32 text-center">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
              className="text-[11px] md:text-xs tracking-[0.32em] uppercase text-emerald-400/80 mb-8"
            >
              Introducing EasyTouch Rhythm Band
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-semibold tracking-tight text-white text-[44px] leading-[1.02] md:text-[88px] md:leading-[0.98]"
            >
              Discover which foods spike{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(120deg,#6ee7b7,#10b981 50%,#059669)" }}
              >
                YOUR
              </span>{" "}
              sugar.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-8 max-w-2xl mx-auto text-white/70 text-lg md:text-xl leading-relaxed"
            >
              Not your friend's. Not your family's. <span className="text-white">Yours.</span>
              <br className="hidden md:block" />
              Rhythm Band and Nera AI reveal the foods that create larger sugar-response patterns for your body —
              while tracking your sleep, recovery, stress and heart every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#buy">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full px-8 h-12">
                  Get yours — {fmt(price)}
                </Button>
              </a>
              <a href="#discover" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-2">
                See how it works <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4 }}
              className="mt-20 relative mx-auto max-w-3xl"
            >
              <div className="absolute inset-0 -z-10 blur-3xl opacity-60"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.5), transparent)" }} />
              <img src={rhythmHero} alt="EasyTouch Rhythm Band" className="w-full h-auto object-contain drop-shadow-2xl" />
            </motion.div>
          </div>
        </section>

        {/* 2. MYSTERY ------------------------------------------------- */}
        <section id="discover" className="relative py-32 md:py-48">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 {...fadeUp}
              className="text-center font-semibold tracking-tight text-white text-[36px] leading-[1.05] md:text-[72px]"
            >
              Which one spikes{" "}
              <span className="text-emerald-400">YOUR</span> sugar?
            </motion.h2>
            <motion.p {...fadeUp} className="mt-6 text-center text-white/50 max-w-xl mx-auto">
              You won't find the answer here. You'll find it on your wrist.
            </motion.p>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
              {MYSTERY_FOODS.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                >
                  <GlassCard className="aspect-square flex flex-col items-center justify-center gap-3 relative">
                    <div className="text-5xl md:text-6xl">{f.emoji}</div>
                    <div className="text-white/60 text-sm">{f.label}</div>
                    <div className="absolute top-3 right-4 text-emerald-400/70 text-lg font-light">?</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. SAME FOOD, DIFFERENT BODIES ---------------------------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2 {...fadeUp}
              className="text-center font-semibold tracking-tight text-[40px] leading-[1.05] md:text-[80px]"
            >
              The same food.
              <br />
              <span className="text-white/50">Different bodies.</span>
            </motion.h2>
            <motion.p {...fadeUp} className="mt-8 text-center text-white/60 max-w-lg mx-auto text-lg">
              Nobody reacts to food exactly the same way.
            </motion.p>

            <div className="mt-20 grid md:grid-cols-3 gap-6">
              {[
                { name: "Aditi, 32",  img: rhythmPortrait1, curve: "high", note: "Sharp spike, slow return" },
                { name: "Rohan, 41",  img: rhythmPortrait2, curve: "mid",  note: "Moderate rise" },
                { name: "Meera, 28",  img: rhythmPortrait3, curve: "low",  note: "Barely a ripple" },
              ].map((p, i) => (
                <motion.div key={p.name}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                >
                  <GlassCard className="overflow-hidden">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover opacity-90" />
                    </div>
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-widest text-white/40 mb-3">🍕 Same pizza</div>
                      <svg viewBox="0 0 200 60" className="w-full h-16">
                        <path
                          d={
                            p.curve === "high"
                              ? "M0 50 C 40 50, 60 5, 100 8 C 140 12, 160 45, 200 48"
                              : p.curve === "mid"
                              ? "M0 45 C 40 45, 70 22, 110 25 C 150 28, 170 42, 200 44"
                              : "M0 40 C 60 40, 100 32, 140 35 C 170 37, 185 40, 200 40"
                          }
                          fill="none"
                          stroke={EMERALD}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-white font-medium">{p.name}</span>
                        <span className="text-white/50 text-sm">{p.note}</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. YOUR BODY ALREADY KNOWS -------------------------------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 -z-10"
            style={{ background: "radial-gradient(700px 500px at 50% 50%, rgba(16,185,129,0.12), transparent 70%)" }} />
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <h2 className="font-semibold tracking-tight text-[40px] leading-[1.05] md:text-[72px]">
                Your body already knows.
                <br />
                <span className="text-emerald-400">You just can't see it.</span>
              </h2>
              <p className="mt-8 text-white/60 text-lg max-w-md">
                Rhythm Band listens 24/7. Nera AI translates the signal. One quiet notification is all it takes.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[3rem] blur-3xl opacity-40"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.5), transparent)" }} />
              <div className="mx-auto max-w-[340px] rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-2 shadow-2xl">
                <img
                  src={appMetabolic.url}
                  alt="Nera AI metabolic zone chart — sugar-response visualised through the day"
                  className="w-full h-auto rounded-[1.9rem]"
                  loading="lazy"
                />
              </div>
              <p className="mt-6 text-center text-xs text-white/40">Actual Nera AI screen · your day, decoded</p>
            </motion.div>
          </div>
        </section>

        {/* 5. NERA STARTS LEARNING ----------------------------------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <motion.p {...fadeUp} className="text-center text-emerald-400 text-xs tracking-[0.3em] uppercase">Week after week</motion.p>
            <motion.h2 {...fadeUp}
              className="mt-6 text-center font-semibold tracking-tight text-[40px] leading-[1.05] md:text-[72px]"
            >
              Your Personal Food Profile.
            </motion.h2>
            <motion.p {...fadeUp} className="mt-6 text-center text-white/55 max-w-xl mx-auto text-lg">
              Not calorie counting. Not a generic diet chart. Nera AI learns <span className="text-white">your</span> body.
            </motion.p>

            <div className="mt-16 grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <motion.div {...fadeUp} className="relative order-2 md:order-1">
                <GlassCard className="divide-y divide-white/5">
                  {FOOD_PROFILE.map(f => (
                    <div key={f.label} className="flex items-center gap-5 p-5">
                      <div className="text-3xl">{f.emoji}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{f.label}</div>
                        <div className="text-xs text-white/40">{f.note}</div>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: f.tone === "high" ? "90%" : f.tone === "mid" ? "55%" : "25%",
                            background: f.tone === "high" ? "#ef4444" : f.tone === "mid" ? "#f59e0b" : EMERALD,
                          }}
                        />
                      </div>
                      <ToneDot tone={f.tone as any} />
                    </div>
                  ))}
                </GlassCard>
              </motion.div>

              <motion.div {...fadeUp} className="relative order-1 md:order-2">
                <div className="absolute -inset-6 -z-10 rounded-[3rem] blur-3xl opacity-40"
                  style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.4), transparent)" }} />
                <div className="mx-auto max-w-[320px] rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-2 shadow-2xl">
                  <img
                    src={appMeals.url}
                    alt="Today's meal responses — metabolic spikes detected by Nera AI"
                    className="w-full h-auto rounded-[1.9rem]"
                    loading="lazy"
                  />
                </div>
                <p className="mt-6 text-center text-xs text-white/40">Tag your meals · Nera learns faster every day</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. AND THAT'S JUST THE BEGINNING - CAPABILITIES ----------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <motion.p {...fadeUp} className="text-center text-emerald-400 text-xs tracking-[0.3em] uppercase">And that's just the beginning</motion.p>
            <motion.h2 {...fadeUp}
              className="mt-6 text-center font-semibold tracking-tight text-[40px] leading-[1.05] md:text-[72px]"
            >
              One band.
              <br />
              <span className="text-white/50">Your whole body.</span>
            </motion.h2>
            <motion.p {...fadeUp} className="mt-6 text-center text-white/55 max-w-xl mx-auto text-lg">
              HRV, heart rate, temperature, sleep, stress, SpO₂, activity — one silent band, one daily answer.
            </motion.p>

            <motion.div {...fadeUp} className="mt-16 relative mx-auto max-w-[340px]">
              <div className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl opacity-50"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.55), transparent)" }} />
              <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-2 shadow-2xl">
                <img
                  src={appWearable.url}
                  alt="Rhythm Band wearable dashboard — HRV, live HR, SpO₂, temperature, sleep"
                  className="w-full h-auto rounded-[1.9rem]"
                  loading="lazy"
                />
              </div>
            </motion.div>


            <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAPABILITIES.map((c, i) => (
                <motion.div key={c.title}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  <GlassCard className="p-8 h-full">
                    <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                      <c.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="text-xl font-semibold text-white">{c.title}</div>
                    <p className="mt-3 text-white/55 text-sm leading-relaxed">{c.copy}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. DAY IN YOUR LIFE --------------------------------------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6">
            <motion.h2 {...fadeUp}
              className="text-center font-semibold tracking-tight text-[40px] leading-[1.05] md:text-[72px]"
            >
              A day in your body.
            </motion.h2>
            <motion.p {...fadeUp} className="mt-6 text-center text-white/55 max-w-lg mx-auto">
              Every hour tells Nera AI something. By tomorrow morning, you'll know more about yourself than you did today.
            </motion.p>

            <div className="mt-20 relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500/40 to-transparent" />
              <div className="space-y-10">
                {TIMELINE.map((t, i) => (
                  <motion.div
                    key={t.time}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className={`relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
                  >
                    <div className={`${i % 2 ? "md:text-left" : "md:text-right"}`}>
                      <div className="text-emerald-400 text-sm font-mono">{t.time}</div>
                      <div className="mt-1 text-2xl md:text-3xl font-semibold">{t.label}</div>
                      <div className="mt-2 text-white/50 text-sm">{t.note}</div>
                    </div>
                    <div className="hidden md:block" />
                    <div className="absolute left-6 md:left-1/2 top-2 -translate-x-1/2 h-3 w-3 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 20px #10b981" }} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. COMPARE ------------------------------------------------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
            <motion.h2 {...fadeUp}
              className="text-center font-semibold tracking-tight text-[36px] leading-[1.05] md:text-[64px]"
            >
              Everyone else counts steps.
              <br />
              <span className="text-emerald-400">Rhythm reads you.</span>
            </motion.h2>

            <motion.div {...fadeUp} className="mt-16">
              <GlassCard className="overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] text-sm">
                  <div className="p-5 text-white/50 text-xs uppercase tracking-widest">Feature</div>
                  <div className="p-5 text-center text-white/50 text-xs uppercase tracking-widest w-32">Other bands</div>
                  <div className="p-5 text-center text-emerald-400 text-xs uppercase tracking-widest w-32">Rhythm</div>

                  {COMPARE.map(r => (
                    <div key={r.row} className="contents">
                      <div className="p-5 border-t border-white/5 text-white">{r.row}</div>
                      <div className="p-5 border-t border-white/5 flex justify-center">
                        {r.others ? <Check className="h-4 w-4 text-white/40" /> : <X className="h-4 w-4 text-white/20" />}
                      </div>
                      <div className="p-5 border-t border-white/5 flex justify-center">
                        {r.ours ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-white/20" />}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* 9. DESIGN + COLORS ---------------------------------------- */}
        <section className="relative py-32 md:py-48 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div {...fadeUp}>
                <img src={rhythmPortrait4} alt="Rhythm Band on wrist" className="w-full rounded-3xl" />
              </motion.div>
              <motion.div {...fadeUp}>
                <h2 className="font-semibold tracking-tight text-[36px] leading-[1.05] md:text-[64px]">
                  Screenless.
                  <br />
                  <span className="text-white/50">By design.</span>
                </h2>
                <p className="mt-6 text-white/60 text-lg max-w-md">
                  Nothing to check. Nothing to notify. The band listens quietly. Nera AI does the talking — once a day, on your phone.
                </p>

                <div className="mt-12">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/40 mb-4">Choose your colour</div>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        aria-label={c.name}
                        className={`h-11 w-11 rounded-full border-2 transition ${selectedColor.id === c.id ? "border-emerald-400 scale-110" : "border-white/15 hover:border-white/40"}`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-white/60">{selectedColor.name}</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 10. FAQ --------------------------------------------------- */}
        <section className="relative py-32 md:py-40 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <motion.h2 {...fadeUp}
              className="text-center font-semibold tracking-tight text-[36px] leading-[1.05] md:text-[56px]"
            >
              Questions.
            </motion.h2>

            <motion.div {...fadeUp} className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`i-${i}`} className="border-white/10">
                    <AccordionTrigger className="text-left text-white hover:text-emerald-400 py-5">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* 11. FINAL CTA / BUY --------------------------------------- */}
        <section id="buy" className="relative py-32 md:py-48 border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 -z-10"
            style={{ background: "radial-gradient(900px 500px at 50% 50%, rgba(16,185,129,0.25), transparent 70%)" }} />
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h2 {...fadeUp}
              className="font-semibold tracking-tight text-[44px] leading-[1.02] md:text-[88px]"
            >
              Stop guessing.
              <br />
              <span className="text-emerald-400">Start discovering.</span>
            </motion.h2>
            <motion.p {...fadeUp} className="mt-8 text-white/60 text-lg max-w-xl mx-auto">
              Most people know what they eat. Almost nobody knows how their body actually responds to it. It's your turn.
            </motion.p>

            <motion.div {...fadeUp} className="mt-16">
              <GlassCard className="p-8 md:p-10 text-left max-w-xl mx-auto">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-emerald-400">EasyTouch Rhythm Band</div>
                    <div className="mt-2 text-2xl md:text-3xl font-semibold">{selectedColor.name}</div>
                    <div className="mt-1 text-white/50 text-sm">Includes 7-day Nera AI Premium</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl md:text-4xl font-semibold">{fmt(price)}</div>
                    <div className="text-xs text-white/40 mt-1">Free shipping · India</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      aria-label={c.name}
                      className={`h-9 w-9 rounded-full border-2 transition ${selectedColor.id === c.id ? "border-emerald-400 scale-110" : "border-white/15 hover:border-white/40"}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>

                <Button
                  onClick={addToCart}
                  size="lg"
                  className="mt-8 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full h-12"
                >
                  Add to cart
                </Button>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-white/40">
                  <span>✓ 7-day trial</span>
                  <span>✓ 1-year warranty</span>
                  <span>✓ Easy returns</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
