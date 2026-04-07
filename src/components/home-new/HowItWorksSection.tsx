import { motion } from "framer-motion";
import { Plug, Brain, HeartPulse } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const steps = [
  {
    num: "01",
    icon: Plug,
    title: "Connect your devices",
    copy: "Pair your SanketLife ECG, EasyTouch metabolic health monitor, BP device, smart scale, or Rhythm wellness band via Bluetooth. Setup takes under 2 minutes. Your readings are automatically synced to the Agatsa One app and securely stored.",
  },
  {
    num: "02",
    icon: Brain,
    title: "Nera AI analyses everything",
    copy: "Every reading is processed by Nera AI — our proprietary health intelligence engine. Nera identifies patterns, detects anomalies, builds your health timeline, and generates plain-English insights you can actually understand. No medical jargon. No confusion.",
  },
  {
    num: "03",
    icon: HeartPulse,
    title: "Act on real intelligence",
    copy: "Get weekly health reports, daily nudges, care programme guidance, and a voice AI you can actually talk to. Share your health data with your doctor with one tap. Enrol in a supervised care programme. Take control — with AI as your co-pilot.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Three steps to understanding your health completely.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative bg-background rounded-3xl p-8 border border-border hover:shadow-purple transition-shadow duration-300"
            >
              <span className="absolute top-6 right-6 text-6xl font-extrabold text-muted/80 select-none">
                {step.num}
              </span>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
