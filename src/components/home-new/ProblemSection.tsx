import { motion } from "framer-motion";
import { Heart, Droplets, Activity } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const riskCards = [
  { icon: Heart, label: "Heart rhythm", desc: "A slight change you didn't notice" },
  { icon: Droplets, label: "Metabolic wellness", desc: "A gradual rise, week over week" },
  { icon: Activity, label: "Blood pressure", desc: "A pattern forming quietly" },
];

export function ProblemSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* WHY THIS MATTERS */}
        <motion.div {...fadeUp} className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">
            Why This Matters
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6">
            We all trust health reports.
          </h2>
          <div className="flex items-center justify-center gap-6 text-lg text-muted-foreground font-medium">
            <span>A test.</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>A number.</span>
            <span className="w-1 h-1 rounded-full bg-primary" />
            <span>A result.</span>
          </div>
        </motion.div>

        {/* BUT EVERY REPORT IS ONE MOMENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-14"
        >
          <p className="text-lg md:text-xl text-foreground font-medium mb-5">
            But every report shows just{" "}
            <span className="text-primary font-extrabold underline decoration-primary/30 decoration-2 underline-offset-4">
              one moment
            </span>.
          </p>
          <div className="space-y-1 text-muted-foreground text-base">
            <p>One ECG is a moment.</p>
            <p>One metabolic reading is a moment.</p>
            <p>One BP check is a moment.</p>
          </div>
          <div className="w-16 h-px bg-primary/30 mx-auto my-8" />
          <p className="text-2xl md:text-3xl font-extrabold text-foreground">
            But your health is <span className="text-primary">not</span> a moment.
          </p>
          <p className="text-muted-foreground mt-3 text-base">
            It's something that changes…<br />
            <span className="text-foreground font-semibold">slowly, quietly, continuously.</span>
          </p>
        </motion.div>

        {/* THE REAL INSIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-lg md:text-xl text-foreground font-medium mb-4">
            You can feel fine today.
          </p>
          <div className="space-y-1 text-muted-foreground mb-6">
            <p>Your report may look normal.</p>
            <p>Nothing may seem urgent.</p>
          </div>
          <p className="text-base text-foreground/80 max-w-xl mx-auto leading-relaxed mb-8">
            But what if things have been shifting…{" "}
            <span className="font-semibold text-foreground">little by little</span>…
            over the last few weeks?
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {riskCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-muted rounded-2xl p-5 border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-primary font-bold text-sm mb-1">{card.label}</p>
                <p className="text-muted-foreground text-xs">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mt-6">
            Individually, they may not stand out.
            <br />
            <span className="text-foreground font-bold">Together, they tell a different story.</span>
          </p>
        </motion.div>

        {/* THE SHIFT — KEY IDEA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground shadow-xl shadow-primary/20"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            Health problems don't appear suddenly.
          </h3>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-semibold">
            They become visible when you see the pattern.
          </p>
          <div className="w-12 h-px bg-primary-foreground/30 mx-auto my-5" />
          <p className="text-primary-foreground/70 text-sm">
            And patterns only appear
            <br />
            when you look over time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
