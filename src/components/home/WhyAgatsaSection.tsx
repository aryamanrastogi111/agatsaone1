import { motion } from "framer-motion";
import { Shield, Home, Stethoscope, Flag, BadgeCheck, Microscope, HeartPulse, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Non-invasive First",
    description: "Painless monitoring without needles, gels, or uncomfortable procedures",
  },
  {
    icon: Home,
    title: "Designed for Home",
    description: "Easy to use at home, with professional-grade accuracy you can trust",
  },
  {
    icon: Stethoscope,
    title: "Medical-grade Thinking",
    description: "Developed with input from healthcare professionals for clinical reliability",
  },
  {
    icon: Flag,
    title: "Made in India",
    description: "Proudly designed and manufactured in India for global standards",
  },
];

const qualityCommitments = [
  {
    icon: BadgeCheck,
    title: "ISO 13485 Certified",
    description: "Our manufacturing processes meet the highest international medical device quality standards.",
  },
  {
    icon: Microscope,
    title: "Clinically Validated",
    description: "Every device undergoes rigorous clinical trials before reaching your hands.",
  },
  {
    icon: HeartPulse,
    title: "99.7% Accuracy",
    description: "Our ECG algorithms are validated against hospital-grade equipment for unmatched precision.",
  },
  {
    icon: Award,
    title: "Award-Winning Innovation",
    description: "Recognized by national and international bodies for breakthrough health technology.",
  },
];

export function WhyAgatsaSection() {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container">
        {/* Why Agatsa Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Agatsa?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe healthcare should be accessible, comfortable, and
            reliable for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon
                    className="h-8 w-8 text-primary transition-colors duration-300 group-hover:text-primary-foreground"
                    strokeWidth={1.5}
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Commitment
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quality You Can Trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From lab to living room, every Agatsa device is built to meet the strictest quality and safety standards.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityCommitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-6 group hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
