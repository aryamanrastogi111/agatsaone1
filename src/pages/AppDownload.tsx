import { useSEO } from "@/hooks/useSEO";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check, Apple, Play } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import qrApple from "@/assets/qr-apple.png";
import qrGoogle from "@/assets/qr-google.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const iosUrl =
  import.meta.env.VITE_IOS_APP_STORE_URL ||
  "https://apps.apple.com/in/app/agatsa-one/id6760245564";
const androidUrl =
  import.meta.env.VITE_ANDROID_PLAY_URL ||
  "https://play.google.com/store/apps/details?id=com.agatsakone";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6 },
};

const features = [
  { emoji: "🫀", text: "Connect medical-grade ECG, metabolic health, BP, scale, and wellness band" },
  { emoji: "🧠", text: "Nera AI analyses every reading and builds your health story" },
  { emoji: "📊", text: "Weekly AI health reports in plain English — every Monday" },
  { emoji: "👨‍👩‍👧", text: "Share your health data securely with family and doctors" },
  { emoji: "🎙️", text: "Talk to Nera — voice AI health assistant (Premium)" },
];

const faqs = [
  {
    q: "Is Agatsa One really free?",
    a: "Yes. Agatsa One is free to download and includes basic health logging and device connection. Nera AI features (analysis, reports, health score) require a subscription from ₹599/month. Try free for 7 days — no credit card required.",
  },
  {
    q: "Which devices are compatible?",
    a: "Agatsa One works with all Agatsa devices: SanketLife ECG, EasyTouch Wellness Monitor, EasyTouch Rhythm Band, and Agatsa Smart Scale. You can also log manual readings from any device.",
  },
  {
    q: "Is my health data secure?",
    a: "All data is encrypted in transit and at rest. Stored on secure Indian servers (Google Cloud, Mumbai region). We never sell your health data. You are always in control of who sees your readings.",
  },
];

const deviceConfigs: Record<
  string,
  { h1: string; sub: string; highlight: string; steps: string[] }
> = {
  ecg: {
    h1: "You have a SanketLife ECG",
    sub: "Download Agatsa One to activate your SanketLife ECG and start getting clinical-grade ECG analysis powered by Nera AI.",
    highlight:
      "SanketLife ECG · 12-lead ECG · 98.15% validated accuracy · CDSCO Certified",
    steps: [
      "Download Agatsa One using the button below — it's free",
      "Create your account or sign in with your phone number",
      "Tap 'Add Device' and select SanketLife ECG from the list",
      "Your device activates automatically and your 3-month Nera AI Premium subscription is applied",
    ],
  },
  easytouch: {
    h1: "You have an EasyTouch Wellness Monitor",
    sub: "Download Agatsa One to activate your EasyTouch device and start tracking your metabolic health, BP, and SpO2 — all without needles.",
    highlight:
      "EasyTouch Wellness · Metabolic Wellness + BP + SpO2 · No needles · No blood",
    steps: [
      "Download Agatsa One using the button below — it's free",
      "Create your account or sign in with your phone number",
      "Tap 'Add Device' and select EasyTouch Wellness from the list",
      "Your device activates and your 3-month Nera AI subscription is applied automatically",
    ],
  },
  rhythm: {
    h1: "You have an EasyTouch Rhythm Band",
    sub: "Download Agatsa One to activate your Rhythm band and start 24/7 wellness monitoring — sleep, HRV, steps, SpO2, and more.",
    highlight:
      "EasyTouch Rhythm Band · 24/7 Monitoring · 7-Day Battery · Sleep + HRV + SpO2",
    steps: [
      "Download Agatsa One using the button below — it's free",
      "Create your account or sign in with your phone number",
      "Tap 'Add Device' and select EasyTouch Rhythm Band from the list",
      "Your band syncs and begins monitoring your vitals continuously within minutes",
    ],
  },
  scale: {
    h1: "You have an Agatsa Smart Scale",
    sub: "Download Agatsa One to activate your Smart Scale and start tracking 14 body composition metrics including BMI, body fat percentage, muscle mass, and hydration.",
    highlight:
      "Agatsa Smart Scale · 14 Body Metrics · Bluetooth Sync · Family Profiles",
    steps: [
      "Download Agatsa One using the button below — it's free",
      "Create your account or sign in with your phone number",
      "Tap 'Add Device' and select Agatsa Smart Scale from the list",
      "Step on the scale. Your first reading syncs to Nera AI in seconds.",
    ],
  },
};

function DownloadButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={iosUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 bg-foreground text-background rounded-xl px-6 py-4 hover:opacity-90 transition-opacity"
      >
        <Apple className="h-6 w-6 shrink-0" />
        <div className="text-left leading-tight">
          <span className="text-[10px] opacity-80">Download on the</span>
          <br />
          <span className="text-sm font-semibold">App Store</span>
        </div>
      </a>
      <a
        href={androidUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 bg-foreground text-background rounded-xl px-6 py-4 hover:opacity-90 transition-opacity"
      >
        <Play className="h-6 w-6 shrink-0 fill-current" />
        <div className="text-left leading-tight">
          <span className="text-[10px] opacity-80">Get it on</span>
          <br />
          <span className="text-sm font-semibold">Google Play</span>
        </div>
      </a>
    </div>
  );
}

function FeatureList() {
  return (
    <ul className="space-y-4">
      {features.map((f, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="flex items-start gap-3"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm shrink-0">
            {f.emoji}
          </span>
          <span className="text-sm text-foreground">{f.text}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function FAQSection() {
  return (
    <motion.div {...fadeUp} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground text-center mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border rounded-2xl px-5 data-[state=open]:shadow-purple transition-shadow"
          >
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}

/* ─── Default state ─── */
function DefaultState() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      <motion.div {...fadeUp} className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Download Agatsa One
          </h1>
          <p className="text-lg text-muted-foreground max-w-[540px]">
            Your AI health companion. Medical-grade monitoring. Powered by Nera AI.
            Available free on iOS and Android.
          </p>
        </div>
        <FeatureList />
        <DownloadButtons />
        <p className="text-xs text-muted-foreground">
          Free download · No credit card required · iOS 14+ · Android 8+
        </p>
      </motion.div>

      {/* QR codes — desktop only */}
      <motion.div
        {...fadeUp}
        className="hidden lg:flex flex-col items-center justify-center bg-muted rounded-3xl p-6 border border-border gap-6"
      >
        <div className="flex gap-10">
          {/* Apple QR */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-background rounded-2xl p-3 border border-border">
              <img
                src={qrApple}
                alt="QR code to download Agatsa One on App Store"
                className="rounded-lg w-[240px] h-[240px] object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Apple className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">App Store</span>
            </div>
          </div>

          {/* Google QR */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-background rounded-2xl p-3 border border-border">
              <img
                src={qrGoogle}
                alt="QR code to download Agatsa One on Google Play"
                className="rounded-lg w-[240px] h-[240px] object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Play className="h-4 w-4 text-foreground fill-current" />
              <span className="text-sm font-medium text-foreground">Google Play</span>
            </div>
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground text-center">
          Scan with your phone camera to download
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Referral state ─── */
function ReferralState({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Banner */}
      <div className="bg-primary text-primary-foreground text-center py-3 rounded-2xl font-medium text-sm">
        🎁 Your friend has invited you to Agatsa One!
      </div>

      <motion.div {...fadeUp} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
          You've been invited to Agatsa One
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Someone who cares about your health has shared Agatsa One with you. Download
          the app and enter referral code during sign-up to get your first month of Nera
          AI free.
        </p>
      </motion.div>

      {/* Offer box */}
      <motion.div
        {...fadeUp}
        className="max-w-md mx-auto border-2 border-primary rounded-2xl p-8 bg-muted text-center space-y-4"
      >
        <p className="text-5xl font-extrabold text-primary">1 Month FREE</p>
        <p className="text-sm text-muted-foreground">
          Nera AI subscription — worth ₹599
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-2xl font-bold text-foreground bg-background border border-border rounded-xl px-4 py-2">
            {code}
          </span>
          <button
            onClick={copyCode}
            className="p-2 rounded-lg hover:bg-background transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-5 w-5 text-success" />
            ) : (
              <Copy className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Applied automatically when you download using the link below
        </p>
      </motion.div>

      <motion.div {...fadeUp} className="max-w-lg mx-auto space-y-8">
        <FeatureList />
        <DownloadButtons />
      </motion.div>
    </div>
  );
}

/* ─── Device state ─── */
function DeviceState({ device }: { device: string }) {
  const config = deviceConfigs[device];
  if (!config) return <DefaultState />;

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <motion.div {...fadeUp} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
          {config.h1}
        </h1>
        <p className="text-lg text-muted-foreground">{config.sub}</p>
      </motion.div>

      {/* Device highlight */}
      <motion.div
        {...fadeUp}
        className="bg-muted rounded-2xl p-6 text-center border border-border"
      >
        <p className="text-sm font-medium text-foreground">{config.highlight}</p>
        {device === "ecg" && (
          <span className="inline-block mt-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold">
            CDSCO Certified
          </span>
        )}
      </motion.div>

      {/* Setup steps */}
      <motion.div {...fadeUp} className="space-y-4">
        {config.steps.map((step, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
              {i + 1}
            </span>
            <p className="text-sm text-foreground pt-1">{step}</p>
          </div>
        ))}
      </motion.div>

      <DownloadButtons />
    </div>
  );
}

/* ─── Main page ─── */
export default function AppDownloadPage() {
  useSEO({ title: "Download Agatsa One — Free AI Health Monitoring App", description: "Download Agatsa One free on iOS and Android. Connect your health devices. Get AI insights from Nera. Start monitoring your heart, metabolic health, and vitals today." });

  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");
  const device = searchParams.get("device");

  const renderContent = () => {
    if (ref) return <ReferralState code={ref} />;
    if (device && deviceConfigs[device]) return <DeviceState device={device} />;
    return <DefaultState />;
  };

  return (
    <SiteLayout>
      <section className="py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </section>

      {/* FAQ — all states */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>
      </section>
    </SiteLayout>
  );
}
