import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ScanLine,
  Activity,
  Sparkles,
  TrendingUp,
  Camera,
  LineChart,
  Bell,
  HeartPulse,
  Check,
  Star,
  ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { WellnessReviewsSection } from "@/components/products/WellnessReviewsSection";
import { RecentPurchasePopup } from "@/components/products/RecentPurchasePopup";
import { AwardsTrustSection } from "@/components/AwardsTrustSection";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { TodayOnlyCouponCTA } from "@/components/sale";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useCartStore } from "@/stores/cartStore";
import { usePricing } from "@/hooks/useDevicePricing";
import { useSEO } from "@/hooks/useSEO";
import { shipDateLabel, deliveryDateLabel } from "@/lib/shipDate";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import easytouchDeviceImg from "@/assets/easytouch-wellness-device.png";
import appVariabilityImg from "@/assets/wellness-app-variability.png";
import appJourneyImg from "@/assets/wellness-app-journey.png";
import appHealthScoreImg from "@/assets/wellness-app-health-score.png";
import appMealIntelligenceImg from "@/assets/wellness-app-meal-intelligence.png";
import appSugarPatternImg from "@/assets/wellness-app-sugar-pattern.png";

const PRIMARY = "#7C4DFF";
const ACCENT = "#1A73E8";
const HEADING = "#1A1A2E";
const BODY = "#4A4A68";
const LIGHT_BG = "#F8F4FF";


const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function EasyTouchWellnessProduct() {
  const navigate = useNavigate();
  const { prices, fmt } = usePricing();
  const PRICE = prices.wellness_sub;
  const PRICE_FMT = fmt(PRICE);
  useSEO({
    title:
      "EasyTouch Wellness — Prick Less. Know More. | Light-Based Daily Diabetes Check-in | Agatsa One",
    description:
      "Daily diabetes check-in without finger pricks. Light through blood — reads body signals in 15 seconds. Snap meals, track trends, predict HbA1c.",
  });
  useMetaPixelViewContent("wellness_sub", "EasyTouch Wellness", PRICE);

  const buyNow = (qty: number = 1) => {
    try {
      (window as any).fbq?.("track", "AddToCart", {
        content_ids: ["wellness_sub"],
        content_name: "EasyTouch Wellness",
        content_type: "product",
        value: PRICE * qty,
        currency: "INR",
      });
    } catch {}
    navigate(`/checkout?sku=${Array(qty).fill("wellness_sub").join(",")}`);
  };

  const addToCart = (qty: number = 1) => {
    useCartStore.getState().addItem({
      productId: "wellness_sub",
      productName: "EasyTouch Wellness",
      variantTitle: "Default Title",
      price: PRICE,
      quantity: qty,
    });
  };

  return (
    <SiteLayout>
      <div style={{ color: BODY, fontFamily: "Inter, system-ui, sans-serif" }}>
        {/* SECTION 1 — HERO */}
        <section
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(180deg, #FFFFFF 0%, ${LIGHT_BG} 100%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp}>
              <nav
                className="text-sm mb-4"
                style={{ color: BODY }}
                aria-label="Breadcrumb"
              >
                <Link to="/devices" className="hover:underline">
                  Devices
                </Link>{" "}
                / <span style={{ color: HEADING }}>EasyTouch Wellness</span>
              </nav>

              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-white mb-5"
                style={{ backgroundColor: ACCENT }}
              >
                15,000+ users bought · Trusted across India
              </span>

              <h1
                className="font-black tracking-tight"
                style={{
                  color: HEADING,
                  fontSize: "clamp(40px, 6vw, 64px)",
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                Prick less.
                <br />
                Know more.
              </h1>

              <p
                className="mt-5 max-w-[500px]"
                style={{ color: BODY, fontSize: 18, lineHeight: 1.7 }}
              >
                Managing diabetes means pricking every day. It hurts. People
                skip it.
                <br />
                EasyTouch shines light through your finger — no needle, no blood
                — and reads how your body is doing in 15 seconds.
                <br />
                Use your glucometer when you need the exact number. Use
                EasyTouch for everything in between.
              </p>

              <div className="mt-8 flex flex-col gap-2 items-start">
                <OfferEndingTag />
                <button
                  onClick={() => buyNow()}
                  className="rounded-full px-8 py-4 font-bold text-lg text-white hover:opacity-90 transition"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {`Buy EasyTouch Wellness — ${PRICE_FMT}`}
                </button>
              </div>

              {/* Stock urgency + ship date */}
              <div className="mt-5">
                <StockUrgencyBar productKey="easytouch-wellness" />
                <div className="flex items-center gap-2 text-sm mt-2" style={{ color: BODY }}>
                  <span>📦</span>
                  <span>
                    <span className="font-semibold text-green-600">{shipDateLabel()}</span> · {deliveryDateLabel()}
                  </span>
                </div>
              </div>

              {/* Social proof row */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["#FFB199", "#B3D4FF", "#C4F0C5", "#FFE0A3"].map((c, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full border-2 border-white"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="text-sm" style={{ color: BODY }}>
                    <span className="font-bold" style={{ color: HEADING }}>15,000+</span> users bought
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: HEADING }}>4.6/5</span>
                  <span className="text-sm" style={{ color: BODY }}>· 834 reviews</span>
                </div>
              </div>

              {/* Trust badges row */}
              <div
                className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium"
                style={{ color: BODY }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: PRIMARY }} /> Free shipping
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: PRIMARY }} /> 7-day returns
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: PRIMARY }} /> 1-year warranty
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" style={{ color: PRIMARY }} /> Secure payment
                </span>
              </div>

              <div
                className="flex gap-x-6 gap-y-2 mt-5 text-sm font-medium flex-wrap"
                style={{ color: BODY }}
              >
                <span>No needle</span>
                <span>· Light-through-finger scan</span>
                <span>· 15 seconds</span>
                <span>· Works every day</span>
              </div>

              <p
                className="mt-4 text-xs italic"
                style={{ color: "#9E9E9E" }}
              >
                EasyTouch Wellness does NOT replace a glucometer. It is a daily
                companion device that uses optical light signals — not blood
                glucose measurement.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="relative">
              <div
                className="rounded-3xl overflow-hidden flex items-center justify-center aspect-[520/460]"
                style={{ backgroundColor: ACCENT }}
              >
                <img
                  src={easytouchDeviceImg}
                  alt="EasyTouch Wellness device"
                  className="w-full h-full object-contain p-8"
                  loading="eager"
                />
              </div>
              <div
                className="absolute top-4 right-4 bg-white rounded-2xl shadow-md px-4 py-2 font-bold"
                style={{ color: HEADING }}
              >
                {PRICE_FMT}
              </div>
              <div
                className="text-sm mt-3 flex items-center gap-2"
                style={{ color: BODY }}
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                4.6/5 · 834 reviews
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 — STATS BAR */}
        <section className="py-8" style={{ backgroundColor: HEADING }}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            {[
              { stat: "No needle", sub1: "Daily check-in", sub2: "No blood, no prep" },
              { stat: "15 sec", sub1: "Per reading", sub2: "Faster than any prick" },
              { stat: "98.56%", sub1: "Validation accuracy", sub2: "Clinically validated" },
              { stat: "8 vitals", sub1: "One scan", sub2: "Light-based · No strips" },
            ].map((s) => (
              <div key={s.stat} className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold">{s.stat}</div>
                <div className="text-sm font-medium" style={{ color: "#9E9E9E" }}>
                  {s.sub1}
                </div>
                <div className="text-xs" style={{ color: "#9E9E9E" }}>
                  {s.sub2}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3 — THE PROBLEM */}
        <section className="bg-white py-20">
          <motion.div
            {...fadeUp}
            className="max-w-3xl mx-auto px-6 text-center"
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: PRIMARY }}
            >
              The Real Problem
            </p>
            <h2
              className="font-bold"
              style={{ color: HEADING, fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.2 }}
            >
              Finger pricks hurt.
              <br />
              So people skip them.
              <br />
              And that's dangerous.
            </h2>
            <p
              className="mt-6 max-w-xl mx-auto"
              style={{ color: BODY, fontSize: 18, lineHeight: 1.8 }}
            >
              Every missed reading is a gap in your diabetes management. You're
              flying blind — not because you don't care, but because pricking
              3–4 times a day is just too painful to keep up. That's not your
              fault. That's a design problem.
            </p>

            <div
              className="rounded-2xl p-6 mt-8 max-w-sm mx-auto border"
              style={{ backgroundColor: "#FFF3F3", borderColor: "#FECACA" }}
            >
              <div
                className="font-black"
                style={{ color: "#DC2626", fontSize: 56, lineHeight: 1 }}
              >
                67%
              </div>
              <div
                className="font-medium mt-2"
                style={{ color: HEADING, fontSize: 16 }}
              >
                of diabetics don't test as often as their doctor recommends
              </div>
              <div className="text-sm mt-2" style={{ color: BODY }}>
                Primary reason cited: pain and inconvenience of pricking
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 4 — HOW IT WORKS */}
        <section className="py-20" style={{ backgroundColor: LIGHT_BG }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: PRIMARY }}
              >
                How EasyTouch Works
              </p>
              <h2
                className="font-extrabold"
                style={{ color: HEADING, fontSize: "clamp(28px, 4vw, 40px)" }}
              >
                Light goes in. Your body's story comes out.
              </h2>
              <p
                className="mt-4"
                style={{ color: BODY, fontSize: 18, lineHeight: 1.8 }}
              >
                EasyTouch shines multiple wavelengths of light through your
                fingertip — red light, infrared, and others. Each wavelength
                travels through your blood differently. When your sugar rises,
                when you're stressed, when your body is calm — your blood
                absorbs these light wavelengths in different ways. EasyTouch
                captures those changes. Nera AI reads what they mean.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6 mt-12">
              {[
                {
                  Icon: ScanLine,
                  title: "Light shines through your finger",
                  body:
                    "Multiple colours of light — red, infrared and more — pass through your fingertip for 15 seconds. No needle. No blood.",
                },
                {
                  Icon: HeartPulse,
                  title: "Your blood tells a story",
                  body:
                    "Every change in your body — sugar response, stress, circulation — affects how your blood absorbs each wavelength of light. The pattern coming back out is unique to your state right now.",
                },
                {
                  Icon: Activity,
                  title: "EasyTouch captures the pattern",
                  body:
                    "The sensor reads thousands of light signals in those 15 seconds and sends them to the Agatsa One app instantly.",
                },
                {
                  Icon: Sparkles,
                  title: "Nera AI learns YOUR normal",
                  body:
                    "After a few days, Nera AI knows what calm looks like for you specifically. Now when the pattern shifts, it tells you: your body is at ease today — or something is different.",
                },
              ].map(({ Icon, title, body }, i) => (
                <motion.div key={title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}>
                  <div className="bg-white rounded-2xl p-6 h-full shadow-sm">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${ACCENT}1A` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: ACCENT }} />
                    </div>
                    <h3
                      className="font-bold"
                      style={{ color: HEADING, fontSize: 17 }}
                    >
                      {title}
                    </h3>
                    <p className="text-sm mt-2" style={{ color: BODY }}>
                      {body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className="bg-white border-l-4 rounded-r-2xl p-5 max-w-2xl mx-auto mt-10 shadow-sm"
              style={{ borderColor: PRIMARY }}
            >
              <p style={{ color: HEADING, fontSize: 17, lineHeight: 1.6 }}>
                Your glucometer tells you your number right now.
                <br />
                <strong>EasyTouch tells you which direction your body is heading.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* INLINE CTA — after How It Works */}
        <InlineBuyCTA
          headline="Ready to stop the daily pricks?"
          sub="EasyTouch Wellness · 15-second check-in · No strips, no needles."
          price={PRICE}
          onBuy={() => buyNow()}
          onCart={() => addToCart()}
        />

        {/* SECTION 5 — DEVICE + APP ECOSYSTEM */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: PRIMARY }}
              >
                Device + App — The Complete Picture
              </p>
              <h2
                className="font-bold"
                style={{ color: HEADING, fontSize: "clamp(26px, 3.5vw, 38px)", lineHeight: 1.2 }}
              >
                EasyTouch is the device.
                <br />
                Agatsa One is where it comes alive.
              </h2>
              <p
                className="mt-4"
                style={{ color: BODY, fontSize: 18, lineHeight: 1.7 }}
              >
                Every scan syncs to the Agatsa One app. That's where Nera AI
                builds your full picture — connecting your readings, your
                meals, your patterns, and your progress.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
              {[
                {
                  Icon: ScanLine,
                  border: ACCENT,
                  chipBg: ACCENT,
                  chipColor: "#fff",
                  chip: "CORE FEATURE",
                  title: "15-second light scan",
                  body:
                    "Place finger. Light reads your blood. Get 8 vitals instantly — SpO2, heart rate, estimated BP, blood flow quality, and pulse pattern. No needle. No strip.",
                },
                {
                  Icon: Camera,
                  border: PRIMARY,
                  chipBg: PRIMARY,
                  chipColor: "#fff",
                  chip: "APP FEATURE",
                  title: "Snap your meal",
                  body:
                    "Photograph what you're about to eat. Nera AI identifies the food and notes it against your scan. Scan before eating, scan after — and see what that meal did to your body.",
                },
                {
                  Icon: TrendingUp,
                  border: "#22c55e",
                  chipBg: "#22c55e",
                  chipColor: "#fff",
                  chip: "APP FEATURE",
                  title: "30-day body response trend",
                  body:
                    "Every daily scan is plotted on a trend chart. Is your body getting calmer over time — or more reactive? See your direction, week by week.",
                },
                {
                  Icon: LineChart,
                  border: "#fb923c",
                  chipBg: "#fb923c",
                  chipColor: "#fff",
                  chip: "APP FEATURE",
                  title: "Predicted HbA1c",
                  body:
                    "Based on 30 days of daily scans, Nera AI estimates your likely HbA1c range. Know what's coming — before your lab test.",
                },
                {
                  Icon: Bell,
                  border: "#f87171",
                  chipBg: "#f87171",
                  chipColor: "#fff",
                  chip: "APP FEATURE",
                  title: "Nera AI daily insights",
                  body:
                    "When your body's pattern shifts — a spike in response, a drop in blood flow quality, a change in your oxygen level — Nera AI flags it immediately. Don't discover it at the next doctor visit.",
                },
                {
                  Icon: Sparkles,
                  border: "#c084fc",
                  chipBg: "#c084fc",
                  chipColor: "#fff",
                  chip: "APP FEATURE",
                  title: "Is your management working?",
                  body:
                    "Changed your diet? Started medication? EasyTouch + Nera AI show you week-by-week whether your body is actually responding — not just what your sugar is today.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl p-6 border-t-4"
                  style={{ borderTopColor: c.border, backgroundColor: LIGHT_BG }}
                >
                  <span
                    className="inline-block text-xs font-bold rounded-full px-3 py-1 mb-3"
                    style={{ backgroundColor: c.chipBg, color: c.chipColor }}
                  >
                    {c.chip}
                  </span>
                  <c.Icon className="w-6 h-6 mb-2" style={{ color: c.border }} />
                  <h3
                    className="font-bold"
                    style={{ color: HEADING, fontSize: 17 }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-sm mt-2" style={{ color: BODY }}>
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5.5 — INSIDE THE APP (real screenshots) */}
        <section className="py-20" style={{ backgroundColor: LIGHT_BG }}>
          <div className="max-w-6xl mx-auto px-6">
            <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: PRIMARY }}
              >
                Inside the app
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: HEADING }}
              >
                What you'll actually see, day after day
              </h2>
              <p className="text-base md:text-lg" style={{ color: BODY }}>
                Real screens from the Agatsa One app — not mockups. Three views that turn
                scattered readings into a story your body is telling you.
              </p>
            </motion.div>

            {/* Featured: Variability widget standalone (no phone frame) */}
            <motion.div
              {...fadeUp}
              className="max-w-md mx-auto mb-16 flex flex-col items-center"
            >
              <div
                className="w-full mb-5 rounded-3xl overflow-hidden"
                style={{
                  background: "#fff",
                  boxShadow: "0 25px 60px -20px rgba(255,90,95,0.35), 0 8px 20px -8px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={appVariabilityImg}
                  alt="High Variability — Metabolic variability widget from the Agatsa One app"
                  loading="lazy"
                  className="w-full h-auto block"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center" style={{ color: HEADING }}>
                Variability score — backed by JAMA 2006
              </h3>
              <p className="text-sm leading-relaxed text-center" style={{ color: BODY }}>
                See how steady — or jumpy — your metabolic load is. Swings hurt your body
                3× more than a steady high.
              </p>
            </motion.div>

            {/* Four full-app screens inside iPhone frames */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  img: appJourneyImg,
                  title: "Your Metabolic Journey",
                  body: "14-scan trend with your latest active reading — fills the gap between blood tests.",
                },
                {
                  img: appHealthScoreImg,
                  title: "Metabolic Health Score",
                  body: "A single 0–100 score from Day Portrait, Meal Recovery and Vascular signals.",
                },
                {
                  img: appMealIntelligenceImg,
                  title: "Meal Intelligence",
                  body: "Snap any meal — Nera AI predicts the sugar spike before you eat.",
                },
                {
                  img: appSugarPatternImg,
                  title: "Sugar Pattern History",
                  body: "Your own logged Glucometer values with zone and trend.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="relative mx-auto mb-5"
                    style={{
                      width: "100%",
                      maxWidth: 220,
                      aspectRatio: "9 / 19.5",
                      background: "#1A1A2E",
                      borderRadius: 34,
                      padding: 8,
                      boxShadow:
                        "0 25px 50px -12px rgba(26,26,46,0.45), inset 0 0 0 2px rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{ borderRadius: 26, background: "#fff" }}
                    >
                      <div
                        className="absolute left-1/2 -translate-x-1/2 z-10"
                        style={{
                          top: 7,
                          width: 70,
                          height: 20,
                          background: "#1A1A2E",
                          borderRadius: 999,
                        }}
                      />
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  <h3
                    className="text-base font-bold mb-1.5 text-center"
                    style={{ color: HEADING }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-center" style={{ color: BODY }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — COMPANION FRAMING */}
        <section className="py-20" style={{ backgroundColor: HEADING, color: "#fff" }}>
          <div className="max-w-3xl mx-auto px-6 text-center" style={{ color: "#fff" }}>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#B8A4FF" }}
            >
              Important
            </p>
            <h2
              className="font-bold"
              style={{ fontSize: "clamp(26px, 3.5vw, 36px)", lineHeight: 1.2, color: "#fff" }}
            >
              EasyTouch is not a glucometer.
              <br />
              It works alongside one.
            </h2>

            <div className="bg-white/10 rounded-3xl p-8 mt-10 grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="font-bold text-lg mb-4" style={{ color: "#fff" }}>
                  Your glucometer (keep using it):
                </h3>
                <ul className="space-y-3">
                  {[
                    "Exact blood glucose number",
                    "Insulin dosing decisions",
                    "Post-meal clinical confirmation",
                    "Required for medication management",
                  ].map((t) => (
                    <li key={t} className="flex gap-2" style={{ color: "#fff" }}>
                      <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#fff" }} />
                      <span className="text-sm" style={{ color: "#fff" }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3
                  className="font-bold text-lg mb-4"
                  style={{ color: "#B8A4FF" }}
                >
                  EasyTouch adds on top:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Daily check-in without a prick",
                    "Light-through-blood body signals",
                    "Snap meal + see body response",
                    "30-day trend + predicted HbA1c",
                    "Nera AI alerts when something shifts",
                  ].map((t) => (
                    <li key={t} className="flex gap-2" style={{ color: "#fff" }}>
                      <Check
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: "#B8A4FF" }}
                      />
                      <span className="text-sm" style={{ color: "#fff" }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="font-semibold text-lg mt-10" style={{ color: "#fff" }}>
              Together: fewer pricks. More data. Better control.
            </p>
          </div>
        </section>

        {/* INLINE CTA — after Companion Framing */}
        <InlineBuyCTA
          headline="Pair it with your glucometer today"
          sub="One-time purchase · 7-day return"
          price={PRICE}
          onBuy={() => buyNow()}
          onCart={() => addToCart()}
        />

        {/* SECTION 7 — SCIENCE */}
        <section className="py-20" style={{ backgroundColor: LIGHT_BG }}>
          <div className="max-w-4xl mx-auto px-6">
            <motion.div {...fadeUp} className="text-center">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: PRIMARY }}
              >
                The Science Behind It
              </p>
              <h2
                className="font-bold"
                style={{ color: HEADING, fontSize: "clamp(26px, 3.5vw, 36px)", lineHeight: 1.2 }}
              >
                Why light through your finger
                <br />
                tells you something real.
              </h2>
              <p
                className="mt-4 max-w-2xl mx-auto"
                style={{ color: BODY, fontSize: 17, lineHeight: 1.8 }}
              >
                The signals EasyTouch reads — beat-to-beat heart rhythm
                variation, blood flow changes, pulse wave shape — are not
                marketing claims. They are among the most studied biomarkers in
                diabetes research.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {[
                {
                  pill: "8,185 people · 8.3 years",
                  title:
                    "These signals predict diabetes before symptoms appear",
                  body:
                    "People whose heart rhythm variation was low were 60% more likely to develop diabetes over 8 years — even when their blood sugar was completely normal at the start.",
                  source: "Carnethon et al., Circulation 2003 · PMID 12695289",
                },
                {
                  pill: "25 studies · 2,932 people",
                  title:
                    "Diabetics show measurably different signals than healthy people",
                  body:
                    "A pooled analysis of 25 studies found diabetics consistently have weaker beat-to-beat heart rhythm variation compared to healthy adults — confirming these light-read signals carry real diagnostic information.",
                  source: "Benichou et al., PLOS ONE 2018 · PMID 29608603",
                },
                {
                  pill: "25,000 measurements",
                  title:
                    "Wearable light sensors track personal glucose deviations at 84–87% accuracy",
                  body:
                    "A study pairing smartwatch optical sensors with continuous glucose monitors showed the light signals could predict whether glucose was deviating from that person's personal normal — within the same individual.",
                  source: "Bent et al., NPJ Digital Medicine 2021 · PMID 34079049",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-white rounded-2xl p-6 shadow-sm flex flex-col"
                >
                  <span
                    className="inline-block self-start text-xs font-bold rounded-full px-3 py-1"
                    style={{ backgroundColor: "#ECFDF5", color: "#15803D" }}
                  >
                    {c.pill}
                  </span>
                  <h3
                    className="font-bold mt-3"
                    style={{ color: HEADING, fontSize: 15, lineHeight: 1.4 }}
                  >
                    {c.title}
                  </h3>
                  <p className="text-sm mt-2 flex-1" style={{ color: BODY }}>
                    {c.body}
                  </p>
                  <p
                    className="text-xs font-bold mt-3"
                    style={{ color: PRIMARY }}
                  >
                    {c.source}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8 — SOCIAL PROOF */}
        <section className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: PRIMARY }}
              >
                What Users Say
              </p>
              <h2
                className="font-bold"
                style={{ color: HEADING, fontSize: "clamp(24px, 3vw, 32px)" }}
              >
                Real diabetics. Real difference.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {[
                {
                  quote:
                    "I was pricking 3 times a day and dreading every one. Now I use EasyTouch in the morning and after lunch — I only prick when Nera AI flags something unusual. My doctor says I'm actually monitoring MORE consistently now.",
                  name: "Deepak M., Type 2 diabetic",
                  loc: "Hyderabad · Using EasyTouch for 4 months",
                },
                {
                  quote:
                    "The Snap feature changed how I think about food. I photograph my plate, scan after eating, and literally see what that meal did. Not a number — a pattern. It made me understand my body in a way years of pricking never did.",
                  name: "Priya S., pre-diabetic",
                  loc: "Pune · Using EasyTouch for 2 months",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-3xl p-8"
                  style={{ backgroundColor: LIGHT_BG }}
                >
                  <div
                    className="text-5xl leading-none mb-2"
                    style={{ color: PRIMARY }}
                  >
                    “
                  </div>
                  <p style={{ color: HEADING, fontSize: 16, lineHeight: 1.7 }}>
                    {t.quote}
                  </p>
                  <p
                    className="mt-5 font-semibold"
                    style={{ color: HEADING }}
                  >
                    {t.name}
                  </p>
                  <p className="text-sm" style={{ color: BODY }}>
                    {t.loc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8b — FULL CUSTOMER REVIEWS (stars, filters, verified) */}
        <WellnessReviewsSection />

        {/* SECTION 8c — AWARDS & RECOGNITION */}
        <AwardsTrustSection />

        {/* SECTION 9 — PRICING + IN THE BOX */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2
                className="font-bold"
                style={{ color: HEADING, fontSize: 28 }}
              >
                What's in the box
              </h2>
              <ul className="mt-6 space-y-3">
                {[
                  "EasyTouch Wellness device (1 unit)",
                  "2x AAA batteries",
                  "Quick start guide (English + Hindi)",
                  "7-day Nera AI subscription FREE on activation",
                  "Snap meal feature included in app",
                  "Predicted HbA1c included in app",
                ].map((b) => (
                  <li key={b} className="flex gap-3">
                    <Check
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: PRIMARY }}
                    />
                    <span style={{ color: BODY }}>{b}</span>
                  </li>
                ))}
              </ul>

            </div>

            <div
              className="rounded-3xl p-8 shadow-sm border"
              style={{
                backgroundColor: LIGHT_BG,
                borderColor: `${PRIMARY}33`,
              }}
            >
              <p className="font-semibold" style={{ color: HEADING }}>
                EasyTouch Wellness
              </p>
              <div
                className="font-black mt-2"
                style={{ color: PRIMARY, fontSize: 56, lineHeight: 1 }}
              >
                {PRICE_FMT}
              </div>

              <ul className="mt-5 space-y-2">
                {[
                  "7-day Nera AI subscription FREE on activation",
                  "Snap meal feature + HbA1c prediction",
                  "1-year manufacturer warranty",
                  "Free shipping pan-India",
                  "7-day return guarantee",
                ].map((b) => (
                  <li key={b} className="flex gap-2 text-sm">
                    <Check
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: PRIMARY }}
                    />
                    <span style={{ color: BODY }}>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6"><OfferEndingTag /></div>
              <button
                onClick={() => buyNow()}
                className="mt-3 w-full rounded-full py-4 font-bold text-white hover:opacity-90 transition"
                style={{ backgroundColor: PRIMARY }}
              >
                {`Buy Now — ${PRICE_FMT}`}
              </button>
              <TodayOnlyCouponCTA />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" style={{ backgroundColor: LIGHT_BG }}>
          <div className="max-w-2xl mx-auto px-6">
            <h2
              className="font-bold text-center mb-8"
              style={{ color: HEADING, fontSize: 28 }}
            >
              Frequently asked questions
            </h2>
            <Accordion type="single" collapsible className="bg-white rounded-2xl px-6">
              {[
                {
                  q: "Does EasyTouch measure blood sugar like a glucometer?",
                  a: "No — and this is important to understand. EasyTouch shines light through your fingertip and reads how your blood absorbs different wavelengths. These optical signals reflect your body's metabolic state — blood flow, heart rhythm pattern, oxygen levels — but they are NOT a blood glucose reading. Always use your glucometer for clinical glucose values and medication decisions. EasyTouch is a daily companion that gives you body signals without pricking.",
                },
                {
                  q: "Then what is the point — why buy it?",
                  a: "Most diabetics skip readings because pricking hurts. EasyTouch gives you a daily health check-in with no pain at all. Combined with the Snap meal feature and 30-day trend in the Agatsa One app, you get something your glucometer can't give: your body's direction over time. Is your management actually working? Are you getting better or worse between blood tests? That's what EasyTouch tells you.",
                },
                {
                  q: "How does the Snap feature work?",
                  a: "Open the Agatsa One app and photograph your meal before eating. Nera AI identifies the food automatically. Then scan with EasyTouch 30–60 minutes after eating. The app pairs your meal log with your body scan and shows you how your body responded to that specific meal over time — building a personal picture unique to you.",
                },
                {
                  q: "How accurate is it?",
                  a: "EasyTouch Wellness was validated at Medanta — The Medicity, Gurugram with 98.56% accuracy for SpO2, pulse rate, and optical monitoring parameters. The light-through-finger technology is the same optical sensing used in hospital-grade pulse oximeters.",
                },
                {
                  q: "What is the return policy?",
                  a: "Returns are accepted within 7 days of delivery for verified manufacturing defects only. The product must be returned in original packaging with all accessories and will undergo a technical inspection by our quality team. See our Return Policy page for full details.",
                },
              ].map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger
                    className="text-left"
                    style={{ color: HEADING }}
                  >
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent style={{ color: BODY, lineHeight: 1.7 }}>
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* RELATED DEVICES */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2
              className="font-bold mb-6"
              style={{ color: HEADING, fontSize: 20 }}
            >
              Complete your diabetes monitoring setup
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  name: "SanketLife ECG",
                  desc: "Add 12-lead cardiac monitoring alongside metabolic tracking",
                  link: "/devices/sanketlife-ecg",
                },
                {
                  name: "EasyTouch Rhythm Band",
                  desc: "Add 24/7 continuous monitoring between finger scans",
                  link: "/devices/rhythm-band",
                },
                {
                  name: "Agatsa Smart Scale",
                  desc: "Add body composition for the full metabolic picture",
                  link: "/devices/smart-scale",
                },
              ].map((p) => (
                <Link
                  key={p.name}
                  to={p.link}
                  className="rounded-2xl p-6 border hover:shadow-md transition group"
                  style={{ borderColor: `${PRIMARY}33`, backgroundColor: LIGHT_BG }}
                >
                  <h3 className="font-bold" style={{ color: HEADING }}>
                    {p.name}
                  </h3>
                  <p className="text-sm mt-2" style={{ color: BODY }}>
                    {p.desc}
                  </p>
                  <div
                    className="text-sm font-semibold mt-4 inline-flex items-center gap-1"
                    style={{ color: PRIMARY }}
                  >
                    Learn more{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      <RecentPurchasePopup />
      <StickyAddToCart
        productName="EasyTouch Wellness"
        price={PRICE_FMT}
        unitPrice={PRICE}
        onBuyNow={(qty) => buyNow(qty)}
        onAddToCart={(qty) => addToCart(qty)}
        themeColor="primary"
      />
    </SiteLayout>
  );
}

function InlineBuyCTA({
  headline,
  sub,
  price,
  onBuy,
  onCart,
}: {
  headline: string;
  sub: string;
  price: number;
  onBuy: () => void;
  onCart: () => void;
}) {
  return (
    <section className="py-12" style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)` }}>
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div style={{ color: "#fff" }}>
          <h3 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, color: "#fff", marginBottom: 6 }}>
            {headline}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14 }}>{sub}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-center">
          <div style={{ color: "#fff", textAlign: "right", marginRight: 4 }}>
            <div style={{ fontSize: 11, opacity: 0.85, lineHeight: 1 }}>
              <span style={{ textDecoration: "line-through", marginRight: 6 }}>₹5,999</span>
              <span style={{ background: "#fff", color: PRIMARY, padding: "1px 6px", borderRadius: 999, fontWeight: 700 }}>Offer Ending Soon</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, marginTop: 4 }}>
              ₹{price.toLocaleString("en-IN")}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onCart}
            style={{ background: "transparent", borderColor: "#fff", color: "#fff" }}
          >
            Add to Cart
          </Button>
          <Button
            onClick={onBuy}
            style={{ background: "#fff", color: PRIMARY, fontWeight: 700 }}
          >
            Buy Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function OfferEndingTag() {
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="line-through text-gray-500">₹5,999</span>
      <span
        className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white animate-pulse"
        style={{ background: "linear-gradient(90deg,#FF6B6B,#FF3D3D)" }}
      >
        Offer Ending Soon
      </span>
    </div>
  );
}
