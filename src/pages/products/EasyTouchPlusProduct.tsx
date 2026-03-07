import { useRef } from "react";
import easytouchPlusHero from "@/assets/easytouch-plus-hero.png";
import easytouchPlusDevice from "@/assets/easytouch-plus-device-new.png";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Zap,
  Utensils,
  Moon,
  Dumbbell,
  Clock,
  Brain,
  Fingerprint,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Users,
  Target,
  Beaker,
  ShieldCheck,
  TrendingUp,
  BatteryCharging,
  Coffee,
  Salad,
  Flame,
  Droplets,
  Activity,
  Sparkles,
  HeartPulse,
  ScanLine,
  Waves,
} from "lucide-react";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const benefits = [
  { icon: <Coffee className="h-6 w-6" />, title: "Which foods give you energy", desc: "See which meals leave you feeling sharp and focused." },
  { icon: <Moon className="h-6 w-6" />, title: "Which meals make you sluggish", desc: "Identify foods that drain your energy after eating." },
  { icon: <Clock className="h-6 w-6" />, title: "How fasting affects your body", desc: "Track how your body responds during fasting windows." },
  { icon: <Moon className="h-6 w-6" />, title: "How sleep impacts metabolic response", desc: "Understand the connection between rest and metabolism." },
  { icon: <Dumbbell className="h-6 w-6" />, title: "Your body's reaction to exercise", desc: "See how workouts shift your metabolic signals." },
];

const audience = [
  { icon: <Dumbbell className="h-5 w-5" />, label: "Fitness Enthusiasts" },
  { icon: <Beaker className="h-5 w-5" />, label: "Biohackers" },
  { icon: <Clock className="h-5 w-5" />, label: "Intermittent Fasters" },
  { icon: <Salad className="h-5 w-5" />, label: "Diet Optimisers" },
  { icon: <ShieldCheck className="h-5 w-5" />, label: "Health-Conscious Individuals" },
  { icon: <Activity className="h-5 w-5" />, label: "Pre-diabetics & Borderline Cases" },
  { icon: <HeartPulse className="h-5 w-5" />, label: "People with Family History of Diabetes" },
];

const faqs = [
  {
    q: "Is EasyTouch+ a medical device?",
    a: "EasyTouch+ is designed for wellness tracking and lifestyle insights and is not intended for medical diagnosis.",
  },
  {
    q: "Can it replace medical tests?",
    a: "No. It is designed for personal wellness awareness only. Always consult a qualified healthcare professional for medical decisions.",
  },
  {
    q: "How often should I use it?",
    a: "Many users use it before meals, after meals, and after workouts to observe their body's patterns over time.",
  },
  {
    q: "Does it work with my smartphone?",
    a: "Yes. EasyTouch+ pairs with the companion mobile app (iOS & Android) to display trends and insights on your dashboard.",
  },
];

export default function EasyTouchPlusProduct() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // White fade overlay — only on background image
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  // Text floats up
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <Layout>
      {/* ── 1. HERO ── */}
      <section className="bg-background py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto">

            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-sm font-medium text-teal-700"
            >
              <Zap className="h-3.5 w-3.5" /> Metabolic Wellness Device
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-center max-w-3xl"
            >
              Your glucometer tells you a number.{" "}
              <span className="text-teal-600">EasyTouch+ tells you the story.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-xl text-center"
            >
              Track your metabolic signal across the 22 hours your glucometer misses — no strips, no pricks.
            </motion.p>

            {/* Device Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-teal-300/30 blur-3xl scale-125" />
                <img
                  src={easytouchPlusDevice}
                  alt="EasyTouch+ Device"
                  className="relative w-72 md:w-96 lg:w-[480px] object-contain drop-shadow-2xl"
                />
            </motion.div>

            {/* Big Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
            >
              {[
                {
                  icon: <ScanLine className="h-6 w-6 text-teal-600" />,
                  title: "No Pricks",
                  desc: "PPG-based finger sensor — painless, strip-free readings",
                },
                {
                  icon: <Waves className="h-6 w-6 text-teal-600" />,
                  title: "22-Hour Coverage",
                  desc: "Continuous metabolic tracking your glucometer can't provide",
                },
                {
                  icon: <Fingerprint className="h-6 w-6 text-teal-600" />,
                  title: "Personalised Index",
                  desc: "Calibrated to your unique body — not population averages",
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-teal-600" />,
                  title: "Smart Patterns",
                  desc: "Meal, sleep, workout & fasting insights in one dashboard",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                  className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-3 hover:border-teal-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <h3 className="text-foreground font-semibold text-sm">{card.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 text-base shadow-lg shadow-teal-200">
                Start Your Metabolic Discovery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-teal-200 text-teal-700 hover:bg-teal-50">
                See How It Works
              </Button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM ── */}
      <section className="py-24 bg-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Does The Same Food Affect <span className="text-teal-600">People Differently?</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Two people eating the same meal can feel completely different afterward. Your body's response is uniquely yours.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <BatteryCharging className="h-8 w-8 text-teal-600" />, title: "One Feels Energetic", desc: "Their body processes the meal efficiently, providing sustained energy and focus." },
              { icon: <Moon className="h-8 w-8 text-amber-500" />, title: "One Feels Sleepy", desc: "The same food causes a sluggish, heavy feeling that lasts for hours." },
              { icon: <Flame className="h-8 w-8 text-orange-500" />, title: "One Feels Hungry Again", desc: "Their body burns through the energy quickly, triggering hunger soon after eating." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-4 h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.3} className="mt-12 text-center">
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Most people never see how their body reacts internally. <strong className="text-foreground">EasyTouch+ changes that.</strong>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 2b. THE 22-HOUR GAP ── */}
      <section className="py-24 bg-muted/20">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              You're Blind for <span className="text-teal-600">22 Hours</span> a Day
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              A glucometer gives you 2 snapshots. EasyTouch+ watches everything in between.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-3xl mx-auto">
              {/* Timeline */}
              <div className="relative flex items-stretch gap-0">
                {/* 7am */}
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                  <div className="rounded-xl border-2 border-border bg-card p-4 flex flex-col items-center gap-1 shadow-sm text-center">
                    <Droplets className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">7 AM</span>
                    <span className="text-xs text-muted-foreground">Glucometer</span>
                    <span className="text-sm font-semibold text-foreground">118 mg/dL</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Fasting</span>
                </div>
                {/* gap line */}
                <div className="flex-1 flex flex-col justify-center px-2">
                  <div className="relative h-0.5 w-full bg-gradient-to-r from-border via-teal-400 to-border">
                    {/* spike badge */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex flex-col items-center">
                      <div className="rounded-full bg-teal-600 text-white text-xs font-bold px-3 py-1 shadow-md whitespace-nowrap">
                        ⚡ 3 PM — Spike Caught
                      </div>
                      <div className="w-0.5 h-4 bg-teal-400 mt-1" />
                    </div>
                  </div>
                  <p className="text-center text-xs text-teal-600 font-medium mt-3">EasyTouch+ continuous tracking</p>
                </div>
                {/* 9pm */}
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                  <div className="rounded-xl border-2 border-border bg-card p-4 flex flex-col items-center gap-1 shadow-sm text-center">
                    <Droplets className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-bold text-foreground">9 PM</span>
                    <span className="text-xs text-muted-foreground">Glucometer</span>
                    <span className="text-sm font-semibold text-foreground">142 mg/dL</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Post-dinner</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-8 max-w-lg mx-auto">
                The 3 PM spike happened <strong className="text-foreground">6 hours before your 9 PM reading.</strong> Without EasyTouch+, you'd never know it was there.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 3. SOLUTION ── */}
      <section className="py-24 bg-gradient-to-b from-teal-50/60 to-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet <span className="text-teal-600">EasyTouch+</span></h2>
            <p className="mt-4 text-muted-foreground text-lg">
              A wellness device that helps you observe how your body responds to the lifestyle factors that matter most.
            </p>
          </AnimatedSection>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <AnimatedSection delay={0.1} className="flex-1 flex justify-center">
              <img
                src={easytouchPlusDevice}
                alt="EasyTouch+ Device showing Metabolic Index"
                className="w-72 md:w-96 rounded-3xl shadow-2xl shadow-teal-200/50 object-cover"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="flex-1">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <Utensils className="h-5 w-5" />, label: "Meals & Snacks", color: "text-teal-600" },
                  { icon: <Moon className="h-5 w-5" />, label: "Sleep Quality", color: "text-indigo-600" },
                  { icon: <Dumbbell className="h-5 w-5" />, label: "Workouts", color: "text-orange-500" },
                  { icon: <Clock className="h-5 w-5" />, label: "Fasting Windows", color: "text-amber-500" },
                  { icon: <Brain className="h-5 w-5" />, label: "Stress & Mood", color: "text-rose-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white shadow-sm">
                    <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                    <CheckCircle2 className="ml-auto h-5 w-5 text-teal-500" />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="py-24 bg-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It <span className="text-teal-600">Works</span></h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to metabolic awareness.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />
            {[
              { step: "01", icon: <Fingerprint className="h-10 w-10 text-teal-600" />, title: "Place Your Finger", desc: "Insert your finger into EasyTouch+ for a quick reading." },
              { step: "02", icon: <Zap className="h-10 w-10 text-teal-600" />, title: "Instant Reading", desc: "The device captures wellness signals related to your metabolic response." },
              { step: "03", icon: <BarChart3 className="h-10 w-10 text-teal-600" />, title: "Track Your Patterns", desc: "View trends over time in the mobile dashboard." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center gap-5 p-8 rounded-2xl bg-card border border-border shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest text-teal-500 uppercase">Step {item.step}</span>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4b. CALIBRATION STORY ── */}
      <section className="py-24 bg-gradient-to-b from-teal-50/50 to-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              EasyTouch+ Learns <span className="text-teal-600">Your Metabolic Fingerprint</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Not an average person's. Yours. The calibration step is what makes it accurate — and it's a 2-day setup, once.
            </p>
          </AnimatedSection>
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { step: "1", icon: <Droplets className="h-7 w-7 text-muted-foreground" />, title: "Take 4 glucometer readings", sub: "Fasting morning + post-meal evening, over 2 days" },
              { step: "2", icon: <Fingerprint className="h-7 w-7 text-teal-600" />, title: "Pair with EasyTouch+ PPG", sub: "Read at the same moment as each glucometer snap" },
              { step: "3", icon: <Brain className="h-7 w-7 text-teal-600" />, title: "Algorithm builds your model", sub: "A personal PPG→metabolic correlation, unique to you" },
              { step: "4", icon: <Sparkles className="h-7 w-7 text-teal-600" />, title: "All future readings show your Index", sub: "No two people calibrate the same way" },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3 h-full shadow-sm text-center items-center">
                  <span className="text-xs font-bold tracking-widest text-teal-500 uppercase">Step {item.step}</span>
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <p className="font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.sub}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          {/* Metabolic Index mockup */}
          <AnimatedSection delay={0.5} className="mt-14 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">After calibration, you see:</p>
            <div className="flex items-center gap-6 p-8 rounded-3xl border-2 border-teal-200 bg-white shadow-xl shadow-teal-100">
              <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-teal-500 shadow-inner">
                <span className="text-3xl font-bold text-foreground">72</span>
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">Metabolic<br/>Index</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 border border-orange-200">
                  ⚠ Elevated Zone
                </span>
                <p className="text-sm text-muted-foreground max-w-xs">Your metabolic signal is elevated. This corresponds to your logged readings in the post-meal range.</p>
                <p className="text-xs text-muted-foreground italic">Not mg/dL — calibrated to your body.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 5. BENEFITS ── */}
      <section className="py-24 bg-gradient-to-b from-white to-teal-50/40">
        <div className="container">
          <AnimatedSection className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What You Can <span className="text-teal-600">Discover</span></h2>
            <p className="mt-4 text-muted-foreground">Personal insights your body has been waiting to share.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="rounded-2xl border border-border bg-white p-6 flex flex-col gap-4 h-full shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    {b.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </AnimatedSection>
            ))}
            <AnimatedSection delay={0.4}>
              <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 p-6 flex flex-col justify-between text-white shadow-lg shadow-teal-200 h-full min-h-[160px]">
                <TrendingUp className="h-8 w-8 text-white/80" />
                <p className="text-lg font-semibold mt-4">Personalise your wellness journey, one reading at a time.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── 6. LIFESTYLE EXPERIMENT ── */}
      <section className="py-24 bg-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Turn Your Body Into A <span className="text-teal-600">Personal Experiment Lab</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Experiment with food and lifestyle choices. Observe. Learn. Optimise.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
              {[
                { icon: <Utensils className="h-8 w-8 text-teal-600" />, label: "Check Before Meal", sub: "Baseline reading" },
                { arrow: true },
                { icon: <Fingerprint className="h-8 w-8 text-teal-600" />, label: "EasyTouch+", sub: "Place finger, get reading" },
                { arrow: true },
                { icon: <BarChart3 className="h-8 w-8 text-teal-600" />, label: "Observe Response", sub: "Track in dashboard" },
              ].map((item: any, i) =>
                item.arrow ? (
                  <ArrowRight key={i} className="h-8 w-8 text-teal-300 rotate-0 md:rotate-0 shrink-0" />
                ) : (
                  <div key={i} className="flex-1 rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                )
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 7. TARGET AUDIENCE ── */}
      <section className="py-24 bg-gradient-to-b from-teal-50/40 to-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Who Is <span className="text-teal-600">EasyTouch+ For</span></h2>
          </AnimatedSection>
          <div className="flex flex-wrap justify-center gap-4">
            {audience.map((a, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="flex items-center gap-3 rounded-full border border-teal-200 bg-white px-6 py-3 shadow-sm text-teal-700 font-medium hover:bg-teal-50 transition-colors cursor-default">
                  {a.icon}
                  {a.label}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CREDIBILITY ── */}
      <section className="py-24 bg-white border-y border-border">
        <div className="container">
          <AnimatedSection className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
            <ShieldCheck className="h-14 w-14 text-teal-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Built By Health Technology <span className="text-teal-600">Innovators</span></h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              EasyTouch+ is designed by Agatsa — a team with over a decade of experience building advanced personal health monitoring technology and preventive healthcare devices trusted by thousands.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Agatsa Medical Technologies</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 8b. 3 LEVELS OF KNOWING ── */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              3 Levels of <span className="text-teal-600">Knowing</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">Your glucometer only gives you Level 1.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AnimatedSection delay={0}>
              <div className="rounded-2xl border border-border bg-muted/40 p-7 flex flex-col gap-4 h-full">
                <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Level 1 — Snapshot</span>
                <div className="flex items-center gap-3">
                  <Droplets className="h-7 w-7 text-muted-foreground" />
                  <span className="font-semibold text-foreground">Glucometer</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">"My sugar is 148 right now."</p>
                <p className="text-xs text-muted-foreground mt-auto">A number, at one moment, twice a day.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl border-2 border-teal-400 bg-teal-50 p-7 flex flex-col gap-4 h-full shadow-md shadow-teal-100">
                <span className="text-xs font-bold tracking-widest text-teal-600 uppercase">Level 2 — Pattern</span>
                <div className="flex items-center gap-3">
                  <Activity className="h-7 w-7 text-teal-600" />
                  <span className="font-semibold text-foreground">EasyTouch+</span>
                </div>
                <p className="text-sm text-teal-700 leading-relaxed italic">"My metabolic signal spikes every day at 3 PM — regardless of what I eat."</p>
                <p className="text-xs text-teal-600 mt-auto font-medium">Continuous. Calibrated. Yours.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-teal-600 to-cyan-500 p-7 flex flex-col gap-4 h-full shadow-lg shadow-teal-200">
                <span className="text-xs font-bold tracking-widest text-teal-200 uppercase">Level 3 — Prediction</span>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-7 w-7 text-white" />
                  <span className="font-semibold text-white">Nera AI</span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed italic">"This pattern will normalise in 11 weeks if you shift your dinner timing by 90 minutes."</p>
                <p className="text-xs text-teal-200 mt-auto">Coming soon — powered by your pattern data.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── 9. COMPARISON ── */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">The <span className="text-teal-600">Difference</span></h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl mx-auto grid grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-md">
              <div className="bg-muted/60 p-8 flex flex-col gap-6">
                <h3 className="font-bold text-lg text-muted-foreground text-center">Without EasyTouch+</h3>
                {[
                  "Guess how food affects you",
                  "₹50 per glucometer strip — rationing your health data",
                  "No continuous metabolic data",
                  "Generic, one-size-fits-all advice",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
              <div className="bg-teal-600 p-8 flex flex-col gap-6">
                <h3 className="font-bold text-lg text-white text-center">With EasyTouch+</h3>
                {[
                  "Observe your body's metabolic response",
                  "₹0 per EasyTouch+ reading — unlimited insights",
                  "22-hour continuous metabolic tracking",
                  "Calibrated to your body, not an average",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-200 shrink-0 mt-0.5" />
                    <span className="text-sm text-white">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 10. EARLY ACCESS ── */}
      <section className="py-24 bg-gradient-to-br from-teal-600 to-cyan-500 text-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">
              <Target className="h-3.5 w-3.5" /> Limited Availability
            </span>
            <h2 className="text-3xl md:text-5xl font-bold">Limited Early Access Batch</h2>
            <p className="text-white/80 text-lg max-w-xl">
              The current batch of EasyTouch+ is available for a limited number of early adopters. Don't miss your spot.
            </p>
            <Button size="lg" className="mt-4 bg-white text-teal-700 hover:bg-teal-50 rounded-full px-10 text-base font-semibold shadow-lg">
              Get EasyTouch+
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 11. PRICING ── */}
      <section className="py-24 bg-white">
        <div className="container">
          <AnimatedSection className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Simple, <span className="text-teal-600">Transparent Pricing</span></h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-sm mx-auto rounded-3xl border-2 border-teal-500 bg-white shadow-2xl shadow-teal-100 p-8 flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center">
                <Fingerprint className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">EasyTouch+ Device</h3>
              <ul className="flex flex-col gap-3 text-left w-full">
                {["EasyTouch+ device", "Mobile app access (iOS & Android)", "Lifestyle tracking dashboard", "Free firmware updates"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full text-base font-semibold mt-2">
                Order Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 12. FAQ ── */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked <span className="text-teal-600">Questions</span></h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="flex flex-col gap-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-white px-6 shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-foreground py-5 hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 13. FINAL CTA ── */}
      <section className="py-32 bg-gradient-to-br from-teal-50 via-cyan-50 to-white text-center">
        <div className="container">
          <AnimatedSection className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Your Body Is Unique.<br />
              <span className="text-teal-600">Start Understanding It.</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Join early adopters who are taking control of their metabolic wellness with EasyTouch+.
            </p>
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-12 text-base font-semibold shadow-lg shadow-teal-200">
              Get EasyTouch+
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 14. DISCLAIMER ── */}
      <div className="bg-muted/60 border-t border-border py-6">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
            <strong>Disclaimer:</strong> EasyTouch+ is a wellness device intended for lifestyle awareness and personal health tracking. <strong>Metabolic Index is a wellness indicator derived from PPG signals and personal calibration data. It is not a substitute for clinical blood glucose measurement.</strong> EasyTouch+ is not intended for medical diagnosis, treatment, or disease management. Always consult a qualified healthcare professional for any medical concerns.
          </p>
        </div>
      </div>
    </Layout>
  );
}
