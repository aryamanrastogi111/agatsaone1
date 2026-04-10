import { useState, useEffect } from "react";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star, Check, ArrowRight, ShieldCheck, Package, Heart,
  Clock, Activity, Smartphone, Share2, Stethoscope, Users,
  MapPin, Building2, Shield, Zap, FileText, Phone, HeartPulse,
  Moon, Eye, UserCheck, Timer, CalendarCheck, Headphones,
  Award, RefreshCw, CheckCircle2, AlertTriangle, Brain,
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

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function SanketLifeECGProduct() {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  useMetaPixelViewContent("SANKET_LIFE_ECG", "SanketLife 12-Lead ECG", 3999);

  const handleBuy = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["ecg_bundle"], content_name: "SanketLife ECG", content_type: "product", value: 4999, currency: "INR" }); } catch {}
    }
    navigate("/checkout?sku=ecg_bundle");
  };

  useSEO({
    title: "SanketLife ECG — Medical-Grade Heart Monitor at Home | Agatsa One",
    description:
      "Take a 12-lead ECG at home in 15 seconds. 98.5% accuracy. Share instantly with your doctor. Peace of mind for your heart. ₹3,999.",
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
                <span className="text-4xl font-extrabold text-foreground">₹3,999</span>
                <span className="text-sm text-muted-foreground ml-2">incl. GST</span>
                <EmiLine price={3999} />
                <StockUrgencyBar productKey="sanketlife" className="mt-3" />
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
                  onClick={handleBuy}
                  disabled={adding}
                  size="lg"
                  className="rounded-full px-8 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.35)]"
                >
                  Check Your Heart Anytime — ₹3,999
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 text-base border-2 border-primary text-primary">
                  <Link to="/app?device=ecg">Download Agatsa One App (free)</Link>
                </Button>
              </div>
              <TrustBar />
              <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">Included FREE</span>
                <span className="text-sm font-semibold text-foreground">Nera AI Premium — 3 months</span>
                <span className="text-xs text-muted-foreground">(worth ₹1,197)</span>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                CDSCO Class B Medical Device · Lic. MFG/MD/2023/000231
              </p>
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
            <VideoCard video={{ id: "Lehu-0DV-74", title: "SanketLife ECG — Official Demo" }} hero />
          </div>
          {/* Supporting videos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <VideoCard video={{ id: "Ck8syb2uQdo", title: "Why Watch ECGs Aren't Enough" }} />
            <VideoCard video={{ id: "ZkLv3wyVtfg", title: "Real Story: What the ECG Revealed" }} />
            <VideoCard video={{ id: "4nldXDM1w7w", title: "Heart Problems Don't Check Your Age" }} />
          </div>
          <YouTubeChannelLink />
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Most heart symptoms don't happen{" "}
              <span className="text-primary">inside hospitals.</span>
            </h2>
          </motion.div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6 text-left">
            {[
              { icon: AlertTriangle, title: "Symptoms appear suddenly", desc: "Palpitations at 2 AM. A racing heart during a meeting. A flutter that lasts only seconds." },
              { icon: Clock, title: "Hospital visits take time", desc: "By the time you get an appointment, the episode is over. The ECG comes back normal." },
              { icon: Eye, title: "Symptoms vanish before diagnosis", desc: "Intermittent arrhythmias are invisible unless captured in the moment they occur." },
              { icon: HeartPulse, title: "Anxiety continues", desc: "Was it nothing? Or something serious? Without data, you're left guessing — and worrying." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <item.icon className="h-6 w-6 text-destructive/70 mb-3" />
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeUp}
            className="mt-10 text-lg font-semibold text-foreground"
          >
            Waiting to check can make everything worse.
          </motion.p>
        </div>
      </section>

      {/* ─── SECTION 3: WHY EARLY CHECK MATTERS ─── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Early detection saves lives.{" "}
              <span className="text-primary">Delay creates risk.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Path A — Delay */}
            <motion.div
              {...fadeUp}
              className="bg-card border border-destructive/20 rounded-2xl p-8"
            >
              <p className="text-sm font-bold text-destructive uppercase tracking-wider mb-4">Without early check</p>
              <div className="space-y-4">
                {[
                  "Symptoms appear",
                  "Wait for appointment",
                  "Symptoms gone by visit",
                  "No data for doctor",
                  "Risk continues undetected",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Path B — Early Check */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-primary/20 rounded-2xl p-8"
            >
              <p className="text-sm font-bold text-primary uppercase tracking-wider mb-4">With SanketLife</p>
              <div className="space-y-4">
                {[
                  "Symptoms appear",
                  "Take ECG in 15 seconds",
                  "Nera AI analyses instantly",
                  "Share report with doctor",
                  "Get clarity. Take action.",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-foreground font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── MID CTA 1 ─── */}
      <section className="py-10 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-foreground font-semibold text-lg">
            Don't wait for the next episode. Be ready.
          </p>
          <Button
            onClick={handleBuy}
            disabled={adding}
            className="mt-3 rounded-full px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            Check Your Heart Anytime — ₹3,999
          </Button>
          <p className="text-primary-foreground/70 text-xs mt-2 font-medium">Included FREE: Nera AI Premium — 3 months (worth ₹1,197)</p>
        </div>
      </section>

      {/* ─── SECTION 4: PRODUCT INTRODUCTION ─── */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block text-xs font-semibold text-primary-foreground bg-primary rounded-full px-4 py-1.5 mb-4 uppercase tracking-wider">
                Your Personal ECG
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Meet SanketLife —{" "}
                <span className="text-primary">your personal ECG at home.</span>
              </h2>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                A pocket-sized, medical-grade ECG device that captures a full
                12-lead reading in 15 seconds. No wires. No gel. No training needed.
              </p>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                Capture your ECG the moment symptoms appear — at home, at work,
                or anywhere. Then share the clinical report with your doctor
                instantly. That's it.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["12-Lead ECG", "15-Second Capture", "AI Analysis", "Doctor Sharing"].map((tag) => (
                  <span key={tag} className="bg-primary/10 text-primary text-sm font-medium rounded-full px-4 py-1.5">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <img
                src={sanketlifeHero}
                alt="SanketLife ECG device and Agatsa One app"
                className="w-full rounded-3xl"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: HOW IT WORKS ─── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Three steps. Fifteen seconds.{" "}
              <span className="text-primary">Complete clarity.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-3">
              No medical training. No complicated setup. Just hold and know.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-[48px] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />

            {[
              {
                icon: Smartphone,
                step: "01",
                title: "Hold the device",
                desc: "Place your thumbs on both metal sensors. No gel, no wires, no preparation.",
              },
              {
                icon: Activity,
                step: "02",
                title: "Capture your ECG",
                desc: "SanketLife records a medical-grade 12-lead ECG in just 15 seconds via Bluetooth.",
              },
              {
                icon: Share2,
                step: "03",
                title: "Share with your doctor",
                desc: "Nera AI analyses your reading instantly. Share the PDF report with your cardiologist in one tap.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: TRUST & MEDICAL AUTHORITY ─── */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trusted by <span className="text-primary">medical professionals.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-3">
              Clinically validated at India's top cardiac institutions.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                name: "Sri Jayadeva Institute of Cardiovascular Sciences, Bengaluru",
                stats: [
                  ["Sensitivity", "98.15%"],
                  ["Comparison", "Mortara ELI 250c (hospital-grade)"],
                  ["Population", "200 ambulatory cardiac patients"],
                ],
                quote: "The SanketLife device demonstrated clinically acceptable accuracy for detection of cardiac arrhythmias in ambulatory patients.",
                source: "Clinical Study Report, Sri Jayadeva Institute",
              },
              {
                name: "Narayana Health, Bengaluru",
                stats: [
                  ["Accuracy", "98.5%"],
                  ["Study type", "Clinical validation study"],
                ],
                quote: "SanketLife ECG readings demonstrated high concordance with hospital-grade equipment across a diverse patient population.",
                source: "Narayana Health Validation Study",
              },
            ].map((inst) => (
              <motion.div
                key={inst.name}
                {...fadeUp}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <h3 className="text-lg font-bold text-foreground">{inst.name}</h3>
                <table className="w-full mt-4 text-sm">
                  <tbody>
                    {inst.stats.map(([k, v]) => (
                      <tr key={k} className="border-b border-border last:border-0">
                        <td className="py-3 text-muted-foreground font-medium">{k}</td>
                        <td className="py-3 text-foreground font-semibold text-right">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <blockquote className="mt-6 bg-muted/50 rounded-xl p-5 border-l-4 border-primary">
                  <p className="text-sm text-muted-foreground italic">"{inst.quote}"</p>
                  <footer className="mt-2 text-xs font-medium text-foreground">— {inst.source}</footer>
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: SOCIAL PROOF ─── */}
      <section className="py-10 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trusted by <span className="text-primary">families across India.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Activity, big: "2.1 Lac+", label: "ECGs recorded" },
              { icon: Users, big: "50,000+", label: "Active users" },
              { icon: MapPin, big: "500+", label: "Cities served" },
              { icon: Building2, big: "200+", label: "Clinics & hospitals" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <s.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <p className="text-3xl font-extrabold text-primary">{s.big}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NERA AI SECTION ─── */}
      <section className="py-12 bg-gradient-to-br from-[hsl(240,30%,8%)] to-[hsl(260,40%,12%)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">POWERED BY NERA AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(0,0%,100%)] mt-2">
              One ECG is a moment. Nera AI builds your cardiac story.
            </h2>
            <p className="text-[hsl(240,10%,70%)] text-lg mt-4 max-w-2xl mx-auto">
              Trained on <span className="font-semibold text-[hsl(0,0%,100%)]">1.5 Crore+ Indian health records</span> from 2.1 Lac+ users.
              97.8% concordance with cardiologist interpretations across 1.3 million+ ECGs analysed.
            </p>
          </div>

          {/* Cardiac Timeline */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mt-16">
            <motion.div {...fadeUp}>
              <div className="bg-[hsl(0,0%,100%)]/5 border border-[hsl(0,0%,100%)]/10 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(0,0%,100%)] font-medium">Your Cardiac Journal</span>
                  <span className="text-[hsl(240,10%,70%)] text-sm">Last 30 days</span>
                </div>
                <div className="border-t border-[hsl(0,0%,100%)]/10 my-4" />
                <div className="space-y-4">
                  {[
                    { date: "Today, 7:12 AM", status: "Normal sinus rhythm", color: "hsl(160,84%,39%)", sub: "HR 63 bpm · HRV 42ms · QTc 398ms" },
                    { date: "Apr 5, 8:01 AM", status: "Normal sinus rhythm", color: "hsl(160,84%,39%)", sub: "HR 68 bpm · HRV 38ms · QTc 401ms" },
                    { date: "Apr 3, 7:44 AM", status: "Occasional PVC", color: "hsl(38,92%,50%)", sub: "Nera AI: Single PVC detected. Isolated — no action needed." },
                    { date: "Apr 1, 8:22 AM", status: "Occasional PVC", color: "hsl(38,92%,50%)", sub: "Nera AI: Second PVC this week. Flagged for monitoring." },
                    { date: "Mar 28, 7:55 AM", status: "Normal sinus rhythm", color: "hsl(160,84%,39%)", sub: "HR 66 bpm · HRV 41ms" },
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
                <div className="border-t border-[hsl(0,0%,100%)]/10 my-4" />
                <p className="text-[hsl(240,10%,70%)] text-xs italic">
                  Nera AI: Two isolated PVCs in 7 days — below threshold for concern, but flagged for monitoring. Share with your cardiologist.
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <span className="inline-block bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1 text-sm font-medium">
                What most devices miss
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-[hsl(0,0%,100%)] mt-4">
                Patterns only visible across time.
              </h3>
              <p className="text-[hsl(240,10%,70%)] text-base leading-relaxed mt-4">
                One abnormal ECG can be noise. The same pattern three times in a week is a signal.
                Nera AI compares every new ECG to your entire cardiac history — it knows your baseline, not just the population average.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Full cardiac journal", "Pattern repeat detection", "Share with cardiologist — 1 tap"].map((pill) => (
                  <span key={pill} className="bg-[hsl(0,0%,100%)]/5 border border-[hsl(0,0%,100%)]/10 rounded-full px-3 py-1 text-sm text-[hsl(0,0%,100%)]">{pill}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* AI Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: AlertTriangle, title: "Real-Time STEMI Detection", body: "STEMI shows up in the ST segment before symptoms peak. Nera AI analyses every reading and sends an immediate alert if elevation is detected." },
              { icon: FileText, title: "Cardiologist-Ready PDF", body: "Every reading generates a clinical PDF — waveform, findings, AI interpretation, and 30-day trend. Share via WhatsApp or email in one tap." },
              { icon: Brain, title: "Dual-Algorithm Analysis", body: "Nera runs two independent engines — rhythm classification and waveform digitizer — and cross-checks results. Disagreements are flagged for review." },
            ].map((card) => (
              <motion.div key={card.title} {...fadeUp} className="bg-[hsl(0,0%,100%)]/5 border border-[hsl(0,0%,100%)]/10 rounded-2xl p-6 hover:border-primary/50 transition-all">
                <card.icon className="text-primary" size={28} />
                <h4 className="text-[hsl(0,0%,100%)] font-semibold text-lg mt-3">{card.title}</h4>
                <p className="text-[hsl(240,10%,70%)] text-sm mt-2 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA inside Nera section */}
          <div className="mt-14 text-center">
            <Button
              onClick={handleBuy}
              disabled={adding}
              size="lg"
              className="rounded-full px-10 text-base bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              Get SanketLife + Nera AI — ₹3,999
            </Button>
            <p className="text-[hsl(240,10%,70%)] text-sm mt-3">Includes 3 months Nera AI Premium free</p>
          </div>
        </div>
      </section>


      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              When would you <span className="text-primary">actually use it?</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-3">Real moments. Real peace of mind.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: HeartPulse,
                title: "Sudden palpitations",
                desc: "Your heart starts racing unexpectedly. Take an ECG right then — capture what your doctor needs to see.",
              },
              {
                icon: Moon,
                title: "Night-time symptoms",
                desc: "Chest discomfort at 2 AM? Don't wait until morning. Record an ECG in bed and check with your doctor.",
              },
              {
                icon: UserCheck,
                title: "Monitoring your parents",
                desc: "Your parents may not tell you when something feels off. Give them a device that captures data you can review — even from another city.",
              },
              {
                icon: CalendarCheck,
                title: "Preventive daily monitoring",
                desc: "For post-cardiac patients or high-risk individuals, a daily ECG builds a baseline your doctor can track over time.",
              },
            ].map((uc, i) => (
              <motion.div
                key={uc.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6 flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <uc.icon className="h-6 w-6 text-primary" />
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

      {/* ─── MID CTA 2 ─── */}
      <section className="py-10 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-foreground font-semibold text-lg">
            Peace of mind for you. Safety for your family.
          </p>
          <Button
            onClick={handleBuy}
            disabled={adding}
            className="mt-3 rounded-full px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            Buy SanketLife ECG — ₹3,999
          </Button>
          <p className="text-primary-foreground/70 text-xs mt-2 font-medium">Included FREE: Nera AI Premium — 3 months (worth ₹1,197)</p>
        </div>
      </section>

      {/* ─── SECTION 9: PARENT CARE ─── */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Because your parents won't always tell you{" "}
              <span className="text-primary">something feels wrong.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-6 leading-relaxed max-w-xl mx-auto">
              They'll say "I'm fine" when they're not. They'll skip the hospital
              because it's too much trouble. SanketLife gives them a way to check —
              and gives you a way to know.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {[
                { icon: Smartphone, text: "Simple enough for anyone to use" },
                { icon: Share2, text: "Results shared with family instantly" },
                { icon: Brain, text: "AI flags anything unusual" },
              ].map((p) => (
                <div key={p.text} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2">
                  <p.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground font-medium text-center">{p.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 10: COMPARISON ─── */}
      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Hospital ECG vs <span className="text-primary">SanketLife</span>
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="py-4 text-left text-muted-foreground font-medium" />
                  <th className="py-4 text-center text-muted-foreground font-medium">Hospital ECG</th>
                  <th className="py-4 text-center text-primary font-bold">SanketLife</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Availability", "By appointment", "Anytime, anywhere"],
                  ["Time to result", "Hours to days", "15 seconds"],
                  ["Monitoring", "One-time snapshot", "Daily, on-demand"],
                  ["Cost per ECG", "₹300–₹1,500", "Unlimited for ₹3,999"],
                  ["Report sharing", "Physical copy", "Instant digital PDF"],
                  ["AI analysis", "Not available", "Nera AI included"],
                  ["Trend tracking", "No", "Continuous timeline"],
                ].map(([feature, hospital, sanket]) => (
                  <tr key={feature} className="border-b border-border">
                    <td className="py-4 text-foreground font-medium">{feature}</td>
                    <td className="py-4 text-center text-muted-foreground">{hospital}</td>
                    <td className="py-4 text-center text-primary font-semibold">{sanket}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 11: FEATURES ─── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Built for <span className="text-primary">real life.</span> Not just specs.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "15-Second Capture", desc: "Full 12-lead ECG faster than making a phone call." },
              { icon: ShieldCheck, title: "98.5% Accuracy", desc: "Clinically validated against hospital-grade equipment." },
              { icon: FileText, title: "Shareable Reports", desc: "Send a clinical PDF to any doctor via WhatsApp or email." },
              { icon: Brain, title: "Nera AI Analysis", desc: "Instant rhythm analysis, trend detection, and anomaly alerts." },
              { icon: Package, title: "Pocket-Sized", desc: "Smaller than your wallet. Carry it everywhere you go." },
              { icon: Shield, title: "CDSCO Certified", desc: "Class B medical device. Licensed and approved in India." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 12: FAQ ─── */}
      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">
              Frequently asked questions
            </h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Is it really as accurate as a hospital ECG?",
                a: "SanketLife has been validated at 98.15% sensitivity at Sri Jayadeva Institute and 98.5% accuracy at Narayana Health — comparable to standard hospital ECG machines. It's not a replacement for a full in-hospital workup, but it's the most accurate portable ECG available for home use in India.",
              },
              {
                q: "Can my doctor read the reports?",
                a: "Yes. Every reading generates a standard clinical PDF with full waveform data and Nera AI interpretation. You can share it via WhatsApp, email, or the Agatsa One app's built-in sharing feature.",
              },
              {
                q: "How fast is the recording?",
                a: "15 seconds. Place your thumbs on both sensors, and SanketLife captures a complete 12-lead ECG transmitted via Bluetooth to the Agatsa One app.",
              },
              {
                q: "Is it safe for home use?",
                a: "Absolutely. SanketLife is CDSCO-approved as a Class B medical device. It's designed for anyone to use at home — no medical training required. The app guides you through every step.",
              },
              {
                q: "Who should use this?",
                a: "Anyone who wants peace of mind about their heart health — people experiencing palpitations, those with a family history of heart disease, post-cardiac patients, caregivers monitoring elderly parents, or anyone who wants proactive heart monitoring.",
              },
              {
                q: "Do I need medical training to use it?",
                a: "Not at all. Place your thumbs on the sensors, hold for 15 seconds, and Nera AI does the rest. It's simpler than using a blood pressure cuff.",
              },
              {
                q: "What happens if something abnormal is detected?",
                a: "Nera AI sends you an in-app alert with a plain-language explanation and a recommended next step — such as 'Contact your doctor within 24 hours.' Nera flags and guides — it does not diagnose.",
              },
            ].map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── MID CTA 3 ─── */}
      <section className="py-10 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-primary-foreground font-semibold text-lg">
            Still have questions? Your heart doesn't wait — and neither should you.
          </p>
          <Button
            onClick={handleBuy}
            disabled={adding}
            className="mt-3 rounded-full px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
          >
            Check Your Heart Anytime — ₹3,999
          </Button>
          <p className="text-primary-foreground/70 text-xs mt-2 font-medium">Included FREE: Nera AI Premium — 3 months (worth ₹1,197)</p>
        </div>
      </section>

      {/* ─── SECTION 13: OFFER FRAMING ─── */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Check your heart anytime —{" "}
              <span className="text-primary">without waiting for appointments.</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Think about what you get for ₹3,999:
            </p>
          </motion.div>

          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {[
              { icon: Timer, title: "Time saved", desc: "No travel. No queues. No waiting rooms. ECG in 15 seconds at home." },
              { icon: Heart, title: "Stress reduced", desc: "Stop guessing. Know what your heart is doing — whenever you need to." },
              { icon: RefreshCw, title: "Unlimited ECGs", desc: "One device. Unlimited readings. No per-test charges — ever." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <v.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="mt-8">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 inline-block">
              <p className="text-sm text-foreground font-medium">
                Includes <span className="font-bold text-primary">3 months Nera AI Premium</span> free
                <span className="text-muted-foreground"> (worth ₹1,197)</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 14: FINAL TRUST REINFORCEMENT ─── */}
      <section className="py-10 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "1-Year Warranty", desc: "Full manufacturer warranty. Hassle-free replacement." },
              { icon: Headphones, title: "Dedicated Support", desc: "Phone & email support. Real humans, not chatbots." },
              { icon: CheckCircle2, title: "Proven Reliability", desc: "2.1 Lac+ ECGs analysed. Trusted by families & doctors." },
            ].map((t, i) => (
              <motion.div
                key={t.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 bg-card border border-border rounded-2xl p-6"
              >
                <t.icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 15: FINAL CTA ─── */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
              Take control of your heart health today.
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-lg">
              Safe. Simple. Reliable.
            </p>
            <Button
              onClick={handleBuy}
              disabled={adding}
              size="lg"
              className="mt-8 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
            >
              Check Your Heart Anytime — ₹3,999
            </Button>
            <p className="text-primary-foreground/60 text-sm mt-4">
              Free shipping · 1-year warranty · 3 months Nera AI Premium included
            </p>
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
    </SiteLayout>
  );
}
