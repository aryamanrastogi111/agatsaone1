import { useState, useEffect } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { StrikePrice } from "@/components/StrikePrice";
import { shipDateLabel, deliveryDateLabel } from "@/lib/shipDate";
import { useNavigate } from "react-router-dom";
import { usePricing } from "@/hooks/useDevicePricing";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Star, Check, ArrowRight, ShieldCheck, Package,
  Activity, Smartphone, Share2, Stethoscope,
  FileText, HeartPulse,
  Moon, UserCheck, CalendarCheck, Headphones,
  Award, CheckCircle2, AlertTriangle, Brain, ShoppingCart,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { EmiLine, TrustBar } from "@/components/EmiLine";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import sanketlifeHero from "@/assets/sanketlife-device-app.webp";
import { ProductReviewsSection } from "@/components/products/ProductReviewsSection";
import { sanketLifeEcgReviews } from "@/data/sanketLifeEcgReviews";
import { AwardsTrustSection } from "@/components/AwardsTrustSection";
import { TrustVideosSection } from "@/components/TrustVideosSection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function SanketLifeECGProduct() {
  const [adding, setAdding] = useState(false);
  const { prices, fmt } = usePricing();
  const ecgPrice = prices.ecg_bundle;
  useMetaPixelViewContent("SANKET_LIFE_ECG", "SanketLife 12-Lead ECG", ecgPrice);

  const handleAddToCart = (qtyOrEvent?: number | React.MouseEvent) => {
    const qty = typeof qtyOrEvent === "number" ? qtyOrEvent : 1;
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["ecg_bundle"], content_name: "SanketLife ECG", content_type: "product", value: ecgPrice * qty, currency: "INR" }); } catch {}
    }
    useCartStore.getState().addItem({ productId: "ecg_bundle", productName: "SanketLife 12-Lead ECG", variantTitle: "Default Title", price: ecgPrice, quantity: qty });
    toast.success(qty > 1 ? `${qty} SanketLife ECG devices added to cart` : "SanketLife ECG added to cart");
  };

  useSEO({
    title: "SanketLife ECG — Medical-Grade Heart Monitor at Home | Agatsa One",
    description:
      "Take a 12-lead ECG at home in 15 seconds. 98.5% accuracy. Share instantly with your doctor. Peace of mind for your heart. ₹4,999.",
  });

  return (
    <SiteLayout>
      {/* ─── SECTION 1: ABOVE THE FOLD ─── */}
      <section className="pt-8 pb-10 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link to="/devices" className="hover:text-primary">Devices</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">SanketLife ECG</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Image */}
            <motion.div {...fadeUp}>
              <img
                src={sanketlifeHero}
                alt="Person using SanketLife ECG monitor at home"
                className="w-full rounded-3xl shadow-2xl"
              />
            </motion.div>

            {/* Hero Content */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                That strange heartbeat{" "}
                <span className="text-primary">shouldn't be ignored.</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed max-w-lg">
                Take a medical-grade ECG at home in 15 seconds — and share it
                instantly with your doctor.
              </p>

              {/* Trust Strip */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: ShieldCheck, text: "Medical-grade ECG" },
                  { icon: Stethoscope, text: "Used by doctors" },
                  { icon: Share2, text: "Instant report sharing" },
                ].map((t) => (
                  <div
                    key={t.text}
                    className="flex items-center gap-2 bg-muted/60 rounded-full px-4 py-2"
                  >
                    <t.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{t.text}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="mt-8">
                <StrikePrice sku="ecg_bundle" price={ecgPrice} />
                <span className="text-sm text-muted-foreground ml-1">incl. GST</span>
                <EmiLine price={ecgPrice} />
                <StockUrgencyBar productKey="sanketlife" className="mt-3" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <span>📦</span>
                  <span><span className="font-semibold text-green-600">{shipDateLabel()}</span> · {deliveryDateLabel()}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">4.8/5 · 1,247 reviews</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={adding}
                  size="lg"
                  className="rounded-full px-8 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.35)]"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />Add to Cart — {fmt(ecgPrice)}
                </Button>
              </div>
              <TrustBar showCDSCO />
              <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Included FREE</span>
                <span className="text-sm font-semibold text-foreground">Nera AI Premium — 1 year</span>
                <span className="text-xs text-muted-foreground">No subscription needed</span>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                CDSCO Class B Medical Device · Lic. MFG/MD/2023/000231
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHAT SANKETLIFE DETECTS ─── */}
      <section className="py-14 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">12-Lead Clinical Picture</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              One device. A <span className="text-primary">full clinical picture</span> of your heart.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
              A 12-lead ECG sees your heart from 12 angles — surfacing patterns single-lead smartwatches can't.
            </p>
          </motion.div>

          {/* Life-threatening — full-width hero card */}
          <motion.div
            {...fadeUp}
            className="bg-destructive/5 border-2 border-destructive/30 ring-1 ring-destructive/10 rounded-3xl p-6 md:p-8 mb-6 shadow-[0_8px_32px_hsl(var(--destructive)/0.12)]"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-5">
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3 md:shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-destructive/15 flex items-center justify-center">
                  <AlertTriangle className="h-7 w-7 text-destructive" />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-destructive bg-destructive/10 border border-destructive/30 rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  Life-Threatening
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-destructive">Heart attack & critical events</h3>
                <p className="text-sm text-muted-foreground mt-1.5">The patterns where every minute matters.</p>
                <div className="grid sm:grid-cols-2 gap-2.5 mt-5">
                  {[
                    "STEMI (ST-Elevation Heart Attack)",
                    "NSTEMI / Ischemia patterns",
                    "Ventricular Tachycardia",
                    "Ventricular Fibrillation",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-foreground bg-card/60 border border-destructive/15 rounded-xl px-3 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-destructive shrink-0 mt-1.5" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other categories — compact 2-up */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: Activity,
                title: "Rhythm disorders",
                items: [
                  "Atrial Fibrillation (AFib) & Flutter",
                  "Supraventricular Tachycardia (SVT)",
                  "Bradycardia & Tachycardia",
                  "Premature beats (PVC, PAC)",
                ],
              },
              {
                icon: HeartPulse,
                title: "Conduction & structural clues",
                items: [
                  "AV blocks (1st / 2nd / 3rd degree)",
                  "Bundle Branch Blocks (LBBB / RBBB)",
                  "Long QT / Short QT intervals",
                  "Left Ventricular Hypertrophy signs",
                ],
              },
            ].map((cat, i) => (
              <motion.div
                key={cat.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <cat.icon className="h-6 w-6 mb-3 text-primary" />
                <h3 className="font-bold text-foreground mb-3">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp} className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            SanketLife provides clinical-grade ECG waveforms for review. Diagnosis and treatment decisions are made by your doctor.
          </motion.p>
        </div>
      </section>

      {/* ─── HOW IT'S TAKEN — animated scene ─── */}
      <HowItsTakenSection />

      {/* ─── WHY EARLY CHECKS MATTER (merged) ─── */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Most heart symptoms don't happen{" "}
              <span className="text-primary">inside hospitals.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              Palpitations at 2 AM. A flutter that lasts seconds. By the time you reach a clinic, the episode is over.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div {...fadeUp} className="bg-card border border-destructive/20 rounded-2xl p-6">
              <p className="text-xs font-bold text-destructive uppercase tracking-wider mb-4">Without early check</p>
              <div className="space-y-3">
                {["Symptoms appear", "Wait for appointment", "Symptoms gone by visit", "Risk continues undetected"].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="bg-card border border-primary/30 rounded-2xl p-6">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">With SanketLife</p>
              <div className="space-y-3">
                {["Symptoms appear", "Take ECG in 15 seconds", "Nera AI analyses instantly", "Share with doctor — get clarity"].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="text-sm text-foreground font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-14 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Three steps. Fifteen seconds.
            </h2>
            <p className="text-base text-muted-foreground mt-3">No medical training. Just hold and know.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />
            {[
              { icon: Smartphone, step: "01", title: "Hold the device", desc: "Place your thumbs on both sensors. No gel, no wires." },
              { icon: Activity, step: "02", title: "Capture your ECG", desc: "A 12-lead reading in 15 seconds via Bluetooth." },
              { icon: Share2, step: "03", title: "Share with your doctor", desc: "Nera AI analyses instantly. Send the PDF in one tap." },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Step {item.step}</span>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUSTED BY HOSPITALS + SOCIAL PROOF (merged) ─── */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Clinically validated. <span className="text-primary">Trusted at scale.</span>
            </h2>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { big: "98.5%", label: "Accuracy vs hospital ECG" },
              { big: "2.1 Lac+", label: "ECGs recorded" },
              { big: "500+", label: "Cities served" },
              { big: "200+", label: "Clinics & hospitals" },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }} className="bg-card border border-border rounded-2xl p-5 text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-primary">{s.big}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Validation cards — compact */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { name: "Sri Jayadeva Institute, Bengaluru", stat: "98.15% sensitivity", quote: "Clinically acceptable accuracy for detection of cardiac arrhythmias in ambulatory patients." },
              { name: "Narayana Health, Bengaluru", stat: "98.5% accuracy", quote: "High concordance with hospital-grade equipment across a diverse patient population." },
            ].map((inst) => (
              <motion.div key={inst.name} {...fadeUp} className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-base font-bold text-foreground">{inst.name}</h3>
                <p className="text-primary font-semibold text-sm mt-1">{inst.stat}</p>
                <p className="text-sm text-muted-foreground italic mt-3 leading-relaxed">"{inst.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NERA AI SECTION ─── */}
      <section className="py-14 bg-gradient-to-br from-[hsl(240,30%,8%)] to-[hsl(260,40%,12%)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Powered by Nera AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(0,0%,100%)] mt-2">
              One ECG is a moment. Nera AI builds your cardiac story.
            </h2>
            <p className="text-[hsl(240,10%,70%)] text-base md:text-lg mt-4 max-w-2xl mx-auto">
              Trained on <span className="font-semibold text-[hsl(0,0%,100%)]">1.5 Crore+ Indian health records</span>. 97.8% concordance with cardiologists.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center mt-12">
            <motion.div {...fadeUp}>
              <div className="bg-[hsl(0,0%,100%)]/5 border border-[hsl(0,0%,100%)]/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(0,0%,100%)] font-medium">Your Cardiac Journal</span>
                  <span className="text-[hsl(240,10%,70%)] text-sm">Last 30 days</span>
                </div>
                <div className="border-t border-[hsl(0,0%,100%)]/10 my-4" />
                <div className="space-y-4">
                  {[
                    { date: "Today, 7:12 AM", status: "Normal sinus rhythm", color: "hsl(160,84%,39%)", sub: "HR 63 bpm · HRV 42ms" },
                    { date: "Apr 5, 8:01 AM", status: "Normal sinus rhythm", color: "hsl(160,84%,39%)", sub: "HR 68 bpm · HRV 38ms" },
                    { date: "Apr 3, 7:44 AM", status: "Occasional PVC", color: "hsl(38,92%,50%)", sub: "Nera AI: Single PVC — isolated, no action." },
                    { date: "Apr 1, 8:22 AM", status: "Occasional PVC", color: "hsl(38,92%,50%)", sub: "Nera AI: Second PVC this week — flagged." },
                  ].map((row) => (
                    <div key={row.date}>
                      <div className="flex items-center justify-between">
                        <span className="text-[hsl(240,10%,70%)] text-sm">{row.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${row.color}20`, color: row.color }}>{row.status}</span>
                      </div>
                      <p className="text-[hsl(240,10%,70%)] text-xs mt-1">{row.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <span className="inline-block bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1 text-sm font-medium">
                What most devices miss
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-[hsl(0,0%,100%)] mt-4">Patterns only visible across time.</h3>
              <p className="text-[hsl(240,10%,70%)] text-base leading-relaxed mt-4">
                One abnormal ECG can be noise. The same pattern three times in a week is a signal. Nera AI knows your baseline — not just the population average.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mt-6">
                {[
                  { icon: AlertTriangle, title: "STEMI alerts" },
                  { icon: FileText, title: "Doctor-ready PDF" },
                  { icon: Brain, title: "Dual-algorithm" },
                ].map((c) => (
                  <div key={c.title} className="bg-[hsl(0,0%,100%)]/5 border border-[hsl(0,0%,100%)]/10 rounded-xl p-3 flex items-center gap-2">
                    <c.icon className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs text-[hsl(0,0%,100%)] font-medium">{c.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Button onClick={handleAddToCart} disabled={adding} size="lg" className="rounded-full px-10 text-base bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
              Get SanketLife + Nera AI — {fmt(ecgPrice)}
            </Button>
            <p className="text-[hsl(240,10%,70%)] text-sm mt-3">Includes Nera AI Premium — 1 year free</p>
          </div>
        </div>
      </section>

      {/* ─── WHEN YOU'D USE IT ─── */}
      <section className="py-14 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              When would you <span className="text-primary">actually use it?</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: HeartPulse, title: "Sudden palpitations", desc: "Your heart races unexpectedly. Capture what your doctor needs to see — right then." },
              { icon: Moon, title: "Night-time symptoms", desc: "Chest discomfort at 2 AM? Record an ECG in bed instead of waiting until morning." },
              { icon: UserCheck, title: "Monitoring your parents", desc: "Give them a device that captures data you can review — even from another city." },
              { icon: CalendarCheck, title: "Daily preventive checks", desc: "Build a baseline your cardiologist can track over time." },
            ].map((uc, i) => (
              <motion.div key={uc.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <uc.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{uc.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{uc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARISON ─── */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Hospital ECG vs <span className="text-primary">SanketLife</span>
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="py-3 px-4 text-left text-muted-foreground font-medium" />
                  <th className="py-3 px-4 text-center text-muted-foreground font-medium">Hospital</th>
                  <th className="py-3 px-4 text-center text-primary font-bold">SanketLife</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Availability", "By appointment", "Anytime"],
                  ["Time to result", "Hours to days", "15 seconds"],
                  ["Cost per ECG", "₹300–₹1,500", `Unlimited`],
                  ["AI analysis", "—", "Nera AI included"],
                  ["Trend tracking", "—", "Continuous timeline"],
                ].map(([feature, hospital, sanket]) => (
                  <tr key={feature} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-foreground font-medium">{feature}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{hospital}</td>
                    <td className="py-3 px-4 text-center text-primary font-semibold">{sanket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-14 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Frequently asked questions</h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Is it really as accurate as a hospital ECG?", a: "SanketLife is validated at 98.15% sensitivity at Sri Jayadeva Institute and 98.5% accuracy at Narayana Health — comparable to standard hospital ECG machines for portable home use." },
              { q: "Can my doctor read the reports?", a: "Yes. Every reading generates a clinical PDF with full waveform data and Nera AI interpretation. Share via WhatsApp, email, or the Agatsa One app." },
              { q: "How fast is the recording?", a: "15 seconds. Place your thumbs on both sensors and SanketLife captures a complete 12-lead ECG via Bluetooth." },
              { q: "Is it safe for home use?", a: "Yes. SanketLife is CDSCO-approved as a Class B medical device, designed for anyone to use at home — no medical training required." },
              { q: "Who should use this?", a: "Anyone wanting peace of mind — people with palpitations, family history of heart disease, post-cardiac patients, or caregivers monitoring elderly parents." },
              { q: "What if something abnormal is detected?", a: "Nera AI sends an in-app alert with a plain-language explanation and a recommended next step. Nera flags and guides — your doctor diagnoses." },
            ].map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── WATCH IT IN ACTION ─── */}
      <section className="py-16 md:py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Watch it in action</h2>
          <div className="mb-6">
            <VideoCard video={{ id: "1UIKpA7H4O4", title: "SanketLife ECG — Official Demo" }} hero />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <VideoCard video={{ id: "Ck8syb2uQdo", title: "Why Watch ECGs Aren't Enough" }} />
            <VideoCard video={{ id: "ZkLv3wyVtfg", title: "Real Story: What the ECG Revealed" }} />
            <VideoCard video={{ id: "4nldXDM1w7w", title: "Heart Problems Don't Check Your Age" }} />
          </div>
          <YouTubeChannelLink />
        </div>
      </section>

      {/* ─── FINAL CTA (with inline trust strip) ─── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Take control of your heart health today.
            </h2>
            <p className="text-primary-foreground/80 mt-3 text-base md:text-lg">Safe. Simple. Reliable.</p>
            <Button
              onClick={handleAddToCart}
              disabled={adding}
              size="lg"
              className="mt-7 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart — {fmt(ecgPrice)}
            </Button>
            <p className="text-primary-foreground/70 text-sm mt-4">
              Free shipping · 1-year warranty · Nera AI Premium 1 year free
            </p>

            {/* Inline trust chips */}
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { icon: Award, text: "1-Year Warranty" },
                { icon: Headphones, text: "Real Support" },
                { icon: CheckCircle2, text: "2.1 Lac+ ECGs" },
              ].map((t) => (
                <div key={t.text} className="flex flex-col items-center gap-1.5 bg-primary-foreground/10 border border-primary-foreground/15 rounded-xl px-3 py-3">
                  <t.icon className="h-4 w-4 text-primary-foreground" />
                  <span className="text-xs text-primary-foreground/90 font-medium text-center">{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's in the box */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-xl font-bold text-foreground text-center mb-6">What's in the box</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "SanketLife ECG device",
              "CR2032 coin battery (pre-installed)",
              "Carrying pouch",
              "Quick start guide (EN + HI)",
              "1-year warranty card",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
                <Package className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 bg-primary/10 rounded-xl border border-primary/20 p-4">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary">3-month Nera AI Premium (₹1,197 value)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Related Devices */}
      <section className="py-10 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Complete your health monitoring</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "EasyTouch Wellness", desc: "BP, SpO₂, metabolic health — pairs with ECG for a complete picture", link: "/devices/easytouch-wellness" },
              { name: "EasyTouch Rhythm Band", desc: "24/7 continuous HR, HRV, sleep — between-reading monitoring", link: "/devices/rhythm-band" },
              { name: "Agatsa Smart Scale", desc: "14 body metrics including visceral fat and BMI", link: "/devices/smart-scale" },
            ].map((d) => (
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
      <StickyAddToCart
        productName="SanketLife 12-Lead ECG"
        price={fmt(ecgPrice)}
        unitPrice={ecgPrice}
        onBuyNow={handleAddToCart}
        onAddToCart={handleAddToCart}
        themeColor="primary"
      />

      <TrustVideosSection />
      <AwardsTrustSection />
      <ProductReviewsSection reviews={sanketLifeEcgReviews} />
    </SiteLayout>
  );
}

/* ──────────────────────────────────────────────────────────────
 * HowItsTakenSection
 * 3-stage looping animation: device → thumbs on sensors → phone w/ ECG
 * ────────────────────────────────────────────────────────────── */
function HowItsTakenSection() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0); // 0 device, 1 +thumbs, 2 +phone

  useEffect(() => {
    if (reduce) { setStage(2); return; }
    const timings = [2000, 2200, 3200]; // dwell per stage
    let i = 0;
    const tick = () => {
      i = (i + 1) % 3;
      setStage(i);
    };
    const id = setInterval(tick, 2600);
    return () => clearInterval(id);
  }, [reduce]);

  // Device shifts left when thumbs/phone appear so the scene composes nicely
  const deviceX = stage === 0 ? 0 : stage === 1 ? -40 : -110;
  const deviceScale = stage === 0 ? 1 : 0.92;

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How it's taken</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            12-lead ECG at home. <span className="text-primary">Hospital-grade.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
            Two thumbs. 30 seconds. A complete ECG on your phone — ready to share with any doctor.
          </p>
        </motion.div>

        {/* Animated stage */}
        <motion.div
          {...fadeUp}
          className="relative mx-auto rounded-3xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden h-[340px] md:h-[420px] shadow-[0_8px_40px_hsl(var(--primary)/0.10)]"
        >
          {/* subtle grid backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[460px] max-w-full h-full flex items-center justify-center">
              {/* DEVICE */}
              <motion.div
                animate={{ x: deviceX, scale: deviceScale, y: stage === 0 ? [0, -6, 0] : 0 }}
                transition={{
                  x: { duration: 0.8, ease: "easeInOut" },
                  scale: { duration: 0.8, ease: "easeInOut" },
                  y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute z-20"
                style={{ left: "50%", marginLeft: -110 }}
              >
                <Device active={stage >= 1} />
              </motion.div>

              {/* THUMBS */}
              <motion.div
                initial={false}
                animate={{
                  y: stage >= 1 ? 0 : 140,
                  opacity: stage >= 1 ? 1 : 0,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute z-30"
                style={{ left: "50%", marginLeft: -70 + deviceX, top: "50%", marginTop: -10 }}
              >
                <Thumbs />
              </motion.div>

              {/* PHONE */}
              <motion.div
                initial={false}
                animate={{
                  x: stage >= 2 ? 0 : 220,
                  opacity: stage >= 2 ? 1 : 0,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute z-10"
                style={{ left: "50%", marginLeft: 20 }}
              >
                <PhoneWithEcg play={stage >= 2} />
              </motion.div>
            </div>
          </div>

          {/* Stage label */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  stage === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Step chips */}
        <motion.div {...fadeUp} className="grid sm:grid-cols-3 gap-3 mt-6">
          {[
            { n: "1", t: "Hold the device", s: "Pocket-sized, no wires." },
            { n: "2", t: "Place both thumbs", s: "On the two sensor pads." },
            { n: "3", t: "ECG on your phone", s: "Share the PDF with any doctor." },
          ].map((step) => (
            <div key={step.n} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                {step.n}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{step.t}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.s}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Device({ active }: { active: boolean }) {
  return (
    <div className="relative w-[220px] h-[110px] rounded-[22px] bg-gradient-to-b from-white to-[hsl(0_0%_94%)] shadow-[0_14px_40px_hsl(var(--foreground)/0.30)] border border-foreground/10 flex items-center pl-3 pr-3">
      {/* brand on left */}
      <div className="text-[10px] tracking-wide font-bold text-foreground/70 italic rotate-0 w-[42px] text-center">
        SanketLife
      </div>
      {/* teal sensor panel — horizontal */}
      <div className="ml-2 flex-1 h-[82px] rounded-[14px] bg-gradient-to-r from-[hsl(180_55%_55%)] via-[hsl(170_50%_50%)] to-[hsl(95_55%_55%)] flex items-center justify-around px-3 shadow-inner">
        {[0, 1].map((i) => (
          <div key={i} className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(0_0%_55%)] via-[hsl(0_0%_38%)] to-[hsl(0_0%_25%)] border-2 border-white/70 shadow-md flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-foreground/60" />
            </div>
            {active && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-destructive/70 animate-ping" />
                <span
                  className="absolute inset-0 rounded-full border border-destructive/40 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
          </div>
        ))}
      </div>
      {/* status dot */}
      <div className="absolute bottom-1.5 right-3">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-success animate-pulse" : "bg-foreground/20"}`} />
      </div>
    </div>
  );
}

function Thumbs() {
  return (
    <div className="flex gap-[60px]">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="w-14 h-24 rounded-t-[28px] rounded-b-[12px] bg-gradient-to-b from-[hsl(28_55%_75%)] to-[hsl(28_45%_60%)] border border-foreground/20 shadow-md relative"
          style={{ transform: i === 0 ? "rotate(-8deg)" : "rotate(8deg)" }}
        >
          {/* nail */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-5 rounded-t-full bg-[hsl(28_30%_88%)]" />
          {/* knuckle line */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-7 h-px bg-foreground/15" />
        </div>
      ))}
    </div>
  );
}

function PhoneWithEcg({ play }: { play: boolean }) {
  return (
    <div className="w-[150px] h-[260px] rounded-[28px] bg-foreground p-2 shadow-[0_12px_40px_hsl(var(--foreground)/0.35)] border border-foreground/40">
      <div className="w-full h-full rounded-[22px] bg-[hsl(240_33%_8%)] relative overflow-hidden flex flex-col">
        {/* notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full bg-foreground" />
        {/* status */}
        <div className="pt-6 px-3">
          <p className="text-[8px] tracking-widest text-success font-bold">● LIVE ECG</p>
          <p className="text-[10px] text-background/80 font-semibold mt-0.5">72 BPM</p>
        </div>
        {/* ECG canvas */}
        <div className="flex-1 mt-1 mx-2 rounded-md bg-[hsl(240_33%_5%)] relative overflow-hidden">
          {/* grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(hsl(0 100% 64% / 0.18) 1px, transparent 1px), linear-gradient(90deg, hsl(0 100% 64% / 0.18) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }}
          />
          <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <motion.path
              d="M0,50 L30,50 L36,50 L40,30 L44,70 L48,20 L52,80 L56,50 L80,50 L100,50 L104,40 L108,55 L112,50 L140,50 L146,50 L150,32 L154,68 L158,18 L162,82 L166,50 L200,50"
              fill="none"
              stroke="hsl(var(--destructive))"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: play ? [0, 1] : 0 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              style={{ filter: "drop-shadow(0 0 3px hsl(var(--destructive)/0.7))" }}
            />
          </svg>
        </div>
        <div className="px-3 py-2 text-[8px] text-background/50 tracking-wider">
          LEAD I · NORMAL SINUS
        </div>
      </div>
    </div>
  );
}
