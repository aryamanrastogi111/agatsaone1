import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Watch,
  Brain,
  TrendingUp,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useSEO } from "@/hooks/useSEO";
import { ProductReviewsSection } from "@/components/products/ProductReviewsSection";
import { wakeUpLike25Reviews } from "@/data/wakeUpLike25Reviews";

const NAVY = "#080f1e";
const CARD = "#0d1626";
const PRICE = 4999;
const SKU = "er30_standard";
const PRODUCT_NAME = "Wake Up Like 25 Again";
const WHATSAPP = "https://wa.me/919319034673";

// ───────── Animated Count Up ─────────
function CountUp({ to, suffix = "", prefix = "", duration = 1800 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(to * (0.2 + 0.8 * (1 - Math.pow(1 - p, 3)))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

// ───────── Sunrise CTA Button ─────────
function SunriseButton({ children, onClick, size = "lg", className = "" }: { children: React.ReactNode; onClick?: () => void; size?: "lg" | "xl"; className?: string }) {
  const h = size === "xl" ? "min-h-[64px] text-lg sm:text-xl" : "min-h-[56px] text-base sm:text-lg";
  return (
    <button
      onClick={onClick}
      className={`w-full ${h} font-bold rounded-2xl text-[#1a0f00] shadow-[0_10px_40px_-10px_rgba(255,160,40,0.55)] hover:shadow-[0_14px_50px_-8px_rgba(255,160,40,0.7)] transition-all hover:scale-[1.01] active:scale-[0.99] ${className}`}
      style={{ background: "linear-gradient(135deg,#FFD27A 0%,#FFA340 50%,#FF7A1A 100%)" }}
    >
      {children}
    </button>
  );
}

// ───────── Countdown ─────────
function Countdown() {
  const [secs, setSecs] = useState(23 * 3600 + 59 * 60 + 59);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return (
    <div className="inline-flex items-center gap-2 text-amber-300/90 font-mono text-base sm:text-lg">
      <Clock className="h-4 w-4" />
      Offer ends in:&nbsp;<span className="text-white font-bold tabular-nums">{h}:{m}:{s}</span>
    </div>
  );
}

// ───────── HRV Graph ─────────
function HRVGraph() {
  return (
    <div className="rounded-2xl p-5 sm:p-7" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
      <svg viewBox="0 0 400 200" className="w-full h-auto">
        <defs>
          <linearGradient id="up" x1="0" x2="1">
            <stop offset="0" stopColor="#FFD27A" />
            <stop offset="1" stopColor="#FF7A1A" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="20" x2="380" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
        ))}
        {/* declining */}
        <path d="M30,60 C 100,80 180,100 380,150" stroke="#5b6677" strokeWidth="3" fill="none" strokeLinecap="round" />
        <text x="40" y="50" fill="#94a3b8" fontSize="12">Your HRV since 35</text>
        {/* rising */}
        <path d="M30,170 C 120,150 220,80 380,40" stroke="url(#up)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <text x="220" y="35" fill="#FFA340" fontSize="12" fontWeight="700">What 30 days does</text>
        {/* axes */}
        <line x1="20" x2="20" y1="10" y2="180" stroke="rgba(255,255,255,0.15)" />
        <line x1="20" x2="380" y1="180" y2="180" stroke="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  );
}

// ───────── Testimonial Card ─────────
function Testimonial({ name, badge, quote, initial, accent }: { name: string; badge: string; quote: string; initial: string; accent: string }) {
  return (
    <div className="rounded-2xl p-6 h-full flex flex-col" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0"
          style={{ background: accent }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm">{name}</p>
          <p className="text-amber-400 text-xs font-bold mt-0.5">{badge}</p>
        </div>
      </div>
      <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">{quote}</p>
    </div>
  );
}

export default function WakeUpLike25() {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const heroRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  useSEO({
    title: "Wake Up Like 25 Again — 30-Day HRV Programme · ₹4,999 | Agatsa One",
    description:
      "Stop waking up tired. Nera AI reads your watch and tells you why. Average +38% HRV in 30 days. Works with Apple Watch, Galaxy & more. ₹4,999.",
  });

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      setStickyVisible(window.scrollY > heroRef.current.offsetHeight * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const buyNow = () => {
    addItem({
      productId: SKU,
      productName: PRODUCT_NAME,
      variantTitle: "30-Day Programme + 1 Year Nera AI",
      price: PRICE,
      quantity: 1,
    });
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen text-white" style={{ background: NAVY }}>
      {/* ───── HERO ───── */}
      <section ref={heroRef} className="relative pt-20 sm:pt-24 pb-10 px-5">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(255,140,40,0.10), transparent 60%)" }} />
        <div className="relative max-w-2xl mx-auto w-full text-center">
          <p className="text-amber-300/90 text-xs sm:text-sm font-medium mb-4">
            ⚡ <CountUp to={2847} /> people started this month · ₹2,000 off this week only
          </p>

          <h1 className="font-black tracking-tight text-[2.5rem] leading-[1.05] sm:text-6xl mb-4 text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            <span className="text-white">You wake up tired.</span>
            <br />
            <span style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Every. Single. Day.
            </span>
          </h1>

          <p className="text-amber-300/90 text-base sm:text-lg leading-snug mb-7">
            You're not lazy. You're not old.
            <br />
            Your watch has the answer — and nobody showed you how to read it.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-7">
            {[
              { v: 38, suf: "%", lbl: "HRV gain" },
              { v: 30, suf: "", lbl: "Days" },
              { v: 100, suf: "%", lbl: "Avg result" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl py-3 px-2" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-2xl sm:text-3xl font-black" style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  +<CountUp to={s.v} suffix={s.suf} />
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>

          <SunriseButton size="xl" onClick={buyNow}>
            Fix My Energy in 30 Days — ₹4,999
          </SunriseButton>

          <p className="text-slate-400 text-xs sm:text-sm mt-4">
            Works with Apple Watch · Galaxy Watch · Any smartwatch you own
          </p>
          <p className="text-slate-500 text-[11px] sm:text-xs mt-1.5">
            30-day money-back if your HRV doesn't improve
          </p>
        </div>
      </section>

      {/* ───── EMPATHY ───── */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="italic text-2xl sm:text-3xl font-light leading-tight text-white mb-6">
            "I sleep 8 hours and still wake up exhausted.
            <br />
            I used to jump out of bed."
          </p>
          <div className="text-slate-300 text-base sm:text-lg leading-relaxed space-y-1.5">
            <p className="font-semibold text-white text-lg sm:text-xl mb-4">Sound familiar?</p>
            <p>You've tried supplements.</p>
            <p>You've tried sleeping earlier.</p>
            <p>You've tried cutting caffeine.</p>
            <p className="pt-3 font-bold text-white">Nothing worked.</p>
            <p className="text-amber-300">Because none of it was built on YOUR data.</p>
          </div>
        </div>
      </section>

      {/* ───── REVEAL ───── */}
      <section className="px-5 py-12 sm:py-16" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-4">
            Here's what's actually happening
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-center leading-tight mb-8">
            Your HRV has been declining for years.
            <br />
            <span className="text-slate-400 font-bold">You just didn't know it.</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-6" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
              <Brain className="h-7 w-7 text-amber-400 mb-3" />
              <p className="text-white text-base sm:text-lg leading-relaxed">
                <span className="font-bold">HRV = How recovered your body actually is.</span>
                <br />
                Not how long you slept. <span className="text-amber-300">How deeply.</span>
              </p>
            </div>
            <div className="rounded-2xl p-6" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
              <TrendingUp className="h-7 w-7 text-amber-400 mb-3" />
              <p className="text-white text-base sm:text-lg leading-relaxed">
                When HRV is low, you wake up tired even after 8 hours.
                <br />
                <span className="font-bold text-amber-300">When HRV is high, you feel 25 again.</span>
              </p>
            </div>
          </div>

          <HRVGraph />

          <p className="text-center text-lg sm:text-xl mt-8 leading-relaxed">
            The average user improves HRV by{" "}
            <span className="font-black text-amber-400">+<CountUp to={38} suffix="%" /></span> in 30 days.
            <br />
            <span className="text-slate-400">Measured by the watch on your wrist. Not our claims. Your numbers.</span>
          </p>
        </div>
      </section>

      {/* ───── SOCIAL PROOF ───── */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-6">
            Real people. Real watches. Real numbers.
          </p>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Testimonial
              initial="R"
              accent="linear-gradient(135deg,#3b82f6,#1e40af)"
              name="Rajan Mehta, 44 · Delhi"
              badge="+41% HRV · Day 30"
              quote={`"By Day 12 my wife said I seemed younger.\nBy Day 28 I stopped needing coffee to function.\nMy watch showed 38ms → 54ms. I thought it was broken."`}
            />
            <Testimonial
              initial="P"
              accent="linear-gradient(135deg,#ec4899,#9d174d)"
              name="Priya Nair, 38 · Bangalore"
              badge="+29% HRV · Resting HR -8 bpm"
              quote={`"I was eating dinner at 9:30pm and destroying my sleep.\nChanged ONE thing on Day 3.\nHRV went up 19% the next week."`}
            />
            <Testimonial
              initial="V"
              accent="linear-gradient(135deg,#10b981,#065f46)"
              name="Vivek Sharma, 52 · Mumbai"
              badge="Wakes without alarm · Day 18"
              quote={`"I genuinely thought this was just aging.\nNera AI showed me it was 3 specific habits.\nFixed them. Felt 35 again."`}
            />
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-5xl font-black">
              Average HRV improvement:{" "}
              <span style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                +<CountUp to={38} suffix="%" />
              </span>
            </p>
            <p className="text-slate-400 mt-2">Measured. Not estimated.</p>
          </div>
        </div>
      </section>

      {/* ───── NERA AI ───── */}
      <section className="px-5 py-12 sm:py-16" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-4">Meet Nera AI</p>
          <h2 className="text-3xl sm:text-5xl font-black text-center leading-tight mb-8">
            The first AI that reads your watch
            <br />
            <span className="text-amber-300">and tells you WHY you're tired</span>
          </h2>

          <div className="space-y-5">
            {[
              {
                title: "Nera finds YOUR pattern.",
                quote: "Your HRV drops 14% every time you eat after 8pm. This happened 4 times last week.",
              },
              {
                title: "Nera predicts tomorrow.",
                quote: "That late dinner tonight? Your HRV will be 12% lower tomorrow morning. Here's what to do instead.",
              },
              {
                title: "Nera ranks what works FOR YOU.",
                quote: "For your body: dinner timing has 3× more impact than breathing. Other people get different results.",
              },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-bold text-lg sm:text-xl mb-3 text-white">{s.title}</p>
                <p className="text-amber-200/90 text-base sm:text-lg italic border-l-2 border-amber-400 pl-4 leading-relaxed">
                  "{s.quote}"
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-2xl sm:text-3xl font-black mt-8 leading-tight">
            Apple Health shows you numbers.
            <br />
            <span style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Nera tells you what they mean.
            </span>
          </p>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-4">
            30 Days. 5 Changes. Watch-Confirmed.
          </p>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {[
              { icon: <Watch className="h-8 w-8" />, n: "1", title: "Sync", body: "Connect your existing watch.\nApple Watch, Galaxy, anything.\nDay 0 HRV recorded." },
              { icon: <Brain className="h-8 w-8" />, n: "2", title: "Nera Diagnoses", body: "Nera reads 14 days of your data.\nFinds your top 3 energy killers.\nRanks which changes will move your HRV most." },
              { icon: <TrendingUp className="h-8 w-8" />, n: "3", title: "Watch It Rise", body: "Follow 5 protocols.\nWatch your HRV climb.\nDay 30: compare the numbers." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-6" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-amber-400">{s.icon}</div>
                  <div className="text-5xl font-black text-white/10">{s.n}</div>
                </div>
                <p className="font-black text-xl text-white mb-2">{s.title}</p>
                <p className="text-slate-400 whitespace-pre-line text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg sm:text-xl mt-6 font-medium">
            Most users see their first measurable HRV improvement{" "}
            <span className="text-amber-300 font-bold">within 72 hours.</span>
          </p>
        </div>
      </section>

      {/* ───── 5 PROTOCOLS ───── */}
      <section className="px-5 py-12 sm:py-16" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-6">
            The 5 things that change everything
          </p>
          <p className="text-center text-slate-300 text-lg leading-relaxed mb-8">
            The programme installs five habits — one at a time,
            <br />
            each one confirmed by your watch before the next begins.
          </p>
          <div className="space-y-3">
            {[
              "The 8pm dinner rule (your watch proves why in 24 hours)",
              "The 10-minute evening walk (drops glucose spike 30%)",
              "4-7-8 breathing (measurable HRV boost in minutes)",
              "The recovery meal plan (Nera generates it daily from your pantry)",
              "Morning HRV sync (30 seconds — tells you how today will feel)",
            ].map((t, i) => (
              <div key={i} className="rounded-xl p-4 flex items-start gap-4" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-amber-400 font-black text-2xl shrink-0 leading-none">{i + 1}</span>
                <p className="text-white text-base sm:text-lg leading-snug">{t}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-lg">
            Not generic advice.
            <br />
            <span className="text-amber-300 font-bold">Your watch confirms each one works for YOUR body.</span>
          </p>
        </div>
      </section>

      {/* ───── WHAT YOU GET ───── */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-6">
            Everything in ₹4,999
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "The Programme",
                items: [
                  "30-day structured plan (4 phases)",
                  "30 science lessons — 7 min/day",
                  "Nera AI daily analysis of YOUR watch",
                  "Daily meal plan for sleep recovery",
                  "Pantry scan — finds what's hurting your sleep",
                  "Food → HRV attribution (Nera connects the dots)",
                  "Personal rules Nera discovers about YOUR body",
                ],
              },
              {
                title: "The Access",
                items: [
                  "1 year Nera AI Premium (worth ₹3,588)",
                  "Works with ANY existing smartwatch",
                  "Android + iOS",
                  "Indian food database (3,000+ items)",
                  "Hindi + English",
                  "No device to buy or ship",
                  "Instant access after payment",
                ],
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl p-6 sm:p-7" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-black text-xl text-white mb-5 uppercase tracking-wider">{c.title}</p>
                <ul className="space-y-3">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-[15px] leading-snug">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-2xl sm:text-3xl font-black mt-6 leading-tight">
            No new device.
            <br />
            No subscription.
            <br />
            <span style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              One payment. One year.
            </span>
          </p>
        </div>
      </section>

      {/* ───── PRICE + CTA ───── */}
      <section className="px-5 py-12 sm:py-16" style={{ background: "linear-gradient(180deg,rgba(255,140,40,0.05),transparent)" }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-6"><Countdown /></div>

          <p className="text-slate-500 line-through text-2xl">₹7,999</p>
          <p className="font-black text-6xl sm:text-7xl my-2" style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ₹4,999
          </p>
          <p className="text-amber-300 text-sm font-medium mb-8">You save ₹3,000 this week</p>

          <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
            {[
              "Full 30-day programme + Nera AI",
              "Works with your existing watch — nothing to buy",
              "1 year app access",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-white text-base">{t}</span>
              </li>
            ))}
          </ul>

          <div
            className="rounded-2xl p-6 mb-7 text-left"
            style={{ background: "rgba(16,185,129,0.06)", border: "1.5px solid rgba(16,185,129,0.5)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <p className="font-black text-lg text-white">30-Day HRV Guarantee</p>
            </div>
            <p className="text-slate-300 text-[15px] leading-relaxed">
              If your HRV doesn't improve after completing the programme, we refund 100%. No questions. No forms. We're that confident in the science.
            </p>
          </div>

          <SunriseButton size="xl" onClick={buyNow}>
            Yes — Fix My Energy in 30 Days →
          </SunriseButton>
          <p className="text-slate-400 text-xs mt-3">Instant app access · Secure payment via Razorpay</p>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center w-full min-h-[52px] rounded-2xl border border-white/20 text-white font-medium hover:bg-white/5 transition"
          >
            Have questions? WhatsApp us →
          </a>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="px-5 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] text-center mb-6">Quick Answers</p>
          <div className="space-y-4">
            {[
              {
                q: "Do I need to buy a new device?",
                a: "No. Works with Apple Watch, Galaxy Watch, or the JStyle band you already have. Most customers don't buy anything extra.",
              },
              {
                q: "I've tried other sleep programmes. Why will this work?",
                a: "Because this uses YOUR watch data, not generic advice. Nera AI finds what's specifically killing YOUR energy. Everyone's body responds differently. We find yours.",
              },
              {
                q: "What if it doesn't work?",
                a: "Full refund. No questions. That's the 30-day HRV guarantee. Your HRV is measured by your watch — it either improves or it doesn't.",
              },
              {
                q: "How much time does it take?",
                a: "7 min reading + 30 sec watch sync + 10 min evening walk. Under 20 minutes a day.",
              },
            ].map((f) => (
              <div key={f.q} className="rounded-xl p-5" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="font-bold text-white text-base sm:text-lg mb-2">Q: {f.q}</p>
                <p className="text-slate-300 text-[15px] leading-relaxed">A: {f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="px-5 py-14 sm:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-3">Stop waking up tired.</h2>
          <p className="text-2xl sm:text-3xl font-bold mb-6" style={{ background: "linear-gradient(135deg,#FFD27A,#FF7A1A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Your 30 days start today.
          </p>
          <SunriseButton size="xl" onClick={buyNow}>
            Start Wake Up Like 25 — ₹4,999 →
          </SunriseButton>
          <p className="text-slate-400 text-xs sm:text-sm mt-4">
            30-day money-back · Instant access · Works with your watch
          </p>
        </div>
      </section>

      {/* ───── STICKY BAR ───── */}
      {stickyVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-3 py-3 backdrop-blur-lg border-t border-white/10"
          style={{ background: "rgba(8,15,30,0.92)" }}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">Wake Up Like 25</p>
              <p className="text-amber-300 text-base font-black">₹4,999</p>
            </div>
            <button
              onClick={buyNow}
              className="shrink-0 px-5 sm:px-7 py-3 rounded-xl font-black text-[#1a0f00] text-sm sm:text-base"
              style={{ background: "linear-gradient(135deg,#FFD27A,#FFA340,#FF7A1A)" }}
            >
              Buy Now →
            </button>
          </div>
        </motion.div>
      )}

      {/* ───── WHATSAPP FAB ───── */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(34,197,94,0.4)] hover:scale-105 transition"
        style={{ background: "#25D366" }}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
