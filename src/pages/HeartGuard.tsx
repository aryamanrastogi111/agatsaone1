import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  Check,
  Lock,
  Package,
  RefreshCw,
  ArrowRight,
  Play,
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

  const scrollToOrder = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
            onClick={scrollToOrder}
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
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your patients leave your clinic.
              <br />
              <span className="text-white/70">Their heart doesn't stop.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              HeartGuard lets you monitor your cardiac and diabetic patients every single day — not
              just when they visit. Nera AI watches the data. You get alerted only when something
              actually needs your attention.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#order"
                onClick={scrollToOrder}
                className="inline-flex items-center justify-center rounded-md px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
                style={{ background: BLUE }}
              >
                Buy the HeartGuard Kit — ₹24,999
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Play className="h-4 w-4" /> Watch 2-min Demo
              </a>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              First 50 doctors get 1-year platform access free · Ships in 48 hours
            </p>
          </div>

          {/* Phone mockup */}
          <div className="lg:col-span-5">
            <DoctorPhoneMockup />
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
                body: "One-time purchase. 5 ECG devices. Ships to your clinic in 48 hours.",
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

      {/* ───────── INCOME CALCULATOR ───────── */}
      <section className="bg-white py-20 sm:py-28">
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
                * You set your own programme fee. This is illustrative at ₹3,000/month.
              </p>

              <div className="mt-8 text-center">
                <a
                  href="#order"
                  onClick={scrollToOrder}
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
                onClick={scrollToOrder}
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
              onClick={scrollToOrder}
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
