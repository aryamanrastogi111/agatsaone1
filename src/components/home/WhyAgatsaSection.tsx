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

export function WhyAgatsaSection() {
  return (
    <section className="py-20 bg-muted/30 overflow-hidden">
      <div className="container">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>
    </section>
  );
}
