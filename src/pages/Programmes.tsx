import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const whyCards = [
  { title: "Daily structure", desc: "Each programme gives you a daily task list: readings to take, exercises to do, meals to log, medication to confirm. No guesswork. No forgetting." },
  { title: "AI adaptation", desc: "Nera AI reviews your progress weekly and adjusts recommendations based on your actual readings — not a generic template. Your programme evolves with you." },
  { title: "Clinical design", desc: "Each programme is designed with clinical advisors and follows evidence-based protocols from international cardiology and metabolic health guidelines." },
];

const howSteps = [
  { n: "1", title: "Enrol", copy: "Choose your programme. Enrol in minutes from the Agatsa One app. Your provider can also enrol you directly — share your programme link with your doctor." },
  { n: "2", title: "Monitor daily", copy: "Complete daily tasks: device readings, medication logs, exercise check-ins. Nera AI tracks your progress and adjusts guidance based on your actual data." },
  { n: "3", title: "Graduate", copy: "Hit your clinical milestones. Share your progress report with your doctor. Celebrate measurable improvement — whether that's a BP reading down 20 points or a post-MI ECG clear for 12 weeks." },
];

interface Programme {
  icon: string;
  accent: string;
  name: string;
  duration: string;
  who: string;
  included: string[];
  device: string;
  alert: { type: "red" | "info"; text: string };
  cta1: { label: string; link: string };
  cta2: { label: string; link?: string };
}

const programmes: (Programme & { slug: string })[] = [
  {
    slug: "post-heart-attack",
    icon: "❤️", accent: "#FF4B4B",
    name: "Post Heart Attack Recovery Programme",
    duration: "12 weeks · 84 daily check-ins",
    who: "Patients recovering from myocardial infarction, angioplasty, bypass surgery, or any acute cardiac event in the past 12 weeks",
    included: [
      "Daily 12-lead ECG monitoring with Nera AI analysis",
      "Cardiac rehabilitation exercise progression (Phases 1–4)",
      "Medication adherence tracking with daily reminders",
      "Weekly AI risk assessment and cardiologist-ready report",
      "Optional cardiologist oversight — share progress automatically",
    ],
    device: "SanketLife ECG (required) + EasyTouch Wellness (recommended)",
    alert: { type: "red", text: "⚠️ Red Flag Alert: If Nera AI detects ST-segment changes or a significant arrhythmia during the programme, you receive an immediate alert with instructions to contact your doctor or go to the nearest emergency department." },
    cta1: { label: "Enrol Now", link: "/app" },
    cta2: { label: "Ask Your Doctor" },
  },
  {
    slug: "diabetic-cardiac",
    icon: "💉", accent: "#1A73E8",
    name: "Diabetic Cardiac Care Programme",
    duration: "16 weeks · 112 daily check-ins",
    who: "Type 2 diabetics with one or more cardiac risk factors — hypertension, elevated LDL, ECG abnormalities, or family history of heart disease",
    included: [
      "Metabolic wellness + ECG + BP triple monitoring, unified in Nera AI",
      "Post-meal metabolic impact scoring for every meal logged",
      "HbA1c trend prediction (estimated from 30-day metabolic patterns)",
      "Cardiometabolic risk score — updated after every reading",
      "Evidence-based dietary recommendations for diabetic cardiac patients",
    ],
    device: "EasyTouch Wellness (required) + SanketLife ECG (required)",
    alert: { type: "red", text: "⚠️ Red Flag Alert: If your fasting metabolic readings remain elevated for 3 consecutive days, or if Nera detects ECG changes alongside a metabolic spike, you receive an urgent escalation alert." },
    cta1: { label: "Enrol Now", link: "/app" },
    cta2: { label: "Ask Your Doctor" },
  },
  {
    slug: "obesity-reversal",
    icon: "⚖️", accent: "#00C853",
    name: "Obesity Reversal Programme",
    duration: "12 weeks · 84 daily check-ins",
    who: "Adults with BMI above 27.5 targeting safe, sustainable weight loss with health monitoring",
    included: [
      "Daily weight and 14-metric body composition tracking",
      "Visceral fat trend monitoring (the metabolically dangerous fat)",
      "Calorie and macro guidance personalised to your goals and BMR",
      "Activity targets tracked via Rhythm band step count and calories",
      "Weekly body recomposition analysis — weight vs. muscle vs. fat",
    ],
    device: "Agatsa Smart Scale (required) + EasyTouch Rhythm Band (recommended)",
    alert: { type: "red", text: "⚠️ Red Flag: If you lose more than 1.5 kg in a single week, Nera flags this as potentially rapid and recommends a review — fast weight loss can indicate muscle loss, not just fat loss." },
    cta1: { label: "Enrol Now", link: "/app" },
    cta2: { label: "Ask Your Doctor" },
  },
  {
    slug: "hypertension-control",
    icon: "🩺", accent: "#FF6D00",
    name: "Hypertension Control Programme",
    duration: "12 weeks · 168 BP readings (2x daily)",
    who: "Adults diagnosed with Stage 1 or Stage 2 hypertension, or pre-hypertension with risk factors",
    included: [
      "Twice-daily BP monitoring with trend analysis and stage tracking",
      "Medication adherence log with reminder system",
      "Stress index monitoring via HRV (Rhythm band)",
      "DASH diet daily guidance personalised to Indian food preferences",
      "Sleep quality analysis — poor sleep is the #1 underappreciated cause of high BP",
    ],
    device: "EasyTouch Wellness (required) + EasyTouch Rhythm Band (recommended)",
    alert: { type: "red", text: "⚠️ Red Flag: A systolic reading above 180 mmHg or diastolic above 120 mmHg triggers an immediate Hypertensive Crisis alert with instructions to seek emergency care immediately." },
    cta1: { label: "Enrol Now", link: "/app" },
    cta2: { label: "Ask Your Doctor" },
  },
  {
    slug: "corporate-wellness",
    icon: "🏢", accent: "#7C4DFF",
    name: "Corporate Wellness Programme",
    duration: "8 weeks · 56 days of guided wellness",
    who: "Employer-sponsored health initiatives for employee groups of 20 to 10,000+",
    included: [
      "Anonymous aggregate health dashboard for HR teams",
      "Individual biometric screening with Nera AI risk scoring",
      "Group challenges — steps, sleep, healthy readings leaderboard",
      "HR-friendly reporting — aggregate health trends, not individual data",
      "On-site camp screening integration — bulk ECG and vitals screening events",
    ],
    device: "Flexible — device bundles available for employer purchase",
    alert: { type: "info", text: "ℹ️ Note: Employees identified as high-risk by Nera AI are prompted to consult a doctor — HR sees only aggregate risk tiers, never individual health data." },
    cta1: { label: "Request a Demo", link: "/for-corporates" },
    cta2: { label: "Download Programme Guide" },
  },
];

function ProgrammeCard({ p, index }: { p: Programme & { slug: string }; index: number }) {
  const isInfo = p.alert.type === "info";
  return (
    <motion.div
      id={p.slug}
      {...fadeUp}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="bg-card rounded-3xl shadow-md border border-border overflow-hidden flex scroll-mt-24"
    >
      <div className="w-1 shrink-0" style={{ backgroundColor: p.accent }} />
      <div className="p-6 md:p-8 flex-1">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <span className="text-4xl">{p.icon}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground">{p.name}</h2>
            <span className="inline-block text-xs font-semibold text-primary-foreground bg-primary rounded-full px-3 py-1 mt-1">{p.duration}</span>
            <p className="text-sm text-muted-foreground mt-2"><span className="font-medium text-foreground">Who it's for:</span> {p.who}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">What's included</h3>
            <ul className="space-y-2">
              {p.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">✅</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">Devices required</h3>
              <p className="text-sm text-muted-foreground">{p.device}</p>
            </div>
            <div className={`rounded-xl p-4 text-sm ${isInfo ? "bg-primary/5 border border-primary/20 text-primary" : "bg-destructive/5 border border-destructive/20 text-destructive"}`}>
              {p.alert.text}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button asChild className="rounded-full">
            <Link to={p.cta1.link}>{p.cta1.label}</Link>
          </Button>
          <Button variant="outline" className="rounded-full">{p.cta2.label}</Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProgrammesPage() {
  useSEO({ title: "AI Care Programmes — Post Heart Attack, Diabetes, Hypertension | Agatsa One", description: "Five evidence-based Care Programmes: Post Heart Attack Recovery, Diabetic Cardiac Care, Obesity Reversal, Hypertension Control, Corporate Wellness. AI-guided. Doctor-supervised." });

  return (
    <SiteLayout>
      <section className="pt-8 pb-8 bg-gradient-to-b from-background to-[hsl(260,100%,97%)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Care Programmes</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            Guided recovery and prevention.
            <br className="hidden sm:block" />
            AI-powered. Doctor-supervised.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Agatsa One's Care Programmes go beyond monitoring. They are structured, evidence-based health improvement journeys that combine daily device readings, AI-driven task lists, clinical milestones, and optional doctor oversight — all in one app.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why Programmes Work</p>
            <h2 className="text-3xl font-bold text-foreground">What makes a Care Programme different?</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {whyCards.map((c, i) => (
              <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-base font-bold text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[hsl(260,100%,97%)]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How Programmes Work</p>
            <h2 className="text-3xl font-bold text-foreground">Three steps from enrolment to graduation.</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {howSteps.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto md:mx-0">{s.n}</div>
                <h3 className="text-lg font-bold text-foreground mt-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {programmes.map((p, i) => (
            <ProgrammeCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[800px] mx-auto px-4">
          <div className="bg-[hsl(260,100%,97%)] rounded-3xl p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Start your Care Programme today.</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              All Care Programmes are available in the Agatsa One app. Enrol takes under 5 minutes. A Nera AI subscription is required to access programmes.
            </p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link to="/app">Download Agatsa One</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Already have the app?{" "}
              <a href="https://agatsaone.com/app" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                Open Agatsa One <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
