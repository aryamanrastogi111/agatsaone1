import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Check, ArrowRight, Bluetooth, Clock, ShieldCheck, Package, Mic, ChevronDown, AlertTriangle, FileText, Brain } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import sanketlifeHero from "@/assets/sanketlife-device-app.png";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const measures = [
  { title: "12-Lead ECG", desc: "Full cardiac waveform — I, II, III, aVR, aVL, aVF, V1–V6" },
  { title: "Heart Rate", desc: "Beats per minute, real-time and historical" },
  { title: "HRV", desc: "Heart rate variability — key indicator of cardiac resilience" },
  { title: "Arrhythmia Detection", desc: "AFib, PVCs, SVT, bundle branch blocks" },
  { title: "ST Segment", desc: "STEMI and ischemia detection" },
  { title: "QTc Interval", desc: "Drug-induced QT prolongation monitoring" },
];

const steps = [
  { n: "1", title: "Place your fingers on the sensors", copy: "Place your thumbs on both metal sensors — one on each side of the device. No gel, no leads, no preparation needed. Anyone can do this in seconds." },
  { n: "2", title: "Hold for 30 seconds", copy: "SanketLife captures a clinical-quality 12-lead ECG signal, transmitted via Bluetooth to your Agatsa One app in real time. A progress indicator shows you exactly when the reading is complete." },
  { n: "3", title: "Get your AI analysis", copy: "Nera AI analyses your ECG instantly — detecting rhythm anomalies, flagging risks, and adding this reading to your cardiac health timeline. Share the PDF with your cardiologist in one tap." },
];

const boxItems = [
  "SanketLife ECG device (1 unit)",
  "USB-C charging cable",
  "Carrying pouch",
  "Quick start guide (English + Hindi)",
  "1-year manufacturer warranty card",
];

const faqs = [
  { q: "Do I need medical training to use SanketLife ECG?", a: "No. SanketLife ECG is designed for home use by anyone. Place your thumbs on the sensors, hold for 30 seconds, and let Nera AI do the analysis. The app guides you through every step." },
  { q: "Is the ECG reading as accurate as a hospital ECG?", a: "SanketLife has been clinically validated at 98.15% sensitivity at Sri Jayadeva Institute and 98.5% accuracy at Narayana Health. While it is not a replacement for a full in-hospital workup, it is the most accurate portable ECG device available for home monitoring in India." },
  { q: "Can my cardiologist receive my ECG reports?", a: "Yes. From the Agatsa One app, you can share a full ECG PDF report with any doctor via WhatsApp, email, or the app's built-in sharing. Doctors enrolled in the Agatsa One provider platform can receive your readings directly in their portal." },
  { q: "How often should I take an ECG?", a: "For most users, once daily or as advised by your doctor is recommended. For post-cardiac event patients on the Recovery Programme, the programme specifies ECG frequency. For general wellness, daily morning ECG tracking is a great baseline habit." },
  { q: "What happens if Nera AI detects something abnormal?", a: "You will receive an in-app alert with a plain-English explanation of what was detected and a recommended next step — for example, 'Contact your doctor within 24 hours' or 'This reading appears normal — here's what we found.' Nera AI does not diagnose — it flags and guides." },
];

const relatedDevices = [
  { name: "EasyTouch Wellness", desc: "Pairs with ECG for complete cardiac + metabolic picture", link: "/devices/easytouch-wellness" },
  { name: "EasyTouch Rhythm Band", desc: "Continuous between-reading monitoring", link: "/devices/rhythm-band" },
  { name: "Agatsa Smart Scale", desc: "Complete body health picture", link: "/devices/smart-scale" },
];

export default function SanketLifeECGProduct() {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const handleBuy = () => {
    setAdding(true);
    addItem({ productId: "sanketlife-ecg", productName: "SanketLife 12-Lead ECG", variantTitle: "Default Title", price: 4999, quantity: 1 });
    toast.success("SanketLife ECG added to cart", { position: "top-center" });
    setTimeout(() => setAdding(false), 500);
  };
  useSEO({ title: "SanketLife 12-Lead ECG Monitor — Hospital-Grade Portable ECG | Agatsa One", description: "12-lead ECG in your pocket. 98.15% sensitivity validated at Sri Jayadeva Institute. Arrhythmia detection, ST analysis, Nera AI reports. ₹4,999." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-8 pb-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/devices" className="hover:text-primary">Devices</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">SanketLife ECG</span>
          </nav>

          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            <motion.img
              {...fadeUp}
              src={sanketlifeHero}
              alt="SanketLife 12-Lead ECG Monitor"
              className="w-full rounded-3xl shadow-2xl"
            />

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <span className="inline-block text-sm font-medium text-primary-foreground bg-primary rounded-full px-4 py-1.5 mb-4">
                CDSCO Class B Medical Device · MFG/MD/2023/000231
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
                SanketLife 12-Lead ECG Monitor
              </h1>

              <p className="text-xl md:text-2xl font-bold text-primary mt-3">
                The ECG machine that fits in your pocket — and sends results to your AI.
              </p>

              <p className="text-lg text-muted-foreground mt-4 max-w-[480px]">
                Hospital-grade 12-lead ECG readings in 30 seconds. Clinically validated at 98.15% sensitivity. Powered by Nera AI analysis. For anyone — patients, caregivers, and high-risk individuals.
              </p>

              {/* Price */}
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-foreground">₹4,999</span>
                <span className="text-sm text-muted-foreground ml-2">inclusive of GST</span>
                <div className="mt-2 inline-flex items-center gap-2 bg-[hsl(270,60%,96%)] dark:bg-[hsl(270,40%,20%)] border border-[hsl(270,60%,80%)] dark:border-[hsl(270,40%,40%)] rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-[hsl(270,80%,50%)] uppercase tracking-wide">Included FREE</span>
                  <span className="text-sm font-semibold text-foreground">Nera AI Premium — 3 months</span>
                  <span className="text-xs text-muted-foreground">(worth ₹1,197)</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">4.8/5 (1,247 reviews)</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleBuy} disabled={adding} className="rounded-full px-8 py-4 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
                  Buy SanketLife ECG — ₹4,999
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 py-4 text-base border-2 border-primary text-primary">
                  <Link to="/app?device=ecg">Download Agatsa One App (free)</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[hsl(260,100%,97%)] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { big: "98.5%", label: "ECG Accuracy", sub: "Narayana Health & Sri Jayadeva" },
            { big: "30 seconds", label: "Time for a 12-lead ECG", sub: "No gel, no preparation" },
            { big: "2.1 Lac+", label: "ECG readings analysed", sub: "By Nera AI to date" },
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
            <h2 className="text-3xl font-bold text-foreground">Complete cardiac visibility</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
              SanketLife captures the same 12 leads a hospital ECG machine captures. Nera AI analyses every lead.
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
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-foreground text-center">
            How to take an ECG in 30 seconds
          </motion.h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto md:mx-0">
                  {s.n}
                </div>
                <h3 className="text-lg font-bold text-foreground mt-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nera AI Intelligence */}
      <section className="py-20 bg-gradient-to-br from-[#0D0D1A] to-[#120D2A]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#7C4DFF]">POWERED BY NERA AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">One ECG is a moment. Nera AI builds your cardiac story.</h2>
            <p className="text-[#A0A0C0] text-lg mt-4 max-w-2xl mx-auto">
              A single reading tells you what your heart did today. Nera AI analyses every ECG you've ever taken — finding patterns, tracking trends, and catching what one reading alone never could.
            </p>
          </div>

          {/* Cardiac Timeline Spotlight */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            {/* Left - App UI Card */}
            <motion.div {...fadeUp}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">📋 Your Cardiac Journal</span>
                  <span className="text-[#A0A0C0] text-sm">Last 30 days</span>
                </div>
                <div className="border-t border-white/10 my-4" />
                <div className="space-y-4">
                  {[
                    { date: "Today, 7:12 AM", status: "Normal sinus rhythm", color: "#10B981", sub: "HR 63 bpm · HRV 42ms · QTc 398ms" },
                    { date: "Apr 5, 8:01 AM", status: "Normal sinus rhythm", color: "#10B981", sub: "HR 68 bpm · HRV 38ms · QTc 401ms" },
                    { date: "Apr 3, 7:44 AM", status: "Occasional PVC", color: "#F59E0B", sub: "Nera AI: Single PVC detected. Isolated — no action needed." },
                    { date: "Apr 1, 8:22 AM", status: "Occasional PVC", color: "#F59E0B", sub: "Nera AI: Second PVC this week. Flagged for monitoring." },
                    { date: "Mar 28, 7:55 AM", status: "Normal sinus rhythm", color: "#10B981", sub: "HR 66 bpm · HRV 41ms" },
                  ].map((row) => (
                    <div key={row.date}>
                      <div className="flex items-center justify-between">
                        <span className="text-[#A0A0C0] text-sm">{row.date}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${row.color}20`, color: row.color }}>{row.status}</span>
                      </div>
                      <p className="text-[#A0A0C0] text-xs mt-1">{row.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 my-4" />
                <p className="text-[#A0A0C0] text-xs italic">
                  Nera AI: Two isolated PVCs in 7 days — below the threshold for concern, but flagged. Share this journal with your cardiologist at your next visit.
                </p>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <span className="inline-block bg-[#7C4DFF]/20 text-[#7C4DFF] border border-[#7C4DFF]/30 rounded-full px-4 py-1 text-sm font-medium">
                What most devices miss
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-4">
                Patterns only visible across time. Not one reading.
              </h3>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-4">
                One abnormal ECG reading can be noise — a deep breath, a movement, a bad night's sleep. The same pattern appearing three times in a week is a signal.
              </p>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-3">
                Nera AI compares every new ECG to your entire cardiac history. It knows your baseline. It knows what's normal for you — not just what's normal for the population. When something deviates from your pattern, Nera flags it. When it repeats, Nera escalates.
              </p>
              <p className="text-[#A0A0C0] text-base leading-relaxed mt-3">
                50,000+ ECGs analysed. Your heart is not a stranger to Nera.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["📋 Full cardiac journal", "🔁 Pattern repeat detection", "📤 Share with cardiologist — 1 tap"].map((pill) => (
                  <span key={pill} className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm text-white">{pill}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3 AI Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: AlertTriangle, iconColor: "#EF4444", title: "Real-Time STEMI Detection", body: "STEMI — a major, time-critical cardiac event — shows up in the ST segment before symptoms peak. Nera AI analyses your ST segment on every reading and sends an immediate alert if elevation is detected. Seconds matter. Nera doesn't wait." },
              { icon: FileText, iconColor: "#7C4DFF", title: "Cardiologist-Ready PDF Report", body: "Every ECG reading generates a full clinical PDF — waveform, findings, Nera AI interpretation, and your 30-day trend. Share it with any doctor via WhatsApp or email in one tap. No printing. No clinic visit just to share data." },
              { icon: Brain, iconColor: "#7C4DFF", title: "Dual-Algorithm Analysis", body: "Nera AI runs two independent analysis engines on every ECG — a rhythm classification model and a waveform digitizer — and cross-checks results. Disagreements between the two are flagged for a second look. No single point of failure." },
            ].map((card) => (
              <motion.div key={card.title} {...fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#7C4DFF]/50 transition-all">
                <card.icon style={{ color: card.iconColor }} size={28} />
                <h4 className="text-white font-semibold text-lg mt-3">{card.title}</h4>
                <p className="text-[#A0A0C0] text-sm mt-2 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="bg-[#7C4DFF]/10 border border-[#7C4DFF]/30 rounded-2xl p-8 mt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-semibold text-xl">
                The required device for the{" "}
                <span className="text-[#7C4DFF] font-bold">Post Heart Attack Recovery Programme</span>
              </p>
              <p className="text-[#A0A0C0] text-sm mt-2">
                Daily ECG task. Cardiac score tracking. Abnormal rhythm detection with automatic doctor notification. Nera AI generates a weekly cardiac report your doctor reviews — without you having to travel to the clinic.
              </p>
            </div>
            <Button asChild className="bg-[#7C4DFF] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6B3FE8] transition-all whitespace-nowrap shrink-0">
              <Link to="/programmes">View the Programme →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Clinical Evidence */}
      <section className="py-20 bg-background">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Clinical Validation</p>
            <h2 className="text-3xl font-bold text-foreground">Validated at India's top cardiac hospitals</h2>
          </motion.div>

          <div className="space-y-6">
          <motion.div {...fadeUp} className="bg-[hsl(260,100%,97%)] rounded-3xl p-8 md:p-10">
            <h3 className="text-lg font-bold text-foreground">Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru</h3>

            <table className="w-full mt-6 text-sm">
              <tbody>
                {[
                  ["Sensitivity", "98.15%"],
                  ["Comparison device", "Mortara ELI 250c (hospital-grade ECG)"],
                  ["Patient population", "200 ambulatory cardiac patients"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <td className="py-3 text-muted-foreground font-medium">{k}</td>
                    <td className="py-3 text-foreground font-semibold text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <blockquote className="mt-8 bg-card rounded-2xl p-6 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground italic">
                "The SanketLife device demonstrated clinically acceptable accuracy for detection of cardiac arrhythmias in ambulatory patients, with sensitivity and specificity comparable to standard 12-lead ECG equipment."
              </p>
              <footer className="mt-3 text-xs font-medium text-foreground">
                — Clinical Study Report, Sri Jayadeva Institute of Cardiovascular Sciences
              </footer>
            </blockquote>
          </motion.div>

          <motion.div {...fadeUp} className="bg-[hsl(260,100%,97%)] rounded-3xl p-8 md:p-10">
            <h3 className="text-lg font-bold text-foreground">Narayana Health, Bengaluru</h3>

            <table className="w-full mt-6 text-sm">
              <tbody>
                {[
                  ["Accuracy", "98.5%"],
                  ["Study type", "Clinical validation study"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <td className="py-3 text-muted-foreground font-medium">{k}</td>
                    <td className="py-3 text-foreground font-semibold text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <blockquote className="mt-8 bg-card rounded-2xl p-6 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground italic">
                "SanketLife ECG readings demonstrated high concordance with hospital-grade equipment across a diverse patient population."
              </p>
              <footer className="mt-3 text-xs font-medium text-foreground">
                — Narayana Health Validation Study
              </footer>
            </blockquote>
          </motion.div>
          </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to take your first ECG?</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">Most users take their first reading within 5 minutes of unboxing.</p>
          <Button onClick={handleBuy} disabled={adding} className="mt-8 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
            Buy SanketLife ECG — ₹4,999
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
