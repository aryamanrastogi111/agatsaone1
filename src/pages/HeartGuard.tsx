import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  CalendarX,
  HeartPulse,
  Unlink,
  ShoppingBag,
  QrCode,
  MonitorPlay,
  Activity,
  Watch,
  LayoutDashboard,
  IdCard,
  Bell,
  TrendingUp,
  FileText,
  Heart,
  Droplet,
  Stethoscope,
  Search,
  AlertTriangle,
  CircleDot,
  Send,
  Sparkles,
  Check,
  Lock,
  Package,
  RefreshCw,
  ArrowRight,
  Play,
  Cpu,
  Database,
  Brain,
  Zap,
  Smartphone,
  BatteryCharging,
  Bluetooth,
  Ruler,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSEO } from "@/hooks/useSEO";
import { VideoCard, YouTubeChannelLink, type VideoItem } from "@/components/VideoCard";
import awardMbillionth from "@/assets/award-mbillionth-new.png";
import awardAegisGrahambell from "@/assets/award-aegis-grahambell.webp";
import awardAnjaniMashelkar from "@/assets/award-anjani-mashelkar.webp";
import sanketlifeDevice from "@/assets/sanketlife-2.0-device.webp";
import rhythmBand from "@/assets/easytouch-rhythm-band.webp";

const DOCTOR_VIDEOS: VideoItem[] = [
  { id: "u26lsahqY8k", title: "Dr. Sanjeev Gera Recommends SanketLife ECG" },
  { id: "RfXpcoGsJlA", title: "Dr. Vanita Arora: SanketLife — Hero For Your Heart" },
  { id: "LW1dBopGYl4", title: "NEWS9 Live: Agatsa's Life-Saving SanketLife 2.0" },
  { id: "0bLpUCQw-Xc", title: "AIIMS Event — Simplifying Heart Care with SanketLife" },
  { id: "Ird2TuUR0j4", title: "Neha Rastogi at Medical Expo India 2024" },
  { id: "wocf2tnTLmE", title: "Patients & Doctors Embrace SanketLife Pro Plus" },
];

const HG_AWARDS = [
  { name: "Anjani Mashelkar Prize 2025", image: awardAnjaniMashelkar, recent: true },
  { name: "Aegis Graham Bell Award 2022", image: awardAegisGrahambell },
  { name: "mBillionth Award 2017", image: awardMbillionth },
];

// Additional recognitions (text badges)
const HG_AWARDS_MORE: { name: string; year?: string }[] = [
  { name: "National Startup Award", year: "2023" },
  { name: "Startup India Recognition", year: "2017" },
  { name: "BIRAC BIG Grant" },
  { name: "DST NIDHI PRAYAS Grant" },
  { name: "Atal Innovation Mission" },
  { name: "Smart Fifty by IIM Calcutta" },
  { name: "Lockheed Martin India Innovation Growth" },
  { name: "Tata Social Enterprise Challenge" },
  { name: "NASSCOM Emerge 50" },
  { name: "FICCI Healthcare Excellence" },
  { name: "CII Industrial Innovation" },
  { name: "ET Power of Ideas" },
  { name: "Economic Times Healthworld" },
  { name: "Women Transforming India — NITI Aayog" },
  { name: "Make in India Champion" },
  { name: "Vibrant Gujarat Showcase" },
  { name: "Bengaluru Tech Summit" },
  { name: "Global Bio-India" },
  { name: "World Health Summit, Berlin" },
  { name: "GES Hyderabad" },
  { name: "Geneva Health Forum" },
  { name: "Singapore Slingshot Top 100" },
  { name: "Red Herring Asia" },
  { name: "AIIMS Innovation Showcase" },
  { name: "ELCINA Electronics Award" },
  { name: "India Innovation Growth Programme" },
  { name: "TiE Entrepreneurial Excellence" },
  { name: "BW Disrupt 40 Under 40" },
  { name: "Cartier Women's Initiative" },
  { name: "MIT Solve Health Challenge" },
  { name: "Forbes Asia Recognition" },
  { name: "WHO Digital Health Showcase" },
  { name: "FICCI FLO Excellence" },
  { name: "DPIIT Innovation Recognition" },
];


// ───────── Animated counter ─────────
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const diff = value - start;
    const duration = 400;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

// ───────── Section wrapper with reveal ─────────
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </div>
  );
}

// ───────── Theme tokens (page-local, premium look) ─────────
const NAVY = "#0a1628";
const NAVY_LIGHT = "#0f172a";
const BLUE = "#2563EB";
const TEAL = "#0D9488";

export default function HeartGuard() {
  useSEO({
    title: "HeartGuard — Daily Remote Cardiac Monitoring for Doctors | Agatsa One",
    description:
      "HeartGuard kit: 5 ECG devices, 5 health bands, doctor portal, and Nera AI. Monitor your cardiac and diabetic patients daily. Earn ₹3,000+/month per patient.",
  });

  const [patients, setPatients] = useState(15);
  const monthly = patients * 3000;
  const yearly = monthly * 12;
  const paybackDaysRaw = (24999 / monthly) * 30;
  const paybackDays = Math.max(5, Math.round(paybackDaysRaw / 5) * 5);

  // Hero carousel
  const HERO_SLIDES = [
    {
      key: "portal",
      label: "Doctor Portal",
      sub: "Daily ECG triage · Nera AI",
      gradient: "linear-gradient(135deg, #2563EB 0%, #0D9488 100%)",
      kind: "phone" as const,
    },
    {
      key: "ecg",
      label: "SanketLife 12-Lead ECG",
      sub: "Touch-based · CDSCO approved",
      gradient: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      kind: "image" as const,
      src: sanketlifeDevice,
      alt: "SanketLife 12-Lead touch ECG device",
    },
    {
      key: "band",
      label: "EasyTouch Rhythm Band",
      sub: "HRV · Sleep · Activity · SpO₂",
      gradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
      kind: "image" as const,
      src: rhythmBand,
      alt: "EasyTouch Rhythm vitals band",
    },
  ];
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setHeroSlide((i) => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(id);
  }, [HERO_SLIDES.length]);

  const navigate = useNavigate();

  // HeartGuard Doctor Starter Kit — single SKU @ ₹24,999 in backend catalog
  const HEARTGUARD_KIT_SKUS = "heartguard_starter";

  const goToCheckout = (e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (e) e.preventDefault();
    navigate(`/checkout?sku=${HEARTGUARD_KIT_SKUS}&utm_source=heartguard`);
  };

  return (
    <div className="font-sans antialiased text-[#0f172a] bg-white scroll-smooth">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden" style={{ background: NAVY }}>
        {/* subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(800px 400px at 80% 20%, rgba(37,99,235,0.25), transparent 60%), radial-gradient(600px 400px at 10% 90%, rgba(13,148,136,0.18), transparent 60%)",
          }}
        />
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: BLUE }}>
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">Agatsa One</span>
          </div>
          <a
            href="#order"
            onClick={goToCheckout}
            className="hidden rounded-md px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white sm:inline-block"
          >
            Order Kit →
          </a>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-12 lg:pb-32 lg:pt-16">
          <div className="lg:col-span-7">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              For Cardiologists & Diabetologists
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-gradient-to-r from-orange-500/25 to-amber-500/20 px-3 py-1 text-[11px] font-semibold text-orange-100 shadow-[0_0_0_1px_rgba(251,146,60,0.15)] backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.9)]" />
                World's only touch-based 12-Lead ECG
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/25 px-3 py-1 text-[11px] font-semibold text-orange-100 shadow-[0_0_0_1px_rgba(251,146,60,0.15)] backdrop-blur">
                <Check className="h-3 w-3 text-orange-300" />
                CDSCO approved · Class B Medical Device
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              You're losing ₹3 lakh a month
              <br />
              <span className="text-white/70">to follow-ups that never happen.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Apollo and Medanta already monitor their patients at home. Your clinic doesn't.
              HeartGuard gives solo and small-group doctors the same remote-monitoring stack —
              ECG kit, vitals band, doctor dashboard, and Nera AI triage — for a one-time ₹24,999.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#order"
                onClick={goToCheckout}
                className="inline-flex items-center justify-center rounded-md px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
                style={{ background: BLUE }}
              >
                Buy the HeartGuard Kit — ₹24,999
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Play className="h-4 w-4" /> How it Happens?
              </a>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              First 50 doctors get 1-year platform access free · Ships in 48 hours
            </p>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
              {[
                { stat: "1.6 Cr+", label: "ECG tests analysed" },
                { stat: "10+", label: "Peer-reviewed publications" },
                { stat: "WHO", label: "Deployed in WHO programmes" },
                { stat: "ISO 13485", label: "Medical-grade certified" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="text-lg font-bold sm:text-xl" style={{ color: TEAL }}>
                    {b.stat}
                  </div>
                  <div className="mt-1 text-[11px] leading-tight text-slate-400 sm:text-xs">
                    {b.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero carousel: phone mockup ↔ ECG device ↔ Rhythm band */}
          <div className="lg:col-span-5">
            <div
              className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              style={{ aspectRatio: "3 / 4", minHeight: "480px" }}
            >
              {/* Animated gradient background per slide */}
              <AnimatePresence mode="sync">
                <motion.div
                  key={`bg-${HERO_SLIDES[heroSlide].key}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                  style={{ background: HERO_SLIDES[heroSlide].gradient }}
                />
              </AnimatePresence>

              {/* Soft sheen overlay (skip on light slides) */}
              {HERO_SLIDES[heroSlide].key !== "ecg" && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 20% 0%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(120% 80% at 100% 100%, rgba(0,0,0,0.25), transparent 60%)",
                  }}
                />
              )}

              {/* Slide content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={HERO_SLIDES[heroSlide].key}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {HERO_SLIDES[heroSlide].kind === "phone" ? (
                      <div className="flex h-full w-full items-center justify-center px-6 pb-24 pt-6">
                        <div className="origin-center scale-[0.78] sm:scale-90">
                          <DoctorPhoneMockup />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={HERO_SLIDES[heroSlide].src}
                        alt={HERO_SLIDES[heroSlide].alt}
                        loading="eager"
                        className={`absolute inset-0 h-full w-full object-contain p-4 pb-24 ${HERO_SLIDES[heroSlide].key === "ecg" ? "drop-shadow-[0_12px_20px_rgba(15,23,42,0.18)]" : "drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"}`}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`lbl-${HERO_SLIDES[heroSlide].key}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent px-5 pb-5 pt-12"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      In the kit
                    </p>
                    <p className="mt-1 text-base font-semibold text-white sm:text-lg">
                      {HERO_SLIDES[heroSlide].label}
                    </p>
                    <p className="text-xs text-white/80">{HERO_SLIDES[heroSlide].sub}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots */}
              <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setHeroSlide(i)}
                    aria-label={`Show ${s.label}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroSlide ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── PROBLEM ───────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              The Problem
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              You are completely blind between visits
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: CalendarX,
                title: "3 months of darkness",
                body:
                  "Your patient had a silent arrhythmia last Tuesday night. Took a painkiller. Felt better. Came to you Friday with no symptoms. You never knew.",
              },
              {
                Icon: HeartPulse,
                title: "Clinic ECG is a snapshot",
                body:
                  "Your Tricog or in-clinic ECG tells you what happened when the patient was sitting in front of you. What happened at 2am on Wednesday — you have no idea.",
              },
              {
                Icon: Unlink,
                title: "Medication changes are guesswork",
                body:
                  "You adjust insulin or a cardiac drug and ask the patient to 'come back in a month.' You're waiting 30 days to find out if it worked.",
              },
            ].map((c, i) => (
              <Reveal key={i}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-slate-300 hover:shadow-lg">
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "rgba(37,99,235,0.08)" }}
                  >
                    <c.Icon className="h-5 w-5" style={{ color: BLUE }} />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SOLUTION ───────── */}
      <section id="demo" className="py-20 sm:py-28" style={{ background: "#F8FAFC" }}>
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              The Solution
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Daily home ECG. Real-time on your screen.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              HeartGuard gives your patients a device they use every morning — 30 seconds, in their
              palm. Every result goes directly to your portal. Nera AI reads it, flags anomalies,
              and tells you which patients need your attention today.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                Icon: ShoppingBag,
                title: "You buy the kit",
                body: "One-time purchase. 5 SanketLife ECG devices + 5 EasyTouch Rhythm wearable bands. Ships to your clinic in 72 hours.",
              },
              {
                Icon: QrCode,
                title: "Patient scans the card",
                body:
                  "Give your patient a clinic card. They download Agatsa One, enter your code, and are linked to your dashboard instantly.",
              },
              {
                Icon: MonitorPlay,
                title: "You monitor. Nera AI does the work.",
                body:
                  "Daily ECGs, HRV, sleep, glucose patterns — all in one portal. Nera AI sends you a morning briefing: 'Patient 3 needs review today.'",
              },
            ].map((s, i, arr) => (
              <Reveal key={i}>
                <div className="relative h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200/60">
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: BLUE }}
                    >
                      {i + 1}
                    </div>
                    <s.Icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{s.body}</p>
                  {i < arr.length - 1 && (
                    <ArrowRight className="absolute -right-5 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-slate-300 md:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ZERO-EFFORT ONBOARDING RIBBON ───────── */}
      <section className="pb-10 sm:pb-14">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-3xl p-[2px] shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",
              }}
            >
              <div
                className="rounded-[22px] p-8 sm:p-10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,60,172,0.95) 0%, rgba(120,75,160,0.95) 50%, rgba(43,134,197,0.95) 100%)",
                }}
              >
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-lg"
                    style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)" }}
                  >
                    📞
                  </div>
                  <div className="flex-1">
                    <h3
                      className="mb-3 text-2xl font-extrabold leading-tight sm:text-3xl"
                      style={{ color: "#ffffff" }}
                    >
                      Zero Patient Onboarding
                    </h3>
                    <p
                      className="text-sm leading-relaxed sm:text-base"
                      style={{ color: "rgba(255,255,255,0.92)" }}
                    >
                      The moment you enroll a patient, the system notifies the Agatsa team and they call the enrolled patient directly to explain how to download the Agatsa One app and record their readings — so you spend zero effort getting them started.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── WHAT'S IN THE KIT ───────── */}
      <section className="py-20 sm:py-28" style={{ background: NAVY_LIGHT }}>
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              What's in the Box
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Everything you need to start monitoring today
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Activity, title: "5 × SanketLife ECG Devices", body: "World's smallest ECG. Patient holds it in their palm for 30 seconds. Clinical-grade accuracy. Works with any Android or iOS phone." },
              { Icon: Watch, title: "5 × Smart Health Bands", body: "HRV, sleep quality, SpO2, activity — continuous monitoring between ECG scans. Syncs automatically to your portal." },
              { Icon: LayoutDashboard, title: "Doctor Portal Access (1 Year Free)", body: "Patient triage panel, daily ECG results, Nera AI briefing, message your patients, generate reports — all in one screen." },
              { Icon: IdCard, title: "10 Printed Clinic Cards", body: "Cards with your unique clinic code. Patient scans, downloads app, enters code — linked to your portal in under 2 minutes." },
            ].map((item, i) => (
              <Reveal key={i}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:bg-white/[0.06]">
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: "rgba(13,148,136,0.15)" }}
                  >
                    <item.Icon className="h-5 w-5" style={{ color: TEAL }} />
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TECHNICAL SPECIFICATIONS ───────── */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: BLUE }}>
              Technical Specifications
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Built for clinical accuracy. Designed for everyday use.
            </h2>
            <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
              Every device in the HeartGuard kit meets medical-grade standards your patients can rely on.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* SanketLife ECG */}
            <Reveal>
              <div className="h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200/60">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(37,99,235,0.1)" }}>
                    <Activity className="h-5 w-5" style={{ color: BLUE }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">SanketLife ECG Device</h3>
                    <p className="text-xs text-slate-500">World's smallest 12-lead pocket ECG</p>
                  </div>
                </div>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { Icon: HeartPulse, label: "ECG Type", value: "12-lead clinical ECG via thumb sensors" },
                    { Icon: Zap, label: "Capture Time", value: "15-second reading · no gel, no wires" },
                    { Icon: Check, label: "Accuracy", value: "98.5% concordance with hospital ECG" },
                    { Icon: Bluetooth, label: "Connectivity", value: "Bluetooth Low Energy" },
                    { Icon: Smartphone, label: "Compatibility", value: "Android & iOS · Agatsa One app" },
                    { Icon: BatteryCharging, label: "Battery", value: "CR2032 coin cell · pre-installed" },
                    { Icon: FileText, label: "Output", value: "Instant PDF report, doctor-shareable" },
                    { Icon: Package, label: "In the Box", value: "Device, battery, pouch, quick-start guide" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                      <s.Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</dt>
                        <dd className="mt-0.5 text-sm font-medium text-slate-800">{s.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* EasyTouch Rhythm Band */}
            <Reveal>
              <div className="h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200/60">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(13,148,136,0.12)" }}>
                    <Watch className="h-5 w-5" style={{ color: TEAL }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">EasyTouch Rhythm Band</h3>
                    <p className="text-xs text-slate-500">Continuous wellness monitoring wearable</p>
                  </div>
                </div>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { Icon: Heart, label: "Vitals Tracked", value: "Heart rate, HRV, SpO₂, stress score" },
                    { Icon: Activity, label: "Sleep & Activity", value: "Sleep stages, steps, calories, 5 sport rhythms" },
                    { Icon: Watch, label: "Wear Style", value: "Lightweight silicone strap · 24/7 comfort" },
                    { Icon: BatteryCharging, label: "Battery", value: "7-day usage · magnetic charging cable" },
                    { Icon: Droplet, label: "Water Resistance", value: "IP67 — handwash & light rain safe" },
                    { Icon: Bluetooth, label: "Sync", value: "Bluetooth — auto-uploads to Nera AI" },
                    { Icon: Smartphone, label: "App", value: "Agatsa One · Android & iOS" },
                    { Icon: Bell, label: "Smart Alerts", value: "Sleep score, stress, sedentary nudges" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                      <s.Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</dt>
                        <dd className="mt-0.5 text-sm font-medium text-slate-800">{s.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── POWER OF NERA AI ───────── */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.4) 0%, transparent 50%)" }} />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-300">
              The Power of Nera AI
            </p>
            <h2 className="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Trained on the world's largest ECG dataset — <span style={{ color: "#A78BFA" }}>16 million+ recordings</span>
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Over a decade, Agatsa has collected 16M+ real-world ECG recordings from Indian patients across
              every age group, body type and clinical scenario. That's the foundation Nera AI is trained on —
              giving your patients diagnostic-grade intelligence no global model can match for the Indian heart.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Database, stat: "16 M+", label: "ECG recordings", body: "The largest proprietary ECG dataset in the world — collected from real Indian patients, not lab simulations." },
              { Icon: Brain, stat: "97.8%", label: "Concordance with cardiologists", body: "Independently validated against expert ECG readings. Nera AI matches what your cardiologist would say." },
              { Icon: Cpu, stat: "12+ years", label: "Of clinical learning", body: "Continuously trained since 2013 across millions of patient journeys, arrhythmias and recovery patterns." },
              { Icon: Zap, stat: "< 8 sec", label: "Per ECG analysis", body: "Real-time triage. The moment a patient records, Nera flags abnormal rhythms before you see it." },
            ].map((item, i) => (
              <Reveal key={i}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition hover:border-purple-400/40 hover:bg-white/[0.08]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "rgba(168,85,247,0.18)" }}>
                    <item.Icon className="h-5 w-5 text-purple-300" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">{item.stat}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-300">{item.label}</div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-purple-300" />
              <p className="text-sm text-slate-200 sm:text-base">
                <span className="font-semibold text-white">Built for the Indian heart.</span>{" "}
                Indian ECG patterns differ from Western datasets. Nera AI is the only model trained
                primarily on Indian patient data — making it uniquely accurate for your clinic.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── NERA AI ───────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-600">
              Powered by Nera AI
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Nera reads 20 ECGs every morning so you don't have to
            </h2>
            <p className="mt-5 max-w-3xl text-base text-slate-600 sm:text-lg">
              Nera AI correlates your patient's ECG with their HRV, sleep, glucose patterns and
              tells you what a number means — not just what it is.
            </p>
          </Reveal>

          {/* ───── Doctor Portal Mockup ───── */}
          <Reveal>
            <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="ml-3 flex flex-1 items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
                  <Lock className="h-3 w-3" /> portal.agatsa.one / dashboard
                </div>
              </div>

              <div className="grid grid-cols-12">
                <aside className="col-span-12 border-b border-slate-200 bg-white p-4 sm:col-span-3 sm:border-b-0 sm:border-r">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: TEAL }}>
                      <HeartPulse className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-tight">Agatsa One</p>
                      <p className="text-[10px] text-slate-500">Doctor Portal</p>
                    </div>
                  </div>
                  <nav className="mt-5 space-y-1 text-[12px]">
                    {[
                      { Icon: LayoutDashboard, label: "Dashboard", active: true },
                      { Icon: Stethoscope, label: "My Patients", count: "47" },
                      { Icon: Activity, label: "ECG Reports", count: "20" },
                      { Icon: Bell, label: "Alerts", count: "3", urgent: true },
                      { Icon: FileText, label: "Weekly Reports" },
                      { Icon: Send, label: "Messages" },
                    ].map((it, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${it.active ? "bg-purple-50 text-purple-700 font-semibold" : "text-slate-600"}`}
                      >
                        <span className="flex items-center gap-2">
                          <it.Icon className="h-3.5 w-3.5" />
                          {it.label}
                        </span>
                        {it.count && (
                          <span className={`rounded-full px-1.5 text-[10px] font-bold ${it.urgent ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}>
                            {it.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </nav>
                </aside>

                <main className="col-span-12 bg-slate-50 p-5 sm:col-span-9 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Tuesday, 12 Nov · 7:42 AM</p>
                      <h4 className="mt-0.5 text-lg font-bold tracking-tight">Good morning, Dr. Mehta</h4>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                      <Search className="h-3.5 w-3.5" /> Search patient…
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Nera AI · Morning Briefing</p>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-700">
                      I reviewed <strong>20 ECGs</strong> overnight. <strong className="text-emerald-600">17 stable</strong>,
                      <strong className="text-amber-600"> 2 borderline</strong>, <strong className="text-red-600">1 needs urgent review</strong>.
                      Estimated time to triage: <strong>6 minutes</strong>.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "ECGs read", value: "20", sub: "today", color: "text-slate-900" },
                      { label: "Urgent", value: "1", sub: "review now", color: "text-red-600" },
                      { label: "Borderline", value: "2", sub: "today", color: "text-amber-600" },
                      { label: "Stable", value: "17", sub: "auto-cleared", color: "text-emerald-600" },
                    ].map((k, i) => (
                      <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{k.label}</p>
                        <p className={`mt-1 text-2xl font-bold tracking-tight ${k.color}`}>{k.value}</p>
                        <p className="text-[10px] text-slate-500">{k.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
                      <p className="text-[12px] font-semibold tracking-tight">Today's Triage Queue</p>
                      <p className="text-[10px] text-slate-500">Sorted by Nera priority</p>
                    </div>
                    <div className="divide-y divide-slate-100 text-[12px]">
                      {[
                        { name: "Rajesh Kumar", age: "58 · M", note: "ECG: AFib detected · HRV ↓ 3 days · BP 152/96", tag: "URGENT", color: "red", dot: "bg-red-500" },
                        { name: "Sunita Verma", age: "62 · F", note: "ECG: ST-T changes · Sleep score 48 · Sugar spike post-dinner", tag: "REVIEW", color: "amber", dot: "bg-amber-500" },
                        { name: "Anil Joshi", age: "54 · M", note: "ECG: borderline QT · HRV trending up · Fasting sugar stable", tag: "REVIEW", color: "amber", dot: "bg-amber-500" },
                        { name: "Meena Gupta", age: "67 · F", note: "ECG: normal sinus rhythm · All vitals stable · 7-day adherence 100%", tag: "STABLE", color: "emerald", dot: "bg-emerald-500" },
                        { name: "Vikas Sharma", age: "49 · M", note: "ECG: normal · HRV improving · Weight ↓ 1.2 kg this week", tag: "STABLE", color: "emerald", dot: "bg-emerald-500" },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                          <span className={`h-2 w-2 flex-shrink-0 rounded-full ${p.dot}`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-slate-900">{p.name} <span className="font-normal text-slate-400">· {p.age}</span></p>
                            <p className="truncate text-[11px] text-slate-500">{p.note}</p>
                          </div>
                          <span
                            className={`hidden rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider sm:inline-block ${
                              p.color === "red" ? "bg-red-100 text-red-700" : p.color === "amber" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {p.tag}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold tracking-tight">Rajesh Kumar — Lead I</p>
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-700">AFib · 142 BPM</span>
                      </div>
                      <svg viewBox="0 0 300 70" className="mt-2 h-16 w-full">
                        <defs>
                          <pattern id="hg-ecg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#fee2e2" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="300" height="70" fill="url(#hg-ecg-grid)" />
                        <path
                          d="M0,35 L20,35 L25,30 L30,35 L40,35 L45,10 L50,55 L55,35 L75,35 L78,33 L82,37 L95,35 L100,12 L105,52 L110,35 L130,35 L135,32 L155,35 L160,15 L165,50 L170,35 L195,35 L200,30 L220,35 L225,12 L230,52 L235,35 L260,35 L265,33 L285,35 L290,18 L295,48 L300,35"
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="1.4"
                        />
                      </svg>
                      <p className="mt-1 text-[10px] text-slate-500">Captured 06:48 AM · ln ECG · Nera flagged irregular R-R intervals</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-purple-600" />
                        <p className="text-[11px] font-semibold tracking-tight">Auto-drafted weekly report · Sunita Verma</p>
                      </div>
                      <div className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-slate-600">
                        <p>• Avg resting HR: <strong className="text-slate-900">78 bpm</strong> (↑4 vs last week)</p>
                        <p>• HRV (RMSSD): <strong className="text-slate-900">28 ms</strong> — borderline</p>
                        <p>• Post-dinner sugar spikes: <strong className="text-amber-600">3 of 7 days</strong></p>
                        <p>• Sleep quality: <strong className="text-slate-900">Fair</strong> · Avg 5h 42m</p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                          <Send className="h-3 w-3" /> Send via WhatsApp
                        </button>
                        <button className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600">Edit</button>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-500">
              Illustrative mockup of the Doctor Portal · Patient names anonymised
            </p>
          </Reveal>

          <div className="mt-14 space-y-6">
            {[
              { Icon: Bell, title: "Morning triage briefing", body: "Every morning: 'Rajesh Kumar — HRV declining 3 days, borderline ECG. Review recommended. Meena Gupta — all stable.' That's your 2-minute daily check-in." },
              { Icon: TrendingUp, title: "Cross-signal intelligence", body: "Nera connects the dots: late dinner → poor sleep → HRV drop → elevated cardiac risk next morning. No other system in India shows you this connection." },
              { Icon: FileText, title: "One-tap weekly report", body: "Nera auto-generates a weekly progress report for each patient. Review it, tap send. Patient gets it on WhatsApp. Looks like you spent an hour writing it." },
            ].map((row, i) => (
              <Reveal key={i}>
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-6 sm:flex-row sm:items-start sm:p-8">
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(147,51,234,0.10)" }}
                  >
                    <row.Icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{row.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{row.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── INCOME CALCULATOR ───────── */}
      <section className="bg-white py-20 sm:py-28 border-t border-slate-100">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
                Your Earning Potential
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                How much can you earn with HeartGuard?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
                You set your own monthly monitoring fee.
                <br />
                Most doctors charge ₹2,000–₹4,000/month per patient.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm sm:p-12">
              <div className="mb-8">
                <div className="mb-4 flex items-baseline justify-between">
                  <label className="text-sm font-medium text-slate-700">Number of enrolled patients</label>
                  <span className="text-2xl font-bold tabular-nums" style={{ color: BLUE }}>
                    {patients}
                  </span>
                </div>
                <Slider
                  value={[patients]}
                  onValueChange={(v) => setPatients(v[0])}
                  min={5}
                  max={50}
                  step={1}
                />
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                  <div className="text-4xl font-bold tabular-nums sm:text-5xl" style={{ color: BLUE }}>
                    <AnimatedNumber value={monthly} prefix="₹" />
                    <span className="text-base font-medium text-slate-400"> /month</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Your monthly monitoring income
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                  <div className="text-4xl font-bold tabular-nums sm:text-5xl" style={{ color: TEAL }}>
                    <AnimatedNumber value={yearly} prefix="₹" />
                    <span className="text-base font-medium text-slate-400"> /year</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-600">Annual additional income</p>
                </div>
              </div>

              <p className="mt-8 text-center text-sm italic text-slate-500">
                Kit cost ₹24,999 recovered in <span className="font-semibold not-italic text-slate-700">{paybackDays} days</span>
              </p>

              <p className="mt-2 text-center text-xs text-slate-400">
                * You set your own programme fee. This is an illustration at ₹3,000/month charged as patient fees.
              </p>

              <div className="mt-8 text-center">
                <a
                  href="#order"
                  onClick={goToCheckout}
                  className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-110"
                  style={{ background: BLUE }}
                >
                  Get the HeartGuard Kit <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── CLINICAL PROOF + VIDEO ───────── */}
      <section className="bg-white py-20 sm:py-28 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              Clinical Proof
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Validated in 10+ peer-reviewed publications
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              The same SanketLife ECG inside the HeartGuard kit has been independently
              validated against 12-lead hospital ECGs at India's top cardiac centres.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
            {/* Publications grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    venue: "Sri Jayadeva Institute of Cardiovascular Sciences",
                    finding: "98.15% ECG sensitivity vs 12-lead",
                    type: "Clinical validation, 2022",
                  },
                  {
                    venue: "Narayana Health",
                    finding: "98.5% accuracy vs hospital ECG",
                    type: "Comparative study",
                  },
                  {
                    venue: "15,000-user real-world study",
                    finding: "98.56% optical-monitoring accuracy",
                    type: "Population validation, 2023",
                  },
                  {
                    venue: "Indian Heart Journal & IEEE proceedings",
                    finding: "Cited in arrhythmia & STEMI detection literature",
                    type: "Peer-reviewed citations",
                  },
                  {
                    venue: "WHO digital-health programmes",
                    finding: "Deployed in field cardiac screening",
                    type: "Public health pilot",
                  },
                  {
                    venue: "AIIMS & PGIMER teaching cases",
                    finding: "Used as pocket ECG in ward rounds",
                    type: "Clinical adoption",
                  },
                ].map((p, i) => (
                  <Reveal key={i}>
                    <div className="h-full rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" style={{ color: BLUE }} />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {p.type}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-slate-900">
                        {p.venue}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.finding}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Demo videos */}
            <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
                  <div className="relative aspect-video bg-black">
                    <video
                      src="/videos/heartguard-demo.mp4"
                      controls
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="bg-white p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEAL }}>
                      Live demo
                    </div>
                    <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
                      One touch, 30 seconds, clinical-grade ECG
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      One touch, 30 seconds, PDF report on your dashboard. The same device
                      that powers the HeartGuard kit.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
                  <VideoCard video={{ id: "1UIKpA7H4O4", title: "SanketLife ECG — Official Demo" }} hero />
                  <div className="bg-white p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEAL }}>
                      How to use
                    </div>
                    <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
                      SanketLife ECG — Official Demo
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Step-by-step walkthrough of taking an ECG with the SanketLife device
                      included in your HeartGuard kit.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── DOCTOR ENDORSEMENTS + AWARDS ───────── */}
      <section className="bg-slate-950 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              Trusted by Experts
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Cardiologists, hospitals & national media on Agatsa
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-400">
              Watch leading doctors and institutions vouch for the same ECG device that ships
              inside every HeartGuard kit.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DOCTOR_VIDEOS.map((v) => (
              <Reveal key={v.id}>
                <VideoCard video={v} />
              </Reveal>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <YouTubeChannelLink />
          </div>

          {/* Awards strip */}
          <div className="mt-16 border-t border-white/10 pt-12">
            <Reveal>
              <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
                Recognised by
              </p>
              <h3 className="text-center text-xl font-semibold tracking-tight text-white sm:text-2xl">
                National & international awards
              </h3>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {HG_AWARDS.map((a, i) => (
                <Reveal key={i}>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]">
                    {a.recent && (
                      <span className="absolute top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                        Latest
                      </span>
                    )}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-white/5">
                      <img
                        src={a.image}
                        alt={a.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="px-4 py-4 text-sm font-medium text-white/85">{a.name}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* More recognitions — text badges */}
            <Reveal>
              <p className="mt-12 mb-5 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
                And {HG_AWARDS_MORE.length}+ more honours & grants
              </p>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-2">
              {HG_AWARDS_MORE.map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 backdrop-blur transition hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {a.name}
                  {a.year && <span className="text-white/45">· {a.year}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── COMPARISON: SANKETLIFE vs OTHER ECG DEVICES ───────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: BLUE }}>
              ECG Comparison
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              SanketLife vs other ECG options
            </h2>
            <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
              The only pocket device that gives your patient a true 12-lead reading at home — and gives you the same data your hospital ECG would.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="min-w-[180px] py-4 px-5 text-left font-semibold text-slate-600">Feature</th>
                    <th className="min-w-[150px] py-4 px-5 text-center font-bold" style={{ color: BLUE }}>SanketLife</th>
                    <th className="min-w-[140px] py-4 px-5 text-center font-medium text-slate-500">Hospital ECG</th>
                    <th className="min-w-[140px] py-4 px-5 text-center font-medium text-slate-500">Holter Monitor</th>
                    <th className="min-w-[140px] py-4 px-5 text-center font-medium text-slate-500">Smartwatch ECG</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ECG Leads", "12-lead", "12-lead", "3-lead", "Single-lead"],
                    ["Time to result", "15 seconds", "Hours to days", "24–48 hours", "30 seconds"],
                    ["Where", "Patient's palm", "Hospital only", "Worn for 1–2 days", "Wrist only"],
                    ["Cost per ECG", "Unlimited", "₹300 – ₹1,500", "₹3,000 – ₹6,000", "Unlimited"],
                    ["Validated accuracy", "98.5% vs hospital", "Reference", "Reference", "Limited"],
                    ["Doctor-shareable PDF", "Instant", "Manual", "Lab report", "Limited export"],
                    ["AI triage (Nera AI)", "Included", "—", "—", "—"],
                    ["Setup for elderly patient", "30 seconds", "Appointment + travel", "Clinic fitting", "Needs paired phone"],
                  ].map(([feature, sanket, hosp, holter, watch], i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                      <td className="py-3.5 px-5 font-medium text-slate-800">{feature}</td>
                      <td className="py-3.5 px-5 text-center font-semibold" style={{ color: BLUE, background: "rgba(37,99,235,0.04)" }}>{sanket}</td>
                      <td className="py-3.5 px-5 text-center text-slate-500">{hosp}</td>
                      <td className="py-3.5 px-5 text-center text-slate-500">{holter}</td>
                      <td className="py-3.5 px-5 text-center text-slate-500">{watch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">Comparison based on publicly available specifications. SanketLife accuracy validated at Narayana Health and Sri Jayadeva Institute.</p>
          </Reveal>
        </div>
      </section>

      {/* ───────── COMPARISON: RHYTHM BAND vs OTHER WEARABLES ───────── */}
      <section className="py-20 sm:py-24" style={{ background: "#F8FAFC" }}>
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              Wearable Comparison
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              EasyTouch Rhythm vs other wearables
            </h2>
            <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
              Most bands track numbers. The Rhythm Band feeds Nera AI the continuous signal it needs to spot what matters between ECGs.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="min-w-[200px] py-4 px-5 text-left font-semibold text-slate-600">Feature</th>
                    <th className="min-w-[150px] py-4 px-5 text-center font-bold" style={{ color: TEAL }}>EasyTouch Rhythm</th>
                    <th className="min-w-[130px] py-4 px-5 text-center font-medium text-slate-500">Apple Watch</th>
                    <th className="min-w-[130px] py-4 px-5 text-center font-medium text-slate-500">Fitbit</th>
                    <th className="min-w-[130px] py-4 px-5 text-center font-medium text-slate-500">Oura Ring</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Five Rhythm Analysis", rhythm: true, apple: false, fitbit: false, oura: false, unique: true },
                    { feature: "Unified Rhythm Score", rhythm: true, apple: false, fitbit: false, oura: false, unique: true },
                    { feature: "Heart Rate Monitoring", rhythm: true, apple: true, fitbit: true, oura: true },
                    { feature: "Sleep Tracking", rhythm: true, apple: true, fitbit: true, oura: true },
                    { feature: "Blood Oxygen (SpO₂)", rhythm: true, apple: true, fitbit: true, oura: true },
                    { feature: "Stress Detection", rhythm: true, apple: true, fitbit: true, oura: true },
                    { feature: "Circadian Rhythm Tracking", rhythm: true, apple: false, fitbit: false, oura: true, unique: true },
                    { feature: "Metabolic Insights", rhythm: true, apple: false, fitbit: false, oura: false, unique: true },
                    { feature: "Feeds doctor portal (Nera AI)", rhythm: true, apple: false, fitbit: false, oura: false, unique: true },
                    { feature: "7-Day Battery", rhythm: true, apple: false, fitbit: true, oura: true },
                    { feature: "No Subscription Required", rhythm: true, apple: true, fitbit: false, oura: false, unique: true },
                    { feature: "Made in India", rhythm: true, apple: false, fitbit: false, oura: false },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 last:border-0 ${row.unique ? "bg-teal-50/40" : "hover:bg-slate-50/60"}`}>
                      <td className="py-3.5 px-5 font-medium text-slate-800">
                        {row.feature}
                        {row.unique && (
                          <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ background: "rgba(13,148,136,0.15)", color: TEAL }}>
                            Unique
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center" style={{ background: "rgba(13,148,136,0.05)" }}>
                        {row.rhythm ? <Check className="mx-auto h-5 w-5" style={{ color: TEAL }} /> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.apple ? <Check className="mx-auto h-5 w-5 text-slate-400" /> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.fitbit ? <Check className="mx-auto h-5 w-5 text-slate-400" /> : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {row.oura ? <Check className="mx-auto h-5 w-5 text-slate-400" /> : <span className="text-slate-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">* Comparison based on publicly available product specifications.</p>
          </Reveal>
        </div>
      </section>

      {/* ───────── WHAT'S IN THE KIT (moved above) ───────── */}
      {/* ───────── WHO IS THIS FOR ───────── */}
      <section className="py-20 sm:py-28" style={{ background: "#F8FAFC" }}>
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
              Designed For
            </p>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Built for the doctor managing chronic disease patients
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { Icon: Heart, title: "Cardiologists", body: "Monitor post-MI patients daily at home. Know immediately if their ECG changes. Reduce unnecessary ER visits. Justify higher-value follow-up consultations." },
              { Icon: Droplet, title: "Diabetologists", body: "Correlate glucose patterns with cardiac rhythm. Catch diabetic cardiomyopathy early. The most common death in your patients is cardiac — now you can watch for it daily." },
              { Icon: Stethoscope, title: "General Physicians", body: "Your high-risk patients go 3 months without monitoring. HeartGuard turns you into the most thorough GP in your city. Patients refer family members because 'my doctor monitors my heart every day.'" },
            ].map((p, i) => (
              <Reveal key={i}>
                <div className="h-full rounded-2xl bg-white p-7 ring-1 ring-slate-200 transition hover:shadow-lg">
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "rgba(13,148,136,0.10)" }}
                  >
                    <p.Icon className="h-6 w-6" style={{ color: TEAL }} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section id="order" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
                Simple Pricing
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                One kit. One payment. Start earning.
              </h2>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div
              className="relative mx-auto max-w-[520px] rounded-3xl bg-white p-8 shadow-xl sm:p-10"
              style={{ border: `2px solid ${BLUE}` }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span
                  className="rounded-full px-4 py-1.5 text-xs font-semibold text-white shadow-md"
                  style={{ background: BLUE }}
                >
                  Most Popular · First 50 Doctors
                </span>
              </div>

              <h3 className="mt-2 text-center text-lg font-semibold text-slate-700">
                HeartGuard Starter Kit
              </h3>

              <div className="mt-4 flex items-baseline justify-center gap-3">
                <span className="text-5xl font-bold tracking-tight">₹24,999</span>
                <span className="text-xl text-slate-400 line-through">₹34,999</span>
              </div>
              <p className="mt-2 text-center text-sm text-slate-500">
                One-time purchase · No hidden fees
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "5 SanketLife ECG devices",
                  "5 Smart health bands",
                  "1 year doctor portal access (worth ₹11,988)",
                  "10 printed clinic cards with your unique code",
                  "Nera AI morning briefing included",
                  "Patient app access for all enrolled patients",
                  "48-hour shipping to your clinic",
                  "Onboarding call with Agatsa team (30 min)",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" strokeWidth={2.5} />
                    <span className="text-[15px] text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={goToCheckout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-base font-semibold text-white shadow-md transition hover:brightness-110"
                style={{ background: BLUE }}
              >
                Order HeartGuard Kit Now <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-4 text-center text-sm text-slate-500">
                Have questions? WhatsApp us: +91 95605 92872
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Secure payment via Razorpay
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Ships in 48 hours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> 30-day return policy
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="py-20 sm:py-28" style={{ background: "#F8FAFC" }}>
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Common questions from doctors
            </h2>
          </Reveal>

          <Reveal className="mt-12">
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "My clinic already has an ECG machine. Why do I need this?",
                  a: "Your clinic ECG is a snapshot — it shows you what happened when the patient was in front of you. HeartGuard gives your patient a device they use at home every morning. You see their heart between visits — the 75 days between appointments when anything can happen. No clinic machine can do this.",
                },
                {
                  q: "Is it legal for me to charge patients a monthly monitoring fee?",
                  a: "Yes. You are providing a medical service — remote monitoring and clinical oversight. Charging for this service is entirely within the scope of medical practice. Thousands of Indian doctors already charge consultation fees for teleconsultations and follow-up calls. This is the same, with clinical data to back it up.",
                },
                {
                  q: "How much time does this actually take per day?",
                  a: "Under 10 minutes. Nera AI reads every ECG and sends you a morning briefing listing only patients who need your attention. On a typical day with 20 patients, 18 are stable — you see 'all clear' in 30 seconds. 2 need review — you spend 5 minutes. That's it.",
                },
                {
                  q: "What if a patient's ECG shows something serious?",
                  a: "Nera AI flags it immediately — you receive a push notification on your phone. The patient also receives an alert to contact their doctor. The system is designed to surface emergencies the moment they appear, not at your next scheduled review.",
                },
                {
                  q: "Can I add more devices later?",
                  a: "Yes. You can order additional devices anytime from your portal. Add-on device packs of 5 are available at ₹12,999.",
                },
              ].map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="overflow-hidden rounded-xl border-0 bg-white px-6 ring-1 ring-slate-200"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-slate-600">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="relative overflow-hidden py-20 sm:py-28" style={{ background: NAVY }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(600px 300px at 50% 0%, rgba(37,99,235,0.25), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              The first 50 doctors get 1-year platform access free.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              After that, it's ₹999/month. At 10 enrolled patients earning ₹3,000/month each,
              that's a 3,000% return on platform cost.
            </p>
            <button
              onClick={goToCheckout}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
              style={{ background: BLUE }}
            >
              Claim Your HeartGuard Kit <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-6 text-sm text-slate-400">
              Questions? Email hello@agatsaone.com or WhatsApp us
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: BLUE }}>
                <HeartPulse className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-tight">Agatsa One</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <a href="/about" className="hover:text-slate-900">About</a>
              <a href="/privacy-policy" className="hover:text-slate-900">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-slate-900">Terms</a>
              <a href="/contact" className="hover:text-slate-900">Contact</a>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Powered by Nera AI — Agatsa One, 2026
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            HeartGuard devices are for monitoring purposes. Clinical decisions remain the physician's responsibility.
          </p>
        </div>
      </footer>

      <StickyAddToCart
        productName="HeartGuard Doctor Starter Kit"
        price="₹24,999"
        unitPrice={24999}
        onBuyNow={() => goToCheckout()}
        themeColor="primary"
      />
    </div>
  );
}

// ───────── Phone mockup component ─────────
function DoctorPhoneMockup() {
  const patients = [
    { name: "Rajesh Kumar", note: "HRV ↓ 3 days · Review", color: "bg-amber-400", bar: "bg-amber-400" },
    { name: "Meena Gupta", note: "Stable · all clear", color: "bg-emerald-500", bar: "bg-emerald-500" },
    { name: "Arjun Patel", note: "ECG anomaly detected", color: "bg-rose-500", bar: "bg-rose-500" },
    { name: "Priya Shah", note: "Stable · sleep good", color: "bg-emerald-500", bar: "bg-emerald-500" },
    { name: "Vikas Singh", note: "Stable · HRV improving", color: "bg-emerald-500", bar: "bg-emerald-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      <div
        className="relative rounded-[2.5rem] p-3 shadow-2xl"
        style={{
          background: "linear-gradient(180deg, #1a2740 0%, #0a1628 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black/60" />
        <div className="overflow-hidden rounded-[2rem] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10px] font-semibold text-slate-500">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live
            </span>
          </div>

          {/* Header */}
          <div className="px-5 pt-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Morning briefing
            </p>
            <h4 className="mt-1 text-base font-bold text-slate-900">Good morning, Dr. Sharma</h4>
            <p className="mt-1 text-[11px] text-slate-500">5 patients · 1 needs review · 1 alert</p>
          </div>

          {/* ECG strip */}
          <div className="mx-5 mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-500">Latest ECG · Rajesh K.</span>
              <span className="text-[10px] font-semibold text-amber-600">Borderline</span>
            </div>
            <svg viewBox="0 0 200 40" className="h-10 w-full">
              <polyline
                points="0,20 20,20 25,18 30,22 35,5 40,35 45,15 50,20 70,20 90,20 95,18 100,22 105,8 110,32 115,16 120,20 140,20 160,20 165,18 170,22 175,5 180,35 185,15 190,20 200,20"
                fill="none"
                stroke={BLUE}
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Triage list */}
          <div className="px-5 pb-5 pt-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Patient triage
            </p>
            <div className="space-y-2">
              {patients.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${p.color}`} />
                    <div>
                      <p className="text-[12px] font-semibold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.note}</p>
                    </div>
                  </div>
                  <span className={`h-1 w-6 rounded-full ${p.bar} opacity-30`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute -left-6 top-20 hidden rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-200 sm:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(13,148,136,0.12)" }}>
            <Bell className="h-4 w-4" style={{ color: TEAL }} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-900">Nera AI</p>
            <p className="text-[10px] text-slate-500">2 min daily</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
