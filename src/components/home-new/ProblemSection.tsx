import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const oldWay = [
  "Annual checkups that miss 364 days of changes",
  "ECG only when you're already in an emergency room",
  "Glucose readings without pattern analysis",
  "BP logs in a notebook no doctor ever reads",
  "No connection between your devices and your doctor",
  "Generic health advice that ignores your actual data",
];

const newWay = [
  "Continuous monitoring with medical-grade devices",
  "AI analysis of every ECG — 98.15% clinical accuracy",
  "Glucose trends, predicted HbA1c, meal scoring",
  "BP trends shared automatically with your care team",
  "All devices unified in one app, one AI, one health story",
  "Personalised recommendations from Nera AI, every day",
];

export function ProblemSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Why This Matters
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Health monitoring in India is broken.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Most people only check their vitals when something goes wrong. By then, it's often too late.
            Heart attacks don't send calendar invites. Silent diabetes kills silently. Hypertension earns
            its nickname — the 'silent killer' — for a reason.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Old way */}
          <motion.div
            {...fadeUp}
            className="bg-muted/50 rounded-3xl p-8 border border-border"
          >
            <h3 className="text-lg font-bold text-muted-foreground mb-6">The old way</h3>
            <ul className="space-y-4">
              {oldWay.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex gap-3 text-sm text-muted-foreground"
                >
                  <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* New way */}
          <motion.div
            {...fadeUp}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 border border-primary/10"
          >
            <h3 className="text-lg font-bold text-primary mb-6">The Agatsa One way</h3>
            <ul className="space-y-4">
              {newWay.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex gap-3 text-sm text-foreground"
                >
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
