import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  HeartPulse,
  Droplet,
  Moon,
  Activity,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Package,
  Cpu,
  Users,
  Brain,
  Zap,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Utensils,
  Briefcase,
  Bed,
  Heart,
  ShieldAlert,
  Home,
  Stethoscope,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/useDevicePricing";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { shipDateLabel, deliveryDateLabel } from "@/lib/shipDate";

import sanketImg from "@/assets/sanketlife-hero-new.webp";
import wellnessImg from "@/assets/easytouch-wellness-hero.webp";
import scaleImg from "@/assets/corebalance-hero.webp";
import bandAsset from "@/assets/bands/band-olive-hero.png.asset.json";
import bundleHeroImg from "@/assets/bundle-devices-hero.png";
import neraReportUnified from "@/assets/nera-report-unified.jpg";
import neraReportWeekly from "@/assets/nera-report-weekly.jpg";
import neraReportCardiac from "@/assets/nera-report-cardiac.jpg";

const BUNDLE_PRICE = 12999;
const BUNDLE_MRP = 18999;
const SAVINGS = BUNDLE_MRP - BUNDLE_PRICE;

const devices = [
  {
    name: "SanketLife ECG",
    tagline: "12-lead ECG in your pocket",
    image: sanketImg,
    bullet: "Hospital-grade cardiac rhythm capture. CDSCO Class B certified.",
  },
  {
    name: "EasyTouch Wellness",
    tagline: "Metabolic health — no needles",
    image: wellnessImg,
    bullet: "Non-invasive glucose trend monitoring with Nera AI insights.",
  },
  {
    name: "EasyTouch Rhythm Band",
    tagline: "24/7 body intelligence",
    image: bandAsset.url,
    bullet: "Sleep stages, HRV, SpO₂, glucose spikes — automatically recorded.",
  },
  {
    name: "Agatsa Smart Scale",
    tagline: "14 body metrics in 5 seconds",
    image: scaleImg,
    bullet: "BMI, body fat, visceral fat, muscle mass — full composition analysis.",
  },
];

const neraFeatures = [
  { icon: Brain, text: "Weekly AI health reports across every device" },
  { icon: Zap, text: "Early anomaly alerts before symptoms show" },
  { icon: Activity, text: "Voice health assistant — ask Nera anything" },
  { icon: Sparkles, text: "AI Heart disease interpretation" },
];

const faqs = [
  {
    q: "How is the 3-month Nera AI Premium activated?",
    a: "Automatically. Once your payment is confirmed, we activate 90 days of Nera AI Premium on the phone number you use at checkout. Just install the Agatsa One app and sign in with that number.",
  },
  {
    q: "How much am I saving vs buying separately?",
    a: "Buying the four devices individually adds up to ₹15,797. In this bundle, you pay ₹12,999 — that's ₹2,798 off the individual total (and ₹6,000 off MRP of ₹18,999). Nera AI Premium is also included free for 3 months.",
  },
  {
    q: "When will my order ship?",
    a: `Orders placed before 6 PM IST ship the same working day. ${shipDateLabel()} — expected delivery ${deliveryDateLabel()}.`,
  },
  {
    q: "Is the ECG device really medical-grade?",
    a: "Yes. SanketLife is CDSCO Class B certified and validated at Narayana Health and Sri Jayadeva Institute of Cardiovascular Sciences with 98.5% accuracy vs hospital ECG machines.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <span className="text-base font-semibold text-foreground">{q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

export default function CompleteHealthKitPage() {
  useSEO({
    title: "Complete Health Kit — 4 Devices + 3 Months Nera AI at ₹12,999 | Agatsa One",
    description:
      "The full Agatsa One bundle: SanketLife ECG, EasyTouch Wellness, Rhythm Band and Smart Scale + 3 months free Nera AI Premium. ₹12,999 (MRP ₹18,999). Save ₹6,000.",
  });

  const { emi } = usePricing();

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative pt-8 pb-10 md:pt-24 md:pb-20 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        {/* Decorative rings */}
        <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-primary/10 hidden md:block" />
        <div className="pointer-events-none absolute top-1/2 right-20 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/10 hidden md:block" />

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 md:gap-10 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-full px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" /> Agatsa One + Nera AI
              </div>
              <div className="inline-flex items-center gap-1.5 border border-primary/30 rounded-full px-2.5 py-1 text-[10px] md:text-xs font-semibold text-primary">
                <Package className="h-3 w-3 md:h-3.5 md:w-3.5" /> Complete Bundle
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] md:leading-[1.05]">
              Your Heart, Glucose Trends, Sleep &{" "}
              <span className="text-primary">Recovery</span> change every day.
            </h1>

            <p className="mt-4 md:mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              Agatsa devices track the signals.{" "}
              <span className="font-semibold text-primary">Nera AI</span> connects the patterns.
            </p>

            {/* Signal chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { icon: HeartPulse, label: "ECG" },
                { icon: Droplet, label: "Glucose Trends" },
                { icon: Moon, label: "Sleep" },
                { icon: Activity, label: "Recovery" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  <c.icon className="h-4 w-4 text-primary" />
                  {c.label}
                </div>
              ))}
            </div>

            {/* Price block */}
            <div className="mt-6 md:mt-8 p-4 md:p-5 bg-card border border-border rounded-2xl shadow-sm">
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                  ₹{BUNDLE_PRICE.toLocaleString("en-IN")}
                </span>
                <span className="text-lg md:text-xl text-muted-foreground line-through">
                  ₹{BUNDLE_MRP.toLocaleString("en-IN")}
                </span>
                <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
                  Save ₹{SAVINGS.toLocaleString("en-IN")}
                </span>
              </div>
              
              <p className="text-sm text-foreground mt-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold">3 months Nera AI Premium — free</span>
              </p>
              <StockUrgencyBar productKey="complete_kit" className="mt-3" />
              <div className="text-xs text-muted-foreground mt-3">
                📦 <span className="font-semibold text-green-600">{shipDateLabel()}</span> · {deliveryDateLabel()}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button asChild size="lg" className="flex-1 rounded-full">
                  <Link to="/checkout?sku=complete_kit">
                    Buy Bundle — ₹{BUNDLE_PRICE.toLocaleString("en-IN")}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1 rounded-full"
                >
                  <a href="#whats-inside">See what's inside</a>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Devices composition — hero product photograph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative order-1 md:order-2"
          >
            <img
              src={bundleHeroImg}
              alt="Complete Health Kit — SanketLife ECG, EasyTouch Wellness, Rhythm Band and Agatsa Smart Scale"
              className="w-full h-auto object-contain drop-shadow-xl"
              loading="eager"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-5 py-2 text-xs font-bold shadow-lg whitespace-nowrap">
              4 devices · 1 AI · 1 order
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY LONGITUDINAL — Episodic vs Continuous */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Why this bundle exists
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-foreground">
              Episodic care is broken. Your body doesn't wait for a check-up.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              A heart attack doesn't start on the day of the ECG. Diabetes doesn't begin on the
              morning of your HbA1c test. By the time a symptom is obvious, the disease has
              already had a long, silent runway.
            </p>
          </div>

          {/* Episodic vs Longitudinal */}
          <div className="grid md:grid-cols-2 gap-6 mb-10 md:mb-14">
            <div className="bg-card border border-border rounded-2xl p-5 md:p-8">
              <div className="inline-flex items-center gap-2 bg-muted rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                The old way
              </div>
              <h3 className="text-xl font-bold text-foreground">Episodic snapshots</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                One ECG a year. One blood test every six months. One BP reading in a noisy
                clinic. Each is a single frame — and single frames miss the story.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-red-500">✕</span> A "normal" ECG at rest can miss silent ischemia.</li>
                <li className="flex gap-2"><span className="text-red-500">✕</span> A fasting sugar reading hides the after-meal spikes that damage vessels.</li>
                <li className="flex gap-2"><span className="text-red-500">✕</span> A clinic BP reading is often 10–20 mmHg off your real one.</li>
                <li className="flex gap-2"><span className="text-red-500">✕</span> Reports live in silos — heart, metabolism, sleep never talk to each other.</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/30 rounded-2xl p-5 md:p-8 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                The Agatsa way
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Longitudinal signals + Nera AI
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Continuous data from four medical-grade devices, stitched together by AI that
                actually understands the connections between heart, metabolism, sleep and
                recovery.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-foreground">
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> ECG on demand — every time your chest feels off, not once a year.</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Glucose trends across meals, sleep and stress — not one fasting number.</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Sleep, HRV and recovery tracked 24/7 — the earliest warning system your body has.</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Nera AI cross-references every signal and flags drift before it becomes disease.</li>
              </ul>
            </div>
          </div>

          {/* Cardiac + Metabolic dual cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-5 md:p-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center mb-4">
                <HeartPulse className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Cardiac health, tracked over time</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Roughly <span className="font-semibold text-foreground">50% of first heart
                attacks in India happen without prior warning symptoms</span> — but the
                electrical, rhythm and recovery changes are almost always there weeks in
                advance. A once-a-year ECG cannot catch them. Continuous rhythm data from the
                Rhythm Band, on-demand 12-lead ECGs from SanketLife, and Nera AI's trend
                analysis can.
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Nera AI watches your resting heart rate, HRV, ST-segment behaviour and recovery
                night after night. When your baseline drifts — <span className="italic">before</span>{" "}
                you feel anything — it tells you, and it tells your doctor with a
                cardiologist-ready PDF.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-5 md:p-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mb-4">
                <Droplet className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Metabolic health, before HbA1c breaks</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Metabolic dysfunction begins <span className="font-semibold text-foreground">7–10
                years before</span> a lab test calls it diabetes. The post-meal glucose spikes,
                the disturbed sleep, the visceral fat creeping up, the metabolic age climbing —
                all of it is happening on ordinary weekdays, not in a lab.
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                EasyTouch Wellness and the Rhythm Band record glucose trend patterns after
                every meal. The Smart Scale tracks visceral fat, muscle mass and metabolic
                age. Nera AI ties it all to your sleep and stress data — so you see which
                meals, which nights and which weeks are quietly nudging you toward disease.
              </p>
            </motion.div>
          </div>

          {/* Predict → Prevent framing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 md:mt-12 bg-slate-900 text-white rounded-3xl p-6 md:p-12 text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary">
              Predict · Prevent · Report
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">
              Agatsa's job is to see the problem before it becomes obvious.
            </h3>
            <p className="mt-4 text-base md:text-lg text-background/80 max-w-3xl mx-auto leading-relaxed">
              The devices capture the raw signals. Nera AI learns your personal baseline,
              predicts drift, flags early warnings and generates the report your doctor needs —
              so a routine consultation becomes a targeted, data-backed conversation instead of
              a guessing game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section id="whats-inside" className="py-12 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              What's in the Kit
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-foreground">
              Four devices. One connected health system.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Each device measures something distinct. Nera AI stitches them together into a
              single picture of your health — updated every day.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {devices.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="aspect-square bg-white flex items-center justify-center p-4 md:p-6">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-sm md:text-base font-bold text-foreground">{d.name}</h3>
                  <p className="text-xs md:text-sm text-primary font-medium mt-1">{d.tagline}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">{d.bullet}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A DAY IN YOUR LIFE — how each device supplements you */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              A day in your life with Agatsa
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-foreground">
              Four devices. One rhythm. From your first coffee to your deepest sleep.
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              Health isn't a yearly check-up — it's what happens between breakfast and bedtime,
              every single day. Here's how the bundle quietly works around you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {[
              {
                icon: Sunrise,
                time: "6:30 AM · Wake",
                device: "Rhythm Band",
                title: "Start with a real recovery score, not a guess",
                body:
                  "You wake up and glance at Nera AI: HRV, resting heart rate and deep-sleep minutes from the Rhythm Band. It tells you whether today is a push day or a recover day — before the coffee kicks in.",
                accent: "from-amber-400/20 to-transparent",
                iconBg: "bg-amber-100 dark:bg-amber-950/40 text-amber-600",
              },
              {
                icon: Utensils,
                time: "9:00 AM · Breakfast",
                device: "Rhythm Band + EasyTouch Wellness",
                title: "See what your food actually did to you",
                body:
                  "The Rhythm Band auto-detects your post-meal glucose spike and asks one question: what did you eat? EasyTouch Wellness lets you spot-check when curiosity strikes. Nera AI labels the meal as a high, medium or low-spike food — for the next time you order the same thing.",
                accent: "from-emerald-400/20 to-transparent",
                iconBg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600",
              },
              {
                icon: Briefcase,
                time: "1:30 PM · That chest twinge at work",
                device: "SanketLife ECG",
                title: "Take a 12-lead ECG in 30 seconds",
                body:
                  "A palpitation, a tight moment, a family history nagging at you. Instead of Googling symptoms, you place your fingers on SanketLife and get a hospital-grade 12-lead ECG PDF — right at your desk. Nera AI compares it to your last one and tells you if anything has drifted.",
                accent: "from-rose-400/20 to-transparent",
                iconBg: "bg-rose-100 dark:bg-rose-950/40 text-rose-600",
              },
              {
                icon: Home,
                time: "7:00 PM · Home",
                device: "Agatsa Smart Scale",
                title: "Weight is one number. Your body is fourteen.",
                body:
                  "A 5-second step tracks visceral fat, muscle mass, body water, metabolic age and more. Nera AI ties it back to how you ate and slept this week — so progress is about muscle going up and visceral fat going down, not just the scale number.",
                accent: "from-sky-400/20 to-transparent",
                iconBg: "bg-sky-100 dark:bg-sky-950/40 text-sky-600",
              },
              {
                icon: Bed,
                time: "11:00 PM · Sleep",
                device: "Rhythm Band",
                title: "Your body files the day's report while you rest",
                body:
                  "The Band keeps recording heart rhythm, HRV, SpO₂, temperature and sleep stages. Nera AI runs its overnight analysis so the next morning's dashboard is ready — no logging, no charging drama, just insight.",
                accent: "from-indigo-400/20 to-transparent",
                iconBg: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600",
              },
              {
                icon: Stethoscope,
                time: "Sunday · The Nera AI weekly report",
                device: "All four devices",
                title: "Seven days of your body, in one screen",
                body:
                  "Every Sunday, Nera AI cross-references cardiac, metabolic, sleep and body-composition data into a single readable report. It highlights what improved, what drifted, and what's worth showing your doctor — before it becomes a symptom.",
                accent: "from-primary/20 to-transparent",
                iconBg: "bg-primary/10 text-primary",
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className={`relative bg-card border border-border rounded-2xl p-5 md:p-6 overflow-hidden`}
              >
                <div className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${s.accent} blur-2xl`} />
                <div className="relative flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                        {s.time}
                      </span>
                      <span className="text-[10px] md:text-xs font-semibold text-muted-foreground">
                        · {s.device}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-base md:text-lg font-bold text-foreground leading-snug">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why now */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 md:mt-14 grid md:grid-cols-3 gap-4 md:gap-5"
          >
            {[
              {
                icon: ShieldAlert,
                stat: "1 in 4",
                label: "Indian adults under 40 now show early cardiac or metabolic markers.",
              },
              {
                icon: HeartPulse,
                stat: "50%",
                label: "of first heart events happen without prior warning symptoms.",
              },
              {
                icon: Droplet,
                stat: "7–10 yrs",
                label: "of silent metabolic dysfunction before a lab test calls it diabetes.",
              },
            ].map((s) => (
              <div
                key={s.stat}
                className="bg-muted/40 border border-border rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-foreground">{s.stat}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            Any one device gives you a slice. Four together — with Nera AI on top — give you the
            full picture. That's why this bundle is the single most useful health purchase you can
            make this year.
          </p>
        </div>
      </section>

      {/* PEACE OF MIND */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 via-background to-primary/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              And the real reason people buy this
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-foreground">
              Peace of mind — for you, and for the people who love you.
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
              Most people don't buy medical devices for themselves. They buy them for the parent
              they worry about, the spouse with a family history, the child moving to a new city.
              The bundle is a quiet promise: <span className="text-foreground font-semibold">if
              something drifts, we'll see it early.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: Heart,
                title: "For the parent you worry about",
                body:
                  "One-tap 12-lead ECG at home, continuous heart-rhythm tracking on the wrist, weekly Nera AI report you can review from another city.",
              },
              {
                icon: ShieldAlert,
                title: "For the family history you can't ignore",
                body:
                  "Diabetes, hypertension or cardiac disease in the family? Nera AI learns your baseline early — so the first sign of drift is caught, not the first hospitalisation.",
              },
              {
                icon: Sparkles,
                title: "For your own quiet confidence",
                body:
                  "No more late-night symptom Googling. You have data, a trend, and an AI second opinion — before you decide whether to call the doctor.",
              },
            ].map((c) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-5 md:p-6"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 md:mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/checkout?sku=complete_kit">
                Bring home peace of mind — ₹{BUNDLE_PRICE.toLocaleString("en-IN")}
              </Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Ships in 24 hours · 3 months Nera AI Premium included · 7-day easy returns
            </p>
          </div>
        </div>
      </section>

      {/* NERA AI BLOCK */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-primary/20 rounded-3xl p-6 md:p-12 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Included Free
              </div>
              <span className="text-xs font-semibold text-primary">Worth ₹1,497</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              3 months of <span className="text-primary">Nera AI Premium</span> — on us.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-3xl">
              Every reading from every device flows into Nera AI. It builds your unified health
              timeline, spots anomalies before symptoms, and gives you weekly reports you can
              actually understand.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {neraFeatures.map((f) => (
                <div
                  key={f.text}
                  className="flex items-start gap-3 bg-background/60 border border-border rounded-xl p-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Activation is automatic. We link 90 days of Premium to the phone number used at
              checkout — sign into the Agatsa One app to start.
            </p>
          </motion.div>
        </div>
      </section>

      {/* NERA AI REPORT SHOWCASE */}

      {/* NERA AI REPORT SHOWCASE */}
      <section className="py-12 md:py-20 bg-foreground text-background overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              What Nera AI actually shows you
            </span>
            <h2 className="mt-3 text-2xl md:text-4xl font-bold">
              Four devices in. <span className="text-primary">One report out.</span>
            </h2>
            <p className="mt-4 text-sm md:text-base text-background/70 leading-relaxed">
              Nera AI combines every signal — ECG, glucose trends, sleep, HRV, body composition —
              into a single, readable story of your health. Here's what it looks like on your
              phone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                img: neraReportUnified,
                tag: "Daily dashboard",
                title: "All signals, one view",
                desc: "Heart rhythm, glucose, sleep and recovery — cross-referenced every day.",
              },
              {
                img: neraReportWeekly,
                tag: "Weekly review",
                title: "Your week, explained",
                desc: "Metabolic load, cardiac trend, sleep score and body composition in plain English.",
              },
              {
                img: neraReportCardiac,
                tag: "Doctor-ready",
                title: "Cardiologist-grade PDF",
                desc: "12-lead ECG with 30-day HRV trend and AI interpretation. Share in one tap.",
              },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col"
              >
                <div className="relative bg-gradient-to-br from-primary/20 to-transparent rounded-3xl p-4 md:p-6 border border-white/10">
                  <img
                    src={r.img}
                    alt={r.title}
                    width={768}
                    height={1280}
                    loading="lazy"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="mt-4 px-1">
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                    {r.tag}
                  </span>
                  <h3 className="mt-1 text-base md:text-lg font-bold text-background">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-background/70 leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 md:mt-10 text-center text-xs text-background/50 max-w-2xl mx-auto">
            App visuals shown for illustration. Nera AI does not provide medical diagnosis; reports
            are for informational purposes and to support conversations with your clinician.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-12 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              From real users
            </span>
            <h2 className="mt-2 text-2xl md:text-4xl font-bold text-foreground">
              People who stopped guessing about their health.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                name: "Rajeev M.",
                role: "48, Bengaluru",
                quote:
                  "I bought the bundle after my father's bypass. Nera AI flagged a rhythm change in week three and I got a proper cardiology consult the same week. That kind of heads-up is exactly what my family history needed.",
              },
              {
                name: "Priya S.",
                role: "36, Gurugram",
                quote:
                  "The Rhythm Band caught my post-lunch sugar spikes I never knew about. Two months in, my energy crashes are gone and the Smart Scale is finally showing muscle mass going up, not just weight going down.",
              },
              {
                name: "Anand K.",
                role: "52, Pune",
                quote:
                  "Getting all four devices at once made it feel like a system, not gadgets. The weekly Nera AI report is the single thing I actually forward to my physician now.",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-6 md:p-7 flex flex-col"
              >
                <div className="flex text-amber-400 mb-3" aria-hidden>
                  {"★★★★★"}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* HOW IT WORKS */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              From four devices to <span className="text-primary">one intelligence layer</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[36px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />
            {[
              { icon: Activity, title: "Capture", desc: "ECG, glucose, sleep, weight — every signal, medical-grade." },
              { icon: Package, title: "Sync", desc: "Automatic Bluetooth sync to Agatsa One. No manual logging." },
              { icon: Brain, title: "Nera AI analyses", desc: "Patterns across devices, anomalies, weekly insights." },
              { icon: ShieldCheck, title: "You act early", desc: "Alerts, care programme nudges, doctor-ready reports." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-[72px] h-[72px] rounded-2xl bg-background border-2 border-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-10 md:py-14 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: ShieldCheck, text: "CDSCO Approved" },
              { icon: Cpu, text: "Nera AI powered" },
              { icon: Users, text: "2.1 Lac+ users" },
              { icon: HeartPulse, text: "Clinically validated" },
              { icon: Check, text: "1-year warranty" },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 text-sm text-foreground"
              >
                <b.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-8">
            Frequently asked
          </h2>
          <div className="bg-card border border-border rounded-2xl px-6">
            {faqs.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-12 md:py-20 pb-32 md:pb-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            One order. One AI. Every signal that matters.
          </h2>
          <p className="mt-4 text-muted-foreground">
            The Complete Health Kit ships within 24 hours. 3 months of Nera AI Premium activates
            the moment your payment goes through.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/checkout?sku=complete_kit">
                Buy Bundle — ₹{BUNDLE_PRICE.toLocaleString("en-IN")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link to="/devices">
                Compare individual devices <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free shipping · 7-day easy returns
          </p>
        </div>
      </section>

      {/* Sticky mobile buy bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border p-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{BUNDLE_PRICE.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              ₹{BUNDLE_MRP.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[10px] text-primary font-medium leading-tight">
            + 3 months Nera AI free
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/checkout?sku=complete_kit">Buy Bundle</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}
