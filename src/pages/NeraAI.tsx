import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  HeartPulse,
  Watch,
  Brain,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Moon,
  Utensils,
  Zap,
  Shield,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  LineChart,
  Network,
  Telescope,
} from "lucide-react";
import neraScore from "@/assets/nera-score.jpeg.asset.json";
import neraSignals from "@/assets/nera-signals.jpeg.asset.json";
import neraRisk from "@/assets/nera-risk.jpeg.asset.json";
import neraActions from "@/assets/nera-actions.jpeg.asset.json";
import neraPlans from "@/assets/nera-plans.jpeg.asset.json";
import priyaPersona from "@/assets/priya-persona.jpg.asset.json";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
} as const;

function Section({
  eyebrow,
  title,
  subtitle,
  children,
  dark = false,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 ${
        dark ? "bg-[hsl(var(--dark-bg))] text-white" : "bg-background text-foreground"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          {eyebrow && (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 ${
                dark
                  ? "bg-white/10 text-white/80 border border-white/15"
                  : "bg-primary/10 text-primary border border-primary/15"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {eyebrow}
            </div>
          )}
          <h2
            className={`text-3xl md:text-5xl font-bold tracking-tight text-balance ${
              dark ? "text-white" : ""
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`mt-5 text-base md:text-lg leading-relaxed ${
                dark ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--dark-bg))] text-white">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/25 blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6 py-20 md:py-28">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-6">
            <Brain className="w-3 h-3" />
            NERA AI — The Intelligence Layer
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-balance text-white">
            Your ECG Knows One Story.
            <br />
            <span className="text-white/70">Your Metabolism Knows Another.</span>
            <br />
            <span className="text-white/70">Your sleep, activity, HRV, stress, more.</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NERA Connects Them All.
            </span>
          </h1>
          <p className="mt-7 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Powered by SanketLife ECG, EasyTouch Wellness, and Rhythm Band data, NERA transforms
            disconnected health readings — ECG, metabolic, sleep, activity, HRV, and stress — into personalized health intelligence.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="text-base px-8 h-12 btn-glow">
              <Link to="/pricing">
                Unlock NERA AI <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </motion.div>

        {/* Devices → Brain → Outputs diagram */}
        <motion.div {...fadeUp} className="mt-16 md:mt-20 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
            {/* Devices */}
            <div className="grid gap-3">
              {[
                { icon: HeartPulse, label: "SanketLife ECG", tone: "from-red-500/30 to-red-500/0" },
                { icon: Activity, label: "EasyTouch Wellness", tone: "from-emerald-500/30 to-emerald-500/0" },
                { icon: Watch, label: "Rhythm Band", tone: "from-sky-500/30 to-sky-500/0" },
              ].map((d) => (
                <div
                  key={d.label}
                  className={`relative flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r ${d.tone} px-4 py-3 backdrop-blur-sm`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <d.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm md:text-base font-medium">{d.label}</span>
                </div>
              ))}
            </div>

            {/* Brain */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl animate-pulse" />
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
                  <Brain className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              </div>
              <div className="mt-3 text-xs uppercase tracking-widest text-white/60">
                NERA AI Brain
              </div>
            </div>

            {/* Outputs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                "Heart Health",
                "Metabolic Health",
                "Lifestyle Intelligence",
                "Future Risk Insights",
              ].map((o) => (
                <div
                  key={o}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center backdrop-blur-sm"
                >
                  <div className="text-sm font-semibold">{o}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhyNeraExists() {
  const without = [
    { icon: HeartPulse, label: "ECG Report" },
    { icon: Activity, label: "Glucose Trend" },
    { icon: Moon, label: "Sleep Score" },
    { icon: Zap, label: "Activity Data" },
  ];
  return (
    <Section
      id="how-it-works"
      eyebrow="Why NERA Exists"
      title={
        <>
          Your Devices Collect Data.{" "}
          <span className="text-primary">NERA Finds Meaning.</span>
        </>
      }
      subtitle="Most health platforms show isolated numbers. NERA finds the relationships between them."
    >
      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Without */}
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-border bg-muted/50 p-6 md:p-8"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-5">
            <XCircle className="w-4 h-4" /> Without NERA
          </div>
          <div className="grid grid-cols-2 gap-3">
            {without.map((w) => (
              <div
                key={w.label}
                className="rounded-xl border border-border bg-background p-4 flex items-center gap-3"
              >
                <w.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{w.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted-foreground italic">
            All exist separately. No story. No connection.
          </p>
        </motion.div>

        {/* With */}
        <motion.div
          {...fadeUp}
          className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 md:p-8 shadow-[var(--purple-shadow)]"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-5">
            <CheckCircle2 className="w-4 h-4" /> With NERA
          </div>
          <div className="flex items-center justify-between gap-2 mb-5 text-xs font-semibold text-muted-foreground">
            <span className="px-3 py-1.5 rounded-full bg-background border">Device Data</span>
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="px-3 py-1.5 rounded-full bg-background border">AI Correlation</span>
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground">
              Insight
            </span>
          </div>
          <blockquote className="relative rounded-2xl bg-background border border-border p-5">
            <Sparkles className="absolute top-4 right-4 w-4 h-4 text-primary" />
            <p className="text-base md:text-lg leading-relaxed">
              "We found that your poor sleep is affecting both your{" "}
              <span className="text-primary font-semibold">heart recovery</span> and{" "}
              <span className="text-primary font-semibold">glucose stability</span>."
            </p>
          </blockquote>
        </motion.div>
      </div>
    </Section>
  );
}

function DeviceInsightSection({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  iconTone,
  insights,
  quote,
  visual,
  reverse = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconTone: string;
  insights: string[];
  quote: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <motion.div {...fadeUp}>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 ${iconTone}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {eyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {title}
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2.5">
              {insights.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <blockquote className="mt-7 rounded-2xl border-l-4 border-primary bg-muted/50 p-5">
              <Sparkles className="w-4 h-4 text-primary mb-2" />
              <p className="text-base md:text-lg italic leading-relaxed">"{quote}"</p>
            </blockquote>
          </motion.div>

          <motion.div {...fadeUp}>{visual}</motion.div>
        </div>
      </div>
    </section>
  );
}

function ECGTimelineVisual() {
  const points = [
    { label: "6 mo ago", score: 88, tag: "Baseline" },
    { label: "4 mo ago", score: 84, tag: "Stable" },
    { label: "2 mo ago", score: 79, tag: "Stress ↑" },
    { label: "Now", score: 74, tag: "Recovery ↓" },
  ];
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-red-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          ECG Longitudinal Trend
        </div>
        <HeartPulse className="w-5 h-5 text-red-500" />
      </div>
      <div className="space-y-3">
        {points.map((p) => (
          <div key={p.label} className="flex items-center gap-3">
            <div className="w-20 text-xs text-muted-foreground">{p.label}</div>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-primary rounded-full"
                style={{ width: `${p.score}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm font-bold">{p.score}</div>
            <div className="w-20 text-xs text-muted-foreground hidden sm:block">{p.tag}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
        Snapshots become a longitudinal health story.
      </div>
    </div>
  );
}

function MetabolicVisual() {
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-emerald-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Meals → Glucose → Insight
        </div>
        <Activity className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="space-y-4">
        {[
          { icon: Utensils, label: "Late dinner, 10:30 PM", state: "trigger" },
          { icon: LineChart, label: "Glucose variability ↑ 32%", state: "signal" },
          { icon: Brain, label: "Pattern detected by NERA", state: "ai" },
          { icon: Sparkles, label: "Personalized recommendation", state: "insight" },
        ].map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                s.state === "ai" || s.state === "insight"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <s.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm font-medium">{s.label}</div>
            {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function RhythmVisual() {
  const inputs = ["Sleep", "Activity", "Heart Rate", "Recovery", "Stress", "Movement"];
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-sky-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Daily Signals
        </div>
        <Watch className="w-5 h-5 text-sky-500" />
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {inputs.map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-background px-3 py-3 text-center text-xs font-semibold"
          >
            {i}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold mb-2">
          <Brain className="w-3.5 h-3.5" />
          NERA Output
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">Recovery Score</div>
          <div className="text-right font-bold">62 / 100</div>
          <div className="font-medium">Stress Burden</div>
          <div className="text-right font-bold text-warning">High</div>
          <div className="font-medium">Burnout Risk</div>
          <div className="text-right font-bold text-warning">Elevated</div>
        </div>
      </div>
    </div>
  );
}

function SleepVisual() {
  const nights = [
    { day: "Mon", score: 72, deep: "1h 12m", rem: "1h 40m" },
    { day: "Tue", score: 58, deep: "0h 45m", rem: "1h 05m" },
    { day: "Wed", score: 81, deep: "1h 30m", rem: "1h 55m" },
    { day: "Thu", score: 64, deep: "0h 55m", rem: "1h 20m" },
    { day: "Fri", score: 77, deep: "1h 20m", rem: "1h 45m" },
    { day: "Sat", score: 85, deep: "1h 45m", rem: "2h 05m" },
    { day: "Sun", score: 79, deep: "1h 25m", rem: "1h 50m" },
  ];
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-indigo-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Sleep Score Trend
        </div>
        <Moon className="w-5 h-5 text-indigo-500" />
      </div>
      <div className="space-y-3">
        {nights.map((n) => (
          <div key={n.day} className="flex items-center gap-3">
            <div className="w-10 text-xs font-semibold text-muted-foreground">{n.day}</div>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-primary rounded-full"
                style={{ width: `${n.score}%` }}
              />
            </div>
            <div className="w-10 text-right text-sm font-bold">{n.score}</div>
            <div className="hidden sm:block text-xs text-muted-foreground w-24 text-right">
              {n.deep} deep
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
        Deep sleep is below your baseline on weekdays. NERA links this to higher evening stress.
      </div>
    </div>
  );
}

function ActivityVisual() {
  const days = [
    { day: "Mon", steps: 8400, active: "42 min", calories: 420 },
    { day: "Tue", steps: 6200, active: "28 min", calories: 380 },
    { day: "Wed", steps: 11200, active: "65 min", calories: 510 },
    { day: "Thu", steps: 5400, active: "22 min", calories: 350 },
    { day: "Fri", steps: 9800, active: "55 min", calories: 480 },
    { day: "Sat", steps: 14600, active: "92 min", calories: 620 },
    { day: "Sun", steps: 7200, active: "35 min", calories: 390 },
  ];
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-amber-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Weekly Activity
        </div>
        <Zap className="w-5 h-5 text-amber-500" />
      </div>
      <div className="space-y-3">
        {days.map((d) => (
          <div key={d.day} className="flex items-center gap-3">
            <div className="w-10 text-xs font-semibold text-muted-foreground">{d.day}</div>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                style={{ width: `${Math.min((d.steps / 15000) * 100, 100)}%` }}
              />
            </div>
            <div className="w-14 text-right text-sm font-bold">{d.steps.toLocaleString()}</div>
            <div className="hidden sm:block text-xs text-muted-foreground w-16 text-right">
              {d.active}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
        Activity drops mid-week. NERA correlates this dip with reduced metabolic recovery.
      </div>
    </div>
  );
}

function HRVVisual() {
  const readings = [
    { label: "6 AM", ms: 52, note: "Low" },
    { label: "9 AM", ms: 58, note: "Rising" },
    { label: "12 PM", ms: 64, note: "Peak" },
    { label: "3 PM", ms: 61, note: "Stable" },
    { label: "6 PM", ms: 48, note: "Dip" },
    { label: "9 PM", ms: 55, note: "Recovering" },
  ];
  const maxMs = 80;
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-rose-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          HRV Through The Day
        </div>
        <Activity className="w-5 h-5 text-rose-500" />
      </div>
      <div className="space-y-3">
        {readings.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <div className="w-12 text-xs text-muted-foreground">{r.label}</div>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-400 rounded-full"
                style={{ width: `${(r.ms / maxMs) * 100}%` }}
              />
            </div>
            <div className="w-10 text-right text-sm font-bold">{r.ms}ms</div>
            <div className="w-16 text-right text-xs text-muted-foreground hidden sm:block">{r.note}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
        Evening HRV dips signal accumulated stress. NERA flags this before it affects sleep quality.
      </div>
    </div>
  );
}

function StressVisual() {
  const periods = [
    { time: "Morning", level: 32, state: "Low", color: "from-emerald-500 to-emerald-400" },
    { time: "Midday", level: 58, state: "Moderate", color: "from-amber-500 to-amber-400" },
    { time: "Afternoon", level: 71, state: "High", color: "from-orange-500 to-orange-400" },
    { time: "Evening", level: 45, state: "Moderate", color: "from-amber-500 to-amber-400" },
    { time: "Night", level: 28, state: "Low", color: "from-emerald-500 to-emerald-400" },
  ];
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-violet-500/5 to-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Stress Burden Timeline
        </div>
        <Brain className="w-5 h-5 text-violet-500" />
      </div>
      <div className="space-y-3">
        {periods.map((p) => (
          <div key={p.time} className="flex items-center gap-3">
            <div className="w-20 text-xs text-muted-foreground">{p.time}</div>
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${p.color} rounded-full`}
                style={{ width: `${p.level}%` }}
              />
            </div>
            <div className="w-10 text-right text-sm font-bold">{p.level}</div>
            <div className="w-20 text-right text-xs text-muted-foreground hidden sm:block">{p.state}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
        Afternoon stress peaks repeat on workdays. NERA suggests a 10-minute movement break at 2 PM.
      </div>
    </div>
  );
}

// CombinedIntelligence removed — replaced by PriyaReportStory narrative.

function FutureHealth() {
  return (
    <Section
      eyebrow="Your Future Health"
      title={
        <>
          See Where Your Health{" "}
          <span className="text-primary">Is Heading.</span>
        </>
      }
      subtitle="NERA estimates future risk trajectories based on your current patterns — and shows how they change when you act."
    >
      <div className="grid md:grid-cols-3 gap-3 max-w-5xl mx-auto mb-10">
        {[
          { label: "Future Diabetes Risk", icon: Activity },
          { label: "Future Cardiac Risk", icon: HeartPulse },
          { label: "Metabolic Decline Risk", icon: TrendingDown },
          { label: "Weight Gain Risk", icon: TrendingUp },
          { label: "Burnout Risk", icon: AlertTriangle },
          { label: "Recovery Decline Risk", icon: Shield },
        ].map((r) => (
          <div
            key={r.label}
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <r.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold">{r.label}</span>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        <motion.div
          {...fadeUp}
          className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 md:p-7"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-destructive font-bold mb-3">
            <TrendingDown className="w-4 h-4" />
            Current Trajectory
          </div>
          <p className="text-base md:text-lg leading-relaxed">
            "If your current trends continue, your metabolic health score may decline by{" "}
            <span className="font-bold text-destructive">18%</span> over the next{" "}
            <span className="font-bold">12 months</span>."
          </p>
        </motion.div>
        <motion.div
          {...fadeUp}
          className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-7"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-bold mb-3">
            <TrendingUp className="w-4 h-4" />
            With NERA Recommendations
          </div>
          <p className="text-base md:text-lg leading-relaxed">
            Projected{" "}
            <span className="font-bold text-primary">+22% improvement</span> in metabolic score, with
            reduced cardiac and burnout risk over the same period.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}

// SampleInsights removed — replaced by PriyaReportStory narrative.

function WhySubscribe() {
  return (
    <Section
      eyebrow="Why Subscribe"
      title={
        <>
          Turn Every Reading{" "}
          <span className="text-primary">Into A Story.</span>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-border bg-muted/40 p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-5">
            <XCircle className="w-4 h-4" /> Without NERA
          </div>
          <ul className="space-y-2.5 text-sm">
            {["Individual Reports", "Disconnected numbers", "Static snapshots", "No predictions"].map(
              (i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  {i}
                </li>
              ),
            )}
          </ul>
        </div>
        <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8 shadow-[var(--purple-shadow)]">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-5">
            <CheckCircle2 className="w-4 h-4" /> With NERA
          </div>
          <ul className="space-y-2.5 text-sm">
            {[
              "Health Intelligence",
              "Pattern Discovery",
              "Risk Prediction",
              "Personalized Guidance",
              "Longitudinal Tracking",
            ].map((i) => (
              <li key={i} className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--dark-bg))] text-white py-24 md:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[180px]" />
      </div>
      <div className="container relative mx-auto px-4 md:px-6 text-center">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-balance text-white">
            Your Devices Measure.
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NERA Understands.
            </span>
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto">
            Unlock the intelligence layer behind SanketLife ECG, EasyTouch Wellness, and Rhythm
            Band.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="text-base px-10 h-12 btn-glow">
              <Link to="/pricing">
                Activate NERA AI <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-8 h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/devices">Browse Devices</Link>
            </Button>
          </div>

          <p className="mt-14 text-base md:text-lg italic text-white/60 max-w-2xl mx-auto leading-relaxed">
            The future of healthcare is not more measurements.
            <br />
            <span className="text-white font-medium not-italic">
              It's understanding what those measurements mean.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ChapterShell({
  index,
  total,
  eyebrow,
  reverse = false,
  image,
  imageAlt,
  visual,
  children,
}: {
  index: number;
  total: number;
  eyebrow: string;
  reverse?: boolean;
  image?: string;
  imageAlt?: string;
  visual?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="relative grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center"
    >
      {/* Narrative column */}
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-bold tabular-nums">
            {String(index).padStart(2, "0")}
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-semibold">
            {eyebrow} · Chapter {index} of {total}
          </div>
        </div>
        {children}
      </div>

      {/* Phone column */}
      <div className={reverse ? "lg:order-1" : ""}>
        <div className="relative mx-auto w-full max-w-[280px]">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-primary/30 to-secondary/10 blur-2xl opacity-60" />
          <div className="relative rounded-[2.5rem] border-[8px] border-neutral-800 bg-black overflow-hidden shadow-2xl aspect-[9/19.5]">
            {visual ? (
              <div className="w-full h-full overflow-hidden">{visual}</div>
            ) : image ? (
              <img
                src={image}
                alt={imageAlt || ""}
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
            ) : null}
            <div className="absolute inset-x-0 top-0 h-6 flex justify-center pointer-events-none z-10">
              <div className="mt-1.5 h-4 w-24 rounded-full bg-neutral-900" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


function PriyaReportStory() {
  const TOTAL = 6;
  return (
    <section className="relative bg-[hsl(var(--dark-bg))] text-white py-20 md:py-28 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[140px]" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section intro */}
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3 h-3" />
            A Real NERA Report
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance text-white">
            Meet Priya. This is her NERA report.{" "}
            <span className="text-white/60">Yours will look like this in 7 days.</span>
          </h2>
          <div className="mt-7 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-sm">
            <img
              src={priyaPersona.url}
              alt="Priya Sharma"
              width={44}
              height={44}
              loading="lazy"
              className="w-11 h-11 rounded-full object-cover border border-white/20"
            />
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Priya Sharma, 34</div>
              <div className="text-xs text-white/60">Bengaluru · 3 connected devices</div>
            </div>
            <div className="hidden sm:block w-px h-9 bg-white/15" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Day 7 · Report ready
            </div>
          </div>
        </motion.div>

        {/* Chapters */}
        <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
          {/* Ch 1 — The verdict */}
          <ChapterShell
            index={1}
            total={TOTAL}
            eyebrow="The Verdict"
            image={neraScore.url}
            imageAlt="Priya's NERA score of 49"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-balance text-white">
              Day 7. NERA gives Priya a score of{" "}
              <span className="text-warning">49</span>.
            </h3>
            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Not the number she wanted to see. But for the first time, she understands{" "}
              <span className="text-white">why</span>. Four pillars, one honest picture — no
              dashboards to interpret.
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 max-w-md">
              {[
                { label: "Lifestyle", value: 50, tone: "text-primary" },
                { label: "Cardiac", value: 65, tone: "text-red-400" },
                { label: "Metabolic", value: 22, tone: "text-orange-400" },
                { label: "Food", value: 53, tone: "text-emerald-400" },
              ].map((p) => (
                <div
                  key={p.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3 text-center"
                >
                  <div className={`text-xl font-bold ${p.tone} tabular-nums`}>{p.value}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/55 mt-0.5">
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-warning/15 border border-warning/30 text-warning px-3 py-1.5 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Some signals need attention
            </div>
          </ChapterShell>

          {/* Ch 2 — The 9 signals */}
          <ChapterShell
            index={2}
            total={TOTAL}
            eyebrow="The Signals"
            reverse
            image={neraSignals.url}
            imageAlt="NERA reads 9 health signals"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              NERA read all{" "}
              <span className="text-primary">9 of 9 health signals</span>. Most apps read two.
            </h3>
            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Priya's Rhythm Band streams sleep, activity and HRV. SanketLife ECG handles cardiac.
              EasyTouch Wellness tracks her metabolic zone and sugar response. NERA reads them
              together — so one weak signal can't hide behind a strong one.
            </p>
            <div className="mt-6 space-y-2.5 max-w-md">
              {[
                { label: "Sleep", value: "35/100", note: "1.5h avg · Rhythm Band", tone: "from-violet-500/70 to-violet-500/0", text: "text-violet-300" },
                { label: "Metabolic Zone", value: "22/100", note: "15 readings · high zone", tone: "from-orange-500/70 to-orange-500/0", text: "text-orange-300" },
                { label: "Body Composition", value: "90/100", note: "BMI 24.4 · 66.3 kg", tone: "from-emerald-500/70 to-emerald-500/0", text: "text-emerald-300" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{r.label}</div>
                    <div className="text-[11px] text-white/50 mt-0.5">{r.note}</div>
                  </div>
                  <div className={`text-sm font-bold tabular-nums ${r.text}`}>{r.value}</div>
                </div>
              ))}
            </div>
          </ChapterShell>

          {/* Ch 3 — Risk estimate */}
          <ChapterShell
            index={3}
            total={TOTAL}
            eyebrow="The Risk Estimate"
            image={neraRisk.url}
            imageAlt="Cardiac and metabolic risk estimates"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-balance text-white">
              Then NERA does the math{" "}
              <span className="text-primary">no single device can</span>.
            </h3>

            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              124 sugar readings across 6 days. Clinical thresholds — Rodbard, Monnier — applied
              against her ECG and lifestyle data. Not a diagnosis. A direction.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-md">
              <div className="rounded-2xl border border-warning/30 bg-warning/[0.08] p-4">
                <div className="text-[11px] uppercase tracking-wider text-warning/90 font-bold">
                  Cardiac Risk
                </div>
                <div className="mt-1 text-3xl font-bold text-warning tabular-nums">29%</div>
                <div className="text-xs text-white/60 mt-1">Moderate — sleep & HR trends</div>
              </div>
              <div className="rounded-2xl border border-orange-500/30 bg-orange-500/[0.08] p-4">
                <div className="text-[11px] uppercase tracking-wider text-orange-300 font-bold">
                  Metabolic Risk
                </div>
                <div className="mt-1 text-3xl font-bold text-orange-300 tabular-nums">52%</div>
                <div className="text-xs text-white/60 mt-1">Elevated — add monitoring</div>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-orange-500/30 bg-orange-500/[0.06] px-4 py-3 max-w-md">
              <div className="text-[10px] uppercase tracking-[0.15em] text-orange-300 font-bold mb-1">
                Worth Watching
              </div>
              <div className="text-sm text-white/85">
                Time in optimal metabolic zone is lower than ideal.
              </div>
            </div>
          </ChapterShell>

          {/* Ch 4 — Ranked actions */}
          <ChapterShell
            index={4}
            total={TOTAL}
            eyebrow="The Plan"
            reverse
            imageAlt="Top actions ranked by impact"
            visual={
              <div className="w-full h-full bg-gradient-to-b from-[#0c0c1a] via-[#10102a] to-[#0a0a18] text-white p-4 pt-8 flex flex-col gap-3">
                <div className="text-[9px] uppercase tracking-[0.18em] text-primary font-bold">
                  Sparkles · Ranked by Impact
                </div>
                <div className="text-[15px] font-bold leading-tight">
                  Two changes. <span className="text-primary">Biggest score lift.</span>
                </div>

                {/* Action 1 */}
                <div className="rounded-xl border border-primary/40 bg-primary/[0.08] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary">#1 SLEEP</span>
                    <span className="text-[10px] font-bold text-primary tabular-nums">+44 pts</span>
                  </div>
                  <div className="mt-1 text-[12px] font-bold leading-snug">
                    Sleep 7–8 hrs consistently
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[88%] bg-gradient-to-r from-primary to-secondary" />
                  </div>
                </div>

                {/* Action 2 */}
                <div className="rounded-xl border border-sky-400/40 bg-sky-400/[0.08] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-300">#2 MOVE</span>
                    <span className="text-[10px] font-bold text-sky-300 tabular-nums">+28 pts</span>
                  </div>
                  <div className="mt-1 text-[12px] font-bold leading-snug">
                    Add 4,897 steps daily
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[62%] bg-sky-400" />
                  </div>
                </div>

                {/* 6-week projection */}
                <div className="mt-1 rounded-xl border border-emerald-400/30 bg-emerald-400/[0.06] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold mb-1.5">
                    6-Week Projection
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] text-white/50">Score</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-white/40 tabular-nums line-through">49</span>
                        <ArrowRight className="w-3 h-3 text-white/40" />
                        <span className="text-2xl font-bold tabular-nums text-emerald-300">72</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-white/50">Diabetes risk</div>
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-sm font-bold text-white/40 tabular-nums line-through">52%</span>
                        <ArrowRight className="w-3 h-3 text-white/40" />
                        <span className="text-lg font-bold tabular-nums text-emerald-300">31%</span>
                      </div>
                    </div>
                  </div>
                  {/* Trend line */}
                  <svg viewBox="0 0 100 30" className="mt-2 w-full h-7">
                    <defs>
                      <linearGradient id="trendGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgb(110 231 183)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="rgb(110 231 183)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 24 L20 22 L40 17 L60 12 L80 7 L100 3 L100 30 L0 30 Z" fill="url(#trendGrad)" />
                    <path d="M0 24 L20 22 L40 17 L60 12 L80 7 L100 3" stroke="rgb(52 211 153)" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </div>
            }
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-balance text-white">
              Then it tells her{" "}
              <span className="text-primary">exactly what to do</span> — ranked by impact.
            </h3>
            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Not 30 generic tips. Two changes, each weighed in points she'll actually recover on
              her score.
            </p>
            <div className="mt-6 space-y-3 max-w-md">
              <div className="rounded-2xl border-l-4 border-primary bg-white/[0.04] border-y border-r border-white/10 px-5 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-primary font-bold text-lg tabular-nums">#1</span>
                  <span className="text-white font-bold text-lg">Sleep 7–8 hours consistently</span>
                </div>
                <div className="mt-1 text-sm text-primary/90 font-semibold">
                  +44 pts — highest single impact
                </div>
              </div>
              <div className="rounded-2xl border-l-4 border-sky-400 bg-white/[0.04] border-y border-r border-white/10 px-5 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-sky-400 font-bold text-lg tabular-nums">#2</span>
                  <span className="text-white font-bold text-lg">Add 4,897 more steps daily</span>
                </div>
                <div className="mt-1 text-sm text-sky-300 font-semibold">
                  Reduces metabolic and cardiac risk
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] px-5 py-4">
                <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
                  Projected in 6 weeks
                </div>
                <div className="mt-1 text-sm text-white/85">
                  Score <span className="text-white/50 line-through">49</span> →{" "}
                  <span className="text-emerald-300 font-bold">72</span> · Diabetes risk{" "}
                  <span className="text-white/50 line-through">52%</span> →{" "}
                  <span className="text-emerald-300 font-bold">31%</span>
                </div>
              </div>
            </div>
          </ChapterShell>


          {/* Ch 5 — Outcome (no screenshot) */}
          <motion.div {...fadeUp} className="relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-bold tabular-nums">
                  05
                </div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-semibold">
                  Six Weeks Later · Chapter 5 of {TOTAL}
                </div>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
                Priya's NERA score climbed from{" "}
                <span className="text-warning">49</span>{" "}
                <ArrowRight className="inline w-7 h-7 text-white/40 mx-1 -translate-y-1" />{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  72
                </span>
                .
              </h3>
              <p className="mt-4 text-base md:text-lg text-white/70">
                Same devices. Same body. New understanding.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { label: "Sleep score", from: 35, to: 71, tone: "from-violet-500/20 to-transparent", text: "text-violet-300" },
                { label: "Metabolic zone", from: 22, to: 58, tone: "from-orange-500/20 to-transparent", text: "text-orange-300" },
                { label: "Diabetes risk", from: 52, to: 31, tone: "from-emerald-500/20 to-transparent", text: "text-emerald-300", suffix: "%", invert: true },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`rounded-2xl border border-white/10 bg-gradient-to-br ${m.tone} p-5`}
                >
                  <div className="text-[11px] uppercase tracking-wider text-white/55 font-semibold">
                    {m.label}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white/40 tabular-nums line-through">
                      {m.from}
                      {m.suffix || ""}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                    <span className={`text-4xl font-bold tabular-nums ${m.text}`}>
                      {m.to}
                      {m.suffix || ""}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-white/55">
                    {m.invert ? "Lower is better" : "Higher is better"}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-xs text-white/40 max-w-2xl mx-auto leading-relaxed">
              Priya is an illustrative composite based on typical NERA reports. Not a medical case.
              Individual results vary.
            </p>
          </motion.div>

          {/* Ch 6 — Start your own */}
          <ChapterShell
            index={6}
            total={TOTAL}
            eyebrow="Your Turn"
            reverse
            image={neraPlans.url}
            imageAlt="NERA AI Premium plans"
          >
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-balance text-white">

              Your report is{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                7 days away
              </span>
              .
            </h3>
            <p className="mt-5 text-base md:text-lg text-white/70 leading-relaxed">
              Connect your Agatsa devices. NERA AI does the rest — a weekly report every Monday,
              daily nudges, predictive warnings, a 3-day recovery forecast and unlimited lifestyle
              correlations.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2.5 max-w-md">
              {[
                "Weekly AI health report",
                "Daily nudges from NERA",
                "Predictive health warnings",
                "3-day recovery forecast",
                "City health rank vs peers",
                "Unlimited lifestyle correlations",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="text-base px-7 h-12 btn-glow">
                <Link to="/pricing">
                  Activate NERA AI <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base px-7 h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/devices">Browse Devices</Link>
              </Button>
            </div>
          </ChapterShell>
        </div>
      </div>
    </section>
  );
}

export default function NeraAIPage() {
  useSEO({
    title: "NERA AI — The Intelligence Layer for Agatsa Devices | Agatsa One",
    description:
      "NERA AI connects SanketLife ECG, EasyTouch Wellness, and Rhythm Band data into personalized health intelligence — patterns, risks, and future outcomes.",
  });

  return (
    <SiteLayout>
      <HeroSection />
      <WhyNeraExists />

      <DeviceInsightSection
        eyebrow="SanketLife ECG"
        title={
          <>
            Beyond ECG Reports.
          </>
        }
        subtitle="NERA continuously learns from your ECG history — turning snapshots into a longitudinal cardiac story."
        icon={HeartPulse}
        iconTone="bg-red-500/10 text-red-500 border border-red-500/20"
        insights={[
          "Heart Health Score",
          "Changes in cardiac risk profile",
          "Longitudinal ECG changes",
          "Recovery & stress impact on heart",
          "ECG trend analysis over months & years",
          "Early changes worth discussing with your doctor",
        ]}
        quote="Compared to six months ago, your ECG patterns show reduced cardiac resilience during periods of poor sleep."
        visual={<ECGTimelineVisual />}
      />

      <DeviceInsightSection
        reverse
        eyebrow="EasyTouch Wellness"
        title={<>Understand Your Metabolic Health.</>}
        subtitle="NERA analyzes non-invasive sugar trends together with your lifestyle behaviour to surface patterns."
        icon={Activity}
        iconTone="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
        insights={[
          "Metabolic Health Score",
          "Sugar Stability Score",
          "Meal response patterns",
          "Energy crash detection",
          "Insulin resistance risk indicators",
          "Future metabolic risk estimation",
        ]}
        quote="We observed recurring sugar instability after late dinners and reduced evening activity."
        visual={<MetabolicVisual />}
      />

      <DeviceInsightSection
        eyebrow="Rhythm Band"
        title={<>Your Body Reveals Patterns Every Day.</>}
        subtitle="NERA studies the daily signals most people ignore — and translates them into a clear picture of how you're coping."
        icon={Watch}
        iconTone="bg-sky-500/10 text-sky-600 border border-sky-500/20"
        insights={[
          "Recovery Score",
          "Lifestyle Balance Score",
          "Stress Burden Score",
          "Sleep quality impact",
          "Burnout risk indicators",
          "Behavioural health patterns",
        ]}
        quote="Three consecutive weeks of poor recovery are impacting both metabolic and cardiac health markers."
        visual={<RhythmVisual />}
      />

      <DeviceInsightSection
        reverse
        eyebrow="Sleep Intelligence"
        title={<>Understand How You Rest.</>}
        subtitle="NERA analyzes your sleep architecture — deep sleep, REM, and wake patterns — and connects rest quality to heart recovery and metabolic stability."
        icon={Moon}
        iconTone="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
        insights={[
          "Sleep Quality Score",
          "Deep & REM sleep tracking",
          "Sleep consistency patterns",
          "Bedtime routine impact",
          "Sleep-heart recovery link",
          "Next-day energy prediction",
        ]}
        quote="Your deep sleep drops by 40 minutes on high-stress days. NERA suggests a wind-down routine starting 30 minutes earlier."
        visual={<SleepVisual />}
      />

      <DeviceInsightSection
        eyebrow="Activity Intelligence"
        title={<>See Movement As Medicine.</>}
        subtitle="NERA tracks daily activity, steps, and active minutes — then correlates movement patterns with metabolic response and cardiovascular recovery."
        icon={Zap}
        iconTone="bg-amber-500/10 text-amber-600 border border-amber-500/20"
        insights={[
          "Activity Balance Score",
          "Steps & active minutes trend",
          "Sedentary behaviour alerts",
          "Movement-metabolism link",
          "Workout recovery tracking",
          "Weekly consistency insights",
        ]}
        quote="Your metabolic zone improves by 18% on days with 45+ minutes of moderate activity. NERA builds this into your weekly target."
        visual={<ActivityVisual />}
      />

      <DeviceInsightSection
        reverse
        eyebrow="HRV Intelligence"
        title={<>Read Your Nervous System.</>}
        subtitle="NERA monitors heart rate variability throughout the day — a window into how your body balances stress and recovery in real time."
        icon={Activity}
        iconTone="bg-rose-500/10 text-rose-500 border border-rose-500/20"
        insights={[
          "HRV Baseline Tracking",
          "Morning readiness score",
          "Autonomic nervous system balance",
          "Stress-recovery ratio",
          "Overtraining & burnout flags",
          "Lifestyle intervention response",
        ]}
        quote="Your evening HRV drops below baseline 3 days in a row. NERA flags this as early fatigue — before it affects sleep or mood."
        visual={<HRVVisual />}
      />

      <DeviceInsightSection
        eyebrow="Stress Intelligence"
        title={<>Know Your Stress Before It Knows You.</>}
        subtitle="NERA measures stress burden across your day — identifying triggers, recovery gaps, and the cumulative impact on heart and metabolic health."
        icon={Brain}
        iconTone="bg-violet-500/10 text-violet-500 border border-violet-500/20"
        insights={[
          "Stress Burden Score",
          "Peak stress time identification",
          "Recovery window tracking",
          "Stress-sleep disruption link",
          "Stress-metabolic spike alerts",
          "Personalized calm-down prompts",
        ]}
        quote="Afternoon stress peaks repeat at 2 PM on workdays. NERA suggests a 10-minute breathing window — your HRV recovers 22% faster."
        visual={<StressVisual />}
      />

      <PriyaReportStory />
      <FutureHealth />
      <WhySubscribe />
      <FinalCTA />
    </SiteLayout>
  );
}
