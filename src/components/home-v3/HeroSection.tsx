import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import sanketlifeImg from "@/assets/sanketlife-hero-new.webp";
import easytouchImg from "@/assets/easytouch-wellness-device.webp";
import rhythmImg from "@/assets/easytouch-rhythm-band.webp";
import appScreen from "@/assets/rhythm-app-meal-response.png.asset.json";
import { EcgLine } from "./Reveal";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden min-h-[min(100svh,960px)] flex items-center pt-24 pb-16">
      <div className="luxe-glow absolute -top-40 right-[-10%] h-[620px] w-[620px] -z-10 opacity-70" />
      <div className="section-shell w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div className="max-w-2xl">
          <motion.p {...fade(0)} className="section-eyebrow mb-6">Agatsa · Personal health, powered by AI</motion.p>
          <motion.h1 {...fade(1)} className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight">
            Your Health.
            <br />
            <span className="luxe-text-gradient">A Bigger Picture.</span>
          </motion.h1>
          <motion.p {...fade(2)} className="mt-7 font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-snug tracking-tight max-w-xl">
            Leading the way in <span className="luxe-text-gradient">AI-powered</span> personal health.
          </motion.p>
          <motion.p {...fade(2)} className="mt-4 font-display text-xl sm:text-2xl md:text-3xl font-semibold leading-snug tracking-tight text-primary-glow max-w-xl">
            Blood Glucose Spikes, detected on their own.
          </motion.p>
          <motion.p {...fade(2)} className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            From heart monitoring to everyday wellness, explore connected devices and intelligent insights designed to help you understand your health.
          </motion.p>
          <motion.div {...fade(3)} className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link to="/devices" className="inline-flex justify-center items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-[0_0_40px_-8px_hsl(var(--primary))] transition hover:shadow-[0_0_60px_-6px_hsl(var(--primary))]">
              Explore Devices <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/partner-with-us" className="inline-flex justify-center items-center gap-2 rounded-full border border-border px-7 py-4 font-semibold transition hover:border-foreground/40">
              Partner With Us
            </Link>
          </motion.div>
          <motion.div {...fade(4)} className="mt-12 max-w-md">
            <EcgLine className="h-10 w-full" />
          </motion.div>
          <motion.p {...fade(5)} className="mt-6 text-xs text-muted-foreground/70 max-w-md">
            For wellness purposes only — not intended for clinical or diagnostic use.
          </motion.p>
        </div>

        <motion.div {...fade(2)} className="relative mx-auto w-full max-w-[560px] aspect-[1/1]">
          <div className="absolute inset-[8%] rounded-[2.5rem] quiet-card" />
          <img src={sanketlifeImg} alt="SanketLife 2.0 personal ECG" className="absolute left-[2%] top-[10%] w-[46%] object-contain drop-shadow-2xl" />
          <img src={easytouchImg} alt="EasyTouch Wellness device" className="absolute left-[10%] bottom-[10%] w-[36%] rounded-3xl object-cover shadow-2xl" />
          <img src={rhythmImg} alt="Rhythm Band wearable" className="absolute right-[0%] bottom-[2%] w-[38%] object-contain drop-shadow-2xl" />
          <motion.img
            src={appScreen.url}
            alt="Agatsa One app showing a live meal response"
            className="absolute right-[10%] top-[4%] w-[34%] rounded-[1.6rem] border border-border shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
