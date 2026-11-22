import { motion } from "framer-motion";

const stats = [
  { value: "2.1 Lac+", label: "users across India", source: "Agatsa One registrations" },
  { value: "1.5 Cr+", label: "health readings analysed", source: "Nera AI training corpus" },
  { value: "98.15%", label: "ECG sensitivity", source: "Sri Jayadeva Institute study" },
  { value: "2", label: "hospital validations", source: "Jayadeva · Narayana Health" },
];

export function ProofStripSection() {
  return (
    <section className="py-14 md:py-20 bg-muted/60 border-y border-border">
      <div className="section-shell">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-extrabold text-foreground tabular-nums">
                {s.value}
              </p>
              <p className="text-sm font-medium text-foreground mt-2">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
