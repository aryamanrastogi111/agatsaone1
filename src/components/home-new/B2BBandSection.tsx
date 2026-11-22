import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Store, Factory, Code2, FlaskConical } from "lucide-react";

const paths = [
  { icon: Store, label: "Distributors", desc: "Bring Agatsa devices to your region" },
  { icon: Factory, label: "OEM & White-label", desc: "Our platform, your brand" },
  { icon: Code2, label: "SDK & API", desc: "Build on our devices and data" },
  { icon: FlaskConical, label: "Research", desc: "Collaborate on clinical studies" },
];

export function B2BBandSection() {
  return (
    <section className="py-20 md:py-28 bg-dark-bg text-white">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-4">
            Work with Agatsa
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Four ways to build with us.
          </h2>
          <p className="text-white/70 leading-relaxed">
            From distribution to deep integration, Agatsa partners with organisations
            that share our belief: personal health should be measured at home, not guessed.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {paths.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
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
          className="flex flex-wrap gap-3"
        >
          <Link
            to="/partner-with-us"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-7 py-3.5 font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            Start a partnership <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/partners"
            className="inline-flex items-center gap-2 border border-white/20 text-white rounded-full px-7 py-3.5 font-semibold hover:bg-white/10 transition-colors text-sm"
          >
            Explore the SDK
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
