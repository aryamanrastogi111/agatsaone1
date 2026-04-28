import { useState, lazy, Suspense } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Package, ShoppingCart, ChevronDown, Star, Microscope, Camera, ScanLine, Sparkles, TrendingUp, Fingerprint, Activity, Bell, Compass, Gauge, LineChart, MessageCircle } from "lucide-react";
import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { SiteLayout } from "@/components/SiteLayout";
import { EmiLine } from "@/components/EmiLine";
import { StrikePrice } from "@/components/StrikePrice";
import { shipDateLabel, deliveryDateLabel } from "@/lib/shipDate";

const WellnessTrustBar = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-muted-foreground mt-3">
    {["Free Shipping", "7-Day Return", "12-Month Warranty"].map((item) => (
      <span key={item}><span className="text-green-600">✓</span> {item}</span>
    ))}
  </div>
);
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AppStoreBadges } from "@/components/AppStoreBadges";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import easytouchDeviceImg from "@/assets/easytouch-wellness-device.png";

// Lazy-load heavy below-fold sections
const WellnessReviewsSection = lazy(() => import("@/components/products/WellnessReviewsSection").then(m => ({ default: m.WellnessReviewsSection })));
const AwardsTrustSection = lazy(() => import("@/components/AwardsTrustSection").then(m => ({ default: m.AwardsTrustSection })));
const TrustVideosSection = lazy(() => import("@/components/TrustVideosSection").then(m => ({ default: m.TrustVideosSection })));

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const zones = [
  { color: "#22c55e", name: "Calm", range: "0–25", meaning: "Your body processed that meal smoothly. Everything is in balance — like a normal fasting morning reading.", familiar: "Steady and stable" },
  { color: "#3b82f6", name: "Active", range: "26–50", meaning: "A mild response — your body is working as expected after eating. Nothing to worry about.", familiar: "Within a healthy range" },
  { color: "#f59e0b", name: "Elevated", range: "51–75", meaning: "Your body is working harder than usual to process what you ate. Pay attention to your next meal.", familiar: "Higher than your usual pattern" },
  { color: "#ef4444", name: "High", range: "76–100", meaning: "Your body is under metabolic stress right now. Time to act — rest, take a walk, or speak to your doctor.", familiar: "Needs immediate attention" },
];

const whoIsThisFor = [
  "You check your sugar regularly and want to reduce how often you prick your finger",
  "You have been told you are pre-diabetic and want to understand your body before it becomes a bigger problem",
  "You know your readings but never understand why they change",
  "You want to know which foods work for your body — not a generic diet plan",
  "A family member has sugar issues and you want to help them monitor without the daily needle routine",
  "You are health-conscious and want to track your body's response to food, stress, and sleep",
];

const boxItems = [
  "EasyTouch Wellness PPG device (plug-in, no charging needed)",
  "2× AAA batteries (included)",
  "Carry case",
  "Free Agatsa One app (Android + iOS)",
  "Nera AI Food Fingerprint engine (activates after first scan)",
  "1 year of Nera AI included free — no subscription needed",
];

// New: Food Fingerprint feature highlight cards
const fingerprintCards = [
  { icon: Activity, title: "Meal Impact Score", desc: "Every scan after a meal shows you exactly how many points above or below your fasting baseline you are. +12 pts after biryani. -3 pts after a salad. Now you know." },
  { icon: Fingerprint, title: "Food Fingerprint (Unique to You)", desc: "Built from your actual scans. Light, Balanced and Heavy meals — each gets its own average metabolic response. This is your body's unique dietary blueprint. Nobody else has your fingerprint." },
  { icon: Bell, title: "Smart Scan Nudge", desc: "The app tells you the perfect moment to scan after eating — so you never miss the window when your metabolic response is at its peak. No more forgetting." },
  { icon: Compass, title: "Nera AI Guide", desc: "Even on Day 1, Nera AI tells you exactly what to do next — snap a meal, scan now, or you're building toward your fingerprint. You're never lost." },
  { icon: Gauge, title: "Fasting Baseline", desc: "Before meals, scan fasting. This becomes your personal benchmark. Every meal response is measured against it. Your fasting score is your metabolic truth." },
  { icon: LineChart, title: "Trends Over Time", desc: "Week over week, see if your metabolic health is improving. Stress, sleep, and diet all show up in your scores. Nera AI connects the dots." },
];

// New: Food Fingerprint discovery quotes
const fingerprintTestimonials = [
  { quote: "I always thought fruit was the safest snack. My Food Fingerprint showed that mangoes push my score up almost as much as a full meal. Now I have them in the morning only.", name: "Priya R.", city: "Bangalore" },
  { quote: "My fasting score used to be 62. After 3 weeks of watching my meal responses, it's consistently above 74. I didn't change everything — just the 2 meals that were hitting me hardest.", name: "Vikram S.", city: "Mumbai" },
  { quote: "The scan nudge is what got me to actually use it. It reminds me 90 minutes after I log food. That one feature made the habit stick.", name: "Anita M.", city: "Delhi" },
];

const objections = [
  {
    q: "\"A light through my finger can tell me about my sugar? That sounds impossible.\"",
    a: "It does sound that way. Here is the honest explanation.\n\nDuring COVID, everyone used a pulse oximeter — the small device clipped to your finger that checked your oxygen without drawing blood. It works by shining a light through your fingertip and reading how your blood is absorbing that light.\n\nEasyTouch uses the same proven technology. When your body is under metabolic stress — after a heavy meal, after a spike, during fatigue — your blood flow patterns change in ways that light can detect.\n\nEasyTouch does not measure sugar molecules directly the way a strip test does. What it does is read how your body is responding — and Nera AI, trained on millions of Indian health readings, translates that into a zone that tells you whether your body is handling the situation well or struggling.\n\nNot magic. Science that has been in hospitals for decades — now brought home.",
  },
  {
    q: "\"My glucometer cost ₹800. This costs ₹9,999. Why would I spend this much?\"",
    a: "Your glucometer costs ₹800. But your strips cost ₹10–20 each.\n\nIf you test 3 times a day:\n• That is ₹1,200–1,800 every month\n• ₹15,000–21,000 every year\n• Just on strips. Year after year.\n\nEasyTouch has no strips. No consumables. One purchase — and you are done.\n\nFor most people who test regularly, EasyTouch pays for itself in 6 to 8 months. After that, you are saving money every single month.",
  },
  {
    q: "\"My doctor needs proper glucometer readings. This cannot replace that.\"",
    a: "You are right — and we are not asking you to replace your doctor's protocol.\n\nUse EasyTouch for your daily monitoring. Keep your traditional test for doctor visits or when something feels off.\n\nWhat most users find is that when they do visit their doctor, they bring a full PDF report — every reading, every zone, patterns over weeks — and their doctor gets more useful information than from a handful of manual readings.\n\nYou do not have to choose one or the other.",
  },
  {
    q: "\"Sounds too good to be true. What is the catch?\"",
    a: "Fair. Here is the honest version.\n\nThe first few readings are directional — not perfectly precise. EasyTouch gets better as it learns your personal pattern. Most users say it becomes consistent with their strip tests within 2–3 weeks of regular use.\n\nIt is not a medical diagnostic device. It is a wellness monitoring device that tells you which zone your body is in — and gets more accurate over time as it learns you specifically.\n\nWe back this with a 30-day return policy because we would rather you try it and decide for yourself than trust our word alone.",
  },
  {
    q: "\"I am not good with technology. Apps confuse me.\"",
    a: "The Agatsa One app was designed specifically for this.\n\nLarge text. One tap to start a reading. No charts to decode. No numbers to interpret. Nera AI speaks to you in plain sentences — like a knowledgeable friend, not a doctor's report.\n\nIf you can take a photo on your phone, you can use EasyTouch.",
  },
  {
    q: "\"I have been doing the same routine for 20 years. This feels like too big a change.\"",
    a: "You do not have to change everything at once.\n\nStart by taking one EasyTouch reading alongside your usual morning strip test. See if the zone matches what you would expect from that reading.\n\nDo that for a week. Let yourself build confidence. Most people naturally start reducing their pricks within 2 weeks — not because we told them to, but because they started trusting what they were seeing.\n\nYour pace. Your call.",
  },
  {
    q: "\"What if it breaks or the app stops working? Then I have wasted ₹9,999.\"",
    a: "• 1-year warranty on the device. If anything goes wrong in the first year, we replace it.\n• 30-day return policy. If you are not satisfied, send it back. No questions.\n• The app works for readings even without internet. Your data is backed up on our servers — you never lose your history even if you change phones.\n• We are an Indian company with real support. Not a marketplace seller. If something goes wrong, you are not on your own.",
  },
  {
    q: "\"My family will think I bought some gimmick.\"",
    a: "Show them the Nera AI report after your first week.\n\n4 lakh+ health readings tracked. Users across India. A PDF report that doctors are actually asking to see at appointments.\n\nThe best way to convince anyone is to use it for 7 days and show them the results yourself.",
  },
];

const faqs = [
  { q: "Is this a glucometer? Does it measure blood sugar directly?", a: "No — EasyTouch Wellness measures your body's metabolic response using photoplethysmography (PPG). It gives you a Metabolic Index — a composite of heart, oxygen, and stress signals — not a direct glucose number. It's designed to help you understand food's effect on your body over time, not replace a clinical glucometer." },
  { q: "How many scans before I see my Food Fingerprint?", a: "You need 5 linked meal scans (snap a meal, then scan within 90 minutes). Most users hit this in the first week. The app guides you to each one." },
  { q: "What if I already have diabetes?", a: "Many users with diabetes or pre-diabetes use EasyTouch Wellness to track their metabolic responses to different foods as part of their daily routine. It complements — not replaces — clinical monitoring. Always follow your doctor's advice for disease management." },
  { q: "Does it work without Nera AI?", a: "Basic scans work. The Food Fingerprint, Meal Impact Score, and Nera AI coaching are powered by Nera AI — and 1 year of Nera AI is included free with your kit. No subscription needed." },
  { q: "What's the return policy?", a: "30-day returns on unopened devices. If your device is defective, we replace it. Note: Nera AI activation is non-refundable once the app is set up and your first scan is completed." },
  { q: "Is this easy to use if I am not good with technology?", a: "Yes. Clip it to your finger. Open the app. That is it. The app is in simple English. Nera AI speaks in plain language. No settings to configure." },
];

const trustItems = ["Made in India", "1-year warranty", "30-day returns", "Free delivery", "Secure payment"];

export default function EasyTouchWellnessProduct() {
  const [adding, setAdding] = useState(false);
  const { prices, fmt } = usePricing();
  const wellnessPrice = prices.wellness_sub;
  useMetaPixelViewContent("EASYTOUCH_WELLNESS", "EasyTouch Wellness", wellnessPrice);

  const handleAddToCart = (qtyOrEvent?: number | React.MouseEvent) => {
    const qty = typeof qtyOrEvent === "number" ? qtyOrEvent : 1;
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["wellness_sub"], content_name: "EasyTouch Wellness", content_type: "product", value: wellnessPrice * qty, currency: "INR" }); } catch {}
    }
    useCartStore.getState().addItem({ productId: "wellness_sub", productName: "EasyTouch Wellness", variantTitle: "Default Title", price: wellnessPrice, quantity: qty });
    toast.success(qty > 1 ? `${qty} EasyTouch Wellness devices added to cart` : "EasyTouch Wellness added to cart");
  };

  const scrollToIntro = () => {
    document.getElementById("introduce-device")?.scrollIntoView({ behavior: "smooth" });
  };

  useSEO({ title: "EasyTouch Wellness — Personal Food Fingerprint & Metabolic Tracking | Agatsa One", description: `Discover how your body responds to every meal with EasyTouch Wellness and Nera AI. Build your Food Fingerprint in 5 scans. Metabolic Index, Meal Impact Score, and personalized AI coaching included. ${fmt(wellnessPrice)} with free delivery.` });

  return (
    <SiteLayout>
      {/* ── SECTION 1 — HERO (split layout) ── */}
      <section className="pt-8 pb-10 md:pt-14 md:pb-16 bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left — text */}
            <motion.div {...fadeUp} className="text-center md:text-left order-1 md:order-none">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tight">
                <span className="block">Your Body Responds Differently</span>
                <span className="block">to Every Meal.</span>
                <span className="block text-primary">Now You Can See How.</span>
              </h1>

              {/* Social proof — desktop only in hero text block */}
              <div className="hidden md:flex items-center gap-4 md:gap-6 text-sm text-muted-foreground mt-5 justify-start">
                <span className="flex items-center gap-1.5"><span className="text-primary font-bold text-base">20,000+</span> users</span>
                <span className="w-px h-4 bg-border" />
                <span className="flex items-center gap-1.5">⭐ <span className="font-bold text-foreground">4.6</span> rating</span>
                <span className="w-px h-4 bg-border" />
                <span className="flex items-center gap-1.5">🩸 <span className="font-semibold text-foreground">50% fewer pricks</span> in 30 days</span>
              </div>

              {/* Subheadline — desktop only here */}
              <p className="hidden md:block text-lg md:text-xl text-foreground font-semibold mt-6">
                EasyTouch Wellness + Nera AI builds your personal <span className="text-primary">Food Fingerprint</span> — so you stop guessing and start knowing exactly what food does to your body.
              </p>

              {/* CTA — hide "Show Me How" on mobile */}
              <div className="mt-8 hidden md:flex flex-col sm:flex-row items-center md:items-start gap-4">
                <Button onClick={scrollToIntro} size="lg" className="rounded-full px-10 py-5 text-lg shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
                  Show Me How <ArrowRight className="h-5 w-5 ml-1" />
                </Button>
              </div>
              {/* Hero trust bar */}
              <div className="hidden md:flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-4">
                <span>60-second scan</span>
                <span className="text-border">|</span>
                <span>Powered by Nera AI</span>
                <span className="text-border">|</span>
                <span>Ships in 2–3 days</span>
                <span className="text-border">|</span>
                <span>30-day returns</span>
              </div>
              <p className="hidden md:block mt-4 text-base font-black text-foreground tracking-tight">
                🛡️ 50% FEWER PRICKS IN 30 DAYS — OR MONEY BACK
              </p>
            </motion.div>

            {/* Mobile-only: subheadline + intro ABOVE image */}
            <div className="md:hidden text-center order-2 space-y-3">
              <p className="text-base text-foreground font-semibold">
                Your body responds differently to every meal.<br />Now you can see how.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                EasyTouch Wellness + Nera AI builds your personal <span className="text-primary font-semibold">Food Fingerprint</span> — so you stop guessing and start knowing exactly what food does to your body.
              </p>
              <p className="text-2xl text-foreground font-extrabold tracking-tight">
                Meet <span className="text-accent-foreground">EasyTouch Wellness</span>
              </p>
              <p className="text-base text-muted-foreground">
                60-second scan · No needle · No blood · No strip
              </p>
            </div>

            {/* Product image */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center md:justify-end order-3 md:order-none"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl blur-3xl scale-110" />
                <img
                  src={easytouchDeviceImg}
                  alt="EasyTouch Wellness device clipped to finger"
                  className="relative z-10 w-full max-w-[260px] md:max-w-sm drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Mobile-only: stats + guarantee BELOW image */}
            <div className="md:hidden text-center order-4 space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground justify-center">
                <span className="flex items-center gap-1.5"><span className="text-primary font-bold text-base">20,000+</span> users</span>
                <span className="w-px h-4 bg-border" />
                <span className="flex items-center gap-1.5">⭐ <span className="font-bold text-foreground">4.6</span> rating</span>
              </div>
              <p className="text-lg font-black text-foreground tracking-tight leading-tight">
                🛡️ 50% FEWER PRICKS IN 30 DAYS — OR MONEY BACK
              </p>
            </div>

            {/* Hero price + Add to Cart — below image on mobile */}
            <div className="text-center md:text-left order-5 md:order-none md:col-span-2 md:max-w-[50%]">
              <StrikePrice sku="wellness_sub" price={wellnessPrice} className="justify-center md:justify-start" />
              <div className="hidden md:block">
                <EmiLine price={wellnessPrice} />
              </div>
              <StockUrgencyBar productKey="easytouch-wellness" className="mt-3" />
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mt-2 justify-center md:justify-start">
                <span>📦</span>
                <span><span className="font-semibold text-green-600">{shipDateLabel()}</span> · {deliveryDateLabel()}</span>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={adding}
                  size="lg"
                  className="w-full sm:w-auto h-auto min-h-[3.25rem] rounded-full px-5 sm:px-8 py-3.5 sm:py-5 text-sm sm:text-base md:text-lg whitespace-normal text-center leading-tight shadow-[0_8px_32px_hsl(var(--primary)/0.4)]"
                >
                  <ShoppingCart className="h-5 w-5 mr-2 shrink-0" />
                  <span className="inline">Get My EasyTouch Kit — {fmt(wellnessPrice)}</span>
                  <ArrowRight className="h-4 w-4 ml-1 shrink-0" />
                </Button>
              </div>
              <div className="mt-3 inline-flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 max-w-full">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Included FREE</span>
                <span className="text-sm font-semibold text-foreground">Nera AI Premium — 1 year</span>
                <span className="text-xs text-muted-foreground">No subscription needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / AGITATION — redesigned for scannability */}
      <section className="py-14 md:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Headline */}
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">The Problem</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              You've Been Eating Blindfolded.
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              You eat <span className="text-foreground font-semibold">"healthy"</span> — salad, rice, fruit — and still feel sluggish, bloated, or drained. You don't know why.
            </p>
          </motion.div>

          {/* Key insight callout */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 max-w-3xl mx-auto bg-card border border-primary/20 rounded-2xl p-6 md:p-7 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Fingerprint className="h-5 w-5 text-primary" />
              </div>
              <p className="text-foreground text-base md:text-lg leading-relaxed">
                Metabolic response is <span className="font-semibold">personal</span>. The same bowl of rice that barely moves your friend's numbers can spike yours.
                <span className="block mt-2 text-muted-foreground text-sm md:text-base">Without data, you're guessing.</span>
              </p>
            </div>
          </motion.div>

          {/* 3 blind spots — visual grid */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: Gauge,
                title: "Which foods drain you?",
                desc: "You don't know which foods drain you vs. energize you.",
              },
              {
                icon: LineChart,
                title: "Light vs. Heavy?",
                desc: "You can't see the difference between a Light meal and a Heavy one — on your body.",
              },
              {
                icon: Compass,
                title: "Your baseline?",
                desc: "You have no idea what \"fasting baseline\" means for you specifically.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Resolution */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-5 py-2.5 shadow-md shadow-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm md:text-base font-bold">EasyTouch Wellness ends the guesswork.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: FOOD FINGERPRINT — 6 FEATURE CARDS */}
      <section className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Your Personal Food Fingerprint</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Six features. One unique blueprint of your body.</h2>
            <p className="text-muted-foreground mt-3">
              Every scan, meal snap, and trend powers the only thing that truly matters — your body's personal response to food.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {fingerprintCards.map((card, i) => (
              <motion.div key={card.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — INTRODUCE THE DEVICE ── */}
      <section id="introduce-device" className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">The technology behind EasyTouch</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10 grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: Microscope, title: "Same tech as hospitals", text: "Uses light sensors like the pulse oximeter from COVID — reads blood flow through your fingertip." },
              { icon: Camera, title: "Train it in days", text: "Snap your glucometer + meal photos for a few days. Nera AI learns YOUR body's patterns." },
              { icon: ScanLine, title: "Then just scan", text: "One touch, 15 seconds → Metabolic Score 0–100. No strip. No blood. Glucometer becomes optional." },
            ].map((card) => (
              <div key={card.title} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="flex justify-center">
                  <card.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-foreground font-bold text-lg mt-3">{card.title}</h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </motion.div>
          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-foreground font-semibold text-xl text-center mt-8">
            Not just a reading. An explanation.
          </motion.p>

        </div>
      </section>

      <Suspense fallback={<div className="py-12" />}><AwardsTrustSection /></Suspense>

      {/* ── SECTION 3 — HOW DOES IT WORK ── */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Simple. Personal. Proven.</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Snap. Scan. See your Food Fingerprint.</h2>
          </motion.div>
          <div className="mt-14 space-y-12">
            {[
              { n: "1", title: "Snap Your Meal", copy: "Log what you're eating in the Agatsa One app before you eat. Takes 5 seconds. No calorie counting. Just snap or tap." },
              { n: "2", title: "Scan After Eating", copy: "60–90 minutes later, press your fingertip to EasyTouch Wellness for 60 seconds. Nera AI reads your metabolic response — heart rate variability, oxygen dynamics, and stress signals — and converts it into your Metabolic Index score." },
              { n: "3", title: "See Your Food Fingerprint", copy: "After 5 linked scans, your personal Food Fingerprint unlocks. See exactly how Light, Balanced, and Heavy meals affect your body — averaged, trended, and compared to your fasting baseline. No two fingerprints are alike." },
            ].map((step, i) => (
              <motion.div key={step.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex gap-5 items-start">
                <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shrink-0">{step.n}</div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Step {step.n} — {step.title}</h3>
                  <p className="text-muted-foreground mt-1">{step.copy}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="mt-10 text-sm text-muted-foreground/70 text-center italic max-w-2xl mx-auto">
            The first few readings are directional. As you take more readings and occasionally confirm with a traditional test, EasyTouch learns your personal pattern and becomes more accurate over time.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 4 — METABOLIC LOAD ZONES ── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Metabolic Load Zones</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your Metabolic Score — one number, one zone.</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              Instead of staring at a number and wondering "is this good or bad?", EasyTouch places you in a zone you can instantly understand — whether you just ate or haven't eaten in hours.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {zones.map((z, i) => (
              <motion.div key={z.name} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: z.color }}>
                  <span className="text-white text-xs font-bold">{z.range}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{z.name}</h3>
                <p className="text-xs font-medium text-muted-foreground/60 mt-0.5">{z.familiar}</p>
                <p className="text-sm text-muted-foreground mt-2">{z.meaning}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-10 max-w-2xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground">
              EasyTouch knows whether you just ate or haven't eaten in hours — and adjusts what each zone means accordingly. A post-meal reading is judged differently than a fasting morning reading. The context is always built in.
            </p>
            <p className="text-foreground font-medium italic">
              If you've ever checked your sugar after a meal, you already know what these zones mean. The difference is — no needle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5 — SNAP YOUR MEAL ── */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">Know before you eat.</h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Camera, title: "Snap your plate", desc: "Open the app, take a photo of your meal." },
              { icon: Sparkles, title: "Get a prediction", desc: "Nera AI estimates your metabolic response — before you eat." },
              { icon: ScanLine, title: "Scan after 90 min", desc: "Take a quick EasyTouch reading to see how your body actually responded." },
              { icon: TrendingUp, title: "See your patterns", desc: "Learn which foods keep you Calm vs push you Elevated — for YOUR body." },
            ].map((step, i) => (
              <motion.div key={step.title} {...fadeUp} transition={{ duration: 0.5, delay: 0.1 * i }} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="mx-auto w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 text-center text-lg font-semibold text-foreground italic">
            Not a generic diet chart. Your chart.
          </motion.p>
        </div>
      </section>

      {/* ── MID-PAGE CTA ── */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-xl mx-auto px-4 text-center">
          <StrikePrice sku="wellness_sub" price={wellnessPrice} className="justify-center" />
          <EmiLine price={wellnessPrice} />
          <StockUrgencyBar productKey="easytouch-wellness" className="mt-3" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 justify-center">
            <span>📦</span>
            <span><span className="font-semibold text-green-600">{shipDateLabel()}</span> · {deliveryDateLabel()}</span>
          </div>
          <div className="flex items-center gap-1 mt-3 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-muted-foreground ml-1">4.6/5 (834 reviews)</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button onClick={handleAddToCart} disabled={adding} size="lg" className="rounded-full px-10 py-5 text-lg shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart — {fmt(wellnessPrice)}
            </Button>
          </div>
          <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">Included FREE</span>
            <span className="text-sm font-semibold text-foreground">Nera AI Premium — 1 year</span>
            <span className="text-xs text-muted-foreground">No subscription needed</span>
          </div>
          <WellnessTrustBar />
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Watch It In Action</h2>
            <p className="text-muted-foreground mt-2">Real people, real results</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <VideoCard video={{ id: "e9f0DR890zM", title: "India: The Diabetes Capital" }} />
            <VideoCard video={{ id: "ZkLv3wyVtfg", title: "Real Story: What the Numbers Showed" }} />
            <VideoCard video={{ id: "4nldXDM1w7w", title: "Heart Problems Don't Check Your Age" }} />
          </div>
          <YouTubeChannelLink />
        </div>
      </section>

      {/* ── SECTION 6 — NERA AI ── */}
      <section className="py-12 bg-gradient-to-br from-[#0D0D1A] to-[#1A1040]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Your health — explained in plain language, every single day.</h2>
            <p className="text-[#A0A0C0] text-lg mt-4 max-w-2xl mx-auto">
              Most health apps give you data. Nera AI gives you understanding.
            </p>
            <p className="text-[#A0A0C0] mt-2">
              After every reading, Nera explains what is happening and why — in simple sentences you don't need a medical degree to understand.
            </p>
          </motion.div>

          <div className="mt-12 space-y-5 max-w-2xl mx-auto">
            {[
              "\"Your morning reading is elevated — but this is likely the dawn effect. Your body naturally releases stored energy just before you wake up. This is common and not caused by anything you ate last night.\"",
              "\"Your score went into Elevated zone 2 hours after lunch. The roti portion may have been larger than your body handles easily. Try a smaller portion or a 10-minute walk after your next meal.\"",
              "\"Great — your last 5 readings have all been in Calm or Active zone. Your body is responding well this week.\"",
            ].map((msg, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <p className="text-white/90 text-sm leading-relaxed italic">{msg}</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp} className="mt-10 text-[#A0A0C0] text-center max-w-2xl mx-auto">
            Nera also sends you a weekly summary, tracks your patterns over time, and generates a PDF report you can share with your doctor — with all your readings, zones, and trends in one place.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 7 — WHO IS THIS FOR (persona chips) ── */}
      <section className="py-14 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">Is EasyTouch for you?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">This is for you if...</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="grid sm:grid-cols-2 gap-3">
            {whoIsThisFor.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 bg-primary/5 hover:bg-primary/10 border border-primary/15 hover:border-primary/40 rounded-full pl-4 pr-5 py-3 transition-all"
              >
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <p className="text-sm text-foreground leading-snug">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 8 — WHAT'S IN THE BOX (packing slip) ── */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Everything You Need to Start Knowing Your Body
          </motion.h2>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-card rounded-none border-y-2 border-dashed border-foreground/20 shadow-lg"
          >
            {/* ticket notches */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted/30" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted/30" />

            <div className="px-6 md:px-10 py-6 border-b border-dashed border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Agatsa Packing Slip</p>
                <p className="text-sm font-bold text-foreground mt-0.5">EasyTouch Wellness Kit</p>
              </div>
              <Package className="h-6 w-6 text-primary" />
            </div>

            <ul className="px-6 md:px-10 py-6 divide-y divide-dashed divide-border">
              {boxItems.map((item, i) => (
                <li key={item} className="flex items-start gap-3 py-3">
                  <span className="font-mono text-xs text-muted-foreground pt-1 w-8 shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                  <Check className="h-4 w-4 text-primary shrink-0 mt-1" strokeWidth={3} />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="px-6 md:px-10 py-4 border-t border-dashed border-border flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span>Sku · WELLNESS-SUB</span>
              <span>Qty · 1 Kit</span>
            </div>
          </motion.div>
          <motion.p {...fadeUp} className="mt-6 text-sm text-muted-foreground text-center">
            The device pairs with your phone in under 2 minutes. No technical setup.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 9 — TESTIMONIALS (staggered, with quote marks) ── */}
      <section className="py-14 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Users Discovered About Themselves</h2>
            <p className="text-muted-foreground mt-3">Real Food Fingerprint moments — straight from people who scanned, learned, and changed.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16">
            {fingerprintTestimonials.map((t, i) => {
              const offsets = ["md:mt-0 md:-rotate-[0.8deg]", "md:mt-8 md:rotate-0", "md:mt-2 md:rotate-[0.8deg]"];
              return (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative bg-card rounded-2xl border border-border p-7 pt-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all ${offsets[i]}`}
                >
                  <span
                    aria-hidden
                    className="absolute -top-6 left-5 font-serif text-primary text-[7rem] leading-none select-none"
                  >
                    &ldquo;
                  </span>
                  <p className="relative text-foreground/90 text-[15px] leading-relaxed">{t.quote}</p>
                  <div className="mt-5 pt-4 border-t border-dashed border-border flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t.city}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="py-12" />}><TrustVideosSection /></Suspense>

      {/* ── SECTION 9B — USER REVIEWS ── */}
      <Suspense fallback={<div className="py-12" />}><WellnessReviewsSection /></Suspense>

      {/* ── OBJECTION HANDLING — editorial Q&A ── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="mb-10 border-b border-border pb-6">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-2">Candid Q&amp;A</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">We know what you are thinking.<br/><span className="italic text-muted-foreground font-serif">Let us be honest.</span></h2>
            <p className="text-base text-muted-foreground mt-3">
              The real questions people ask before buying — answered without marketing spin.
            </p>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {objections.map((obj, i) => (
              <AccordionItem key={i} value={`obj-${i}`} className="border-b border-border last:border-b-0 data-[state=open]:bg-card/50 transition-colors">
                <AccordionTrigger className="text-left font-semibold text-base py-5 hover:no-underline group">
                  <div className="flex gap-4 items-start w-full pr-2">
                    <span className="font-serif text-2xl text-primary/70 leading-none shrink-0 w-7">Q.</span>
                    <span className="text-foreground group-hover:text-primary transition-colors">{obj.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pl-11 border-l-2 border-primary ml-[14px]">
                  <div className="flex gap-4 items-start">
                    <span className="font-serif text-2xl text-primary leading-none shrink-0 -ml-[30px]">A.</span>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{obj.a}</div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── GUARANTEE BANNER ── */}
      <section className="py-14 bg-gradient-to-b from-primary/10 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div {...fadeUp}>
            <div className="bg-card border-2 border-primary rounded-2xl p-10 md:p-14 shadow-[0_8px_40px_hsl(var(--primary)/0.2)]">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🛡️</span>
              </div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3">The Agatsa Guarantee</p>
              <h3 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
                50% Fewer Pricks.<br />
                <span className="text-primary">Or 100% Money Back.</span>
              </h3>
              <div className="w-16 h-1 bg-primary mx-auto my-6 rounded-full" />
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Use EasyTouch Wellness daily for 30 days. If it doesn't cut your needle pricks by half — we refund every single rupee. No questions. No fine print.
              </p>
              <p className="mt-6 text-sm font-semibold text-foreground/60 tracking-wide uppercase">That's how confident we are.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 10 — PRICE + CTA ── */}
      <section className="py-12 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your Food Fingerprint Won't Build Itself.</h2>
            <p className="text-muted-foreground text-base md:text-lg mt-5 max-w-xl mx-auto leading-relaxed">
              Every day you eat without data is a day your body is trying to tell you something — and you can't hear it. EasyTouch Wellness gives you ears.
            </p>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Most people who order see their first Meal Impact score within 24 hours of delivery. Your Food Fingerprint starts building from scan #1.
            </p>

            <div className="mt-8">
              <StrikePrice sku="wellness_sub" price={wellnessPrice} className="justify-center" />
              <EmiLine price={wellnessPrice} />
              <p className="text-muted-foreground mt-2 text-sm">Free delivery across India · 1-year warranty · 30-day return policy</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button onClick={handleAddToCart} disabled={adding} size="lg" className="rounded-full px-8 py-5 text-base md:text-lg shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Building My Food Fingerprint — {fmt(wellnessPrice)}
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground max-w-md mx-auto">
              1 year of Nera AI included free. Ships in 2–3 days. 30-day device returns on unopened units. Nera AI activation is non-refundable once first scan is completed.
            </p>

            <div className="mt-6">
              <AppStoreBadges className="justify-center" />
              <p className="text-xs text-muted-foreground mt-2">Download the App First (Free)</p>
            </div>

            <WellnessTrustBar />
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 11 — FAQ ── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Questions We Get Asked</motion.h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-xs text-muted-foreground mt-8 text-center italic">
            *EasyTouch Wellness measures bioelectrical metabolic markers. It is not a blood glucose monitor and is not intended to diagnose, treat, or monitor any medical condition.
          </p>
        </div>
      </section>

      <StickyAddToCart
        productName="EasyTouch Wellness"
        price={fmt(wellnessPrice)}
        unitPrice={wellnessPrice}
        onBuyNow={handleAddToCart}
        onAddToCart={handleAddToCart}
        themeColor="primary"
      />
    </SiteLayout>
  );
}
