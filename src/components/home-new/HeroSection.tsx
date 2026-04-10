import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import appScreen1 from "@/assets/app-screen-1.webp";
import appScreen2 from "@/assets/app-screen-2.webp";
import appScreen3 from "@/assets/app-screen-3.webp";
import appScreen4 from "@/assets/app-screen-4.webp";
import appScreen5 from "@/assets/app-screen-5.webp";

const screens = [appScreen1, appScreen2, appScreen3, appScreen4, appScreen5];

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.1 },
});

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % screens.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-muted overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <motion.div {...stagger(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-semibold text-primary">
                🏥 Trusted by 2.1 Lac+ users across India
              </span>
            </motion.div>

            <motion.h1
              {...stagger(1)}
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight"
            >
              <span className="text-foreground">Most health problems</span>
              <br />
              <span className="text-foreground">don't announce</span>
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                themselves.
              </span>
            </motion.h1>

            <motion.p
              {...stagger(1.5)}
              className="text-lg md:text-xl max-w-[580px] leading-relaxed"
            >
              <span className="text-foreground/80">
                They build quietly — in your heart, your metabolism, your nervous system.
              </span>
              <br />
              <span className="text-primary font-bold text-xl md:text-2xl">
                Agatsa helps you catch them early.
              </span>
            </motion.p>

            <motion.p
              {...stagger(2)}
              className="text-sm md:text-base text-muted-foreground max-w-[540px] leading-relaxed"
            >
              Agatsa devices help you track your health at home, while{" "}
              <span className="text-foreground font-semibold">Nera AI</span> understands your health,
              spots risks early, and guides you every day.{" "}
              <span className="text-primary font-semibold">Not just data. Intelligence.</span>
            </motion.p>

            <motion.ul {...stagger(2.5)} className="space-y-3 text-sm md:text-base">
              {[
                "Track ECG, BP, metabolic wellness, SpO₂ and more — from home",
                "See how your health changes over time",
                "Get simple insights, not confusing reports",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3 text-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div {...stagger(3)} className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/devices"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-4 font-semibold hover:opacity-90 transition-opacity text-sm md:text-base shadow-lg shadow-primary/25"
              >
                Explore Devices
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-background text-primary border-2 border-primary/30 rounded-full px-8 py-4 font-semibold hover:border-primary/60 transition-colors text-sm md:text-base"
              >
                See How It Works
              </a>
            </motion.div>

            <motion.div
              {...stagger(4)}
              className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-bold pt-2"
            >
              <span className="text-primary">98.15% ECG accuracy</span>
              <span className="text-border">|</span>
              <span className="text-foreground/70">2.1 Lac+ users</span>
              <span className="text-border">|</span>
              <span className="text-foreground/70">CDSCO Class B certified</span>
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
                <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-[#2a2a2e] to-[#1a1a1e] shadow-2xl" />
                <div className="absolute inset-[3px] rounded-[2.8rem] bg-[#1a1a1e]" />
                <div className="absolute inset-[6px] rounded-[2.6rem] overflow-hidden bg-white">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] md:h-[32px] bg-[#1a1a1e] rounded-b-2xl z-10" />
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
                <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/30 rounded-full z-10" />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-8 -right-8 md:-right-16 bg-background rounded-2xl shadow-lg px-3 py-2 border border-primary/20"
              >
                <p className="text-xs font-bold text-foreground">📊 ECG Normal</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-24 -left-8 md:-left-16 bg-background rounded-2xl shadow-lg px-3 py-2 border border-primary/20"
              >
                <p className="text-xs font-bold text-foreground">🔬 Metabolic Load: Low</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-12 -right-4 md:-right-12 bg-background rounded-2xl shadow-lg px-3 py-2 border border-primary/20"
              >
                <p className="text-xs font-bold text-foreground">❤️ HR 72 bpm</p>
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
