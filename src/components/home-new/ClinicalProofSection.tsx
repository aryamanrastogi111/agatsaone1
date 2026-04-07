import { motion } from "framer-motion";
import { Shield, Award, FileCheck } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const studies = [
  {
    institution: "Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru",
    stat: "98.15%",
    metric: "ECG Sensitivity",
    quote:
      "'The SanketLife device demonstrated clinically acceptable accuracy for detection of cardiac arrhythmias in ambulatory patients.' — Study report, Sri Jayadeva Institute",
  },
  {
    institution: "Medanta — The Medicity, Gurugram",
    stat: "98.56%",
    metric: "Diagnostic Accuracy",
    quote:
      "'Optical monitoring parameters including SpO2 and pulse rate showed high concordance with reference standard measurements across a diverse patient population.' — Medanta Clinical Study",
  },
];

const badges = [
  { icon: Shield, label: "CDSCO License MFG/MD/2023/000231" },
  { icon: Award, label: "Class B Medical Device — Government of India" },
  { icon: FileCheck, label: "ISO 13485 Compliant Manufacturing" },
];

export function ClinicalProofSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Clinical Validation
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Validated in India's top cardiac hospitals.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We didn't just build a health app. We put it through clinical trials. Our ECG technology
            has been validated against hospital-grade equipment in two of India's most respected
            cardiac institutions.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {studies.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-3xl border border-border p-8 hover:shadow-purple transition-shadow"
            >
              <p className="text-xs font-medium text-muted-foreground mb-4">{s.institution}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-extrabold text-primary">{s.stat}</span>
                <span className="text-sm font-semibold text-muted-foreground">{s.metric}</span>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed mt-4">
                {s.quote}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Regulatory badges */}
        <motion.div
          {...fadeUp}
          className="flex flex-wrap justify-center gap-6"
        >
          {badges.map((b, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 bg-muted rounded-2xl px-5 py-3 border border-border"
            >
              <b.icon className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground">{b.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
