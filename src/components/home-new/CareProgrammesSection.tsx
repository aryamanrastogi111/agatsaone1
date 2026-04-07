import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const programmes = [
  {
    emoji: "❤️",
    name: "Post Heart Attack Recovery",
    duration: "12 weeks",
    audience: "For patients 2–12 weeks post-MI or cardiac event",
    description: "Daily ECG monitoring + medication reminders + guided cardiac rehab exercises + weekly AI risk assessment",
    link: "/programmes#post-heart-attack",
  },
  {
    emoji: "💉",
    name: "Diabetic Cardiac Care",
    duration: "16 weeks",
    audience: "For Type 2 diabetics with cardiac risk factors",
    description: "Glucose + ECG + BP monitoring unified. HbA1c prediction. Meal scoring. Cardiometabolic risk tracking.",
    link: "/programmes#diabetic-cardiac",
  },
  {
    emoji: "⚖️",
    name: "Obesity Reversal Programme",
    duration: "12 weeks",
    audience: "For individuals with BMI > 27.5 targeting sustainable weight loss",
    description: "Smart scale + band integration. Daily calorie guidance. Body composition tracking. Weekly progress milestones.",
    link: "/programmes#obesity-reversal",
  },
  {
    emoji: "🩺",
    name: "Hypertension Control",
    duration: "12 weeks",
    audience: "For Stage 1 or 2 hypertension patients",
    description: "Twice-daily BP logging with trend analysis. Medication adherence tracking. Stress and sleep correlation. DASH diet guidance.",
    link: "/programmes#hypertension-control",
  },
  {
    emoji: "🏢",
    name: "Corporate Wellness",
    duration: "8 weeks",
    audience: "For employer-sponsored employee health initiatives",
    description: "Team dashboards, anonymised aggregate health scores, biometric screening events, HR integration.",
    link: "/programmes#corporate-wellness",
  },
];
export function CareProgrammesSection() {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Care Programmes
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Not just monitoring. Guided recovery and prevention.
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Agatsa One's Care Programmes combine daily device monitoring with AI-driven task lists,
            clinical milestones, and optional doctor oversight. Five evidence-based programmes designed
            for India's five biggest chronic health challenges.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {programmes.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-background rounded-3xl border border-border p-6 flex flex-col hover:shadow-purple transition-shadow duration-300 ${
                i >= 3 ? "md:col-span-1" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2 py-0.5">
                    {p.duration}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic mb-2">{p.audience}</p>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
              <Link
                to={p.link}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4 hover:underline"
              >
                View Programme <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
