import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Star, ArrowRight, Package } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import sanketlifeImg from "@/assets/sanketlife-device-app.png";
import easytouchImg from "@/assets/easytouch-wellness-hero.png";
import rhythmImg from "@/assets/easytouch-rhythm-new.png";
import scaleImg from "@/assets/corebalance-hero.png";

interface DeviceData {
  id: string;
  image: string;
  badge?: string;
  name: string;
  tagline: string;
  keyStat: string;
  price: string;
  priceNum: string;
  rating: string;
  reviews: string;
  measures: string[];
  appFeatures: string[];
  link: string;
  clinicalNote?: string;
}

const devices: DeviceData[] = [
  {
    id: "sanketlife-ecg",
    image: sanketlifeImg,
    badge: "CDSCO Class B Certified · MFG/MD/2023/000231",
    name: "SanketLife 12-Lead ECG Monitor",
    tagline: "Hospital-grade ECG in your shirt pocket",
    keyStat: "98.5% accuracy validated at Narayana Health & Sri Jayadeva Institute",
    price: "₹4,999",
    priceNum: "4,999",
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
    clinicalNote: "98.5% accuracy validated at Narayana Health & Sri Jayadeva Institute of Cardiovascular Sciences",
  },
  {
    id: "easytouch-wellness",
    image: easytouchImg,
    badge: "Metabolic Health",
    name: "EasyTouch Wellness Metabolic Health Monitor",
    tagline: "Metabolic health, BP, SpO2 — no needles, no cuffs",
    keyStat: "8 vitals in 60 seconds — 15,000+ active users across India",
    price: "₹3,499",
    priceNum: "3,499",
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
      "Glucose trend analysis and HbA1c prediction",
      "Post-meal metabolic scoring (log meals, see impact)",
      "BP trend analysis with hypertension stage tracking",
      "SpO2 alerts below 94%",
      "Compatible with Diabetic Cardiac Care Programme",
      "Compatible with Hypertension Control Programme",
    ],
    link: "/devices/easytouch-wellness",
  },
  {
    id: "rhythm-band",
    image: rhythmImg,
    name: "EasyTouch Rhythm Wellness Band",
    tagline: "24/7 health monitoring on your wrist",
    keyStat: "Sleep, HRV, steps, SpO2 — continuous 24/7 monitoring",
    price: "₹2,999",
    priceNum: "2,999",
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
  },
  {
    id: "smart-scale",
    image: scaleImg,
    name: "Agatsa Smart Scale",
    tagline: "14 body metrics. One step. One app.",
    keyStat: "BMI, body fat, muscle mass — 14 metrics in 5 seconds",
    price: "₹2,499",
    priceNum: "2,499",
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
  },
];

function DeviceCard({ device, index }: { device: DeviceData; index: number }) {
  const [measuresOpen, setMeasuresOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

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

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-foreground">{device.price}</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {device.rating}/5 ({device.reviews} reviews)
          </span>
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
            <Link to={device.link}>Buy Now — {device.price}</Link>
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

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-background text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Medical Devices
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Medical-grade devices.
            <br />
            Zero complexity.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every Agatsa One device is clinically validated, CDSCO-approved, and designed to work
            seamlessly with the Agatsa One app and Nera AI. Pair in minutes. Monitor for life.
          </p>
          <p className="text-base text-muted-foreground mt-4 max-w-[720px] mx-auto">
            We believe the best health monitoring device is one you'll actually use. That's why
            every device in the Agatsa One ecosystem is designed for real people — not hospitals.
            Medical-grade accuracy. Consumer-grade simplicity. And when paired with Agatsa One,
            every reading becomes part of your AI-powered health story.
          </p>
        </div>
      </section>

      {/* Bundle Banner */}
      <div className="max-w-[900px] mx-auto px-4">
        <div className="bg-[hsl(260,100%,97%)] border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary shrink-0" />
            <p className="text-sm md:text-base font-medium text-foreground">
              <span className="font-bold">Bundle & Save</span> — Buy SanketLife ECG + Rhythm Band
              together from ₹7,499. Includes 3 months Nera AI Premium free.
            </p>
          </div>
          <Link
            to="/devices/sanketlife-ecg"
            className="text-sm font-semibold text-primary hover:underline whitespace-nowrap flex items-center gap-1"
          >
            View Bundle <ArrowRight className="h-3.5 w-3.5" />
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
            <Link to="/quiz">Find My Device</Link>
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
