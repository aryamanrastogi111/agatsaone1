import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, User, Stethoscope, Handshake } from "lucide-react";

const audiences = [
  {
    icon: User,
    title: "For you",
    desc: "Clinical-grade devices and Nera AI insights for your heart, metabolism and sleep — at home, on your terms.",
    link: "/devices",
    cta: "Explore devices",
  },
  {
    icon: Stethoscope,
    title: "For clinicians",
    desc: "Remote patient monitoring, validated ECG and between-visit visibility for clinics, hospitals and telehealth.",
    link: "/for-doctors",
    cta: "For healthcare",
  },
  {
    icon: Handshake,
    title: "For partners",
    desc: "Distribute Agatsa devices, white-label our platform, or build on our SDK and APIs.",
    link: "/partner-with-us",
    cta: "Partner with us",
  },
];

export function AudienceSplitSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="section-shell">
        <div className="grid md:grid-cols-3 gap-5">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={a.link}
                className="group flex flex-col h-full quiet-card p-8"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <a.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-6 group-hover:gap-2.5 transition-all">
                  {a.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
