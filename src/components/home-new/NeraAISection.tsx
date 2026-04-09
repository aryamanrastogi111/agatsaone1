import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Heart, Droplets, Activity, Moon, Scale, Brain, TrendingUp, Zap } from "lucide-react";
import neraScreen from "@/assets/app-screen-nera.png";
import appScreen1 from "@/assets/app-screen-1.png";

/* ── Phone Mockup ── */
const PhoneMockup = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <div className={`relative w-[200px] h-[410px] md:w-[240px] md:h-[490px] ${className}`}>
    <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1e] shadow-2xl" />
    <div className="absolute inset-[3px] rounded-[2.3rem] bg-[#1a1a1e]" />
    <div className="absolute inset-[5px] rounded-[2.2rem] overflow-hidden bg-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-[#1a1a1e] rounded-b-xl z-10" />
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
    </div>
    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[80px] h-[3px] bg-white/30 rounded-full z-10" />
  </div>
);

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7 },
};

/* ── tiny ECG SVG path ── */
const EcgWave = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="none">
    <motion.path
      d="M0 30 L30 30 L40 10 L50 50 L60 20 L70 40 L80 30 L110 30 L120 5 L130 55 L140 25 L150 35 L160 30 L200 30"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
  </svg>
);

/* ── Mini trend chart ── */
const TrendLine = ({ points, color }: { points: number[]; color: string }) => {
  const width = 160;
  const height = 50;
  const step = width / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${i * step} ${height - p}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12" fill="none">
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  );
};

export function NeraAISection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="bg-[hsl(var(--dark-bg))] text-white overflow-hidden">
      {/* ─── TITLE ─── */}
      <div className="py-12 md:py-16 text-center px-4">
        <motion.p {...fadeUp} className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
          Powered by Nera AI
        </motion.p>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight max-w-3xl mx-auto"
        >
          Understanding your health —{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            beyond the numbers
          </span>
        </motion.h2>
      </div>

      {/* ─── BLOCK 1 — DATA → AI TRANSITION ─── */}
      <div className="py-10 md:py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8">
            <p className="text-white/50 text-sm mb-1">From scattered data to connected intelligence</p>
          </motion.div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
          {/* Left — data cards */}
          <div className="flex flex-col gap-4">
            {[
              { icon: Heart, label: "ECG", color: "from-red-500/20 to-red-600/10", delay: 0 },
              { icon: Droplets, label: "Sugar", color: "from-amber-500/20 to-amber-600/10", delay: 0.1 },
              { icon: Activity, label: "Blood Pressure", color: "from-blue-500/20 to-blue-600/10", delay: 0.2 },
              { icon: Moon, label: "Sleep", color: "from-indigo-500/20 to-indigo-600/10", delay: 0.3 },
            ].map((card) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: card.delay }}
                className={`bg-gradient-to-br ${card.color} border border-white/10 rounded-xl p-3 md:p-4 flex items-center gap-3 backdrop-blur-sm`}
              >
                <card.icon className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs font-semibold text-white/80">{card.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Center — Phone with Nera screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneMockup src={neraScreen} alt="Nera AI Health Score" />
            </motion.div>
          </motion.div>

          {/* Right — AI core + text */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.6 }}>
              <p className="text-lg font-semibold text-white/90">Your data doesn't live in isolation.</p>
              <p className="text-primary font-bold text-lg mt-1">It connects.</p>
            </motion.div>
          </div>
        </div>
        </div>
      </div>

      {/* ─── BLOCK 2 — ECG INTERPRETATION ─── */}
      <div className="py-10 md:py-14 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">ECG Intelligence</p>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              ECG — <span className="text-primary">simplified.</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Not just recorded. <span className="text-white font-semibold">Understood.</span> Nera AI reads your ECG,
              highlights what matters, and explains it in plain English.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-medium text-amber-300">Irregular pattern detected</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">Lead I · 25mm/s</p>
              <Heart className="h-4 w-4 text-red-400" />
            </div>
            <EcgWave className="w-full h-16 text-primary" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-4 bg-primary/10 border border-primary/20 rounded-xl p-3"
            >
              <p className="text-xs text-primary font-semibold">🧠 Nera AI Insight</p>
              <p className="text-xs text-white/60 mt-1">Normal sinus rhythm · Heart rate 72 BPM · QT interval within range</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── BLOCK 3 — ECG TRENDS TIMELINE ─── */}
      <div className="py-10 md:py-14 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              A single ECG is a <span className="text-white/50">moment</span>.
            </h3>
            <p className="text-xl md:text-2xl font-bold text-primary">A trend reveals change.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/40 font-semibold">30-Day ECG Timeline</p>
              <div className="flex gap-4 text-xs text-white/30">
                {["Day 1", "Day 7", "Day 14", "Day 30"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Heart Rate Avg", points: [30, 32, 31, 33, 35, 34, 36, 38], color: "hsl(var(--primary))" },
                { label: "HRV", points: [40, 38, 36, 35, 33, 34, 30, 28], color: "#60a5fa" },
                { label: "QT Interval", points: [25, 25, 26, 26, 27, 28, 29, 30], color: "#fbbf24" },
              ].map((trend) => (
                <div key={trend.label} className="flex items-center gap-3">
                  <p className="text-xs text-white/40 w-24 shrink-0">{trend.label}</p>
                  <TrendLine points={trend.points} color={trend.color} />
                </div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-4 flex items-center gap-2 text-xs text-amber-300"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Subtle QT prolongation trend detected over 30 days</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── BLOCK 4 — CARDIAC + METABOLIC MERGE ─── */}
      <div className="py-10 md:py-14 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              Your heart and metabolism don't work separately.
            </h3>
            <p className="text-lg text-primary font-semibold">Nera AI reads them together.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Left — ECG */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-red-400" />
                <p className="text-xs font-semibold text-white/60">Cardiac Data</p>
              </div>
              <EcgWave className="w-full h-12 text-red-400/80" />
              <p className="text-xs text-white/30 mt-2">Post-meal HRV variability shift</p>
            </motion.div>

            {/* Right — Sugar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="h-4 w-4 text-amber-400" />
                <p className="text-xs font-semibold text-white/60">Metabolic Data</p>
              </div>
              <TrendLine points={[20, 22, 35, 45, 40, 32, 25, 22]} color="#fbbf24" />
              <p className="text-xs text-white/30 mt-2">Glucose spike pattern after meals</p>
            </motion.div>
          </div>

          {/* Merge insight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-5 md:p-6 text-center"
          >
            <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/90 mb-1">Cross-System Insight</p>
            <p className="text-xs text-white/50">
              "After meals → ECG variability shift detected. Metabolic load correlates with cardiac rhythm changes over 14 days."
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── BLOCK 5 — BODY + WEIGHT ─── */}
      <div className="py-10 md:py-14 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp}>
            <Scale className="h-6 w-6 text-primary mb-3" />
            <h3 className="text-2xl font-bold mb-2">
              Weight is a <span className="text-white/50">number</span>.
            </h3>
            <p className="text-xl font-bold text-primary mb-3">Direction is insight.</p>
            <p className="text-sm text-white/50 leading-relaxed">
              Nera AI tracks your body composition trends — not just weight — and connects changes
              to your cardiac and metabolic data for a complete picture.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5"
          >
            <p className="text-xs text-white/40 mb-3">Body Composition · 90 Days</p>
            <div className="space-y-3">
              {[
                { label: "Weight", val: "72.1 kg", pct: 68, color: "bg-primary" },
                { label: "Muscle", val: "34%", pct: 55, color: "bg-blue-500" },
                { label: "Body Fat", val: "22%", pct: 40, color: "bg-amber-500" },
                { label: "BMR", val: "1,640", pct: 72, color: "bg-emerald-500" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">{item.label}</span>
                    <span className="text-white/70 font-medium">{item.val}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── BLOCK 6 — DAILY PATTERNS ─── */}
      <div className="py-10 md:py-14 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 order-2 md:order-1"
          >
            <p className="text-xs text-white/40 mb-4">Daily Health Timeline</p>
            <div className="space-y-2">
              {[
                { time: "6:00 AM", label: "Wake", icon: "☀️", width: "20%" },
                { time: "7:30 AM", label: "Morning walk · 4,200 steps", icon: "🚶", width: "45%" },
                { time: "12:00 PM", label: "Post-lunch glucose spike", icon: "🍽️", width: "70%" },
                { time: "3:00 PM", label: "HRV dip detected", icon: "💓", width: "55%" },
                { time: "10:30 PM", label: "Sleep · 6h 40m", icon: "😴", width: "85%" },
              ].map((item, i) => (
                <motion.div
                  key={item.time}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-[10px] text-white/30 w-14 shrink-0 font-mono">{item.time}</span>
                  <span className="text-sm">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-white/60">{item.label}</p>
                    <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary/40 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: item.width }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="order-1 md:order-2">
            <Moon className="h-6 w-6 text-primary mb-3" />
            <h3 className="text-2xl font-bold mb-2">Your daily habits shape your health.</h3>
            <p className="text-lg text-primary font-semibold mb-3">
              Nera AI connects them to everything else.
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              Sleep, activity, meals, stress — Nera builds a living map of your day and connects
              every data point to your cardiac and metabolic trends.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── BLOCK 7 — AI OUTPUT ─── */}
      <div className="py-10 md:py-14 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <motion.div {...fadeUp} className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                You don't see <span className="text-white/60 line-through decoration-white/20">everything</span>.
              </h3>
              <p className="text-xl md:text-2xl font-bold text-primary">You see what matters.</p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { status: "All Normal", color: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400", text: "text-emerald-300" },
                { status: "Slight Change Detected", color: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400", text: "text-amber-300" },
                { status: "Review Suggested", color: "bg-red-500/10 border-red-500/20", dot: "bg-red-400", text: "text-red-300" },
              ].map((item, i) => (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  className={`${item.color} border rounded-2xl p-5 flex flex-col items-center gap-3`}
                >
                  <div className={`w-3 h-3 rounded-full ${item.dot}`} />
                  <p className={`text-sm font-semibold ${item.text}`}>{item.status}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-xs text-white/30 mt-6"
            >
              From noise → to clarity. That's Nera AI.
            </motion.p>
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="hidden md:flex justify-center"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <PhoneMockup src={appScreen1} alt="Agatsa One App Dashboard" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── BLOCK 8 — CORE LINE (IMMERSIVE) ─── */}
      <div className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-2xl md:text-4xl font-extrabold leading-snug mb-4"
          >
            Nera AI doesn't just read your data.
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-2xl md:text-4xl font-extrabold text-primary leading-snug"
          >
            It understands how it changes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-8"
          >
            <p className="text-sm text-white/30">
              1.5 Crore+ Indian health records · 97.8% concordance with cardiologists · 13 Lac+ ECGs analysed
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
