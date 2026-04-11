import { useState } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Package, ShoppingCart, ChevronDown, Star } from "lucide-react";
import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { SiteLayout } from "@/components/SiteLayout";
import { EmiLine } from "@/components/EmiLine";

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
import { WellnessReviewsSection } from "@/components/products/WellnessReviewsSection";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import easytouchDeviceImg from "@/assets/easytouch-wellness-device.png";

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
  "EasyTouch Wellness device",
  "2× AAA batteries (included)",
  "Carry case",
  "Free Agatsa One app (Android + iOS)",
  "Nera AI — 3-day free access included with device",
];

const testimonials = [
  { quote: "I used to prick my finger 4 times a day. Now I scan once in the morning and once after lunch. Nera tells me what is actually happening. I finally feel like I understand my own body.", name: "Meena R.", city: "Hyderabad" },
  { quote: "My doctor was more interested in my EasyTouch report than my manual readings. She said the pattern data gave her something she had never seen before from a home device.", name: "Suresh K.", city: "Pune" },
  { quote: "I realised my sugar spikes every Tuesday evening. Nera helped me figure out it was stress from my weekly office review. Nothing to do with food at all.", name: "Anita M.", city: "Delhi" },
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
  { q: "Does this replace my glucometer completely?", a: "For many people, it significantly reduces how often they need to prick. However, if your doctor has prescribed a specific testing schedule, follow that. EasyTouch works best alongside — and gradually in place of — your daily routine." },
  { q: "How accurate is it?", a: "The first few readings are directional. As you take more readings and occasionally confirm with a reference test, the system builds a personal model of your body. After 8+ readings, most users find the zone tracking highly consistent with their traditional tests." },
  { q: "Is this easy to use if I am not good with technology?", a: "Yes. Clip it to your finger. Open the app. That is it. The app is in simple English. Nera AI speaks in plain language. No settings to configure." },
  { q: "What if my reading seems wrong?", a: "Take another reading after 5 minutes. If it still seems off, do a traditional test and enter the result in the app — this actually helps EasyTouch learn your body better." },
  { q: "Does it work for older people who are not used to smartphones?", a: "The Agatsa One app is designed to be simple. Large text, clear zones, plain language. Most users above 60 are comfortable with it within the first day." },
  { q: "What is Nera AI?", a: "Nera is the health intelligence system built into the Agatsa One app. It reads all your data — EasyTouch scores, meal snaps, sleep, activity — and explains what is happening in your body in plain language. Think of it as a knowledgeable friend who is always available and never makes you feel judged." },
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

  useSEO({ title: "EasyTouch Wellness — No Needle. No Blood. Know Why Your Sugar Goes Up. | Agatsa One", description: `EasyTouch Wellness measures your Metabolic Score in 15 seconds — no needles, no strips. Nera AI explains why your readings change. ${fmt(wellnessPrice)} with free delivery.` });

  return (
    <SiteLayout>
      {/* ── SECTION 1 — HERO ── */}
      <section className="pt-8 pb-10 md:pt-14 md:pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
              <span className="block">Needle.</span>
              <span className="block">Blood.</span>
              <span className="block">Strip.</span>
              <span className="block">Number.</span>
              <span className="block text-primary">Repeat.</span>
            </h1>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10 max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
              You have been doing this 3 times a day, every day, for years.
            </p>
            <p className="text-xl md:text-2xl text-foreground font-semibold mt-2">
              You know your number. But you still don't know why it goes up.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-10 max-w-xl mx-auto space-y-3 text-lg text-muted-foreground">
            <p>Why did it spike after that meal you thought was fine?</p>
            <p>Why is it high every morning before you've even eaten anything?</p>
            <p>Why does it behave some days and not others?</p>
            <p className="font-medium text-foreground/70">The strip gives you a number. It never gives you a reason.</p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.45 }} className="mt-12">
            <div className="w-16 h-px bg-border mx-auto mb-8" />
            <p className="text-3xl md:text-4xl font-bold text-foreground">There is a better way.</p>
            <Button onClick={scrollToIntro} size="lg" className="mt-8 rounded-full px-10 py-5 text-lg shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
              Show Me <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2 — INTRODUCE THE DEVICE ── */}
      <section id="introduce-device" className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet EasyTouch Wellness.</h2>
            <p className="text-xl text-primary font-semibold mt-3">
              Clip it to your finger. Wait 15 seconds. No needle. No blood. No strip.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10 space-y-5 text-lg text-muted-foreground max-w-3xl mx-auto">
            <p>
              EasyTouch Wellness uses the same light sensor that hospitals use in pulse oximeters — the small device they clipped to your finger during COVID to check your oxygen.
            </p>
            <p>
              That sensor shines a gentle light through your fingertip and reads how your blood is moving. Nera AI — our health intelligence system — then calculates your <strong className="text-foreground">Metabolic Score: a simple number from 0 to 100</strong> that shows how your body is responding right now.
            </p>
            <p className="text-foreground font-semibold text-xl">Not just a reading. An explanation.</p>
          </motion.div>

          {/* Product image */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mt-12 flex justify-center">
            <img src={easytouchDeviceImg} alt="EasyTouch Wellness device clipped to finger" className="w-full max-w-md drop-shadow-2xl" />
          </motion.div>

          {/* Price + Add to Cart block */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }} className="mt-12 text-center">
            <div>
              <span className="text-4xl font-extrabold text-foreground">{fmt(wellnessPrice)}</span>
              <span className="text-sm text-muted-foreground ml-2">inclusive of GST</span>
              <EmiLine price={wellnessPrice} />
              <StockUrgencyBar productKey="easytouch-wellness" className="mt-3" />
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
            <WellnessTrustBar />
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3 — HOW DOES IT WORK ── */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-foreground text-center">How does it work — in plain language</motion.h2>
          <div className="mt-14 space-y-12">
            {[
              { n: "1", title: "Clip it on", copy: "Attach EasyTouch Wellness to your fingertip. Same as a pulse oximeter. No setup. No calibration the first time." },
              { n: "2", title: "15 seconds", copy: "A gentle light passes through your finger. You feel nothing. The sensor reads your blood flow patterns." },
              { n: "3", title: "Your Metabolic Score appears", copy: "The Agatsa One app shows you a score from 0 to 100 and tells you which zone you are in — in plain language, not medical terms." },
              { n: "4", title: "Nera AI explains", copy: "Our AI tells you what the score means right now, why it may have changed since your last reading, and what to do next — in simple sentences, like a knowledgeable friend." },
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">Know before you eat.</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="mt-10 space-y-5 text-lg text-muted-foreground">
            <p>Open the Agatsa One app. Take a photo of your plate.</p>
            <p>Nera AI identifies what is on your plate, estimates the portion, and tells you what kind of metabolic response to expect — before you take a bite.</p>
            <p>Then, 90 minutes after eating, take a quick EasyTouch reading. See exactly how your body actually responded.</p>
            <p>Do this a few times and you will start to see patterns. You will know which foods push you into the Elevated zone and which ones keep you Calm — <strong className="text-foreground">for your body specifically.</strong> Not a general diet chart. Your chart.</p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5B — WATCH IT IN ACTION ── */}
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
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center">Everything you need. Nothing extra.</motion.h2>
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
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-foreground text-center">4 lakh+ health readings tracked. Across India.</motion.h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t, i) => (
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

      {/* ── SECTION 9B — USER REVIEWS ── */}
      <WellnessReviewsSection />

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

      {/* ── SECTION 10 — PRICE + CTA ── */}
      <section className="py-12 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">EasyTouch Wellness</h2>
            <p className="text-5xl font-extrabold text-foreground mt-6">{fmt(wellnessPrice)}</p>
            <EmiLine price={wellnessPrice} />
            <p className="text-muted-foreground mt-2">Free delivery across India · 1-year warranty · 30-day return policy</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Button onClick={handleAddToCart} disabled={adding} size="lg" className="rounded-full px-10 py-5 text-lg shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Now — Free Delivery
              </Button>
            </div>

            <div className="mt-4">
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
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Questions people usually ask</motion.h2>
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
