import { useState } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package, TrendingUp, Zap, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { EmiLine, TrustBar } from "@/components/EmiLine";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import easytouchHero from "@/assets/easytouch-wellness-hero.webp";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const measures = [
  { title: "Metabolic Load Index", desc: "Track how your body responds to food — see post-meal metabolic trends without any needles" },
  { title: "Blood Oxygen (SpO2)", desc: "Oxygen saturation with 94% alert threshold" },
  { title: "Heart Rate", desc: "Pulse rate real-time and trend" },
  { title: "HRV", desc: "Heart rate variability — key stress and recovery indicator" },
  { title: "Perfusion Index", desc: "Signal quality indicator for accurate readings" },
];

const steps = [
  { n: "1", title: "Position your finger on the sensor", copy: "Rest your index finger gently on the EasyTouch sensor. Advanced optical sensing captures your metabolic, cardiovascular, and oxygen data simultaneously. No pain. No preparation." },
  { n: "2", title: "Hold for 15 seconds", copy: "The device takes a 15-second reading, capturing optical data across multiple wavelengths. The Agatsa One app shows a live progress indicator and guides you through the process." },
  { n: "3", title: "Get your complete health picture", copy: "Nera AI processes all vitals simultaneously — comparing them to your historical trends, flagging anything unusual, and updating your Nera Health Score. Log your meal before readings for metabolic impact scoring." },
];

const boxItems = [
  "EasyTouch Wellness device (1 unit)",
  "2× AAA batteries (included)",
  "Quick start guide (English + Hindi)",
  "1-year manufacturer warranty card",
];

const faqs = [
  { q: "What does EasyTouch Wellness measure?", a: "EasyTouch Wellness is a non-invasive metabolic health monitor. It tracks your body's metabolic load — how your body responds to food, stress, and activity — along with SpO2, heart rate, HRV, and more. It gives you a comprehensive metabolic and cardiovascular picture in 15 seconds." },
  { q: "Is this a medical diagnostic device?", a: "EasyTouch Wellness is a health monitoring aid designed for daily wellness tracking. It provides metabolic trend insights that help you understand your body better. For medical diagnosis or treatment decisions, always consult your healthcare provider." },
  { q: "Who should use the EasyTouch Wellness?", a: "Anyone who wants daily visibility into their metabolic and cardiovascular health — especially those managing lifestyle conditions, monitoring their diet's impact, or wanting to track SpO2 and heart rate trends without frequent clinic visits. It's designed for proactive health management." },
  { q: "How does metabolic load tracking work?", a: "The EasyTouch uses advanced optical sensing to measure bioelectrical metabolic markers. When you log your meals in the app, Nera AI correlates your readings with your diet to show how your body processes food over time — building a personalised metabolic profile." },
  { q: "What happens if my readings show something unusual?", a: "Nera AI continuously monitors your trends. If any vital crosses a threshold, you'll receive an immediate alert with guidance. On Care Programmes, unusual patterns trigger an escalation protocol for timely medical consultation." },
];

const relatedDevices = [
  { name: "SanketLife ECG", desc: "Add ECG for complete cardiac + metabolic monitoring", link: "/devices/sanketlife-ecg" },
  { name: "EasyTouch Rhythm Band", desc: "Add 24/7 continuous monitoring", link: "/devices/rhythm-band" },
  { name: "Agatsa Smart Scale", desc: "Complete the picture with body composition", link: "/devices/smart-scale" },
];

export default function EasyTouchWellnessProduct() {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const { prices, fmt } = usePricing();
  const wellnessPrice = prices.wellness_sub;
  useMetaPixelViewContent("EASYTOUCH_WELLNESS", "EasyTouch Wellness", wellnessPrice);

  const handleBuy = (qtyOrEvent?: number | React.MouseEvent) => {
    const qty = typeof qtyOrEvent === "number" ? qtyOrEvent : 1;
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["wellness_sub"], content_name: "EasyTouch Wellness", content_type: "product", value: wellnessPrice * qty, currency: "INR" }); } catch {}
    }
    navigate(`/checkout?sku=${Array(qty).fill("wellness_sub").join(",")}`);
  };

  useSEO({ title: "EasyTouch Wellness — Non-Invasive Metabolic Health Monitor | Agatsa One", description: "Track your metabolic health, SpO2, HRV and more — no needles, no blood. Multiple vitals in 15 seconds. ₹3,999. Powered by Nera AI." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-8 pb-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/devices" className="hover:text-primary">Devices</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">EasyTouch Wellness</span>
          </nav>

          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            <motion.img {...fadeUp} src={easytouchHero} alt="EasyTouch Wellness Non-Invasive Metabolic Health Monitor" className="w-full rounded-3xl shadow-2xl" />

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <span className="inline-block text-sm font-medium text-white bg-[hsl(217,82%,50%)] rounded-full px-4 py-1.5 mb-4">
                Non-Invasive Metabolic Health
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
                EasyTouch Wellness<br />Metabolic Health Monitor
              </h1>

              <p className="text-xl md:text-2xl font-bold text-[hsl(217,82%,50%)] mt-3">
                See how your body responds to food, stress & activity.
              </p>

              <p className="text-lg text-muted-foreground mt-4 max-w-[480px]">
                Track your metabolic load, SpO2, heart rate, and HRV — all in one device, in under 15 seconds. No needles. No blood. No discomfort. Just daily metabolic intelligence powered by Nera AI.
              </p>

              <div className="mt-6">
                <span className="text-4xl font-extrabold text-foreground">{fmt(wellnessPrice)}</span>
                <span className="text-sm text-muted-foreground ml-2">inclusive of GST</span>
                <EmiLine price={wellnessPrice} />
                <StockUrgencyBar productKey="easytouch-wellness" className="mt-3" />
                <div className="mt-2 inline-flex items-center gap-2 bg-[hsl(270,60%,96%)] dark:bg-[hsl(270,40%,20%)] border border-[hsl(270,60%,80%)] dark:border-[hsl(270,40%,40%)] rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-[hsl(270,80%,50%)] uppercase tracking-wide">Included FREE</span>
                  <span className="text-sm font-semibold text-foreground">Nera AI Weekly — 3 months</span>
                  <span className="text-xs text-muted-foreground">(worth ₹897)</span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">4.6/5 (834 reviews)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleBuy} disabled={adding} className="rounded-full px-8 py-4 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
                  Buy EasyTouch Wellness — {fmt(wellnessPrice)}
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 py-4 text-base border-2 border-primary text-primary">
                  <Link to="/app?device=easytouch">Download Agatsa One App (free)</Link>
                </Button>
              </div>
              <TrustBar />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[hsl(260,100%,97%)] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { big: "8 Vitals", label: "In one reading", sub: "Metabolic + cardiovascular + respiratory" },
            { big: "15 Sec", label: "Complete reading time", sub: "No needles, no prep" },
            { big: "15,000+", label: "Active users", sub: "Across India" },
          ].map((s) => (
            <motion.div key={s.big} {...fadeUp}>
              <p className="text-4xl md:text-5xl font-extrabold text-primary">{s.big}</p>
              <p className="text-base font-medium text-muted-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What It Measures */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold text-foreground">Your daily metabolic health snapshot</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
              EasyTouch Wellness captures a comprehensive picture of your metabolic and cardiovascular health in a single 15-second reading. No needles. No blood.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {measures.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-2xl p-6 text-left">
                <h3 className="text-base font-bold text-foreground">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[hsl(260,100%,97%)]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-foreground text-center">How to take a reading in 15 seconds</motion.h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto md:mx-0">{s.n}</div>
                <h3 className="text-lg font-bold text-foreground mt-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nera AI Intelligence */}
      <section className="py-20 bg-gradient-to-br from-[#0D0D1A] to-[#1A1040]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7C4DFF]">POWERED BY NERA AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Your readings become intelligence.</h2>
            <p className="text-[#A0A0C0] text-lg mt-4 max-w-2xl mx-auto">
              Most devices give you a number. Nera AI gives you meaning — patterns, predictions, and alerts built from every reading you take.
            </p>
          </div>

          {/* Food Snap Spotlight */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            <motion.div {...fadeUp}>
              <span className="inline-block bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30 rounded-full px-4 py-1 text-sm font-medium">
                Most loved feature
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-4">
                Snap your meal. See how your body responded.
              </h3>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-4">
                Before you eat, open Agatsa One and photograph your plate. Nera AI analyses the meal and predicts how your body is likely to respond. Take a reading after your meal — and Nera AI shows you exactly how accurate the prediction was.
              </p>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-3">
                Over weeks, it builds a personal map of how different foods affect your readings. Which meals cause spikes. Which don't. What time of day your body handles food best. All from a photo and a 60-second reading.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["📸 Snap before eating", "🤖 AI response prediction", "🗺️ Personal food response map"].map((pill) => (
                  <span key={pill} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-white">{pill}</span>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">🍛 Dal Rice + Sabzi</span>
                  <span className="text-[#A0A0C0] text-sm">Logged 1:15 PM</span>
                </div>
                <div className="border-t border-white/10 my-4" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Predicted post-meal response</span>
                    <span className="text-[#F59E0B] font-medium text-sm">Moderate ↑</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Actual reading (2:45 PM)</span>
                    <span className="text-[#10B981] font-medium text-sm">Within range</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Prediction accuracy</span>
                    <span className="text-[#7C4DFF] font-bold text-sm">91%</span>
                  </div>
                </div>
                <div className="border-t border-white/10 my-4" />
                <p className="text-[#A0A0C0] text-xs italic">
                  Nera AI: Your post-meal readings after rice are consistently better at lunch than dinner. Your body responds differently by time of day.
                </p>
              </div>
            </motion.div>
          </div>

          {/* 3 AI Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: TrendingUp, title: "30-Day Trend Picture", body: "Nera AI builds a rolling picture of your metabolic readings over 30 days — so you can see the direction of travel, not just today's number. Share it with your doctor at your next visit." },
              { icon: Zap, title: "Cross-Vital Pattern Detection", body: "One reading out of range is a data point. The same reading alongside elevated BP and low HRV is a pattern. Nera AI sees the combination and flags what matters — before it becomes a problem." },
              { icon: MessageCircle, title: "Ask Nera", body: "\"Why are my post-meal readings higher at dinner?\" Voice or chat — Nera AI answers using your own data, not a generic response." },
            ].map((card) => (
              <motion.div key={card.title} {...fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#7C4DFF]/50 transition-all">
                <card.icon className="text-[#7C4DFF]" size={28} />
                <h4 className="text-white font-semibold text-lg mt-3">{card.title}</h4>
                <p className="text-[#A0A0C0] text-sm mt-2 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="bg-[#7C4DFF]/10 border border-[#7C4DFF]/30 rounded-2xl p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold text-xl">
                EasyTouch Wellness is the core device for the{" "}
                <span className="text-[#7C4DFF] font-bold">Diabetic Cardiac Care Programme</span>
              </p>
              <p className="text-[#A0A0C0] text-sm mt-2">
                Nera AI monitors your vitals and ECG together, sends weekly AI-generated reports to your enrolled doctor, and alerts automatically when readings need attention.
              </p>
            </div>
            <Button asChild className="bg-[#7C4DFF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6B3FE8] transition-all whitespace-nowrap shrink-0">
              <Link to="/programmes">View the Programme →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Metabolic Health Matters */}
      <section className="py-20 bg-background">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why This Matters</p>
            <h2 className="text-3xl font-bold text-foreground">Your body talks. EasyTouch listens.</h2>
          </motion.div>
          <motion.div {...fadeUp} className="bg-[hsl(260,100%,97%)] rounded-3xl p-8 md:p-10 space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              Most health problems don't appear overnight — they build up silently over months and years. Your metabolic health is one of the earliest indicators of how your body is doing. How you process food, how your cardiovascular system responds to stress, how efficiently your blood carries oxygen.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              EasyTouch Wellness gives you a window into these signals — daily, painlessly, in just 15 seconds. Combined with Nera AI, it builds your personalised metabolic profile over time, helping you and your doctor make informed decisions before problems escalate.
            </p>
            <blockquote className="bg-card rounded-2xl p-6 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground italic">
                "The ability to track metabolic trends daily — without any invasive procedure — fundamentally changes how patients engage with their health."
              </p>
              <footer className="mt-3 text-xs font-medium text-foreground">— Nera AI Clinical Advisory</footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* In The Box */}
      <section className="py-16 bg-[hsl(260,100%,97%)]">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl font-bold text-foreground text-center mb-8">What's included</motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boxItems.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
                <Package className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 bg-primary/10 rounded-xl border border-primary/20 p-4">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary">3-month Nera AI subscription (₹1,797 value)</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl font-bold text-foreground text-center mb-8">Frequently asked questions</motion.h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-xs text-muted-foreground mt-6 text-center italic">
            *EasyTouch Wellness is a metabolic health monitoring aid. It is not a medical diagnostic device and is not intended to diagnose, treat, or cure any medical condition.
          </p>
        </div>
      </section>

      {/* Related Devices */}
      <section className="py-16 bg-[hsl(260,100%,97%)]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Complete your health monitoring setup</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedDevices.map((d) => (
              <Link key={d.name} to={d.link} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all group">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3">
                  Learn more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Your metabolic health, in your hands.</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">Your first reading takes under 15 seconds. No needles. No blood. Just insight.</p>
          <Button onClick={handleBuy} disabled={adding} className="mt-8 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
            Buy EasyTouch Wellness — {fmt(wellnessPrice)}
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
