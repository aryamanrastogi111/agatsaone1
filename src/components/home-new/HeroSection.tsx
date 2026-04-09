import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import appScreen1 from "@/assets/app-screen-1.png";
import appScreen2 from "@/assets/app-screen-2.png";
import appScreen3 from "@/assets/app-screen-3.png";
import appScreen4 from "@/assets/app-screen-4.png";
import appScreen5 from "@/assets/app-screen-5.png";

const screens = [appScreen1, appScreen2, appScreen3, appScreen4, appScreen5];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { duration: 0.6, delay: i * 0.1 },
});

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % screens.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-background to-muted overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div {...stagger(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-muted text-sm font-medium text-muted-foreground">
                🏥 Trusted by 2.1 Lac+ users across India
              </span>
            </motion.div>

            <motion.h1
              {...stagger(1)}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1]"
            >
              Your Heart Doesn't
              <br />
              Take a Day Off.
              <br />
              Neither Does{" "}
              <span className="text-primary">Nera</span>.
            </motion.h1>

            <motion.p
              {...stagger(1.5)}
              className="text-lg md:text-xl text-foreground/80 max-w-[580px] leading-relaxed font-medium"
            >
              Most health problems don't announce themselves.
              <br />
              They build quietly — in your <span className="text-primary font-bold">heart</span>, your <span className="text-primary font-bold">sugar</span>, your <span className="text-primary font-bold">nervous system</span>.
              <br />
              <span className="text-primary font-bold">Agatsa helps you catch them early.</span>
            </motion.p>

            <motion.p
              {...stagger(2)}
              className="text-sm md:text-base text-muted-foreground max-w-[540px] leading-relaxed"
            >
              Agatsa devices help you track your health at home, while <span className="text-foreground font-medium">Nera AI</span> understands your health,
              spots <span className="text-foreground font-medium">risks early</span>, and guides you every day. Not just data. <span className="text-foreground font-medium">Intelligence</span>.
            </motion.p>

            <motion.ul {...stagger(2.5)} className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Track ECG, BP, sugar, SpO₂ and more — from home
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                See how your health changes over time
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Get simple insights, not confusing reports
              </li>
            </motion.ul>

            <motion.div {...stagger(3)} className="flex flex-wrap gap-4">
              <Link
                to="/devices"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-4 font-semibold hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                Explore Devices
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-background text-primary border-2 border-primary/20 rounded-full px-8 py-4 font-semibold hover:border-primary/40 transition-colors text-sm md:text-base"
              >
                See How It Works
              </a>
            </motion.div>

            <motion.div
              {...stagger(4)}
              className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-muted-foreground"
            >
              <span>98.15% ECG accuracy</span>
              <span className="text-border">|</span>
              <span>2.1 Lac+ users</span>
              <span className="text-border">|</span>
              <span>CDSCO Class B certified</span>
              <span className="text-border hidden md:inline">|</span>
              <span className="hidden md:inline">AI-powered insights</span>
            </motion.div>
          </div>

          {/* Right — iPhone mockup with sliding screens */}
          <motion.div
            {...stagger(2)}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              {/* iPhone frame */}
              <div className="relative w-[260px] h-[530px] md:w-[300px] md:h-[612px] mx-auto">
                {/* Outer shell */}
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1e] shadow-2xl" />
                {/* Inner bezel */}
                <div className="absolute inset-[3px] rounded-[2.8rem] bg-[#1a1a1e]" />
                {/* Screen area */}
                <div className="absolute inset-[6px] rounded-[2.6rem] overflow-hidden bg-white">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] md:h-[32px] bg-[#1a1a1e] rounded-b-2xl z-10" />
                  {/* Sliding screenshots */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={current}
                      src={screens[current]}
                      alt="Agatsa One app screen"
                      className="w-full h-full object-cover object-top"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/30 rounded-full z-10" />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-8 -right-8 md:-right-16 bg-background rounded-2xl shadow-purple px-3 py-2 border border-border"
              >
                <p className="text-xs font-semibold">📊 ECG Normal</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-24 -left-8 md:-left-16 bg-background rounded-2xl shadow-purple px-3 py-2 border border-border"
              >
                <p className="text-xs font-semibold">🔬 Metabolic Load: Low</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-12 -right-4 md:-right-12 bg-background rounded-2xl shadow-purple px-3 py-2 border border-border"
              >
                <p className="text-xs font-semibold">❤️ HR 72 bpm</p>
              </motion.div>

              {/* Slide indicators */}
              <div className="flex justify-center gap-1.5 mt-6">
                {screens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-5" : "bg-primary/25"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
