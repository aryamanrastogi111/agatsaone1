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
          >
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Agatsa One + Nera AI
            </div>
            <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-3 py-1 text-xs font-semibold text-primary mb-6 ml-2">
              <Package className="h-3.5 w-3.5" /> Complete Device Bundle
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.05]">
              Your Heart, Glucose Trends, Sleep &{" "}
              <span className="text-primary">Recovery</span> change every day.
            </h1>

            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
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
            <div className="mt-8 p-5 bg-card border border-border rounded-2xl shadow-sm">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-extrabold text-foreground">
                  ₹{BUNDLE_PRICE.toLocaleString("en-IN")}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{BUNDLE_MRP.toLocaleString("en-IN")}
                </span>
                <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">
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
            className="relative"
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
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Why this bundle exists
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
              Episodic care is broken. Your body doesn't wait for a check-up.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              A heart attack doesn't start on the day of the ECG. Diabetes doesn't begin on the
              morning of your HbA1c test. By the time a symptom is obvious, the disease has
              already had a long, silent runway.
            </p>
          </div>

          {/* Episodic vs Longitudinal */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
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

            <div className="bg-primary/5 border border-primary/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
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
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
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
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
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
            className="mt-12 bg-foreground text-background rounded-3xl p-8 md:p-12 text-center"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-primary/80">
              Predict · Prevent · Report
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-bold">
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
      <section id="whats-inside" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              What's in the Kit
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
              Four devices. One connected health system.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Each device measures something distinct. Nera AI stitches them together into a
              single picture of your health — updated every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {devices.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="aspect-square bg-white flex items-center justify-center p-6">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-foreground">{d.name}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{d.tagline}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d.bullet}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NERA AI BLOCK */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-primary/20 rounded-3xl p-8 md:p-12 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Included Free
              </div>
              <span className="text-xs font-semibold text-primary">Worth ₹1,497</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
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

      {/* TESTIMONIALS */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              From real users
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
              People who stopped guessing about their health.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              From four devices to <span className="text-primary">one intelligence layer</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
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
      <section className="py-14 bg-background">
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
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
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
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
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
