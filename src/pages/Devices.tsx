import { useSEO } from "@/hooks/useSEO";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Star, ArrowRight, Package, Smartphone, Workflow, Brain, Stethoscope, Shield, Cpu, Users, HeartPulse } from "lucide-react";
import { EmiLine } from "@/components/EmiLine";
import { SiteLayout } from "@/components/SiteLayout";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { Button } from "@/components/ui/button";
import { usePricing, type DeviceSku } from "@/hooks/useDevicePricing";
import sanketlifeImg from "@/assets/sanketlife-device-app.webp";
import easytouchImg from "@/assets/easytouch-wellness-hero.webp";
import rhythmImg from "@/assets/easytouch-rhythm-new.webp";
import scaleImg from "@/assets/corebalance-hero.webp";

interface DeviceData {
  id: string;
  image: string;
  badge?: string;
  name: string;
  tagline: string;
  keyStat: string;
  sku: DeviceSku;
  rating: string;
  reviews: string;
  measures: string[];
  appFeatures: string[];
  link: string;
  checkoutSku: string;
  clinicalNote?: string;
}

const devices: DeviceData[] = [
  {
    id: "sanketlife",
    image: sanketlifeImg,
    badge: "CDSCO Class B Certified · MFG/MD/2023/000231",
    name: "SanketLife 12-Lead ECG Monitor",
    tagline: "Hospital-grade ECG in your shirt pocket",
    keyStat: "98.5% accuracy validated at Narayana Health & Sri Jayadeva Institute",
    sku: "ecg_bundle",
    rating: "4.8",
    reviews: "1,247",
    measures: [
      "12-lead ECG waveform (full cardiac rhythm capture)",
      "Heart rate and heart rate variability (HRV)",
      "ST-segment analysis (STEMI detection)",
      "Arrhythmia detection (AFib, PVCs, SVT)",
      "P-wave, QRS complex, T-wave morphology",
      "RR interval analysis",
    ],
    appFeatures: [
      "Instant AI analysis by Nera after every ECG",
      "12-lead ECG stored securely in cloud",
      "Share ECG PDF with your cardiologist instantly",
      "ECG trend timeline — see every reading, ever",
      "Arrhythmia alerts and anomaly detection",
      "Compatible with Post Heart Attack Recovery Programme",
    ],
    link: "/devices/sanketlife-ecg",
    checkoutSku: "ecg_bundle",
    clinicalNote: "98.5% accuracy validated at Narayana Health & Sri Jayadeva Institute of Cardiovascular Sciences",
  },
  {
    id: "easytouch-wellness",
    image: easytouchImg,
    badge: "Metabolic Health",
    name: "EasyTouch Wellness Metabolic Health Monitor",
    tagline: "Metabolic health, BP, SpO2 — no needles, no cuffs",
    keyStat: "8 vitals in 60 seconds — 15,000+ active users across India",
    sku: "wellness_sub",
    rating: "4.6",
    reviews: "834",
    measures: [
      "Non-invasive metabolic load tracking (optical, no finger prick)",
      "Blood pressure (systolic and diastolic)",
      "Blood oxygen saturation (SpO2)",
      "Pulse rate",
      "Perfusion index",
      "Waveform quality index",
    ],
    appFeatures: [
      "Metabolic wellness trend analysis and HbA1c prediction",
      "Post-meal metabolic scoring (log meals, see impact)",
      "BP trend analysis with hypertension stage tracking",
      "SpO2 alerts below 94%",
      "Compatible with Diabetic Cardiac Care Programme",
      "Compatible with Hypertension Control Programme",
    ],
    link: "/devices/easytouch-wellness",
    checkoutSku: "wellness_sub",
  },
  {
    id: "rhythm-band",
    image: rhythmImg,
    name: "EasyTouch Rhythm Wellness Band",
    tagline: "24/7 health monitoring on your wrist",
    keyStat: "Sleep, HRV, steps, SpO2 — continuous 24/7 monitoring",
    sku: "band_sub",
    rating: "4.5",
    reviews: "612",
    measures: [
      "Continuous heart rate (24/7)",
      "Blood oxygen saturation (SpO2)",
      "Sleep stages (deep, light, REM, awake)",
      "Step count and distance",
      "Calories burned",
      "Heart rate variability (HRV)",
      "Stress index (HRV-derived)",
      "Skin temperature",
    ],
    appFeatures: [
      "Nera AI sleep analysis and body clock insights",
      "HRV-based recovery scores",
      "Lifestyle correlation — see how sleep affects metabolic health",
      "Band vital readings in your unified health timeline",
      "Compatible with all 5 Care Programmes",
      "7-day battery life",
    ],
    link: "/devices/rhythm-band",
    checkoutSku: "band_sub",
  },
  {
    id: "corebalance",
    image: scaleImg,
    name: "Agatsa Smart Scale",
    tagline: "14 body metrics. One step. One app.",
    keyStat: "BMI, body fat, muscle mass — 14 metrics in 5 seconds",
    sku: "scale_sub",
    rating: "4.7",
    reviews: "423",
    measures: [
      "Body weight (kg/lbs)",
      "BMI (Body Mass Index)",
      "Body fat percentage",
      "Visceral fat level",
      "Skeletal muscle mass",
      "Bone mineral density",
      "Body water percentage",
      "Basal metabolic rate (BMR)",
      "Metabolic age",
      "Protein percentage",
      "Subcutaneous fat",
      "Lean body mass",
      "Body shape index (ABSI)",
      "Physique rating",
    ],
    appFeatures: [
      "Weight and body composition trend in Nera AI",
      "Weight loss programme integration",
      "Visceral fat trend — the dangerous fat, tracked",
      "Syncs via Bluetooth in under 10 seconds",
      "Up to 10 family members on one scale",
      "Compatible with Obesity Reversal Programme",
    ],
    link: "/devices/smart-scale",
    checkoutSku: "scale_sub",
  },
];

function DeviceCard({ device, index }: { device: DeviceData; index: number }) {
  const [measuresOpen, setMeasuresOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const { prices, fmt, emi, loading } = usePricing();
  const price = prices[device.sku];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden"
    >
      <img
        src={device.image}
        alt={device.name}
        className="w-full h-[320px] object-cover"
        loading="lazy"
      />

      <div className="p-8">
        {device.badge && (
          <span className="inline-block text-xs font-semibold text-primary-foreground bg-primary rounded-full px-3 py-1 mb-3">
            {device.badge}
          </span>
        )}

        <h2 className="text-2xl font-bold text-foreground">{device.name}</h2>
        <p className="text-base font-medium text-muted-foreground mt-1">{device.tagline}</p>
        <p className="text-sm font-semibold text-primary mt-2">{device.keyStat}</p>

        <div className="mt-4">
          <div className="flex items-baseline gap-3">
            {loading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <span className="text-3xl font-extrabold text-foreground">{fmt(price)}</span>
            )}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {device.rating}/5 ({device.reviews} reviews)
            </span>
          </div>
          <p className="text-xs text-primary font-medium mt-0.5">{emi(price)}</p>
          <StockUrgencyBar productKey={device.id} className="mt-3" />
        </div>

        {/* What it measures */}
        <button
          onClick={() => setMeasuresOpen(!measuresOpen)}
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors w-full"
        >
          What it measures
          {measuresOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {measuresOpen && (
          <ul className="mt-3 space-y-2">
            {device.measures.map((m) => (
              <li key={m} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {m}
              </li>
            ))}
          </ul>
        )}

        {/* Works with Agatsa One */}
        <button
          onClick={() => setFeaturesOpen(!featuresOpen)}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors w-full"
        >
          Works with Agatsa One
          {featuresOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {featuresOpen && (
          <ul className="mt-3 space-y-2">
            {device.appFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3 mt-6">
          <Button asChild className="flex-1 rounded-full">
            <Link to={`/checkout?sku=${device.checkoutSku}`}>Buy Now — {device.price}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 rounded-full">
            <Link to={device.link}>Learn More</Link>
          </Button>
        </div>
      </div>

      {device.clinicalNote && (
        <div className="bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900 rounded-b-3xl p-4">
          <p className="text-xs text-green-800 dark:text-green-300 font-medium text-center">
            {device.clinicalNote}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function DevicesPage() {
  useSEO({ title: "Health Monitoring Devices — SanketLife ECG, EasyTouch, Rhythm Band | Agatsa One", description: "Medical-grade ECG, metabolic health monitor, wellness band, and smart scale. All CDSCO-approved, clinically validated, and integrated with Nera AI. Shop now from ₹2,499." });

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Devices Page',
        content_category: 'Health Devices',
      });
    }
  }, []);
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="pt-16 pb-12 bg-gradient-to-b from-muted/40 to-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold text-primary-foreground bg-primary rounded-full px-4 py-1.5 mb-6 uppercase tracking-wider">
              The Agatsa One Ecosystem
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Medical-grade devices that don't just measure —{" "}
              <span className="text-primary">they continuously feed your health AI.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-3xl mx-auto"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Every Agatsa One device is built to work as part of a{" "}
              <span className="font-semibold text-foreground">connected system</span> — not in isolation.
              Our ECG device is clinically validated and CDSCO-approved.{" "}
              <span className="font-semibold text-foreground">Pair in minutes. Monitor over time.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6 text-left"
          >
            <p className="text-base text-muted-foreground leading-relaxed">
              Because a single reading is not enough. Every measurement — ECG, BP, metabolic wellness, SpO₂ — becomes part of a{" "}
              <span className="font-semibold text-foreground">continuous health record</span>, captured through
              Agatsa devices and analysed through{" "}
              <span className="font-semibold text-primary">Nera AI</span>.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mt-4">
              We believe the best health monitoring device is one you'll actually use. That's why everything
              is designed for <span className="font-semibold text-foreground">real people</span> — not just hospitals.
              Medical-grade accuracy. Consumer-grade simplicity. And a system that helps you understand
              health <span className="font-semibold text-foreground">over time</span> — not just one report.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Urgency bar */}
      <div className="bg-primary py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-primary-foreground text-sm font-medium text-center">
          <span>🎁 Free 1-year Nera AI included with every device (worth ₹3,999)</span>
          <span className="hidden sm:block text-primary-foreground/40">|</span>
          <span>🚚 Ships within 24 hours</span>
          <span className="hidden sm:block text-primary-foreground/40">|</span>
          <span>↩️ 7-day easy returns</span>
        </div>
      </div>

      {/* How It Works — Visual Pipeline */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              From gadgets → to <span className="text-primary">health infrastructure</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              How every device becomes part of your AI-powered health system
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />

            {[
              {
                icon: Smartphone,
                step: "01",
                title: "Devices capture real data",
                desc: "ECG, BP, metabolic wellness, SpO₂, weight, sleep — medical-grade sensors capture what matters.",
              },
              {
                icon: Workflow,
                step: "02",
                title: "Data flows automatically",
                desc: "Every reading syncs to Agatsa One instantly via Bluetooth. No manual logging.",
              },
              {
                icon: Brain,
                step: "03",
                title: "Nera AI analyses trends",
                desc: "AI spots patterns across readings, flags anomalies, and builds your health timeline.",
              },
              {
                icon: Stethoscope,
                step: "04",
                title: "Doctor sees only what matters",
                desc: "Physicians receive structured insights — not raw data. Faster decisions, better outcomes.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-[72px] h-[72px] rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Step {item.step}</span>
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { icon: Shield, text: "CDSCO Approved" },
              { icon: Cpu, text: "AI-Powered Analysis" },
              { icon: Users, text: "2.1 Lac+ Users" },
              { icon: HeartPulse, text: "Clinically Validated" },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
                <badge.icon className="h-4 w-4 text-primary" />
                <span className="font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bundle Banner */}
      <div className="max-w-[900px] mx-auto px-4">
        <div className="bg-[hsl(260,100%,97%)] border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary shrink-0" />
            <div>
              <p className="text-sm md:text-base font-medium text-foreground">
                <span className="font-bold">Complete Health Kit</span> — all 4 devices + Nera AI. Save ₹3,996.
              </p>
              <p className="text-primary text-sm mt-1">No-cost EMI from ₹834/month · Free shipping</p>
            </div>
          </div>
          <Link
            to="/checkout?sku=ecg_bundle,wellness_sub,band_sub,scale_sub"
            className="text-sm font-semibold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
          >
            Buy Bundle <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Device Grid */}
      <section className="max-w-[1200px] mx-auto px-4 mt-16 pb-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {devices.map((device, i) => (
            <DeviceCard key={device.id} device={device} index={i} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[900px] mx-auto px-4 mt-20 mb-20">
        <div className="bg-[hsl(260,100%,97%)] rounded-3xl p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Not sure which device is right for you?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Take our 2-minute health quiz and we'll recommend the best device for your health goals.
          </p>
          <Button asChild className="mt-6 rounded-full px-8">
            <Link to="/contact">Help Me Choose</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Or{" "}
            <Link to="/programmes" className="text-primary font-medium hover:underline">
              browse all Care Programmes
            </Link>{" "}
            to see which devices each programme recommends →
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
