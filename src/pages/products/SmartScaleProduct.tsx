import { useState } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package, Scale, TrendingDown, Users, Heart } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { EmiLine, TrustBar } from "@/components/EmiLine";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import scaleHero from "@/assets/corebalance-hero.webp";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const measures = [
  { title: "Body Weight", desc: "Precise weight in kg or lbs" },
  { title: "BMI", desc: "Body Mass Index with WHO classification" },
  { title: "Body Fat %", desc: "Total body fat percentage with healthy range indicator" },
  { title: "Visceral Fat", desc: "The dangerous fat around your organs — ranked 1–20" },
  { title: "Muscle Mass", desc: "Skeletal muscle mass in kg" },
  { title: "Bone Density", desc: "Bone mineral density estimate" },
  { title: "Body Water %", desc: "Total body water percentage — key hydration indicator" },
  { title: "Basal Metabolic Rate", desc: "Calories your body burns at rest" },
  { title: "Metabolic Age", desc: "Your body's metabolic age vs. your actual age" },
  { title: "Protein %", desc: "Protein percentage — muscle health indicator" },
  { title: "Subcutaneous Fat", desc: "Fat stored under the skin (vs. visceral fat)" },
  { title: "Lean Body Mass", desc: "Weight minus all fat tissue" },
  { title: "Body Shape Index", desc: "ABSI — central obesity risk indicator" },
  { title: "Physique Rating", desc: "Overall body composition classification" },
];

const steps = [
  { n: "1", title: "Step on barefoot", copy: "Place both bare feet on the scale's electrodes. The Smart Scale uses bioelectrical impedance analysis (BIA) to send a tiny, safe electrical signal through your body. You won't feel a thing." },
  { n: "2", title: "5 seconds to your complete body composition", copy: "The scale measures your weight and body composition simultaneously. All 14 metrics are calculated and transmitted via Bluetooth to your Agatsa One app in under 10 seconds." },
  { n: "3", title: "Nera AI tracks your body recomposition", copy: "Over time, Nera AI builds a body composition trend — showing you not just whether you're losing weight, but whether you're losing fat or muscle. Visceral fat trends. Metabolic age movement. This is how you know your programme is actually working." },
];

const boxItems = [
  "Agatsa Smart Scale (1 unit)",
  "4 AAA batteries (included)",
  "Quick start guide (English + Hindi)",
  "1-year manufacturer warranty card",
];

const faqs = [
  { q: "How does the scale measure body fat without a blood test?", a: "The Smart Scale uses bioelectrical impedance analysis (BIA) — a safe, clinically validated method used in hospitals worldwide. A tiny electrical signal passes through your feet. Different tissues (fat, muscle, water, bone) conduct electricity differently, allowing the scale to calculate your body composition." },
  { q: "How accurate is the body fat measurement?", a: "BIA-based body fat measurement is accurate within 3-5% compared to DEXA scans (the gold standard). The key value is trend tracking — consistent daily readings reveal whether your body fat is decreasing over time, which is far more informative than a single measurement." },
  { q: "Can multiple family members use the same scale?", a: "Yes — up to 10 family members can share one scale. Each person's reading automatically syncs to their own profile in the Agatsa One app using step-on recognition technology." },
  { q: "Is it safe for people with pacemakers?", a: "People with pacemakers or other implanted electronic devices should consult their doctor before using a BIA-based scale. Pregnant women should also avoid BIA measurement and use weight-only mode." },
  { q: "What's the difference between visceral fat and regular body fat?", a: "Visceral fat is stored around your internal organs (liver, intestines, heart). It's metabolically active and strongly linked to heart disease, diabetes, and inflammation. The Smart Scale measures visceral fat separately from subcutaneous fat (the fat under your skin) — this distinction is crucial for understanding cardiac and metabolic risk." },
];

const relatedDevices = [
  { name: "EasyTouch Rhythm Band", desc: "Add 24/7 activity and sleep monitoring", link: "/devices/rhythm-band" },
  { name: "EasyTouch Wellness", desc: "Add metabolic health and BP monitoring", link: "/devices/easytouch-wellness" },
  { name: "SanketLife ECG", desc: "Add cardiac monitoring for the complete picture", link: "/devices/sanketlife-ecg" },
];

export default function SmartScaleProduct() {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const { prices, fmt } = usePricing();
  const scalePrice = prices.scale_sub;
  useMetaPixelViewContent("SMART_SCALE", "Agatsa Smart Scale", 1999);
  const handleBuy = (qtyOrEvent?: number | React.MouseEvent) => {
    const qty = typeof qtyOrEvent === "number" ? qtyOrEvent : 1;
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["scale_sub"], content_name: "Agatsa Smart Scale", content_type: "product", value: scalePrice * qty, currency: "INR" }); } catch {}
    }
    const skus = Array(qty).fill("scale_sub").join(",");
    navigate(`/checkout?sku=${skus}`);
  };
  useSEO({ title: "Agatsa Smart Scale — 14 Body Composition Metrics | BMI, Body Fat, Muscle Mass", description: "14 body composition metrics in 5 seconds. Weight, BMI, body fat, visceral fat, muscle mass, metabolic age and more. 10 family profiles. Works with Nera AI. ₹1,899." });

  return (
    <SiteLayout>
      <section className="pt-8 pb-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/devices" className="hover:text-primary">Devices</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">Agatsa Smart Scale</span>
          </nav>
          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            <motion.img {...fadeUp} src={scaleHero} alt="Agatsa Smart Scale" className="w-full rounded-3xl shadow-2xl" />
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">Agatsa Smart Scale</h1>
              <p className="text-xl md:text-2xl font-bold text-orange-500 dark:text-orange-400 mt-3">Step on. Know everything.</p>
              <p className="text-lg text-muted-foreground mt-4 max-w-[480px]">The Agatsa Smart Scale measures 14 body composition metrics in a single 5-second reading — weight, body fat, muscle mass, bone density, visceral fat, metabolic age, and more. Syncs instantly to Nera AI via Bluetooth.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-foreground">{fmt(scalePrice)}</span>
                <span className="text-sm text-muted-foreground ml-2">inclusive of GST</span>
                <EmiLine price={scalePrice} />
                <StockUrgencyBar productKey="corebalance" className="mt-3" />
                <div className="mt-2 inline-flex items-center gap-2 bg-[hsl(270,60%,96%)] dark:bg-[hsl(270,40%,20%)] border border-[hsl(270,60%,80%)] dark:border-[hsl(270,40%,40%)] rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-[hsl(270,80%,50%)] uppercase tracking-wide">Included FREE</span>
                  <span className="text-sm font-semibold text-foreground">Nera AI Weekly — 3 months</span>
                  <span className="text-xs text-muted-foreground">(worth ₹897)</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-muted-foreground ml-1">4.7/5 (423 reviews)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleBuy} disabled={adding} className="rounded-full px-8 py-4 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">Buy Smart Scale — {fmt(scalePrice)}</Button>
                <Button asChild variant="outline" className="rounded-full px-8 py-4 text-base border-2 border-primary text-primary">
                  <Link to="/app?device=scale">Download Agatsa One App (free)</Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <VideoCard video={{ id: "e9f0DR890zM", title: "India: The Diabetes Capital" }} />
            <VideoCard video={{ id: "ZkLv3wyVtfg", title: "Real Story: What the Numbers Showed" }} />
          </div>
          <YouTubeChannelLink />
        </div>
      </section>

      <section className="bg-[hsl(260,100%,97%)] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { big: "14 Metrics", label: "In one reading", sub: "Comprehensive body analysis" },
            { big: "5 Seconds", label: "Complete reading time", sub: "Step on, step off" },
            { big: "10 Profiles", label: "Per scale", sub: "Whole family, one device" },
          ].map((s) => (
            <motion.div key={s.big} {...fadeUp}>
              <p className="text-4xl md:text-5xl font-extrabold text-primary">{s.big}</p>
              <p className="text-base font-medium text-muted-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold text-foreground">14 metrics. One step. One app.</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">A complete body composition snapshot every time you step on the scale.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {measures.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.04 }} className="bg-card border border-border rounded-2xl p-5 text-left">
                <h3 className="text-sm font-bold text-foreground">{m.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
      <section className="py-20 bg-gradient-to-br from-[#0D0D1A] to-[#1A0D00]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6D00]">POWERED BY NERA AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Your weight is the least interesting thing about you.</h2>
            <p className="text-[#A0A0C0] text-lg mt-4 max-w-2xl mx-auto">
              Nera AI looks past the number on the scale to what it means for your heart — because visceral fat, metabolic age, and muscle loss are cardiac risk factors hiding in plain sight.
            </p>
          </div>

          {/* Cardiac Risk Spotlight */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            {/* Left - Content */}
            <motion.div {...fadeUp}>
              <span className="inline-block bg-[#FF6D00]/20 text-[#FF6D00] border border-[#FF6D00]/30 rounded-full px-4 py-1 text-sm font-medium">
                The number doctors actually care about
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-4">
                Visceral fat is the silent cardiac risk. Nera AI tracks it weekly.
              </h3>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-4">
                You can look healthy on the outside and carry dangerous levels of fat around your heart, liver, and intestines. Visceral fat — not body weight — is one of the strongest predictors of heart disease, inflammation, and metabolic stress.
              </p>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-3">
                Nera AI tracks your visceral fat trend week over week — not just the rank today, but whether it's moving in the right direction. When it combines with your ECG data and resting heart rate from the band, Nera AI shows you the full cardiac-body composition picture in one place.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["❤️ Visceral fat → cardiac risk link", "📈 Weekly trend, not daily noise", "🔗 Crosses with ECG + band data"].map((pill) => (
                  <span key={pill} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-white">{pill}</span>
                ))}
              </div>
            </motion.div>

            {/* Right - App UI Card */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">📊 Nera Cardiac-Body Report</span>
                  <span className="text-[#A0A0C0] text-sm">This week</span>
                </div>
                <div className="border-t border-white/10 my-4" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Visceral fat rank</span>
                    <span className="text-[#10B981] font-medium text-sm">8 → 7 ↓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Metabolic age</span>
                    <span className="text-[#10B981] font-medium text-sm">44 → 42 ↓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#A0A0C0] text-sm">Muscle mass</span>
                    <span className="text-[#F59E0B] font-medium text-sm">31.2kg ↔</span>
                  </div>
                </div>
                <div className="border-t border-white/10 my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-[#A0A0C0] text-sm flex items-center gap-1.5">
                    <Heart className="text-[#FF6D00]" size={14} /> Resting HR this week
                  </span>
                  <span className="text-[#10B981] font-medium text-sm">64 bpm ↓ from 68</span>
                </div>
                <div className="border-t border-white/10 my-4" />
                <p className="text-[#A0A0C0] text-xs italic">
                  Nera AI: Visceral fat dropped one rank this week and your resting heart rate fell 4 bpm. These move together — keep this direction for 4 more weeks and your cardiac risk profile improves measurably.
                </p>
              </div>
            </motion.div>
          </div>

          {/* 3 AI Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Scale, title: "Fat Loss vs Muscle Loss — Nera AI tells the difference", body: "The scale says you lost 2kg. But was it fat or muscle? Nera AI tracks your body fat %, lean mass, and muscle mass separately — so your programme is actually working, not just showing a lower number." },
              { icon: TrendingDown, title: "Metabolic Age — Moving Backwards", body: "Metabolic age higher than your real age is a warning sign. Nera AI tracks it month over month and correlates it with your activity data from the Rhythm Band — showing you exactly what's moving the needle." },
              { icon: Users, title: "10 Family Profiles, One Health Picture", body: "Every family member gets their own Nera AI trend line. Parents, kids, grandparents — each person's body composition is tracked separately. Nera AI flags when any profile shows a pattern worth paying attention to." },
            ].map((card) => (
              <motion.div key={card.title} {...fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF6D00]/50 transition-all">
                <card.icon className="text-[#FF6D00]" size={28} />
                <h4 className="text-white font-semibold text-lg mt-3">{card.title}</h4>
                <p className="text-[#A0A0C0] text-sm mt-2 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="bg-[#FF6D00]/10 border border-[#FF6D00]/30 rounded-2xl p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold text-xl">
                Pair with the SanketLife ECG and get{" "}
                <span className="text-[#FF6D00] font-bold">the most complete cardiac risk picture available at home.</span>
              </p>
              <p className="text-[#A0A0C0] text-sm mt-2">
                Visceral fat trend + ECG rhythm + resting heart rate + HRV — Nera AI combines all four into a single weekly cardiac health summary. No clinic visit. No referral needed.
              </p>
            </div>
            <Button asChild className="bg-[#FF6D00] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#E05A00] transition-all whitespace-nowrap shrink-0">
              <Link to="/devices/sanketlife-ecg">See SanketLife ECG →</Link>
            </Button>
          </div>
        </div>
      </section>

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

      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to know your body?</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">Step on. 5 seconds. 14 metrics. It's that simple.</p>
          <Button onClick={handleBuy} disabled={adding} className="mt-8 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">Buy Smart Scale — {fmt(scalePrice)}</Button>
        </div>
      </section>
      <StickyAddToCart
        productName="Agatsa Smart Scale"
        price={fmt(scalePrice)}
        unitPrice={scalePrice}
        onBuyNow={handleBuy}
        onAddToCart={(qty) => {
          useCartStore.getState().addItem({ productId: "scale_sub", productName: "Agatsa Smart Scale", variantTitle: "Default Title", price: scalePrice, quantity: qty });
          toast.success("Added to cart");
        }}
        themeColor="primary"
      />
    </SiteLayout>
  );
}
