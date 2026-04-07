import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope, Building2, Briefcase } from "lucide-react";

const cards = [
  {
    icon: Stethoscope,
    emoji: "👨‍⚕️",
    title: "For Doctors & Clinics",
    description:
      "Get real-time patient vitals in your portal. Review ECGs before appointments. Catch deterioration between visits. Spend less time on paperwork and more time on care.",
    link: "/for-doctors",
  },
  {
    icon: Building2,
    emoji: "🏥",
    title: "For Hospitals",
    description:
      "Deploy remote monitoring at scale. Reduce readmissions with post-discharge programmes. Add a digital health revenue stream. White-label options available.",
    link: "/for-hospitals",
  },
  {
    icon: Briefcase,
    emoji: "🏢",
    title: "For Corporates",
    description:
      "Launch a company-wide cardiac screening programme. Identify at-risk employees early. Reduce health insurance claims. Show your team you care about more than productivity.",
    link: "/for-corporates",
  },
];

export function ProvidersSection() {
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
            For Healthcare Providers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for patients. Designed for the providers who care for them.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-background rounded-3xl border border-border p-8 hover:shadow-purple transition-shadow duration-300 flex flex-col"
            >
              <span className="text-3xl mb-4">{card.emoji}</span>
              <h3 className="text-lg font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {card.description}
              </p>
              <Link
                to={card.link}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-5 hover:underline"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
