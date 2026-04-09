import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function ProblemSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 2 — Why This Matters */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            Why This Matters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            We all trust health reports.
          </h2>
          <div className="space-y-2 text-lg text-muted-foreground">
            <p>A test.</p>
            <p>A number.</p>
            <p>A result.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <p className="text-lg md:text-xl text-foreground font-medium mb-6">
            But every report shows just <span className="text-primary font-bold">one moment</span>.
          </p>
          <div className="space-y-1.5 text-muted-foreground">
            <p>One ECG is a moment.</p>
            <p>One sugar reading is a moment.</p>
            <p>One BP check is a moment.</p>
          </div>
          <div className="w-16 h-px bg-primary/30 mx-auto my-8" />
          <p className="text-xl md:text-2xl font-bold text-foreground">
            But your health is not a moment.
          </p>
          <p className="text-muted-foreground mt-3">
            It's something that changes…<br />
            slowly, quietly, continuously.
          </p>
        </motion.div>

        {/* Section 3 — The Real Insight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-lg md:text-xl text-foreground font-medium mb-6">
            You can feel fine today.
          </p>
          <div className="space-y-1.5 text-muted-foreground mb-6">
            <p>Your report may look normal.</p>
            <p>Nothing may seem urgent.</p>
          </div>
          <p className="text-base text-foreground/80 max-w-xl mx-auto leading-relaxed">
            But what if things have been shifting… little by little… over the last few weeks?
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted/50 rounded-2xl p-5 border border-border">
              <p className="text-primary font-semibold mb-1">Heart rhythm</p>
              <p className="text-muted-foreground">A slight change you didn't notice</p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-5 border border-border">
              <p className="text-primary font-semibold mb-1">Sugar levels</p>
              <p className="text-muted-foreground">A gradual rise, week over week</p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-5 border border-border">
              <p className="text-primary font-semibold mb-1">Blood pressure</p>
              <p className="text-muted-foreground">A pattern forming quietly</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-6">
            Individually, they may not stand out.<br />
            <span className="text-foreground font-medium">Together, they tell a different story.</span>
          </p>
        </motion.div>

        {/* Section 4 — The Shift (Key Idea) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-3xl p-8 md:p-12 text-center text-primary-foreground"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Health problems don't appear suddenly.
          </h3>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-medium">
            They become visible when you see the pattern.
          </p>
          <div className="w-12 h-px bg-primary-foreground/30 mx-auto my-6" />
          <p className="text-primary-foreground/70">
            And patterns only appear<br />
            when you look over time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
