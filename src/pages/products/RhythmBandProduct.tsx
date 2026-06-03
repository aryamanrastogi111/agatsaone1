import { useEffect, useState } from "react";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { usePricing } from "@/hooks/useDevicePricing";
import { useMetaPixelViewContent } from "@/hooks/useMetaPixelViewContent";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Moon, HeartPulse, Activity, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { StrikePrice } from "@/components/StrikePrice";
import { ProductReviewsSection } from "@/components/products/ProductReviewsSection";
import { easytouchRhythmReviews } from "@/data/easytouchRhythmReviews";
import { AwardsTrustSection } from "@/components/AwardsTrustSection";
import rhythmHero from "@/assets/easytouch-rhythm-new.webp";
import neraScreen from "@/assets/app-screen-nera.webp";
import rhythmAppScore from "@/assets/rhythm-app-score.jpeg.asset.json";
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
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-16 md:pb-24 text-center">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 mb-8">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(220,90%,55%)] to-[hsl(280,80%,60%)] shadow-lg shadow-primary/20">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[40px] leading-[1.05] sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-foreground"
          >
            Your personal<br />health monitor,<br />
            <span className="bg-gradient-to-r from-[hsl(220,90%,50%)] via-[hsl(260,85%,55%)] to-[hsl(280,80%,55%)] bg-clip-text text-transparent">
              built with Nera AI.
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-8 max-w-xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
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

          {/* Floating product image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 md:mt-20"
          >
            <img
              src={rhythmHero}
              alt="EasyTouch Rhythm Band"
              className="w-full max-w-xl mx-auto drop-shadow-[0_30px_60px_hsl(220_80%_40%/0.25)]"
            />
          </motion.div>
        </div>
      </section>

      {/* Why it's different — single statement card */}
      <section className="py-20 md:py-28 bg-background">
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

      {/* Nera AI Readiness — large feature card */}
      <section id="how-it-thinks" className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-[hsl(220,40%,12%)] via-[hsl(240,50%,14%)] to-[hsl(160,40%,12%)] px-6 md:px-16 py-16 md:py-24"
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

      {/* Health monitoring — minimal grid */}
      <section className="py-20 md:py-28 bg-[hsl(220,30%,98%)]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.15em]">Five body systems</p>
            <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.1]">
              Not 14 charts.<br />Five systems that decide how you age.
            </h2>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              Each system gets its own score every day — and a one-line reason why. Tap any card to unlock points and see what to do next.
            </p>
          </motion.div>

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Sparkles, title: "Metabolic", desc: "Stress and temperature signals — is your metabolic load in range?" },
              { icon: HeartPulse, title: "Heart & Circulation", desc: "HR, SpO₂ and BP signals — your cardiovascular foundation." },
              { icon: Moon, title: "Sleep & Recovery", desc: "Sleep duration and quality — is your debt building or clearing?" },
              { icon: Activity, title: "Movement", desc: "Daily steps and active minutes against your personal target." },
              { icon: ShieldCheck, title: "Autonomic Calm", desc: "HRV and stress balance — how regulated is your nervous system?" },
              { icon: Sparkles, title: "Longevity Score", desc: "Your daily Rhythm Score and Biological Age — one number that summarises all five systems." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="rounded-2xl bg-card border border-border/60 p-7 hover:border-primary/40 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.08)] transition-all"
              >
                <f.icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                <h3 className="mt-5 text-lg font-semibold text-foreground tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The loop — visual editorial moment */}
      <section className="py-24 md:py-32 bg-background">
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
      <section className="pb-24 md:pb-32 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="rounded-[32px] bg-gradient-to-br from-[hsl(260,100%,97%)] to-[hsl(220,100%,97%)] px-6 md:px-16 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
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

      {/* FAQ */}
      <section className="py-20 bg-[hsl(220,30%,98%)]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-foreground text-center">
            Questions
          </motion.h2>
          <Accordion type="single" collapsible className="w-full mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
                <AccordionTrigger className="text-left text-foreground font-medium text-base hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA — minimal */}
      <section className="py-24 md:py-32 bg-background">
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
