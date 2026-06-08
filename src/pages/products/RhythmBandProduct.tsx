import { useEffect, useState } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Moon, HeartPulse, Activity, ShieldCheck, Stethoscope, Zap, BatteryLow, Flame, AlertTriangle, ChevronDown } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { VideoCard, YouTubeChannelLink } from "@/components/VideoCard";
import { StrikePrice } from "@/components/StrikePrice";
import { ProductReviewsSection } from "@/components/products/ProductReviewsSection";
import { easytouchRhythmReviews } from "@/data/easytouchRhythmReviews";
import { AwardsTrustSection } from "@/components/AwardsTrustSection";
import rhythmHero from "@/assets/easytouch-rhythm-new.webp";
import neraScreen from "@/assets/app-screen-nera.webp";
import rhythmPortrait1 from "@/assets/rhythm-portrait-1.jpg";
import rhythmPortrait2 from "@/assets/rhythm-portrait-2.jpg";
import rhythmPortrait3 from "@/assets/rhythm-portrait-3.jpg";
import rhythmPortrait4 from "@/assets/rhythm-portrait-4.jpg";
import rhythmAppScore from "@/assets/rhythm-app-score.jpeg.asset.json";
import rhythmAppOverloaded from "@/assets/rhythm-app-overloaded.jpeg.asset.json";

import rhythmMeditationPool from "@/assets/rhythm-meditation-pool.jpg.asset.json";
import rhythmLifestyleBasketball from "@/assets/rhythm-lifestyle-basketball.jpg.asset.json";
import rhythmLifestyleRunning from "@/assets/rhythm-lifestyle-running.jpg.asset.json";
import rhythmLifestyleCoffee from "@/assets/rhythm-lifestyle-coffee.jpg.asset.json";
import rhythmAppSystems from "@/assets/rhythm-app-systems.jpeg.asset.json";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const faqs = [
  { q: "How is this different from other fitness bands?", a: "Most bands give you a screen full of numbers. Rhythm Band feeds those numbers into Nera AI, which turns them into one Rhythm Score and a Biological Age estimate every day — across 5 body systems. No charts to decode. No coach to subscribe to." },
  { q: "What are the 5 body systems?", a: "Metabolic, Heart & Circulation, Sleep & Recovery, Movement, and Autonomic Calm. Each system gets its own score, and together they form your daily Longevity Rhythm — Loaded, Balanced or Overloaded." },
  { q: "What is Biological Age?", a: "Nera AI compares your continuous signals (HRV, resting HR, SpO₂, sleep, stress, movement) against age-matched baselines and gives you an estimated biological age — a clearer answer than 'steps today'." },
  { q: "Does it work without the other Agatsa devices?", a: "Yes. The Rhythm Band works fully standalone with the Agatsa One app and Nera AI. It becomes more powerful when paired with the SanketLife ECG or EasyTouch Wellness — Nera AI then correlates rhythm data with clinical readings." },
  { q: "Can I wear it in water?", a: "IP67 water-resistant. Safe for handwashing, sweat, and light rain. Avoid prolonged submersion or swimming." },
  { q: "What's the battery like?", a: "Up to 7 days of continuous 24/7 monitoring on a single charge. Magnetic charging cable included." },
];

export default function RhythmBandProduct() {
  const [scrolled, setScrolled] = useState(false);
  const { prices, fmt } = usePricing();
  const bandPrice = prices.band_sub;
  useMetaPixelViewContent("RHYTHM_BAND", "EasyTouch Rhythm Band", 3999);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq("track", "AddToCart", {
          content_ids: ["band_sub"],
          content_name: "EasyTouch Rhythm Band",
          content_type: "product",
          value: bandPrice,
          currency: "INR",
        });
      } catch {}
    }
    useCartStore.getState().addItem({
      productId: "band_sub",
      productName: "EasyTouch Rhythm Band",
      variantTitle: "Default Title",
      price: bandPrice,
      quantity: 1,
    });
    toast.success("EasyTouch Rhythm Band added to cart");
  };

  useSEO({
    title: "EasyTouch Rhythm Band — Health Monitoring, Built with Nera AI | Agatsa One",
    description: "Not just another wellness band. Continuous heart, sleep, HRV and SpO2 — interpreted by Nera AI into one Readiness Score every morning. ₹3,999.",
  });

  return (
    <SiteLayout>
      {/* Sub-product bar (Google-style sticky) */}
      <div
        className={`sticky top-[60px] md:top-[68px] z-30 bg-background/85 backdrop-blur-md border-b transition-colors ${
          scrolled ? "border-border" : "border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/devices" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            EasyTouch Rhythm Band
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden sm:block text-sm text-muted-foreground">
              From <span className="font-semibold text-foreground">{fmt(bandPrice)}</span>
            </span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="rounded-full px-5 h-9 text-sm font-medium"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>

      {/* Hero — Google Health Premium style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(220,90%,96%)] via-[hsl(260,80%,97%)] to-background">
        <div className="absolute inset-0 pointer-events-none opacity-60"
          style={{ background: "radial-gradient(60% 50% at 50% 30%, hsl(220 95% 92% / 0.7), transparent 70%)" }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 md:pt-16 pb-10 md:pb-16 text-center">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 mb-8">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(220,90%,55%)] to-[hsl(280,80%,60%)] shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
          </motion.div>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.03 }}
            className="mb-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-semibold tracking-[0.1em] uppercase text-primary"
          >
            EasyTouch Rhythm Band
          </motion.p>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] leading-[1.08] sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] text-foreground"
          >
            Your personal<br />health monitor,<br />
            <span className="bg-gradient-to-r from-[hsl(220,90%,50%)] via-[hsl(260,85%,55%)] to-[hsl(280,80%,55%)] bg-clip-text text-transparent">
              built with Nera AI.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            The EasyTouch Rhythm Band watches your heart, sleep, and recovery 24/7 — and lets Nera AI do the thinking. Not another wall of numbers. One clear answer, every morning.
          </motion.p>


          <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.25 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button onClick={handleAddToCart} className="rounded-full px-8 h-12 text-base font-medium">
              Buy — {fmt(bandPrice)}
            </Button>
            <Link
              to="#how-it-thinks"
              className="text-sm font-medium text-primary hover:underline px-4 py-2"
            >
              See how it thinks →
            </Link>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.35 }} className="mt-4 text-xs text-muted-foreground">
            <StrikePrice sku="band_sub" price={bandPrice} size="sm" showLabel={false} />
            <span className="block mt-2">Free 1-year Nera AI included · Free shipping · 7-day returns</span>
          </motion.div>

          {/* Band + App Screen composition */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 md:mt-20"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 max-w-5xl mx-auto">
              {/* Band image */}
              <img
                src={rhythmHero}
                alt="EasyTouch Rhythm Band"
                className="w-full max-w-[260px] md:max-w-[300px] drop-shadow-[0_20px_50px_hsl(220_80%_40%/0.25)]"
              />
              {/* App screen — Rhythm Score */}
              <div className="rounded-[28px] p-2 bg-gradient-to-b from-[hsl(220,20%,88%)] to-[hsl(220,20%,82%)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">
                <div className="rounded-[22px] overflow-hidden bg-black w-[190px] md:w-[230px]">
                  <img
                    src={rhythmAppOverloaded.url}
                    alt="Nera AI Overloaded metabolic state on mobile"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why it's different — single statement card */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.p {...fadeUp} className="text-sm font-medium text-primary uppercase tracking-[0.15em]">
            The difference
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-5 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]"
          >
            Other bands count steps.<br />
            <span className="text-muted-foreground">Rhythm Band</span> reads your longevity.
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.15 }} className="mt-6 text-lg text-muted-foreground leading-relaxed">
            One <strong className="text-foreground">Rhythm Score</strong>, a daily <strong className="text-foreground">Biological Age</strong>, and a clear verdict — <em>Loaded</em>, <em>Balanced</em> or <em>Overloaded</em>. Built by Nera AI from five body systems, on your own baseline. No 14-chart wall. No coach subscription.
          </motion.p>
        </div>
      </section>


      {/* Bento tiles — Google Health Premium style */}
      <section className="py-10 md:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-6 md:mb-10">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.15em]">What it gives you</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
              Five systems.<br />
              <span className="text-muted-foreground">One clear rhythm.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[minmax(220px,auto)] gap-3 md:gap-4">
            {/* Large hero tile — Metabolic */}
            <motion.div
              {...fadeUp}
              className="md:col-span-4 md:row-span-2 rounded-[28px] md:rounded-[32px] bg-gradient-to-br from-[hsl(220,95%,94%)] to-[hsl(260,90%,95%)] p-7 md:p-10 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/50 blur-3xl pointer-events-none" />
              <div className="relative">
                <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <h3 className="mt-4 text-2xl md:text-4xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
                  Metabolic load,<br />read every day.
                </h3>
                <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
                  Stress and temperature signals tell Nera AI whether your body is balanced, loaded or overloaded — before symptoms show.
                </p>
              </div>
              <div className="relative mt-6 flex items-end justify-end">
                <div className="rounded-2xl bg-white/85 backdrop-blur border border-white px-5 py-4 shadow-sm">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Metabolic</div>
                  <div className="text-3xl font-semibold text-foreground mt-1">72<span className="text-base text-muted-foreground">/100</span></div>
                  <div className="text-[11px] mt-1 inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Balanced</div>
                </div>
              </div>
            </motion.div>

            {/* Heart */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="md:col-span-2 rounded-[28px] bg-[hsl(0,80%,96%)] p-6 md:p-7 flex flex-col justify-between"
            >
              <div>
                <HeartPulse className="h-6 w-6 text-[hsl(0,75%,55%)]" strokeWidth={1.75} />
                <h3 className="mt-4 text-lg md:text-xl font-semibold text-foreground tracking-tight">Heart & circulation</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">HR, SpO₂ and BP signals — your cardiovascular foundation, 24/7.</p>
              </div>
            </motion.div>

            {/* Sleep — dark tile */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="md:col-span-2 rounded-[28px] bg-[hsl(240,50%,12%)] text-white p-6 md:p-7 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(260,80%,40%,0.6),transparent_60%)]" />
              <div className="relative">
                <Moon className="h-6 w-6 text-[hsl(260,80%,80%)]" strokeWidth={1.75} />
                <h3 className="mt-4 text-lg md:text-xl font-semibold tracking-tight text-white">Sleep & recovery</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">Is your sleep debt building, or quietly clearing tonight?</p>
              </div>
              <div className="relative mt-4 text-2xl font-semibold">7h 12m</div>
            </motion.div>

            {/* Movement */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="md:col-span-3 rounded-[28px] bg-[hsl(150,55%,93%)] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5"
            >
              <Activity className="h-6 w-6 text-[hsl(150,70%,30%)] shrink-0" strokeWidth={1.75} />
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">Movement, on your terms</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">Steps and active minutes against <em>your</em> baseline — not someone else's.</p>
              </div>
            </motion.div>

            {/* Autonomic Calm */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:col-span-3 rounded-[28px] bg-[hsl(45,90%,93%)] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5"
            >
              <ShieldCheck className="h-6 w-6 text-[hsl(35,80%,40%)] shrink-0" strokeWidth={1.75} />
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">Autonomic calm</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">HRV and stress balance — how regulated your nervous system really is.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* The Problem No One Talks About */}
      <section className="py-16 md:py-24 bg-background overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-[32px] bg-gradient-to-br from-[hsl(220,45%,10%)] via-[hsl(245,50%,14%)] to-[hsl(280,55%,18%)] text-white p-8 md:p-14 overflow-hidden shadow-[0_40px_120px_-40px_hsl(260_60%_30%/0.6)]"
          >
            {/* Ambient glow orbs */}
            <motion.div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[hsl(280,80%,55%)]/20 blur-3xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-[hsl(200,80%,55%)]/15 blur-3xl"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className="relative">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60 mb-4"
              >
                <span className="w-8 h-px bg-white/40" />
                The silent cascade
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] text-white"
              >
                The Problem <span className="bg-gradient-to-r from-[hsl(280,90%,75%)] to-[hsl(200,90%,75%)] bg-clip-text text-transparent">No One Talks About</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="mt-5 text-white/75 text-lg md:text-xl leading-relaxed max-w-2xl"
              >
                People don't suddenly become unhealthy. It happens like dominoes — one quiet tip at a time.
              </motion.p>

              {/* Cascade */}
              <div className="mt-12 space-y-2.5">
                {[
                  { icon: Moon, label: "Poor sleep", tint: "from-indigo-400/30 to-indigo-500/10", iconColor: "text-indigo-300" },
                  { icon: Zap, label: "Higher stress", tint: "from-amber-400/30 to-amber-500/10", iconColor: "text-amber-300" },
                  { icon: BatteryLow, label: "Lower recovery", tint: "from-sky-400/30 to-sky-500/10", iconColor: "text-sky-300" },
                  { icon: Activity, label: "Reduced movement", tint: "from-emerald-400/30 to-emerald-500/10", iconColor: "text-emerald-300" },
                  { icon: Flame, label: "Metabolic strain", tint: "from-rose-400/30 to-rose-500/10", iconColor: "text-rose-300" },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i}>
                      <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                        className={`group relative flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-r ${step.tint} border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors`}
                      >
                        <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center ${step.iconColor} shrink-0`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.75} />
                        </div>
                        <span className="text-base md:text-xl font-medium text-white tracking-tight">{step.label}</span>
                        <span className="ml-auto text-xs font-mono text-white/40 hidden sm:block">0{i + 1}</span>
                      </motion.div>
                      {i < 4 && (
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          whileInView={{ opacity: 1, scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.12 + 0.25 }}
                          className="flex justify-center origin-top"
                        >
                          <ChevronDown className="w-5 h-5 text-white/30 my-1 animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Years later — explosion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="mt-10 relative rounded-2xl p-6 md:p-7 bg-gradient-to-br from-rose-500/20 via-orange-500/15 to-amber-500/10 border border-rose-300/20"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
                    className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-200 shrink-0"
                  >
                    <AlertTriangle className="w-6 h-6" strokeWidth={1.75} />
                  </motion.div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-rose-200/80 font-semibold">Years later</p>
                    <p className="mt-2 text-lg md:text-2xl font-medium text-white leading-snug">
                      Weight gain. Fatigue. Burnout. Declining health.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Closing lines */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-10 border-t border-white/10 pt-8 space-y-3"
              >
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                  The warning signs appear <em className="not-italic text-white/90 font-medium">long</em> before symptoms do.
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
                  But nobody connects them <span className="bg-gradient-to-r from-[hsl(280,90%,75%)] to-[hsl(200,90%,75%)] bg-clip-text text-transparent">together.</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>




      {/* Lifestyle Q&A — Google Health Premium style alternating blocks */}
      <section className="py-12 md:py-16 bg-[hsl(220,30%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 md:space-y-24">
          {[
            {
              img: rhythmLifestyleBasketball.url,
              alt: "Man holding a basketball with EasyTouch Rhythm Band on his wrist",
              q: "Will it keep up with how hard I push?",
              h: "Built to move with you, not get in your way.",
              a: "Built for real life, not just workouts. The lightweight nylon loop band offers breathable all-day comfort, while its IP67 sweat and splash resistance helps it keep up with your daily routine. With no glass screen to crack, it is designed for professionals, homemakers, seniors, travelers, fitness enthusiasts, and anyone looking to stay connected to their health. From morning walks and office meetings to household chores, workouts, and restful sleep, EasyTouch Rhythm Band works quietly in the background, helping you understand your body's patterns every day.",
            },
            {
              img: rhythmLifestyleRunning.url,
              alt: "Man running up stairs wearing EasyTouch Rhythm Band",
              q: "Does it understand a real workout?",
              h: "Continuous HR, SpO₂ and movement — interpreted, not just logged.",
              a: "NERA AI helps connect the dots between your daily activity, stress, sleep and recovery patterns. Your daily Rhythm Score helps you understand how well your body is coping, recovering and recharging, so you can make smarter decisions about work, rest, movement and overall wellbeing — without relying on guesswork.",
              reverse: true,
            },
            {
              img: rhythmLifestyleCoffee.url,
              alt: "Woman sitting calmly with a cup of coffee wearing EasyTouch Rhythm Band",
              q: "What about stress and recovery?",
              h: "Your nervous system, on screen — gently.",
              a: "HRV, resting heart rate and sleep depth feed an Autonomic Calm score. You see when your body is regulated, when it's overloaded, and what to do about it — without staring at charts.",
            },
          ].map((b, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center ${b.reverse ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="rounded-[28px] md:rounded-[36px] overflow-hidden aspect-[4/3] shadow-[0_30px_80px_-30px_hsl(220_40%_30%/0.3)]">
                <img src={b.img} alt={b.alt} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="md:px-2">
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.18em]">
                  Q. {b.q}
                </p>
                <h3 className="mt-5 text-2xl md:text-4xl font-semibold tracking-[-0.02em] text-foreground leading-[1.15]">
                  {b.h}
                </h3>
                <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {b.a}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Editorial lifestyle card — meditation poolside */}
      <section className="pb-10 md:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[32px] md:rounded-[40px] shadow-2xl"
          >
            <img
              src={rhythmMeditationPool.url}
              alt="Woman meditating poolside wearing the Rhythm Band"
              className="w-full h-[320px] md:h-[520px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="px-6 md:px-14 py-8 md:py-0 max-w-xl">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  <Sparkles className="h-3.5 w-3.5" /> Calm, measured.
                </span>
                <h3 className="mt-4 text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.1]">
                  Breathe in. Your body is listening.
                </h3>
                <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed">
                  Every quiet moment is a signal. Rhythm Band reads your HRV, breath and recovery — so Nera AI can tell you when to push, and when to pause.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nera AI Readiness — large feature card */}
      <section id="how-it-thinks" className="pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-[hsl(220,40%,12%)] via-[hsl(240,50%,14%)] to-[hsl(160,40%,12%)] px-6 md:px-16 py-10 md:py-16"
          >
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[hsl(150,90%,50%)]/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[hsl(220,90%,55%)]/20 blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(150,80%,65%)]">
                  <Sparkles className="h-3.5 w-3.5" /> Powered by Nera AI
                </span>
                <h3 className="mt-5 text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.1]">
                  Today's Longevity Rhythm — in one screen.
                </h3>
                <p className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-lg">
                  Nera AI reads HR, SpO₂, temperature, HRV-stress and sleep continuously, then gives you a single <strong className="text-white">Rhythm Score</strong>, an estimated <strong className="text-white">Biological Age</strong>, and a verdict for the day — Loaded, Balanced, or Overloaded.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Rhythm Score", "Biological Age", "Loaded · Balanced · Overloaded", "Personal baseline"].map((t) => (
                    <span key={t} className="rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-sm text-white/85 backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative w-full max-w-[280px] rounded-[36px] border-[6px] border-white/15 bg-black overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-b-xl z-10" />
                  <img
                    src={rhythmAppScore.url}
                    alt="Today's Longevity Rhythm in the Agatsa One app — Rhythm Score 41, Biological Age 45y, Overloaded"
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Nera actually tells you — animated dialogue cards */}
      <SignalDialogueSection />

      {/* Lives — story-driven personas (Google Health style) */}
      <section className="py-10 md:py-16 bg-[hsl(220,30%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-6 md:mb-10">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.15em]">For every body</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
              One band. Many lives.<br />
              <span className="text-muted-foreground">All ages, all rhythms.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Same wrist. Same band. Completely different stories — written by Nera AI from your own signals.
            </p>
          </motion.div>

          {/* Featured story — Arjun */}
          <motion.div {...fadeUp} className="rounded-3xl overflow-hidden bg-card border border-border/60 grid md:grid-cols-5 mb-4 md:mb-5">
            <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:min-h-[360px] bg-muted">
              <img src={rhythmPortrait1} alt="Arjun, 42, product manager" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="md:col-span-3 p-6 md:p-10 flex flex-col justify-between gap-6 bg-gradient-to-br from-[hsl(220,90%,55%)] to-[hsl(260,80%,55%)] text-white relative overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/15 blur-3xl pointer-events-none" />
              <div className="relative">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Arjun · 42 · Bengaluru</span>
                <p className="mt-3 text-xl md:text-2xl font-medium leading-snug">
                  "Two late nights and Nera flagged my stress load before I felt it. I slept early — Rhythm bounced back to 78 by Friday."
                </p>
              </div>
              <div className="relative grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                <div>
                  <div className="text-3xl md:text-4xl font-semibold tracking-tight">72</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70 mt-1">Rhythm score</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-semibold tracking-tight">38<span className="text-lg">y</span></div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70 mt-1">Bio age</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-semibold tracking-tight">7h12</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70 mt-1">Sleep</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Three persona cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { img: rhythmPortrait2, name: "Priya · 29 · Mumbai", role: "New mother", quote: "Sleep debt cleared in 11 days. Nera nudged me back to baseline gently.", icon: Moon, stat: "HRV 48ms", sub: "Above baseline" },
              { img: rhythmPortrait3, name: "Ramesh · 64 · Pune", role: "Recently retired", quote: "Resting heart rate dropped 6 bpm in a month — just from daily walks Nera planned.", icon: HeartPulse, stat: "62 bpm", sub: "Resting · steady" },
              { img: rhythmPortrait4, name: "Meena · 47 · Delhi", role: "Perimenopause", quote: "My autonomic calm was off. Rhythm caught the pattern weeks before my checkup.", icon: ShieldCheck, stat: "−18%", sub: "Stress this week" },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                {...fadeUp}
                transition={{ duration: 0.7, delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="rounded-3xl overflow-hidden bg-card border border-border/60 flex flex-col"
              >
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-5 md:p-6 flex-1 flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">{p.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{p.role}</span>
                  <p className="mt-3 text-[15px] md:text-base text-foreground leading-relaxed flex-1">"{p.quote}"</p>
                  <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
                    <p.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    <div>
                      <div className="text-base font-semibold text-foreground leading-none">{p.stat}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{p.sub}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical-grade ecosystem */}
      <section className="py-12 md:py-16 bg-[hsl(220,30%,98%)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-8 md:mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.15em]">Complete health picture</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
              Fitness is a start.<br />
              <span className="text-muted-foreground">Clinical depth is the next step.</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              The Rhythm Band watches you continuously. Add medical-grade devices, and Nera AI turns scattered readings into connected health guidance — not just fitness stats.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: HeartPulse,
                title: "SanketLife ECG",
                desc: "Hospital-grade ECG at home. Detect arrhythmia, missed beats and cardiac stress patterns that a band alone cannot see. Nera AI links these snapshots with your 24/7 rhythm data for early warning signals.",
                link: "/devices/sanketlife-ecg",
                linkLabel: "Explore SanketLife →",
              },
              {
                icon: Activity,
                title: "EasyTouch Wellness",
                desc: "Blood pressure and sugar trend monitoring with clinical accuracy. Nera AI correlates these metabolic markers with your continuous stress, sleep and HRV signals — so you see causes, not just numbers.",
                link: "/devices/easytouch-wellness",
                linkLabel: "Explore EasyTouch →",
              },
              {
                icon: Stethoscope,
                title: "Nera AI Correlation",
                desc: "Rhythm Band gives you continuous trends. SanketLife and EasyTouch Wellness give you clinical snapshots. Nera AI connects both — turning separate readings into one coherent health story with actionable guidance.",
                link: "#how-it-thinks",
                linkLabel: "See how it thinks →",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-2xl bg-card border border-border/60 p-7 md:p-8 hover:border-primary/40 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.08)] transition-all flex flex-col"
              >
                <card.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <h3 className="mt-5 text-lg font-semibold text-foreground tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                <Link to={card.link} className="mt-6 text-sm font-medium text-primary hover:underline">
                  {card.linkLabel}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The loop — visual editorial moment */}
      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 {...fadeUp} className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
            The loop most bands miss.
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.8, delay: 0.1 }} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            High stress today → shallow sleep tonight → elevated resting heart rate tomorrow. Nera AI sees the cycle, not just the data points.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.15 }} className="mt-14 flex flex-wrap justify-center gap-3 text-sm">
            {["Stress ↑", "Sleep ↓", "Resting HR ↑", "Recovery ↓"].map((s, i) => (
              <span
                key={s}
                className={`rounded-full px-5 py-2.5 border ${
                  i % 2 === 0
                    ? "bg-primary/5 text-primary border-primary/20"
                    : "bg-muted text-foreground border-border"
                }`}
              >
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Nera score device shot */}
      <section className="pb-14 md:pb-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="rounded-[32px] bg-gradient-to-br from-[hsl(260,100%,97%)] to-[hsl(220,100%,97%)] px-6 md:px-16 py-10 md:py-14 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-[0.15em]">A score per system</p>
              <h3 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
                One screen. Five answers. Every day.
              </h3>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed">
                Metabolic, Heart & Circulation, Sleep & Recovery, Movement and Autonomic Calm — each with its own score, plain-English reason, and points to unlock. No decoding required.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-[220px] rounded-[36px] border-[6px] border-foreground/90 bg-black overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-b-xl z-10" />
                <img
                  src={rhythmAppSystems.url}
                  alt="Five body systems in the Agatsa One app — Metabolic, Heart & Circulation, Sleep & Recovery, Movement, Autonomic Calm"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ — Google-style two column */}
      <section className="py-12 md:py-16 bg-background border-t border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <motion.div {...fadeUp} className="md:col-span-4">
              <p className="text-sm font-medium text-primary uppercase tracking-[0.15em]">Help</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.05]">
                Common<br />questions.
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed">
                Everything you might want to know about the Rhythm Band and Nera AI.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="md:col-span-8">
              <Accordion type="single" collapsible className="w-full border-t border-border/70">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/70">
                    <AccordionTrigger className="text-left text-foreground font-medium text-lg md:text-xl hover:no-underline py-6">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-6 pr-6">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Final CTA — minimal */}
      <section className="py-14 md:py-20 bg-background">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
            Health that thinks for itself.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Strap it on. Forget it's there. Wake up smarter.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button onClick={handleAddToCart} className="rounded-full px-10 h-12 text-base font-medium">
              Buy — {fmt(bandPrice)}
            </Button>
            <Link to="/devices" className="text-sm font-medium text-primary hover:underline px-4 py-2">
              Compare all devices →
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Free 1-year Nera AI · Free shipping · 7-day returns
          </p>
        </div>
      </section>

      <AwardsTrustSection />
      <ProductReviewsSection reviews={easytouchRhythmReviews} />

      <StickyAddToCart
        productName="EasyTouch Rhythm Band"
        price={fmt(bandPrice)}
        unitPrice={bandPrice}
        onBuyNow={handleAddToCart}
        onAddToCart={handleAddToCart}
        themeColor="primary"
      />
    </SiteLayout>
  );
}

// ============================================================
// Animated dialogue section — Nera-AI style signal storytelling
// Auto-rotates through 3 real insights, like the in-app screens.
// ============================================================
type Signal = {
  key: string;
  emoji: string;
  label: string;
  meta: string;
  score: number;
  pill: string;
  headline: string;
  body: string;
  todo: string;
  accent: string; // hsl tuple "h s% l%"
  trend: string;  // svg polyline points 0..300 x, 0..60 y
};

const SIGNALS: Signal[] = [
  {
    key: "sleep",
    emoji: "🛌",
    label: "Sleep",
    meta: "1.4h avg · Rhythm Band",
    score: 35,
    pill: "1.4h avg · Below target",
    headline: "1.4h is 5.6h below your optimal range",
    body: "Each hour below 7h raises morning cortisol ~15–20%, which elevates fasting sugar and suppresses HRV over 3–5 nights. The cumulative effect on your Rhythm Score is significant.",
    todo: "Move bedtime 30 minutes earlier tonight. A consistent 10pm bedtime works better than weekend catch-up sleep.",
    accent: "265 85% 65%",
    trend: "0,40 50,30 100,42 150,22 200,20 250,18 300,32",
  },
  {
    key: "activity",
    emoji: "🏃",
    label: "Activity",
    meta: "2.4k steps/day · 30d tracked",
    score: 40,
    pill: "2.4k · Below target",
    headline: "2.4k steps — below the 7k insulin-sensitivity threshold",
    body: "Research consistently shows that crossing 7,000 steps/day is the threshold where insulin sensitivity, resting HR, and metabolic zone begin to improve measurably. You're 4,626 steps short.",
    todo: "Add one 20-minute walk after lunch — it adds ~2,000 steps and directly lowers post-meal sugar response.",
    accent: "210 95% 60%",
    trend: "0,38 50,45 100,30 150,48 200,35 250,42 300,40",
  },
  {
    key: "hrv",
    emoji: "❤️",
    label: "HRV & Heart Rate",
    meta: "HRV 54 ms · HR 70 bpm",
    score: 72,
    pill: "54ms · Good",
    headline: "HRV 54ms — good autonomic health",
    body: "An HRV of 54ms indicates your autonomic nervous system is managing stress well. Higher HRV is linked to better metabolic regulation, faster recovery, and lower long-term cardiac risk.",
    todo: "Maintain consistent sleep timing — HRV is most sensitive to sleep irregularity, not just duration.",
    accent: "5 90% 60%",
    trend: "0,45 50,42 100,38 150,32 200,28 250,20 300,12",
  },
];

function SignalDialogueSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % SIGNALS.length), 5200);
    return () => clearInterval(t);
  }, []);

  const s = SIGNALS[active];
  const accent = `hsl(${s.accent})`;

  return (
    <section className="py-12 md:py-16 bg-[hsl(225,40%,6%)] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div {...fadeUp} className="max-w-2xl mb-6 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            What Nera actually tells you
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] text-white">
            Not a chart. <span className="text-white/70">A conversation about your day.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/65 leading-relaxed">
            Every signal becomes a plain-English insight — what it means, why it matters, and exactly what to do next.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-12 items-start">
          {/* Signal list */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SIGNALS.map((sig, i) => {
              const isActive = i === active;
              return (
                <button
                  key={sig.key}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 lg:w-full text-left rounded-2xl border px-4 py-4 transition-all ${
                    isActive
                      ? "border-white/25 bg-white/[0.06]"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl">{sig.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{sig.label}</div>
                        <div className="text-xs text-white/45 truncate">{sig.meta}</div>
                      </div>
                    </div>
                    <div
                      className="text-sm font-semibold tabular-nums whitespace-nowrap"
                      style={{ color: `hsl(${sig.accent})` }}
                    >
                      {sig.score}/100
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      key={isActive ? `a-${i}` : `b-${i}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${sig.score}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `hsl(${sig.accent})` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Animated dialogue card */}
          <div className="relative">
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[hsl(225,45%,8%)] p-6 md:p-9"
            >
              <div
                className="absolute -top-32 -right-32 h-72 w-72 rounded-full blur-3xl opacity-25"
                style={{ background: accent }}
              />

              <span
                className="relative inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `hsl(${s.accent} / 0.15)`, color: accent, border: `1px solid hsl(${s.accent} / 0.35)` }}
              >
                {s.pill}
              </span>

              <h3 className="relative mt-5 text-2xl md:text-4xl font-semibold tracking-[-0.01em] leading-[1.15] text-white">
                {s.headline}
              </h3>

              <p className="relative mt-5 text-base md:text-lg text-white/65 leading-relaxed">
                {s.body}
              </p>

              <div
                className="relative mt-7 rounded-r-xl border-l-[3px] pl-4 py-1"
                style={{ borderColor: accent }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: accent }}
                >
                  What to do
                </div>
                <p className="mt-2 text-base md:text-lg text-white/80 leading-relaxed">
                  {s.todo}
                </p>
              </div>

              <div className="relative mt-8">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-2">
                  7-day trend
                </div>
                <svg viewBox="0 0 300 60" className="w-full h-16 overflow-visible">
                  <motion.polyline
                    key={`tr-${s.key}`}
                    fill="none"
                    stroke={accent}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={s.trend}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                  <circle
                    cx={300}
                    cy={Number(s.trend.split(" ").pop()!.split(",")[1])}
                    r={4}
                    fill={accent}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Progress dots */}
            <div className="mt-5 flex items-center gap-2 justify-center lg:justify-start">
              {SIGNALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show insight ${i + 1}`}
                  className="h-1.5 rounded-full bg-white/15 overflow-hidden transition-all"
                  style={{ width: i === active ? 36 : 16 }}
                >
                  {i === active && (
                    <motion.div
                      key={`p-${active}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5.2, ease: "linear" }}
                      className="h-full bg-white/70"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

