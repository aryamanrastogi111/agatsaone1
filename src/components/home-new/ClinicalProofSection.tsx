import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Microscope, Building2, Factory } from "lucide-react";

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
    institution: "Narayana Health, Bengaluru",
    stat: "98.5%",
    metric: "ECG Accuracy",
    quote:
      "'SanketLife ECG readings demonstrated high concordance with hospital-grade equipment across a diverse patient population.' — Narayana Health Validation Study",
  },
];

const markers = [
  { icon: Microscope, label: "Peer-reviewed research programme" },
  { icon: Building2, label: "Validated in leading cardiac hospitals" },
  { icon: Factory, label: "ISO 13485 compliant manufacturing" },
];

export function ClinicalProofSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-shell">
        <motion.div {...fadeUp} className="max-w-2xl mb-14">
          <p className="section-eyebrow mb-3">Clinical evidence</p>
          <h2 className="section-title text-3xl md:text-4xl mb-4">
            Validated in India's top cardiac hospitals.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We didn't just build a health app. We put it through clinical validation. Our ECG
            technology has been checked against hospital-grade equipment in two of India's most
            respected cardiac institutions.
          </p>
        </motion.div>

        {/* Study cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {studies.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="quiet-card p-8"
            >
              <p className="text-xs font-medium text-muted-foreground mb-4">{s.institution}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-5xl font-extrabold text-foreground tabular-nums">{s.stat}</span>
                <span className="text-sm font-semibold text-muted-foreground">{s.metric}</span>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed mt-4">
                {s.quote}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-4">
            {markers.map((m, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2.5 border border-border"
              >
                <m.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground">{m.label}</span>
              </div>
            ))}
          </div>
          <Link
            to="/publications"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Read the research <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
