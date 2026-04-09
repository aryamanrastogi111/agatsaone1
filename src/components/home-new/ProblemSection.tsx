import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export function ProblemSection() {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1 — Why This Matters + The moment problem */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-12">
          {/* Left — narrative hook */}
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              Why This Matters
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              We all trust health reports.
            </h2>
            <div className="space-y-1.5 text-lg text-muted-foreground mb-6">
              <p>A test. A number. A result.</p>
            </div>
            <p className="text-base text-foreground/80 leading-relaxed mb-4">
              But every report shows just <span className="text-primary font-bold">one moment</span>.
            </p>
            <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
              <p>One ECG is a moment.</p>
              <p>One sugar reading is a moment.</p>
              <p>One BP check is a moment.</p>
            </div>
          </motion.div>

          {/* Right — the shift */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-muted/50 rounded-3xl border border-border p-8 md:p-10"
          >
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              But your health is not a moment.
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              It's something that changes… slowly, quietly, continuously.
            </p>
            <p className="text-base text-foreground font-medium mb-5">
              You can feel fine today. Your report may look normal. Nothing may seem urgent.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              But what if things have been shifting… little by little… over the last few weeks?
            </p>
          </motion.div>
        </div>

        {/* Row 2 — 3 pattern cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: "Heart rhythm", desc: "A slight change you didn't notice" },
            { label: "Sugar levels", desc: "A gradual rise, week over week" },
            { label: "Blood pressure", desc: "A pattern forming quietly" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-5 text-center hover:border-primary/30 hover:shadow-md transition-all"
            >
              <p className="text-primary font-semibold text-sm mb-1">{item.label}</p>
              <p className="text-muted-foreground text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          {...fadeUp}
          className="text-center text-sm text-muted-foreground mb-10"
        >
          Individually, they may not stand out.{" "}
          <span className="text-foreground font-semibold">Together, they tell a different story.</span>
        </motion.p>

        {/* Key insight banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-3xl p-8 md:p-10 text-primary-foreground flex flex-col md:flex-row items-center gap-6 md:gap-10"
        >
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Health problems don't appear suddenly.
            </h3>
            <p className="text-lg text-primary-foreground/80 font-medium">
              They become visible when you see the pattern.
            </p>
          </div>
          <div className="w-px h-12 bg-primary-foreground/20 hidden md:block" />
          <p className="text-primary-foreground/60 text-sm md:text-base text-center md:text-left shrink-0 max-w-[200px]">
            And patterns only appear when you look <span className="text-primary-foreground font-semibold">over time</span>.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
