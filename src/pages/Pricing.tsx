import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Minus, ChevronDown, ChevronUp, Mic, Gift } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useSEO } from "@/hooks/useSEO";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const plans = [
  {
    name: "Free",
    tagline: "For getting started",
    price: "₹0",
    period: "forever",
    priceColor: "text-[#1A1A2E]",
    badge: null as string | null,
    trialNote: null as string | null,
    belowPrice: null as string | null,
    belowPriceColor: "",
    strikePrice: null as string | null,
    features: [
      "Connect any Agatsa device",
      "Store and view all your readings",
      "Manual health log (metabolic wellness, BP, weight, SpO₂)",
      "Basic reading history — last 7 days",
      "10 minutes/month with Nera AI voice",
      "Nera AI analysis on readings",
      "Weekly AI health report",
      "Nera Health Score",
      "City rank vs peers",
      "Daily health nudges",
      "Care Programmes",
    ],
    cta: "Download Free",
    ctaStyle: "border-2 border-gray-200 text-gray-700 hover:border-[#7C4DFF]/60 hover:text-[#7C4DFF]",
    ctaNote: "No credit card required",
    ctaNoteColor: "text-gray-400",
    href: "/app",
    highlighted: false,
    cardClass: "",
    badgeStyle: "",
  },
  {
    name: "Nera AI Weekly",
    tagline: "Full AI health intelligence",
    price: "₹149",
    period: "/month",
    priceColor: "text-[#7C4DFF]",
    badge: "Most Popular",
    trialNote: "7-day free trial included — no card needed",
    belowPrice: null as string | null,
    belowPriceColor: "",
    strikePrice: null as string | null,
    features: [
      "Everything in Free, plus:",
      "Weekly AI health report from Nera — every Monday",
      "Nera Health Score (updated after every reading)",
      "Your city rank — how your vitals compare to peers your age",
      "Daily health nudges personalised to your readings",
      "All 5 Care Programmes (Cardiac, Hypertension, Diabetes, Weight, Corporate)",
      "Sleep intelligence — with Rhythm Band",
      "3-day recovery forecast — with Rhythm Band",
      "3 lifestyle correlations (sleep vs ECG, metabolic wellness vs activity, etc.) — with Rhythm Band",
      "30 minutes/month with Nera AI voice assistant",
      "Share readings with doctors",
    ],
    cta: "Start 7-Day Free Trial",
    ctaStyle: "bg-[#7C4DFF] text-white shadow-lg shadow-purple-200 hover:bg-purple-700",
    ctaNote: "Free for 7 days · then ₹149/month · cancel anytime",
    ctaNoteColor: "text-purple-500",
    href: "/app",
    highlighted: true,
    cardClass: "border-2 border-[#7C4DFF] shadow-2xl shadow-purple-100 md:scale-105 relative z-10",
    badgeStyle: "bg-[#7C4DFF] text-white",
  },
  {
    name: "Annual",
    tagline: "Same as Weekly — price locked for a year",
    price: "₹1,499",
    period: "/year",
    priceColor: "text-[#1A1A2E]",
    badge: "Save 16%",
    trialNote: null as string | null,
    belowPrice: "₹125/month — save ₹289 vs monthly",
    belowPriceColor: "text-green-600",
    strikePrice: "₹1,788/year",
    features: [
      "Everything in Nera AI Weekly",
      "Price locked for 12 months — no surprise increases",
      "2 months effectively free vs monthly billing",
      "Annual health summary PDF report in December",
      "7-day free trial included",
    ],
    cta: "Start 7-Day Free Trial",
    ctaStyle: "border-2 border-[#7C4DFF] text-[#7C4DFF] hover:bg-purple-50",
    ctaNote: "Free for 7 days · then ₹1,499/year · cancel anytime",
    ctaNoteColor: "text-gray-400",
    href: "/app",
    highlighted: false,
    cardClass: "",
    badgeStyle: "bg-green-500 text-white",
  },
  {
    name: "Nera AI Premium",
    tagline: "For rhythm band users who want everything",
    price: "₹299",
    period: "/month",
    priceColor: "text-[#1A1A2E]",
    badge: "Maximum Intelligence",
    trialNote: null as string | null,
    belowPrice: "Body Clock Report (₹499 value) included free",
    belowPriceColor: "text-purple-600",
    strikePrice: null as string | null,
    features: [
      "Everything in Nera AI Weekly, plus:",
      "Chronotype analysis — are you a morning lark or night owl? (after 30 band nights)",
      "Temperature cycle tracking — wrist temp patterns over time — with Rhythm Band",
      "Predictive health warnings — Nera flags anomalies before they become symptoms — with Rhythm Band",
      "Unlimited lifestyle correlations — every habit vs every vital — with Rhythm Band",
      "Body Clock Report included free (normally ₹499 one-time purchase)",
      "60 minutes/month with Nera AI voice assistant (2× Weekly)",
      "7-day free trial included",
    ],
    cta: "Start 7-Day Free Trial",
    ctaStyle: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
    ctaNote: "Free for 7 days · then ₹299/month · cancel anytime",
    ctaNoteColor: "text-gray-400",
    href: "/app",
    highlighted: false,
    cardClass: "",
    badgeStyle: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
  },
];

type CellValue = string | boolean;
interface CompRow { feature: string; free: CellValue; weekly: CellValue; annual: CellValue; premium: CellValue }

const compRows: CompRow[] = [
  { feature: "Device connection", free: "1 device", weekly: "Unlimited", annual: "Unlimited", premium: "Unlimited" },
  { feature: "Reading history", free: "7 days", weekly: "Unlimited", annual: "Unlimited", premium: "Unlimited" },
  { feature: "Manual health log", free: true, weekly: true, annual: true, premium: true },
  { feature: "Nera AI reading analysis", free: true, weekly: true, annual: true, premium: true },
  { feature: "Weekly AI health report", free: false, weekly: "Every Mon", annual: "Every Mon", premium: "Every Mon" },
  { feature: "Nera Health Score", free: false, weekly: "Live", annual: "Live", premium: "Live" },
  { feature: "City rank vs peers", free: false, weekly: true, annual: true, premium: true },
  { feature: "Daily health nudges", free: false, weekly: true, annual: true, premium: true },
  { feature: "Care Programmes", free: false, weekly: "All 5", annual: "All 5", premium: "All 5" },
  { feature: "Band sleep intelligence", free: false, weekly: true, annual: true, premium: true },
  { feature: "3-day recovery forecast", free: false, weekly: true, annual: true, premium: true },
  { feature: "Lifestyle correlations", free: false, weekly: "3", annual: "3", premium: "Unlimited" },
  { feature: "Nera voice assistant", free: "10 min/mo", weekly: "30 min/mo", annual: "30 min/mo", premium: "60 min/mo" },
  { feature: "Doctor sharing", free: false, weekly: true, annual: true, premium: true },
  { feature: "Chronotype analysis", free: false, weekly: false, annual: false, premium: "after 30 nights" },
  { feature: "Temp cycle tracking", free: false, weekly: false, annual: false, premium: true },
  { feature: "Predictive health warnings", free: false, weekly: false, annual: false, premium: true },
  { feature: "Body Clock Report", free: false, weekly: "₹499 add-on", annual: "₹499 add-on", premium: "Included free" },
  { feature: "Annual PDF report", free: false, weekly: false, annual: true, premium: true },
  { feature: "Price lock (12 months)", free: "—", weekly: false, annual: true, premium: false },
  { feature: "Price", free: "₹0", weekly: "₹149/mo", annual: "₹1,499/yr", premium: "₹299/mo" },
  { feature: "Free trial", free: "—", weekly: "7 days", annual: "7 days", premium: "7 days" },
];

const faqs = [
  { q: "Is the free plan actually free? No credit card?", a: "Yes — completely free, forever. No credit card, no trial expiry. You get device connection, reading storage, manual health logging, and 10 minutes with Nera AI voice every month. No strings." },
  { q: "What is the 7-day free trial?", a: "When you first subscribe to any paid plan, you get 7 days completely free. The trial is handled by Apple App Store or Google Play — we never see your card details. You can cancel before day 7 and pay nothing." },
  { q: "What happens if I cancel?", a: "Your subscription ends at the billing period. Your reading history, device connections, and health data stay in the app forever — on the free plan. You never lose your data." },
  { q: "Do I need a device to benefit from the paid plans?", a: "No. You can use Nera AI Weekly with manual health logs alone — no device needed. If you log your BP and metabolic wellness data manually, Nera AI still generates your weekly report, health score, and city rank. Devices make it more convenient and add more signals, but they're optional." },
  { q: "What's the difference between Weekly and Premium? Do I need Premium?", a: "Most users are best served by Nera AI Weekly (₹149/month). Premium is specifically for rhythm band users who want deeper sleep science — chronotype analysis, temperature cycle tracking, predictive warnings based on HRV + temp patterns. If you don't have the rhythm band, Weekly gives you everything meaningful." },
  { q: "What are 'lifestyle correlations'?", a: "Nera AI finds hidden patterns between your habits and your vitals. For example — 'Your ECG quality is 23% better on nights after 7,000+ steps' or 'Your fasting metabolic score is better on days you sleep before 11pm'. Weekly gives you 3 correlations. Premium gives you unlimited." },
  { q: "Is Agatsa One a medical device?", a: "The Agatsa One app is a wellness monitoring aid. The hardware devices (SanketLife ECG, EasyTouch Wellness) are CDSCO Class B certified medical devices. AI insights from Nera are for informational purposes and do not constitute a diagnosis. Always consult your doctor for medical decisions." },
];

const deviceBonuses = [
  { device: "SanketLife ECG (₹3,999)", bonus: "3 months Nera AI Premium free — ₹897 value", color: "bg-green-100 text-green-700" },
  { device: "EasyTouch Wellness (₹3,499)", bonus: "3 months Nera AI Weekly free — ₹447 value", color: "bg-purple-100 text-purple-700" },
  { device: "Rhythm Band (₹2,999)", bonus: "3 months Nera AI Weekly free — ₹447 value", color: "bg-purple-100 text-purple-700" },
  { device: "ECG + Band Bundle (₹7,499)", bonus: "3 months Nera AI Premium free — ₹897 value", color: "bg-green-100 text-green-700" },
];

function CellContent({ value }: { value: CellValue }) {
  if (value === true) return <Check className="h-4 w-4 text-green-500 mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-gray-300 mx-auto" />;
  if (value === "—") return <Minus className="h-4 w-4 text-gray-300 mx-auto" />;
  return <span>{value}</span>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4">
        <span className="font-semibold text-[16px] text-[#1A1A2E]">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-[15px] text-[#4A4A68] mt-3 leading-relaxed">
          {a}
        </motion.p>
      )}
    </div>
  );
}

export default function PricingPage() {
  useSEO({
    title: "Pricing — Agatsa One | Nera AI Health Plans from ₹0",
    description: "Start free. Get weekly AI health reports, Nera Health Score, and voice assistant. Plans from ₹149/month with 7-day free trial. No credit card required.",
  });

  return (
    <SiteLayout>
      {/* SECTION 1 — HEADER */}
      <section className="pt-8 pb-6">
        <motion.div {...fade()} className="max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-sm px-4 py-1.5 font-medium">
            ✓ Clinically validated · CDSCO Class B certified
          </span>
          <h1 className="mt-6 text-[36px] md:text-[52px] font-extrabold leading-[1.1] text-[#1A1A2E]">
            Your heart works 24/7.<br />Your health AI should too.
          </h1>
          <p className="mt-4 text-[18px] md:text-[20px] text-[#4A4A68] max-w-xl mx-auto">
            Start free. Get your first week of Nera AI included. No credit card required, no lock-ins, cancel anytime.
          </p>
          <p className="mt-6 text-sm font-medium text-[#4A4A68]">
            2.1 Lac+ users &nbsp;·&nbsp; 7-day free trial &nbsp;·&nbsp; Starts at ₹149/month &nbsp;·&nbsp; Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 — PLAN CARDS */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} {...fade(i * 0.1)} className={`rounded-3xl p-8 bg-white border border-gray-200 shadow-sm flex flex-col ${plan.cardClass}`}>
              {plan.badge && plan.highlighted && (
                <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full shadow ${plan.badgeStyle}`}>
                  {plan.badge}
                </span>
              )}
              {plan.badge && !plan.highlighted && (
                <span className={`inline-block self-start text-xs font-bold px-3 py-1 rounded-full mb-2 ${plan.badgeStyle}`}>
                  {plan.badge}
                </span>
              )}
              <h3 className={`font-bold text-[18px] ${plan.highlighted ? "text-[#7C4DFF]" : "text-[#1A1A2E]"}`}>{plan.name}</h3>
              <p className="text-sm text-[#4A4A68] mt-1">{plan.tagline}</p>
              <div className="mt-6">
                <span className={`text-[48px] font-extrabold leading-none ${plan.priceColor}`}>{plan.price}</span>
                <span className="text-[16px] text-[#4A4A68] ml-1">{plan.period}</span>
              </div>
              {plan.trialNote && <p className="text-sm text-green-600 font-medium mt-1">{plan.trialNote}</p>}
              {plan.belowPrice && <p className={`text-sm font-medium mt-1 ${plan.belowPriceColor || "text-green-600"}`}>{plan.belowPrice}</p>}
              {plan.strikePrice && <p className="text-sm text-gray-400 line-through mt-0.5">{plan.strikePrice}</p>}
              <div className="border-t border-gray-100 my-6" />
              <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-400">What's included</p>
              <ul className="mt-3 space-y-3 text-sm text-[#4A4A68] flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[#7C4DFF] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link to={plan.href} className={`block w-full text-center rounded-full py-3.5 font-semibold text-base transition-colors ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
                <p className={`text-xs text-center mt-2 ${plan.ctaNoteColor || "text-gray-400"}`}>{plan.ctaNote}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — DEVICE BONUS BANNER */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <motion.div {...fade()} className="rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-8">
          <div className="lg:flex lg:gap-10 lg:items-start">
            <div className="lg:w-1/2">
              <h3 className="flex items-center gap-2 font-bold text-[20px] text-[#1A1A2E]">
                <Gift className="h-5 w-5 text-[#7C4DFF]" />
                Buy a device. Get 3 months free.
              </h3>
              <p className="text-[15px] text-[#4A4A68] mt-2">
                Every Agatsa device purchase includes a free Nera AI subscription — no code needed. Automatically applied after your purchase is verified.
              </p>
            </div>
            <div className="mt-6 lg:mt-0 lg:w-1/2 space-y-3">
              {deviceBonuses.map((d) => (
                <div key={d.device} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm font-medium text-[#1A1A2E] whitespace-nowrap">{d.device}</span>
                  <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${d.color}`}>{d.bonus}</span>
                </div>
              ))}
              <Link to="/devices" className="inline-block text-sm font-semibold text-[#7C4DFF] mt-2 hover:underline">
                Browse devices →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 4 — COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <motion.div {...fade()} className="text-center">
          <h2 className="font-bold text-[32px] text-[#1A1A2E]">Everything, side by side.</h2>
          <p className="text-[18px] text-[#4A4A68] mt-2">No asterisks. No hidden fees.</p>
        </motion.div>
        <div className="mt-10 rounded-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-[#1A1A2E]">Feature</th>
                  <th className="px-4 py-3 font-semibold text-[#1A1A2E] text-center">Free</th>
                  <th className="px-4 py-3 font-semibold text-[#7C4DFF] text-center bg-purple-50">Nera AI Weekly</th>
                  <th className="px-4 py-3 font-semibold text-[#1A1A2E] text-center">Annual</th>
                  <th className="px-4 py-3 font-semibold text-[#1A1A2E] text-center">Premium</th>
                </tr>
              </thead>
              <tbody>
                {compRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}>
                    <td className="px-4 py-3 font-medium text-[#1A1A2E] whitespace-nowrap">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-[#4A4A68]"><CellContent value={row.free} /></td>
                    <td className="px-4 py-3 text-center text-[#4A4A68] bg-purple-50/50"><CellContent value={row.weekly} /></td>
                    <td className="px-4 py-3 text-center text-[#4A4A68]"><CellContent value={row.annual} /></td>
                    <td className="px-4 py-3 text-center text-[#4A4A68]"><CellContent value={row.premium} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5 — VOICE ASSISTANT CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <motion.div {...fade()} className="rounded-3xl bg-gradient-to-r from-[#1A1A2E] to-[#2D1B69] p-8 md:p-10 text-white lg:flex lg:gap-10 lg:items-center overflow-hidden relative">
          <div className="lg:w-1/2 relative z-10">
            <span className="inline-block bg-purple-500/30 text-purple-200 rounded-full text-xs px-3 py-1 font-medium">POWERED BY NERA AI</span>
            <h2 className="mt-3 font-extrabold text-[28px] md:text-[32px] leading-tight">
              Talk to your health AI.<br />Not a chatbot.
            </h2>
            <p className="mt-4 text-white/70 text-[16px] max-w-md leading-relaxed">
              Nera voice understands your readings, your history, and your health goals. Ask it anything — "Is my heart rate normal for my age?", "Why is my metabolic load high after lunch?", "Should I be worried about last night's ECG?". Real answers. Real time.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/10 text-sm text-white/80">10 min free</span>
              <span className="px-3 py-1.5 rounded-full bg-purple-500/40 text-sm text-purple-200">30 min — Weekly</span>
              <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/60 to-indigo-500/60 text-sm text-white">60 min — Premium</span>
            </div>
            <Link to="/app" className="inline-block mt-4 text-purple-300 font-semibold underline underline-offset-2 text-sm hover:text-purple-200">
              Need more minutes? Top up anytime →
            </Link>
          </div>
          <div className="hidden lg:block lg:w-1/2 relative">
            <Mic className="absolute -top-8 right-0 h-40 w-40 text-white/5" />
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm mt-6 lg:mt-0">
              <p className="italic text-white/80 text-[15px] leading-relaxed">
                "I asked Nera why my BP spikes every Tuesday and it figured out it's my Monday-night work calls. No doctor would have caught that."
              </p>
              <p className="mt-4 text-sm text-white/60">— Priya S., Mumbai</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 6 — FAQ */}
      <section className="max-w-3xl mx-auto px-4 mt-20">
        <motion.div {...fade()} className="text-center">
          <h2 className="font-bold text-[32px] text-[#1A1A2E]">Questions we actually get asked.</h2>
        </motion.div>
        <div className="mt-8">
          {faqs.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* SECTION 7 — BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-4 mt-20 mb-20">
        <motion.div {...fade()} className="bg-[#F8F4FF] rounded-3xl p-10 md:p-16 text-center">
          <h2 className="font-extrabold text-[32px] md:text-[40px] text-[#1A1A2E]">Your first week is free.</h2>
          <p className="text-[18px] text-[#4A4A68] mt-3 max-w-xl mx-auto">
            Download Agatsa One. Connect your device. Let Nera AI start building your health picture — today.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/app" className="bg-[#7C4DFF] text-white rounded-full px-10 py-4 font-bold hover:bg-purple-700 transition-colors">
              Download Free — Start Today
            </Link>
            <Link to="/devices" className="border-2 border-[#7C4DFF] text-[#7C4DFF] rounded-full px-10 py-4 font-semibold hover:bg-purple-50 transition-colors">
              Browse Devices
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free download · iOS 14+ · Android 8+ · No credit card for free plan</p>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
