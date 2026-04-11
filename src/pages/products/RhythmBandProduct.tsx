import { useState } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package, Moon, Activity, Bell } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { EmiLine, TrustBar } from "@/components/EmiLine";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import rhythmHero from "@/assets/easytouch-rhythm-new.webp";
import neraScreen from "@/assets/app-screen-nera.webp";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const measures = [
  { title: "Continuous Heart Rate", desc: "24/7 heart rate monitoring with resting HR trend and abnormal HR alerts" },
  { title: "Blood Oxygen (SpO2)", desc: "Continuous SpO2 with nocturnal dip detection during sleep" },
  { title: "HRV", desc: "Heart rate variability — the key metric for recovery, stress, and cardiac health" },
  { title: "Sleep Stages", desc: "Deep sleep, REM, light sleep, and awake time — every night tracked" },
  { title: "Steps & Distance", desc: "Daily step count, distance, and activity goal tracking" },
  { title: "Calories Burned", desc: "Active calories and total daily energy expenditure" },
  { title: "Stress Score", desc: "HRV-derived stress index — see how stress builds through your day" },
  { title: "Skin Temperature", desc: "Continuous skin temperature trend — useful for illness detection" },
];

const steps = [
  { n: "1", title: "Wear it. Forget it.", copy: "Strap on the EasyTouch Rhythm Band and wear it 24/7. Waterproof for the shower. Comfortable enough to sleep in. It pairs with Agatsa One via Bluetooth in 30 seconds." },
  { n: "2", title: "It monitors everything, automatically", copy: "No manual readings needed. The band tracks your heart rate, SpO2, sleep stages, and stress score continuously — uploading data to Nera AI every time your phone is in Bluetooth range." },
  { n: "3", title: "Nera AI builds your wellness picture", copy: "Every morning, Nera AI analyses your overnight data — your sleep quality, HRV recovery score, and resting heart rate trend — and gives you a plain-English readiness score for the day." },
];

const boxItems = [
  "EasyTouch Rhythm Band",
  "Magnetic charging cable",
  "Quick start guide (English + Hindi)",
  "1-year manufacturer warranty card",
];

const faqs = [
  { q: "Does the Rhythm Band work without the other Agatsa devices?", a: "Yes. The Rhythm Band works standalone — you get all sleep, HRV, steps, SpO2, and stress features with just the band and the Agatsa One app. It becomes even more powerful when combined with the ECG or EasyTouch for cross-device health correlation." },
  { q: "How accurate is the sleep tracking?", a: "The Rhythm Band uses your HRV and movement data to detect sleep stages. Accuracy is comparable to other medical-grade wristband devices. Nera AI analyses your sleep architecture and gives you weekly sleep quality reports." },
  { q: "Can I wear it in water?", a: "Yes. The Rhythm Band is water-resistant up to IP67 standards — safe for handwashing and light rain. Do not submerge for extended swimming." },
  { q: "How does the stress score work?", a: "The stress score is derived from your HRV patterns throughout the day. Lower HRV = higher stress response. Nera AI correlates your stress score with your sleep quality and vital readings to show you patterns — for example, how a poor night's sleep elevates your stress score the following day." },
  { q: "Does it show BP like the EasyTouch does?", a: "The Rhythm Band provides a spot-check blood pressure estimate using PPG technology. For clinical BP monitoring, we recommend the EasyTouch Wellness, which provides a more validated BP measurement. The two devices complement each other well." },
];

const relatedDevices = [
  { name: "SanketLife ECG", desc: "Add clinical ECG for complete cardiac monitoring", link: "/devices/sanketlife-ecg" },
  { name: "EasyTouch Wellness", desc: "Add metabolic health and BP monitoring", link: "/devices/easytouch-wellness" },
  { name: "Agatsa Smart Scale", desc: "Add body composition for complete health tracking", link: "/devices/smart-scale" },
];

export default function RhythmBandProduct() {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const { prices, fmt } = usePricing();
  const bandPrice = prices.band_sub;
  useMetaPixelViewContent("RHYTHM_BAND", "EasyTouch Rhythm Band", 3999);
  const handleBuy = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["band_sub"], content_name: "EasyTouch Rhythm Band", content_type: "product", value: bandPrice, currency: "INR" }); } catch {}
    }
    navigate("/checkout?sku=band_sub");
  };
  useSEO({ title: "EasyTouch Rhythm Band — 24/7 Sleep, HRV, SpO2 Monitoring | Agatsa One", description: "Continuous heart rate, SpO2, sleep stage tracking, HRV, and stress score. 7-day battery. Works with Nera AI. ₹3,999. Compatible with all 5 Care Programmes." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-8 pb-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/devices" className="hover:text-primary">Devices</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">EasyTouch Rhythm Band</span>
          </nav>
          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            <motion.img {...fadeUp} src={rhythmHero} alt="EasyTouch Rhythm Wellness Band" className="w-full rounded-3xl shadow-2xl" />
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">EasyTouch Rhythm Wellness Band</h1>
              <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 mt-3">24/7 health monitoring that never sleeps.</p>
              <p className="text-lg text-muted-foreground mt-4 max-w-[480px]">The EasyTouch Rhythm Band tracks your heart, sleep, steps, SpO2, and stress score around the clock — providing Nera AI with the continuous data it needs to build a complete picture of your health and recovery.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-foreground">{fmt(bandPrice)}</span>
                <span className="text-sm text-muted-foreground ml-2">inclusive of GST</span>
                <EmiLine price={bandPrice} />
                <StockUrgencyBar productKey="easytouch-rhythm" className="mt-3" />
                <div className="mt-2 inline-flex items-center gap-2 bg-[hsl(270,60%,96%)] dark:bg-[hsl(270,40%,20%)] border border-[hsl(270,60%,80%)] dark:border-[hsl(270,40%,40%)] rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-[hsl(270,80%,50%)] uppercase tracking-wide">Included FREE</span>
                  <span className="text-sm font-semibold text-foreground">Nera AI Weekly — 3 months</span>
                  <span className="text-xs text-muted-foreground">(worth ₹897)</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-muted-foreground ml-1">4.5/5 (612 reviews)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleBuy} disabled={adding} className="rounded-full px-8 py-4 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">Buy Rhythm Band — {fmt(bandPrice)}</Button>
                <Button asChild variant="outline" className="rounded-full px-8 py-4 text-base border-2 border-primary text-primary">
                  <Link to="/app?device=rhythm">Download Agatsa One App (free)</Link>
                </Button>
              </div>
              <TrustBar />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WATCH IT IN ACTION ─── */}
      <section className="py-16 md:py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Watch It In Action</h2>
          {/* Hero video */}
          <div className="mb-6">
            <VideoCard video={{ id: "j8QwXnQwozg", title: "How to Set Up & Pair EasyTouch Rhythm" }} hero />
          </div>
          {/* Supporting videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <VideoCard video={{ id: "m57UYezHL0U", title: "Why Rhythm, Not Just Numbers" }} />
            <VideoCard video={{ id: "Y1uqW-9hbQQ", title: "The Band That Understands Your Body" }} />
            <VideoCard video={{ id: "lvJMaIAO4mo", title: "Stop Tracking Numbers" }} />
            <VideoCard video={{ id: "FSstgD0nujQ", title: "Stop Tracking, Start Understanding" }} />
            <VideoCard video={{ id: "hyl6mvSf-Ew", title: "It Doesn't Just Track — It Explains" }} />
            <VideoCard video={{ id: "4U9wV6nHflI", title: "India's First Rhythm Band" }} />
            <VideoCard video={{ id: "-DumCEShm0w", title: "Your Daily Rhythm Tells a Story" }} />
            <VideoCard video={{ id: "ZMOBfNFOwXY", title: "India's First Daily Rhythm Band" }} />
          </div>
          <YouTubeChannelLink />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[hsl(260,100%,97%)] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { big: "24/7", label: "Continuous monitoring", sub: "Never miss a beat" },
            { big: "7-Day Battery", label: "Wear it all week", sub: "Charge once, monitor always" },
            { big: "9 Metrics", label: "Tracked continuously", sub: "HR, SpO2, sleep, HRV + more" },
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
            <h2 className="text-3xl font-bold text-foreground">9 metrics. Tracked continuously.</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">The Rhythm Band captures a continuous stream of health data — giving Nera AI the context it needs to understand your body's patterns.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {measures.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }} className="bg-card border border-border rounded-2xl p-6 text-left">
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
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-foreground text-center">How it works</motion.h2>
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
      <section className="py-20 bg-gradient-to-br from-[#0D0D1A] to-[#001A0D]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#00C853]">POWERED BY NERA AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Continuous data is only useful if someone's watching it.</h2>
            <p className="text-[#A0A0C0] text-lg mt-4 max-w-2xl mx-auto">
              The Rhythm Band runs 24/7. Nera AI runs with it — watching patterns across your sleep, recovery, stress, and activity so you don't have to.
            </p>
          </div>

          {/* Morning Readiness Spotlight */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            {/* Left - App UI Card */}
            <motion.div {...fadeUp}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">☀️ Good morning, Rahul</span>
                  <span className="text-[#A0A0C0] text-sm">6:42 AM</span>
                </div>
                <div className="border-t border-white/10 my-4" />
                <div className="text-center py-4">
                  <p className="text-5xl font-bold text-[#00C853]">74</p>
                  <p className="text-[#A0A0C0] text-sm mt-1">Readiness Score</p>
                </div>
                <div className="border-t border-white/10 my-4" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Deep sleep</span>
                    <span className="text-[#00C853] font-medium text-sm">1h 52m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">HRV recovery</span>
                    <span className="text-[#00C853] font-medium text-sm">+12% vs avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Resting heart rate</span>
                    <span className="text-white font-medium text-sm">61 bpm</span>
                  </div>
                </div>
                <div className="border-t border-white/10 my-4" />
                <p className="text-[#A0A0C0] text-xs italic">
                  Nera AI: Good recovery night. Your stress score yesterday was high — but your body handled it well. A focused morning is within reach today.
                </p>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <span className="inline-block bg-[#00C853]/20 text-[#00C853] border border-[#00C853]/30 rounded-full px-4 py-1 text-sm font-medium">
                Every morning, automatically
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-4">
                Wake up knowing how recovered you actually are.
              </h3>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-4">
                Every morning, Nera AI analyses your overnight data — sleep stages, HRV trend, resting heart rate, SpO2 dips — and generates a Readiness Score before you even pick up your phone.
              </p>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-3">
                Not a generic sleep score. A score built on your own baseline, your recent stress pattern, and how your body has been trending over the past week. On a hard day, it tells you to ease up. On a recovery day, it tells you you're ready.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["🌙 Sleep stage analysis", "💓 HRV recovery score", "📊 7-day baseline comparison"].map((pill) => (
                  <span key={pill} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-white">{pill}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3 AI Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Moon, title: "Nocturnal Pattern Detection", body: "While you sleep, Nera AI watches for SpO2 dips, irregular heart rate patterns, and unusually shallow sleep stages. Patterns that repeat across nights — not random noise — surface as a flag to discuss with your doctor." },
              { icon: Activity, title: "Stress-Sleep Loop", body: "High stress score yesterday → poor sleep → elevated resting HR today. Nera AI maps this cycle and shows it to you in plain language. Not individual metrics — the loop that's affecting your health." },
              { icon: Bell, title: "Passive Alerts, Not Noise", body: "Nera AI only alerts you when something changes from your personal pattern — not because a number crossed a generic threshold. You get fewer alerts. Every one matters." },
            ].map((card) => (
              <motion.div key={card.title} {...fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00C853]/50 transition-all">
                <card.icon className="text-[#00C853]" size={28} />
                <h4 className="text-white font-semibold text-lg mt-3">{card.title}</h4>
                <p className="text-[#A0A0C0] text-sm mt-2 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="bg-[#00C853]/10 border border-[#00C853]/30 rounded-2xl p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold text-xl">
                The Rhythm Band feeds the{" "}
                <span className="text-[#00C853] font-bold">Nera Health Score — 24 hours a day.</span>
              </p>
              <p className="text-[#A0A0C0] text-sm mt-2">
                Every step, every sleep cycle, every HRV data point updates your Nera Health Score in real time. It's the only health score that actually reflects how you lived today — not just how you measured once.
              </p>
            </div>
            <div className="shrink-0">
              <div className="relative w-[140px] h-[280px] rounded-[28px] border-[3px] border-white/20 bg-black overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[18px] bg-black rounded-b-xl z-10" />
                <img src={neraScreen} alt="Nera Health Score on iPhone" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In The Box */}
      <section className="py-16 bg-background">
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
      <section className="py-20 bg-[hsl(260,100%,97%)]">
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
        </div>
      </section>

      {/* Related Devices */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Complete your health monitoring setup</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedDevices.map((d) => (
              <Link key={d.name} to={d.link} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all group">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3">Learn more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready for 24/7 health monitoring?</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">Pair in 30 seconds. Wear it all week. Let Nera AI do the rest.</p>
          <Button onClick={handleBuy} disabled={adding} className="mt-8 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">Buy Rhythm Band — {fmt(bandPrice)}</Button>
        </div>
      </section>
    </SiteLayout>
  );
}
