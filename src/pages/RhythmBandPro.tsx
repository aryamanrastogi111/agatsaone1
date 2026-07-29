import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { encodeVariantsParam, BAND_SKU } from "@/lib/bandColors";
import {
  Check, X, ArrowRight, HeartPulse, MoonStar, Flame, Activity, Wind, Sparkles,
  Thermometer, Waves, Footprints,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { RecentPurchasePopup } from "@/components/products/RecentPurchasePopup";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { usePricing } from "@/hooks/useDevicePricing";
import { useCartStore } from "@/stores/cartStore";
import { useSEO } from "@/hooks/useSEO";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { toast } from "sonner";


import rhythmPortrait1 from "@/assets/rhythm-portrait-1.jpg";
import rhythmPortrait2 from "@/assets/rhythm-portrait-2.jpg";
import rhythmPortrait3 from "@/assets/rhythm-portrait-3.jpg";
import rhythmPortrait4 from "@/assets/rhythm-portrait-4.jpg";
import appWearable from "@/assets/rhythm-app-wearable.png.asset.json";
import appMeals from "@/assets/rhythm-app-meals.jpg.asset.json";
import appMetabolic from "@/assets/rhythm-app-metabolic.jpg.asset.json";
import spikeDemo from "@/assets/rhythm-spike-demo.mp4.asset.json";

import bandOlive from "@/assets/bands/band-olive.png.asset.json";
import bandOliveHero from "@/assets/bands/band-olive-hero.png.asset.json";
import bandGraphite from "@/assets/bands/band-graphite.png.asset.json";
import bandKhaki from "@/assets/bands/band-khaki.png.asset.json";
import bandSlate from "@/assets/bands/band-slate.png.asset.json";
import bandRosewood from "@/assets/bands/band-rosewood.png.asset.json";

import bandTeal from "@/assets/bands/band-teal.png.asset.json";

/* ------------------------------------------------------------------ */
/* Theme: Black + Emerald. Apple keynote pacing.                       */
/* ------------------------------------------------------------------ */

const EMERALD = "#10b981";

const COLORS = [
  { id: "olive",      name: "Olive",      hex: "#6B7A3A", photo: bandOlive.url },
  { id: "graphite",   name: "Graphite",   hex: "#2E2E2E", photo: bandGraphite.url },
  { id: "khaki",      name: "Khaki",      hex: "#B8A55C", photo: bandKhaki.url },
  { id: "slate",      name: "Slate",      hex: "#7A7A9E", photo: bandSlate.url },
  { id: "rosewood",   name: "Rosewood",   hex: "#8E3B4E", photo: bandRosewood.url },
  
  { id: "teal",       name: "Teal",       hex: "#1F6F86", photo: bandTeal.url },
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
  { q: "Is this a CGM?", a: "No. Rhythm Band learns your personal sugar-response patterns through our patented algorithm — no needles, no strips, completely non-invasive." },
  { q: "How does it discover which foods spike my sugar?", a: "Every meal you log is matched against how your body actually responded — HRV, resting heart rate, energy dips, sleep quality that night. Nera AI turns that into a personal Food Profile that gets more accurate the longer you wear it." },
  { q: "Is this a smartwatch?", a: "No screen. No notifications. Nothing to check. The band reads your body 24/7 in silence — the answers live in the app, once a day." },
  { q: "Battery?", a: "Up to 7 days on a single charge. Magnetic charging in under 90 minutes." },
  { q: "Water?", a: "IP67. Sweat, rain and handwashing are fine. Skip the pool for now." },
  { q: "What's in the box?", a: "Rhythm Band, magnetic charger, quick-start card, and free access to Nera AI — no subscription needed for now." },
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
  const navigate = useNavigate();
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

  const buyNow = () => {
    addToCart();
    const variants = encodeVariantsParam({ [BAND_SKU]: selectedColor.name });
    navigate(`/checkout?sku=${BAND_SKU}${variants ? `&variants=${variants}` : ""}`);
  };

  const buyNowWithQuantity = (qty: number) => {
    useCartStore.getState().addItem({
      productId: "band_sub",
      productName: "EasyTouch Rhythm Band",
      variantTitle: selectedColor.name,
      price,
      quantity: qty,
    });
    const variants = encodeVariantsParam({ [BAND_SKU]: selectedColor.name });
    const sku = Array.from({ length: qty }, () => BAND_SKU).join(",");
    navigate(`/checkout?sku=${sku}${variants ? `&variants=${variants}` : ""}`);
  };

  return (
    <SiteLayout>
      <div className="bg-black text-white selection:bg-emerald-400 selection:text-black [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white">

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
              <a href="#proof-video" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-2">
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
              <img src={bandOliveHero.url} alt="EasyTouch Rhythm Band in Olive" className="w-full h-auto object-contain drop-shadow-2xl" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-10 text-center text-xl md:text-2xl font-semibold tracking-tight text-white"
            >
              Available in <span className="text-emerald-400">{COLORS.length} colours</span>.
            </motion.p>

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
                { name: "Rohan, 41",  img: rhythmPortrait1, curve: "high", note: "Sharp spike, slow return" },
                { name: "Aditi, 28",  img: rhythmPortrait2, curve: "mid",  note: "Moderate rise" },
                { name: "Mr. Menon, 65",  img: rhythmPortrait3, curve: "low",  note: "Barely a ripple" },
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

            {/* Highlight banner — no more manual logging */}
            <motion.div {...fadeUp} className="mt-24 relative">
              <div className="absolute inset-0 -z-10 rounded-[2.5rem] blur-3xl opacity-60"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.28), transparent 70%)" }} />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-400/20 bg-gradient-to-b from-emerald-500/[0.06] to-transparent px-6 py-16 md:py-24 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[11px] tracking-[0.3em] uppercase text-emerald-300">
                  No more food journaling
                </div>
                <h3 className="mt-8 font-semibold tracking-tight text-[34px] leading-[1.1] md:text-[64px] md:leading-[1.05] max-w-4xl mx-auto">
                  <span className="text-white/40 line-through decoration-white/20 decoration-[3px]">
                    Gone are the days of logging every bite.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                    Your band spots the spike.
                  </span>
                  <br />
                  <span className="text-white">You just name the meal.</span>
                </h3>
                <p className="mt-8 text-white/50 text-sm tracking-[0.2em] uppercase">
                  Automatic spike detection · Nera AI meal classification
                </p>
              </div>
            </motion.div>

            {/* Real spike video — proof */}
            <motion.div id="proof-video" {...fadeUp} className="mt-24 md:mt-32 scroll-mt-24">
              <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[11px] tracking-[0.3em] uppercase text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Real recording · Zero edits
                </div>
                <h3 className="mt-6 font-semibold tracking-tight text-[28px] md:text-[44px] leading-[1.1] text-white">
                  Watch a real spike get caught. Live.
                </h3>
                <p className="mt-4 text-white/55 md:text-lg">
                  This is the actual Rhythm app on a real user's phone — the band detected the sugar-response event and logged it automatically. No typing. No CGM patch.
                </p>
              </div>

              <div className="relative mx-auto max-w-[340px] md:max-w-[400px]">
                {/* Emerald glow */}
                <div className="absolute inset-0 -z-10 blur-[120px] opacity-70 rounded-full"
                  style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.55), transparent 70%)" }} />

                {/* iPhone-style mockup frame */}
                <div className="relative rounded-[3rem] border-[10px] border-neutral-800 bg-neutral-900 shadow-[0_40px_120px_-20px_rgba(16,185,129,0.35)] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-6 w-28 rounded-full bg-black" />
                  <video
                    src={spikeDemo.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="block w-full h-auto rounded-[2.2rem]"
                  />
                </div>

                {/* Floating LIVE badge */}
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-6 z-20 rounded-full bg-black border border-emerald-400/40 px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase text-emerald-300 shadow-xl backdrop-blur">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 align-middle animate-pulse" />
                  Recorded on band
                </div>
              </div>

              <p className="mt-8 text-center text-xs md:text-sm text-white/40 tracking-wide">
                No manual entry · No CGM patch · No blood pricks
              </p>
            </motion.div>


            {/* Automatic detection callout */}
            <motion.div {...fadeUp} className="mt-20 max-w-4xl mx-auto">

              <GlassCard className="p-8 md:p-12 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[11px] tracking-[0.25em] uppercase text-emerald-300">
                  Fully Automatic
                </div>
                <h3 className="mt-5 font-semibold tracking-tight text-[26px] md:text-[36px] leading-tight">
                  Just wear the band. Nera AI does the rest.
                </h3>
                <p className="mt-5 text-white/60 md:text-lg leading-relaxed max-w-2xl mx-auto">
                  No logging spikes. No manual tracking. The band silently detects every sugar-response event through the day —
                  each spike is automatically recorded by the band and shown to you on the app as an
                  <span className="text-white"> insulin spike event</span>, with the exact time and intensity already filled in.
                  All you do is add what food it was — a quick tap like "dal-rice" or "cold coffee" — and Nera AI instantly classifies it as a
                  <span className="text-red-400"> high-spike</span>,
                  <span className="text-amber-400"> moderate</span> or
                  <span className="text-emerald-400"> friendly</span> meal for <span className="text-white">your</span> body.
                </p>
                <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="text-emerald-400 text-xs tracking-widest uppercase">Step 1</div>
                    <div className="mt-2 text-white font-medium">Wear it</div>
                    <div className="mt-1 text-sm text-white/50">Band auto-detects spikes 24/7.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="text-emerald-400 text-xs tracking-widest uppercase">Step 2</div>
                    <div className="mt-2 text-white font-medium">Tap your meal</div>
                    <div className="mt-1 text-sm text-white/50">One tap — dal-rice, dosa, biryani, fruit.</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="text-emerald-400 text-xs tracking-widest uppercase">Step 3</div>
                    <div className="mt-2 text-white font-medium">Nera classifies</div>
                    <div className="mt-1 text-sm text-white/50">Instantly tagged as high, moderate or safe for you.</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
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
        <section className="relative py-32 md:py-48 border-t border-white/5 overflow-hidden">
          {/* soft glow that tints to the selected color */}
          <div
            className="absolute inset-0 -z-10 transition-colors duration-700"
            style={{ background: `radial-gradient(1000px 600px at 50% 40%, ${selectedColor.hex}22, transparent 70%)` }}
          />
          <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-400 mb-4">Design</div>
              <h2 className="font-semibold tracking-tight text-[36px] leading-[1.05] md:text-[64px]">
                Screenless.
                <br />
                <span className="text-white/50">By design.</span>
              </h2>
              <p className="mt-6 text-white/60 text-lg">
                Nothing to check. Nothing to notify. The band listens quietly. Nera AI does the talking — once a day, on your phone.
              </p>
            </motion.div>

            {/* Big hero band photo that cross-fades on color change */}
            <motion.div {...fadeUp} className="relative mx-auto aspect-square w-full max-w-[720px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedColor.id}
                  src={selectedColor.photo}
                  alt={`EasyTouch Rhythm Band in ${selectedColor.name}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                />
              </AnimatePresence>
            </motion.div>

            {/* Selected name in large type */}
            <motion.div {...fadeUp} className="mt-8 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedColor.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl md:text-5xl font-semibold tracking-tight"
                >
                  {selectedColor.name}
                </motion.div>
              </AnimatePresence>
              <div className="mt-2 text-xs uppercase tracking-[0.28em] text-white/40">
                {COLORS.findIndex(c => c.id === selectedColor.id) + 1} of {COLORS.length} colours
              </div>
            </motion.div>

            {/* Thumbnail selector */}
            <motion.div {...fadeUp} className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
              {COLORS.map(c => {
                const active = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    aria-label={c.name}
                    aria-pressed={active}
                    className={`group relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      active
                        ? "border-emerald-400 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                        : "border-white/10 hover:border-white/30 hover:scale-105"
                    }`}
                    style={{ background: `${c.hex}22` }}
                  >
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="absolute inset-0 h-full w-full object-cover scale-[1.6]"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </motion.div>
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
                    <div className="mt-1 text-white/50 text-sm">Includes free Nera AI access</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl md:text-4xl font-semibold">{fmt(price)}</div>
                    <div className="text-xs text-white/40 mt-1">Free shipping · India</div>
                  </div>
                </div>

                <div className="mt-6 [&_.text-xs]:text-white/70">
                  <StockUrgencyBar productKey="easytouch-rhythm" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {COLORS.map(c => {
                    const active = selectedColor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        aria-label={c.name}
                        className={`relative h-11 w-11 rounded-xl overflow-hidden border-2 transition ${active ? "border-emerald-400 scale-110" : "border-white/15 hover:border-white/40"}`}
                        style={{ background: `${c.hex}22` }}
                      >
                        <img src={c.photo} alt={c.name} className="absolute inset-0 h-full w-full object-cover scale-[1.6]" loading="lazy" />
                      </button>
                    );
                  })}
                </div>


                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={addToCart}
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full h-12"
                  >
                    Add to cart
                  </Button>
                  <Button
                    onClick={buyNow}
                    size="lg"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full h-12"
                  >
                    Buy now · {selectedColor.name}
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-white/40">
                  <span>✓ Free Nera AI</span>
                  <span>✓ 1-year warranty</span>
                  <span>✓ Easy returns</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>
      </div>
      <StickyAddToCart
        productName={`EasyTouch Rhythm Band · ${selectedColor.name}`}
        price={`₹${price.toLocaleString("en-IN")}`}
        unitPrice={price}
        onBuyNow={buyNowWithQuantity}
        onAddToCart={(qty) => {
          useCartStore.getState().addItem({
            productId: "band_sub",
            productName: "EasyTouch Rhythm Band",
            variantTitle: selectedColor.name,
            price,
            quantity: qty,
          });
          toast.success(`Rhythm Band · ${selectedColor.name} added`, { position: "top-center" });
        }}
        themeColor="emerald"
      />
      <RecentPurchasePopup productName="EasyTouch Rhythm Band" />
    </SiteLayout>

  );
}
