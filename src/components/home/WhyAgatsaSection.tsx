import { motion } from "framer-motion";
import { Shield, Home, Stethoscope, Flag } from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function WhyAgatsaSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
