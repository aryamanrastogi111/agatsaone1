import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import sanketlifeHero from "@/assets/sanketlife-combo-main.png";

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
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-background to-muted overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div {...stagger(0)}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-muted text-sm font-medium text-muted-foreground">
                🏥 Trusted by 50,000+ users across India
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
              {...stagger(2)}
              className="text-base md:text-lg text-muted-foreground max-w-[580px] leading-relaxed"
            >
              Agatsa One connects to medical-grade ECG, glucose, and vital monitors — then
              uses Nera AI to understand your health, spot risks early, and guide you every
              day. Not just data. Intelligence.
            </motion.p>

            <motion.div {...stagger(3)} className="flex flex-wrap gap-4">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-4 font-semibold hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                Download Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/devices"
                className="inline-flex items-center gap-2 bg-background text-primary border-2 border-primary/20 rounded-full px-8 py-4 font-semibold hover:border-primary/40 transition-colors text-sm md:text-base"
              >
                Explore Devices
              </Link>
            </motion.div>

            <motion.div
              {...stagger(4)}
              className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-muted-foreground"
            >
              <span>98.15% ECG accuracy</span>
              <span className="text-border">|</span>
              <span>50,000+ users</span>
              <span className="text-border">|</span>
              <span>CDSCO Class B certified</span>
              <span className="text-border hidden md:inline">|</span>
              <span className="hidden md:inline">AI-powered insights</span>
            </motion.div>
          </div>

          {/* Right — floating mockups */}
          <motion.div
            {...stagger(2)}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px]">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-primary/5" />

              {/* Central phone mockup */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img src={sanketlifeHero} alt="Agatsa One devices" className="w-64 md:w-80 object-contain drop-shadow-2xl" />
              </motion.div>

              {/* Floating device badges */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-4 right-0 bg-background rounded-2xl shadow-purple px-3 py-2 border border-border"
              >
                <p className="text-xs font-semibold">📊 ECG Normal</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 left-0 bg-background rounded-2xl shadow-purple px-3 py-2 border border-border"
              >
                <p className="text-xs font-semibold">💉 Glucose 98 mg/dL</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-4 right-4 bg-background rounded-2xl shadow-purple px-3 py-2 border border-border"
              >
                <p className="text-xs font-semibold">❤️ HR 72 bpm</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
