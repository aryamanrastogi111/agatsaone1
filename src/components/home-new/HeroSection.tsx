import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Heart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import appScreen1 from "@/assets/app-screen-1.webp";
import appScreen2 from "@/assets/app-screen-2.webp";
import appScreen3 from "@/assets/app-screen-3.webp";
import appScreenNera from "@/assets/app-screen-nera.webp";
import sanketDevice from "@/assets/sanketlife-card.webp";
import easytouchDevice from "@/assets/easytouch-rhythm-new.webp";
import coreBalanceDevice from "@/assets/corebalance-card.webp";
import lifestyleImage from "@/assets/easytouch-meal-lifestyle.webp";
import sanketHandImage from "@/assets/sanketlife-hand-new.jpg";

const phoneScreens = [appScreenNera, appScreen1, appScreen2, appScreen3];

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: i * 0.08 },
});

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % phoneScreens.length), 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-background overflow-hidden border-b border-border/60">
      {/* subtle editorial grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full relative">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left — copy (unchanged) */}
          <div className="space-y-6">
            <motion.div {...stagger(0)}>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted/60 text-xs font-semibold text-foreground/80 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Trusted by 2.1 Lac+ users across India
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
              {...stagger(2)}
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
              {...stagger(3)}
              className="text-sm md:text-base text-muted-foreground max-w-[540px] leading-relaxed"
            >
              Agatsa devices help you track your health at home, while{" "}
              <span className="text-foreground font-semibold">Nera AI</span> understands your health,
              spots risks early, and guides you every day.{" "}
              <span className="text-primary font-semibold">Not just data. Intelligence.</span>
            </motion.p>

            <motion.ul {...stagger(4)} className="space-y-2.5 text-sm md:text-base">
              {[
                "Track ECG, BP, metabolic wellness, SpO₂ and more — from home",
                "See how your health changes over time",
                "Get simple insights, not confusing reports",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div {...stagger(5)} className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/devices"
                className="inline-flex items-center gap-2 bg-foreground text-background rounded-md px-6 py-3 font-semibold hover:bg-foreground/90 transition-colors text-sm md:text-base"
              >
                Explore Devices
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-background text-foreground border border-border rounded-md px-6 py-3 font-semibold hover:border-foreground/40 transition-colors text-sm md:text-base"
              >
                See How It Works
              </a>
            </motion.div>

            <motion.div
              {...stagger(6)}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs md:text-sm text-muted-foreground border-t border-border/60 mt-4"
            >
              <span className="pt-4 font-semibold text-foreground">98.15% ECG accuracy</span>
              <span className="pt-4 hidden md:inline text-border">·</span>
              <span className="pt-4">CDSCO Class B certified</span>
              <span className="pt-4 hidden md:inline text-border">·</span>
              <span className="pt-4">Ships in 24h</span>
              <span className="pt-4 hidden md:inline text-border">·</span>
              <span className="pt-4">7-day returns</span>
            </motion.div>
          </div>

          {/* Right — editorial image collage: devices + Nera app */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-6 grid-rows-6 gap-3 md:gap-4 h-[520px] md:h-[600px]">
              {/* Phone — Nera AI insights (large, left) */}
              <div className="col-span-3 row-span-6 relative rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-background border border-border shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-[220px] aspect-[9/19]">
                    <div className="absolute inset-0 rounded-[2rem] bg-[#1a1a1e] shadow-xl" />
                    <div className="absolute inset-[4px] rounded-[1.85rem] overflow-hidden bg-white">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[20px] bg-[#1a1a1e] rounded-b-xl z-20" />
                      {phoneScreens.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt="Nera AI insights"
                          loading="eager"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
                          style={{ opacity: i === current ? 1 : 0 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-background/90 backdrop-blur px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3" /> Nera AI
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-background/90 backdrop-blur px-2 py-1 rounded">
                    LIVE INSIGHT
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-background/95 backdrop-blur border border-border rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-foreground leading-snug">
                    "Your metabolic load trended 12% lower this week — keep the morning walks going."
                  </p>
                </div>
              </div>

              {/* SanketLife ECG */}
              <div className="col-span-3 row-span-3 relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted to-background">
                <img
                  src={sanketDevice}
                  alt="SanketLife pocket ECG device"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground bg-background/90 backdrop-blur px-2 py-1 rounded">
                    <Heart className="h-3 w-3 text-destructive" /> 12-lead ECG
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-[11px] font-bold text-foreground bg-background/90 backdrop-blur px-2 py-1 rounded">
                    SanketLife
                  </p>
                </div>
              </div>

              {/* EasyTouch Rhythm */}
              <div className="col-span-2 row-span-3 relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted to-background">
                <img
                  src={easytouchDevice}
                  alt="EasyTouch Rhythm wearable"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-2 left-2">
                  <p className="text-[10px] font-bold text-foreground bg-background/90 backdrop-blur px-1.5 py-0.5 rounded">
                    Rhythm
                  </p>
                </div>
              </div>

              {/* Core Balance */}
              <div className="col-span-1 row-span-3 relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted to-background">
                <img
                  src={coreBalanceDevice}
                  alt="Core Balance smart scale"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Caption strip */}
            <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3 w-3" /> 4 medical-grade devices · 1 intelligent app
              </span>
              <span className="font-mono">Agatsa One</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
