import { useState, lazy, Suspense } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Package, ShoppingCart, ChevronDown, Star, Microscope, Camera, ScanLine, Sparkles, TrendingUp, Fingerprint, Activity, Bell, Compass, Gauge, LineChart, HeartPulse, Brain, Salad, Users, ShieldCheck, Zap } from "lucide-react";
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
  { color: "#22c55e", name: "Calm", range: "0–25", meaning: "Your body is relaxed. Heart rhythm is steady, blood flow is smooth — a healthy resting state.", familiar: "Steady and stable" },
  { color: "#3b82f6", name: "Active", range: "26–50", meaning: "A mild load — could be after food, light activity, or normal daily stress. Your body is handling it well, and your heart rhythm and blood flow are responding the way they should.", familiar: "Within a healthy range" },
  { color: "#f59e0b", name: "Elevated", range: "51–75", meaning: "Your body is working harder than usual. Could be a heavy meal, poor sleep, or building stress. A sign your body is taking longer than usual to settle after what you ate. Worth noting.", familiar: "Higher than your usual pattern" },
  { color: "#ef4444", name: "High", range: "76–100", meaning: "Your body is under real strain right now — your post-meal recovery and pulse signals are working overtime. Time to slow down, breathe, walk it off — or check in with your doctor.", familiar: "Needs attention" },
];

const whoIsThisFor = [
  "You want an early read on your metabolic health — long before regular tests show anything wrong",
  "You have been told you are pre-diabetic and want to understand what your body is really doing day to day",
  "Your sugar readings keep changing and you can't figure out why",
  "You want to see how food, sleep, and stress are silently shaping your body — not just on the scale, but inside it",
  "A family member has sugar or heart issues and you want to track your own risk early",
  "You are health-conscious and want one simple daily score that tells you how your body is coping",
];

const boxItems = [
  "EasyTouch Wellness PPG device (plug-in, no charging needed)",
  "2× AAA batteries (included)",
  "Carry case",
  "Free Agatsa One app (Android + iOS)",
  "Nera AI Body Signal engine (activates after first scan)",
  "1 year of Nera AI included free — no subscription needed",
];

// Body Signal feature highlight cards
const fingerprintCards = [
  { icon: Activity, title: "Daily Load Score", desc: "Every scan shows how much strain your body is carrying right now — after a meal, after a tough day, or first thing in the morning. It captures how your body is reacting, not just to food, but to sleep, stress and activity. One number. Easy to read." },
  { icon: Fingerprint, title: "Your Body Pattern", desc: "Built from your own scans over time. The device learns how your heart rhythm and blood flow behave — and flags when something shifts. Because two people can eat the same meal and react completely differently inside. No two patterns are the same." },
  { icon: Bell, title: "Smart Reminders", desc: "The app nudges you to scan at the right moments — morning, after a meal, before bed — so you build a real picture of your day, not random snapshots. Same meal, different day — your body's response can change, and the right scan timing reveals it." },
  { icon: Compass, title: "Nera AI Guide", desc: "From Day 1, Nera AI tells you what to do next — when to scan, what your number means, and what's quietly changing. You're never guessing." },
  { icon: Gauge, title: "Resting Baseline", desc: "Your morning fasting scans become your personal benchmark. Every later reading is compared to it — so you can see when your body is calm and when it's under load." },
  { icon: LineChart, title: "Trends Over Time", desc: "Week over week, see if your body is getting calmer or more stressed. Sleep, food, and stress all leave a mark on your score — and your real health signal is the pattern over weeks, not a single meal. Nera AI connects the dots." },
];

// Body Signal discovery quotes
const fingerprintTestimonials = [
  { quote: "I always thought I was 'fine' between checkups. My morning scans showed my body was running hot for weeks. I slowed down, slept more — and the number came back down.", name: "Priya R.", city: "Bangalore" },
  { quote: "My resting score used to sit at 62. After 3 weeks of small changes — sleep, walks, lighter dinners — it's consistently above 74. I didn't change what I ate as much as I learned how my body was reacting to it. I just listened to the signals.", name: "Vikram S.", city: "Mumbai" },
  { quote: "The reminders are what got me to actually use it. It nudges me morning and evening. That one habit made everything else click.", name: "Anita M.", city: "Delhi" },
];

const objections = [
  {
    q: "\"A light through my finger can tell me about my sugar? That sounds impossible.\"",
    a: "It does sound that way. Here is the honest explanation.\n\nDuring COVID, everyone used a pulse oximeter — the small device clipped to your finger that checked your oxygen without drawing blood. It works by shining a light through your fingertip and reading how your blood is moving and absorbing that light.\n\nEasyTouch uses the same proven technology — but it reads much more. It studies your heart rhythm, the shape of your pulse, and how well your tiny blood vessels are pushing blood through. These are the very signals that quietly change when your body is under metabolic strain — sometimes years before a sugar test ever shows a problem.\n\nEasyTouch does not measure sugar molecules the way a strip test does. It reads how your body is coping — your heart rhythm, your blood flow, and your internal stress response after a meal. Nera AI, trained on millions of Indian health readings, turns those signals into one easy score that tells you whether your body is calm or under load.\n\nNot magic. Hospital-grade science — now in your hand.",
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
  { q: "Is this a glucometer? Does it measure blood sugar directly?", a: "No — EasyTouch Wellness measures your body's metabolic response using photoplethysmography (PPG). It gives you a Metabolic Index — a composite of heart, oxygen, and stress signals — not a direct sugar number. It's designed to help you understand how your body responds to food, sleep and stress over time, not replace a clinical glucometer." },
  { q: "How many scans before I see my Food Fingerprint?", a: "You need 5 linked meal scans (snap a meal, then scan within 90 minutes). Most users hit this in the first week. The app guides you to each one." },
  { q: "What if I already have diabetes?", a: "Many users with diabetes or pre-diabetes use EasyTouch Wellness to track how their body responds to different foods — and to daily stress and sleep — as part of their daily routine. It complements — not replaces — clinical monitoring. Always follow your doctor's advice for disease management." },
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

      {/* WHY EVERY PERSON NEEDS THIS — problem it solves */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80">
        {/* Decorative glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-5 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <p className="text-xs font-bold uppercase tracking-widest text-white">Why Everyone Needs This</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
              The silent problem hiding in <span className="italic underline decoration-white/40 decoration-4 underline-offset-4">everyday meals</span>
            </h2>
            <p className="mt-5 text-primary-foreground/90 text-lg md:text-xl leading-relaxed">
              <span className="font-bold text-white">1 in 4 Indian adults</span> already lives with a metabolic issue — and most don't know until it's serious. EasyTouch Wellness catches the early signals, every single day.
            </p>
          </motion.div>

          {/* Problem → Solution rows */}
          <div className="mt-14 grid md:grid-cols-2 gap-5">
            {[
              {
                icon: HeartPulse,
                problem: "Sudden energy crashes after meals",
                solution: "See exactly which foods spike and crash you — so you can swap them out.",
              },
              {
                icon: Brain,
                problem: "Brain fog, mood swings, poor focus",
                solution: "Track how your meals affect your mental clarity through metabolic patterns.",
              },
              {
                icon: Salad,
                problem: "Eating 'healthy' but not feeling better",
                solution: "Discover that 'healthy' is personal — your body reacts differently than others.",
              },
              {
                icon: TrendingUp,
                problem: "Weight that won't move despite effort",
                solution: "Identify hidden metabolic load that quietly stalls your fitness goals.",
              },
              {
                icon: ShieldCheck,
                problem: "Family history of diabetes or heart issues",
                solution: "Build an early-warning system years before standard tests catch a problem.",
              },
              {
                icon: Zap,
                problem: "No clear way to measure 'wellness'",
                solution: "Get a single Metabolic Score 0–100 that tells you, daily, where you stand.",
              },
            ].map((row, i) => (
              <motion.div
                key={row.problem}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group bg-white/95 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <row.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-destructive mb-1">⚠ The Problem</p>
                    <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">{row.problem}</h3>
                    <div className="my-3 h-px bg-gradient-to-r from-primary/40 to-transparent" />
                    <div className="flex items-center gap-2 text-primary mb-1.5">
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest">What EasyTouch Does</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{row.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Who it's for */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 bg-white rounded-3xl p-7 md:p-9 shadow-2xl border-4 border-white/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">Who needs this?</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {[
                "Anyone over 30 who wants to age well",
                "Working professionals battling fatigue",
                "Anyone with a family history of diabetes",
                "Fitness enthusiasts optimizing nutrition",
                "Parents who want to model healthy habits",
                "Anyone tired of generic diet advice",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                  </div>
                  <span className="text-sm md:text-base text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-6 border-t border-border text-center">
              <p className="text-base md:text-lg text-foreground">
                In short — <span className="font-extrabold text-primary">everyone who eats</span>.
              </p>
              <p className="text-sm text-muted-foreground mt-1">Because what you eat today shapes how you feel tomorrow.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* APP IN ACTION — Section A: Metabolic Health Score + Daily Snapshot */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">See It In The App</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Wake up to a <span className="text-primary">single number</span> that tells you exactly where you stand.
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              No charts to decode. No reports to interpret. Just one Metabolic Health Score, every morning — backed by 5 deeper signals.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl rounded-full" />
              <div className="relative bg-white rounded-[2.5rem] border-8 border-foreground/90 shadow-2xl overflow-hidden">
                <div className="bg-foreground/90 h-6 flex items-center justify-center">
                  <div className="w-20 h-1.5 bg-foreground/40 rounded-full" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-slate-900">Your Vitals</span>
                      <span className="text-xs text-slate-400">just now</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-2 text-center">
                        <div className="text-blue-600 font-bold text-sm">Active</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">Sugar Zone</div>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-2 text-center">
                        <div className="text-rose-600 font-bold text-base">86</div>
                        <div className="text-[9px] text-slate-500">Heart Rate</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-2 text-center">
                        <div className="text-amber-600 font-bold text-sm">126/86</div>
                        <div className="text-[9px] text-slate-500">BP</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-50/40 border-2 border-emerald-200 rounded-2xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-base">Metabolic Health Score</div>
                        <div className="text-xs text-slate-500">3 of 5 signals active</div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-extrabold text-emerald-500 leading-none">64</div>
                        <div className="text-emerald-600 font-bold text-sm mt-0.5">Fair</div>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <div className="h-1.5 flex-1 bg-emerald-400 rounded-full" />
                      <div className="h-1.5 flex-1 bg-emerald-400 rounded-full" />
                      <div className="h-1.5 flex-1 bg-emerald-400 rounded-full" />
                      <div className="h-1.5 flex-1 bg-slate-200 rounded-full" />
                      <div className="h-1.5 flex-1 bg-slate-200 rounded-full" />
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {[
                        { label: "Day Portrait", val: "75", w: "w-3/4", color: "bg-emerald-400", text: "text-emerald-500", muted: false },
                        { label: "Autonomic Fitness", val: "—", w: "w-0", color: "bg-slate-300", text: "text-slate-400", muted: true },
                        { label: "Meal Recovery", val: "36", w: "w-1/3", color: "bg-amber-400", text: "text-amber-500", muted: false },
                        { label: "Vascular", val: "80", w: "w-4/5", color: "bg-emerald-400", text: "text-emerald-500", muted: false },
                        { label: "Stress & Load", val: "—", w: "w-0", color: "bg-slate-300", text: "text-slate-400", muted: true },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-3 text-xs">
                          <div className={`flex-1 ${row.muted ? "text-slate-400" : "text-slate-700"} font-medium`}>{row.label}</div>
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full ${row.color} ${row.w} rounded-full`} />
                          </div>
                          <div className={`w-6 text-right font-bold ${row.text}`}>{row.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="text-amber-700 font-bold text-xs mb-1">Biggest opportunity: Meal Recovery</div>
                      <div className="text-[11px] text-slate-600 leading-relaxed">How fast your body clears post-meal load. Improving this single signal moves your overall score the most.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                  One score. Five deeper signals. <span className="text-primary">Zero confusion.</span>
                </h3>
                <p className="mt-3 text-muted-foreground text-base leading-relaxed">
                  Your Metabolic Health Score combines vascular health, meal recovery, autonomic fitness, day portrait and stress load — into one number you can act on.
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    "Updated every morning automatically",
                    "Highlights your single biggest opportunity",
                    "Tracks your trajectory week over week",
                    "Built on 1.5Cr+ Indian metabolic records",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-sm md:text-base text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl border-2 border-emerald-200 p-5 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">⌚</span>
                  <span className="font-bold text-slate-900 text-sm">Today's Snapshot</span>
                  <span className="ml-auto text-[10px] text-slate-400 uppercase tracking-wide">Live</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
                    <div className="text-emerald-600 font-extrabold text-lg leading-tight">Calm</div>
                    <div className="text-[10px] text-slate-500">Sugar Zone</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-500">Score</span>
                      <span className="font-extrabold text-emerald-500 text-lg">93/100</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[93%] bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-500">Resting HR</span>
                    <span className="ml-auto font-bold text-slate-900">51 bpm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-slate-500">Sleep</span>
                    <span className="ml-auto font-bold text-slate-900">9.7h</span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-emerald-600 font-medium leading-relaxed">
                  All signals look good — your metabolic health indicators are in the healthy range today.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* APP IN ACTION — Section B: Meal Intelligence */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Meal Intelligence</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Snap your meal. <span className="text-primary">Nera AI does the maths.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              No counting calories. No guessing portions. Just see how today's meals affected <em>your</em> body — flagged Light or Heavy.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="order-2 lg:order-1">
              <div className="space-y-5">
                {[
                  { tag: "Auto-detected", title: "Calories, carbs, protein, sugar", desc: "Photo your plate. Nera AI estimates kcal, macros, sugar — and flags overshoots vs WHO targets." },
                  { tag: "Personal flags", title: "Heavy or Light — for YOUR body", desc: "Same biryani may be 'Heavy' for you and 'Light' for your friend. The flag is personal, not generic." },
                  { tag: "Sugar-aware", title: "WHO target overshoots, in real time", desc: "If today's sugar is 15g over your daily WHO limit, you'll see it before dinner — not after a year." },
                ].map((item) => (
                  <div key={item.title} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary rounded-full px-2.5 py-1 mb-2">{item.tag}</span>
                    <h3 className="font-bold text-foreground text-base md:text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="order-1 lg:order-2 relative mx-auto w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-amber-200/30 blur-3xl rounded-full" />
              <div className="relative bg-white rounded-[2.5rem] border-8 border-foreground/90 shadow-2xl overflow-hidden">
                <div className="bg-foreground/90 h-6 flex items-center justify-center">
                  <div className="w-20 h-1.5 bg-foreground/40 rounded-full" />
                </div>
                <div className="p-5">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="font-bold text-slate-900 text-base mb-3">Meal Intelligence</div>
                    <div className="flex gap-1.5 mb-4">
                      <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-[10px] font-bold">Today</span>
                      <span className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-[10px] font-medium">7 Days</span>
                      <span className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-[10px] font-medium">30 Days</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">4 meals logged · today</div>
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                        <div className="text-amber-600 font-extrabold text-sm">1156</div>
                        <div className="text-[8px] text-slate-500">kcal</div>
                        <div className="text-[9px] font-bold text-slate-700">Calories</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                        <div className="text-blue-600 font-extrabold text-sm">142g</div>
                        <div className="text-[8px] text-slate-500">carbs</div>
                        <div className="text-[9px] font-bold text-slate-700">Carbs</div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center">
                        <div className="text-emerald-600 font-extrabold text-sm">25g</div>
                        <div className="text-[8px] text-slate-500">protein</div>
                        <div className="text-[9px] font-bold text-slate-700">Protein</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
                        <div className="text-orange-600 font-extrabold text-sm">40g</div>
                        <div className="text-[8px] text-slate-500">sugar</div>
                        <div className="text-[9px] font-bold text-slate-700">Sugar</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                      <div className="h-full w-[80%] bg-orange-400 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] mb-4">
                      <span className="text-orange-600 font-bold">40g sugar · 15g over WHO target</span>
                      <span className="text-slate-400">limit 50g</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">biryani, chutney, cola</span>
                          <span className="bg-rose-100 text-rose-600 rounded-full px-2 py-0.5 text-[9px] font-bold">Heavy</span>
                          <span className="ml-auto text-[10px] text-slate-400">27 Apr</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {["~700–900 kcal", "Carbs 100g", "Protein 15g", "Sugar 35g ⚠", "Fat 25g"].map((t) => (
                            <span key={t} className={`text-[9px] rounded-full px-2 py-0.5 ${t.includes("⚠") ? "bg-rose-50 text-rose-600 font-bold" : "bg-slate-100 text-slate-600"}`}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">Coffee</span>
                          <span className="bg-emerald-100 text-emerald-600 rounded-full px-2 py-0.5 text-[9px] font-bold">Light</span>
                          <span className="ml-auto text-[10px] text-slate-400">27 Apr</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {["~0–5 kcal", "Carbs 1g", "Protein 0g", "Sugar 0g", "Fat 0g"].map((t) => (
                            <span key={t} className="text-[9px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-emerald-600 font-bold text-xs mt-4">View all 5 meals ↓</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Your Food Fingerprint</p>
                <h3 className="text-xl md:text-2xl font-extrabold text-foreground mb-2">Discover which meals quietly drain you.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">After a few days, Nera AI shows your body's average response by meal type — vs your fasting baseline.</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-md">
                <div className="font-bold text-slate-900 text-sm mb-1">Food Fingerprint</div>
                <div className="text-[11px] text-slate-500 mb-4">Your body's average response by meal type</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-700 font-medium">Light meals</span>
                      <span className="text-amber-600 font-bold text-sm">+34 pts</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[40%] bg-amber-400 rounded-full" /></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-700 font-medium">Heavy meals</span>
                      <span className="text-rose-600 font-bold text-sm">+36 pts</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[45%] bg-rose-400 rounded-full" /></div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-3">vs your fasting baseline</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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

      {/* ── SECTION 7 — WHO IS THIS FOR ── */}
      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-foreground text-center">This is for you if...</motion.h2>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10 space-y-4">
            {whoIsThisFor.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 8 — WHAT'S IN THE BOX ── */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center">Everything You Need to Start Knowing Your Body</motion.h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {boxItems.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
                <Package className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
          <motion.p {...fadeUp} className="mt-6 text-sm text-muted-foreground text-center">
            The device pairs with your phone in under 2 minutes. No technical setup.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 9 — TESTIMONIALS ── */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Users Discovered About Themselves</h2>
            <p className="text-muted-foreground mt-3">Real Food Fingerprint moments — straight from people who scanned, learned, and changed.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {fingerprintTestimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <p className="text-muted-foreground text-sm leading-relaxed italic">"{t.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-foreground">— {t.name}, {t.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="py-12" />}><TrustVideosSection /></Suspense>

      {/* ── SECTION 9B — USER REVIEWS ── */}
      <Suspense fallback={<div className="py-12" />}><WellnessReviewsSection /></Suspense>

      {/* ── OBJECTION HANDLING — "We Know What You Are Thinking" ── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">We know what you are thinking. Let us be honest.</h2>
            <p className="text-lg text-muted-foreground mt-3">
              These are the real questions people ask before buying EasyTouch Wellness. Here are straight answers — no marketing spin.
            </p>
          </motion.div>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {objections.map((obj, i) => (
              <AccordionItem key={i} value={`obj-${i}`} className="bg-card border border-border rounded-xl px-5">
                <AccordionTrigger className="text-left text-foreground font-semibold text-base py-5">{obj.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-line pb-5">{obj.a}</AccordionContent>
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
