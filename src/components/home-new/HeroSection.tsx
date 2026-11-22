import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Activity, Moon, Sparkles } from "lucide-react";
import heroImage from "@/assets/luxe-hero-night.jpg";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.1 },
});

const signals = [
  { icon: Heart, label: "ECG rhythm", value: "Normal", tone: "text-primary-glow" },
  { icon: Activity, label: "Meal response", value: "Recovering", tone: "text-signal" },
  { icon: Moon, label: "Sleep readiness", value: "84", tone: "text-primary-glow" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background min-h-[min(88vh,860px)] flex items-center">
      <img
        src={heroImage}
        alt="Woman checking her Nera AI health insights at night"
        width={1600}
        height={1008}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center] opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-background/40" />

      <div className="section-shell w-full py-20 md:py-28 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div className="max-w-2xl space-y-7">
          <motion.span {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_12px_hsl(var(--signal))]" />
            Trusted by 2.1 Lac+ users
          </motion.span>

          <motion.h1 {...fade(1)} className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight">
            Know your body.
            <br />
            <span className="luxe-text-gradient">Before it tells you.</span>
          </motion.h1>

          <motion.p {...fade(2)} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            SanketLife ECG, EasyTouch Wellness, Rhythm Band and Zlu — personal health devices that feed Nera AI, so every reading becomes a clear next step.
          </motion.p>

          <motion.div {...fade(3)} className="flex flex-wrap gap-3">
            <Link to="/devices" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-[0_0_40px_-8px_hsl(var(--primary))] transition hover:shadow-[0_0_60px_-6px_hsl(var(--primary))]">
              Explore devices <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/partner-with-us" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-7 py-3.5 font-semibold text-foreground backdrop-blur transition hover:border-foreground/40">
              For healthcare & partners
            </Link>
          </motion.div>

          <motion.dl {...fade(4)} className="grid grid-cols-3 gap-6 pt-8 border-t border-border max-w-lg">
            {[["98.15%", "ECG sensitivity"], ["1.5 Cr+", "Readings analysed"], ["24h", "Dispatch"]].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl md:text-3xl font-bold">{v}</dt>
                <dd className="text-xs text-muted-foreground mt-1">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div {...fade(3)} className="hidden lg:flex flex-col gap-3 justify-self-end w-full max-w-xs">
          <div className="quiet-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-glow">
              <Sparkles className="h-3.5 w-3.5" /> Nera AI · Today
            </div>
            <p className="mt-3 text-sm leading-relaxed">Your post-lunch response settled 20 minutes faster than last week.</p>
          </div>
          {signals.map(({ icon: Icon, label, value, tone }) => (
            <div key={label} className="quiet-card flex items-center justify-between p-4">
              <span className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className={`h-4 w-4 ${tone}`} /> {label}
              </span>
              <span className="font-display font-bold">{value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
