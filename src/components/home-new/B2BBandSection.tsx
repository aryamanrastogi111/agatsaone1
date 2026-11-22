import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Store, Factory, Code2, FlaskConical } from "lucide-react";
import aspirationalImg from "@/assets/sanketlife-hand-new.jpg";

const paths = [
  { icon: Store, label: "Distributors", desc: "Bring Agatsa devices to your region" },
  { icon: Factory, label: "OEM & White-label", desc: "Our platform, your brand" },
  { icon: Code2, label: "SDK & API", desc: "Build on our devices and data" },
  { icon: FlaskConical, label: "Research", desc: "Collaborate on clinical studies" },
];

export function B2BBandSection() {
  return (
    <section className="relative overflow-hidden bg-dark-bg text-white py-16 md:py-24">
      {/* Aspirational backdrop — real photography under a navy gradient + aurora glow */}
      <img
        src={aspirationalImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, hsl(var(--dark-bg)) 25%, hsl(var(--dark-bg) / 0.88) 55%, hsl(var(--dark-bg) / 0.55) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 10%, hsl(var(--primary) / 0.45), transparent 70%), radial-gradient(ellipse 45% 40% at 5% 95%, hsl(var(--primary) / 0.3), transparent 70%)",
        }}
      />

      <div className="section-shell relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">
            Work with Agatsa
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Four ways to build with us.
          </h2>
          <p className="text-white/70 leading-relaxed">
            From distribution to deep integration, Agatsa partners with organisations
            that share our belief: personal health should be measured at home, not guessed.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {paths.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:border-primary/40 transition-colors"
            >
              <p.icon className="h-6 w-6 text-primary mb-4" strokeWidth={1.75} />
              <h3 className="font-display font-bold text-lg mb-1.5 text-white">{p.label}</h3>
              <p className="text-sm text-white/60">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <div className="flex flex-wrap gap-3">
            <Link
              to="/partner-with-us"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              Start a partnership <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 border border-white/25 text-white rounded-full px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              Explore the SDK
            </Link>
          </div>
          <p className="text-sm text-white/50">
            Built on <span className="text-white/80 font-semibold">1.5 Cr+ readings</span> and{" "}
            <span className="text-white/80 font-semibold">2.1 Lac+ users</span> — your partnership starts with proof.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
