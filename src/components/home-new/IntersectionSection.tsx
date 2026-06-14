import { motion } from "framer-motion";
import { Watch, Stethoscope, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const pillars = [
  {
    icon: Watch,
    tag: "Wearable convenience",
    title: "Always with you",
    desc: "Pocket-sized. No clinic visit, no appointments. Take a reading the moment something feels off — in 30 seconds, from your couch.",
  },
  {
    icon: Stethoscope,
    tag: "Medical-grade accuracy",
    title: "Hospital-level precision",
    desc: "CDSCO Class B certified devices, 98.15% ECG accuracy, validated against hospital equipment. The same signals your cardiologist trusts.",
  },
  {
    icon: Brain,
    tag: "Nera AI insights",
    title: "An intelligence layer on top",
    desc: "Trained on 1.5 Cr+ readings. Nera AI reads patterns across your heart, metabolism, sleep and stress — and tells you what matters, in plain words.",
  },
];

export function IntersectionSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 border-y border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="max-w-2xl mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            What Agatsa Actually Is
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-5">
            The intersection of{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              wearables, medical devices and AI.
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Most fitness wearables track. Most medical devices diagnose. Neither tells you
            <em> what to do </em>about it. Agatsa sits in the middle — combining the convenience of a
            wearable, the accuracy of a clinical device, and the judgement of an AI that has seen 1.5 Cr+
            health readings.
          </p>
        </motion.div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.tag}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-background p-8 md:p-10 flex flex-col"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
                  {p.tag}
                </p>
                <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Equation strip */}
        <motion.div
          {...fadeUp}
          className="mt-10 rounded-2xl border border-border bg-background p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex-1 flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm md:text-base font-semibold text-foreground">
            <span className="px-3 py-1.5 rounded-md bg-muted">Wearable</span>
            <span className="text-muted-foreground">+</span>
            <span className="px-3 py-1.5 rounded-md bg-muted">Medical device</span>
            <span className="text-muted-foreground">+</span>
            <span className="px-3 py-1.5 rounded-md bg-primary/10 text-primary">Nera AI</span>
            <span className="text-muted-foreground">=</span>
            <span className="px-3 py-1.5 rounded-md bg-foreground text-background">
              Health you can actually act on
            </span>
          </div>
          <Link
            to="/nera-ai"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
          >
            Meet Nera AI
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
