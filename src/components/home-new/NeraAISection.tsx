import { motion } from "framer-motion";
import { BarChart3, Mic, AlertTriangle, Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const features = [
  {
    icon: BarChart3,
    emoji: "📊",
    title: "AI Weekly Reports",
    description:
      "Every Monday, Nera generates a plain-English summary of your health week — what improved, what to watch, and what to do next. No charts to interpret. No jargon to decode.",
  },
  {
    icon: Mic,
    emoji: "🎙️",
    title: "Talk to Nera",
    description:
      "Ask Nera anything about your health — 'Was my ECG normal yesterday?', 'Why is my glucose high after lunch?', 'Is my BP trend improving?' — and get answers grounded in your actual data. Available on Nera AI Premium.",
  },
  {
    icon: AlertTriangle,
    emoji: "🔬",
    title: "Early Warning System",
    description:
      "Nera's multimodal AI pipeline analyses your vitals for patterns that precede cardiac events, glucose crises, and hypertensive episodes — often days before symptoms appear.",
  },
  {
    icon: Star,
    emoji: "⭐",
    title: "Nera Health Score",
    description:
      "A single 0–100 score that summarises your cardiovascular and metabolic health. Updated after every reading. Benchmarked against your city. Explained in plain English.",
  },
];

export function NeraAISection() {
  return (
    <section className="py-20 md:py-28 bg-dark-bg text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <div>
            <motion.div {...fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                Powered by Nera AI
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                An AI that actually knows your health.
              </h2>
              <p className="text-white/60 leading-relaxed mb-10">
                Nera isn't a chatbot that reads generic health articles. Nera has read every one of
                your readings. Every ECG. Every glucose log. Every sleep session. And Nera remembers —
                building a living health intelligence profile that gets smarter every week.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="space-y-2"
                >
                  <p className="text-lg">{f.emoji}</p>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-[240px] h-[480px] md:w-[280px] md:h-[560px] rounded-[2.5rem] border-2 border-primary/30 bg-gradient-to-b from-primary/20 to-secondary/10 flex flex-col items-center justify-center p-8 relative"
            >
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-dark-bg rounded-full" />
              <div className="text-5xl mb-4">🧠</div>
              <p className="text-lg font-bold text-center">Nera AI</p>
              <p className="text-xs text-white/50 text-center mt-2">
                Your personal health intelligence
              </p>
              <div className="mt-6 w-full space-y-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/40">Health Score</p>
                  <p className="text-2xl font-bold text-primary">87</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-white/40">This week</p>
                  <p className="text-xs text-white/70">ECG normal · BP improving</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
