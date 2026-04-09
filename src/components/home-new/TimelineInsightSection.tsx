import { motion } from "framer-motion";
import { Activity, Eye, TrendingUp } from "lucide-react";

const insights = [
  {
    icon: Activity,
    text: "A small change is noticed",
  },
  {
    icon: Eye,
    text: "A slow drift becomes visible",
  },
  {
    icon: TrendingUp,
    text: "A pattern begins to make sense",
  },
];

export function TimelineInsightSection() {
  return (
    <section className="py-16 md:py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground text-sm mb-3">From data to understanding</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            A single reading tells you what happened.
          </h2>
          <p className="text-xl md:text-2xl font-bold text-primary mb-10">
            A timeline tells you what's changing.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {insights.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-background rounded-2xl border border-border p-6 flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
