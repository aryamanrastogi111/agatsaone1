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
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NERA Connects Them Both.
            </span>
          </h1>
          <p className="mt-7 text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Powered by SanketLife ECG, EasyTouch Wellness, and Rhythm Band data, NERA transforms
            disconnected health readings into personalized health intelligence.
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

function CombinedIntelligence() {
  const chains = [
    {
      from: "Poor Sleep",
      via: "Higher Morning Glucose Variability",
      to: "Reduced Cardiac Recovery",
      icon: Moon,
    },
    {
      from: "Reduced Activity",
      via: "Rising Body Fat %",
      to: "Lower Metabolic Score",
      icon: TrendingDown,
    },
    {
      from: "Persistent Stress",
      via: "Elevated Resting Heart Rate",
      to: "Declining Recovery Capacity",
      icon: AlertTriangle,
    },
    {
      from: "Late Night Eating",
      via: "Glucose Instability → Lower Sleep Quality",
      to: "Reduced Heart Recovery",
      icon: Utensils,
    },
  ];
  return (
    <Section
      dark
      eyebrow="Combined Intelligence"
      title={
        <>
          The Real Magic Happens When{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Everything Connects.
          </span>
        </>
      }
      subtitle="NERA correlates data across all your devices to reveal cause-and-effect patterns invisible in isolated reports."
    >
      <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-12">
        {chains.map((c) => (
          <motion.div
            key={c.from}
            {...fadeUp}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <c.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm font-bold">{c.from}</div>
            </div>
            <div className="pl-2 border-l-2 border-primary/40 ml-4 space-y-2 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{c.via}</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-white font-medium">{c.to}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Network diagram */}
      <motion.div
        {...fadeUp}
        className="relative max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 font-semibold mb-6 justify-center">
          <Network className="w-4 h-4" />
          NERA Correlation Network
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {["Sleep", "Stress", "Activity", "ECG", "Metabolic", "Recovery"].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/15 to-secondary/10 px-3 py-4 text-sm font-semibold"
            >
              {n}
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-white/50">
          Every node influences every other node. NERA finds the strongest signals.
        </div>
      </motion.div>
    </Section>
  );
}

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

function SampleInsights() {
  const cards = [
    {
      title: "Heart Intelligence",
      icon: HeartPulse,
      tone: "text-red-500",
      body: "Your ECG patterns remain stable overall. However, episodes of poor sleep correlate with temporary declines in recovery markers.",
    },
    {
      title: "Metabolic Intelligence",
      icon: Activity,
      tone: "text-emerald-500",
      body: "Late evening meals are associated with higher glucose variability and reduced next-day energy stability.",
    },
    {
      title: "Lifestyle Intelligence",
      icon: Watch,
      tone: "text-sky-500",
      body: "Increasing activity by 2,000 steps daily may improve both metabolic and recovery scores.",
    },
    {
      title: "Future Intelligence",
      icon: Telescope,
      tone: "text-primary",
      body: "Current trends suggest elevated diabetes risk over the next 3 years if lifestyle patterns remain unchanged.",
    },
  ];
  return (
    <Section
      eyebrow="Sample Insights"
      title={
        <>
          What NERA Tells You,{" "}
          <span className="text-primary">In Your Own Words.</span>
        </>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {cards.map((c) => (
          <motion.div
            key={c.title}
            {...fadeUp}
            className="rounded-3xl border border-border bg-card p-6 hover-lift"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                <c.icon className={`w-5 h-5 ${c.tone}`} />
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {c.title}
              </div>
            </div>
            <p className="text-base leading-relaxed">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

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

      <CombinedIntelligence />
      <FutureHealth />
      <SampleInsights />
      <WhySubscribe />
      <FinalCTA />
    </SiteLayout>
  );
}
