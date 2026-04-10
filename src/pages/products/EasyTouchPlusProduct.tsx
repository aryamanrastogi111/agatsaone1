import { useRef } from "react";
import { usePricing } from "@/hooks/useDevicePricing";
import { useNavigate } from "react-router-dom";
import easytouchWellnessImg from "@/assets/easytouch-wellness-hero.webp";
import easytouchFingerImg from "@/assets/easytouch-wellness-finger.webp";
import { motion, useInView } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Zap,
  ArrowRight,
  ArrowDown,
  Brain,
  Fingerprint,
  Wifi,
  Sparkles,
  Timer,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Users,
  Dumbbell,
  Heart,
  Coffee,
  Eye,
  Package,
  Cable,
  Smartphone,
  MessageCircle,
  Star,
  CheckCircle2,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";

/* ── Animated wrapper ── */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Sticky header buy button ── */
function StickyBuyBar({ onBuy, wp }: { onBuy: () => void; wp: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  return (
    <>
      <div ref={ref} className="h-0" />
      {!inView && (
        <motion.div
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur border-b border-border shadow-sm"
        >
          <div className="container flex items-center justify-between h-12">
            <span className="font-semibold text-sm text-foreground">EasyTouch Wellness</span>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6" onClick={onBuy}>
              Buy Now — {wp}
            </Button>
          </div>
        </motion.div>
      )}
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ── Floating WhatsApp ── */
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918826283840?text=Hi,%20I%20want%20to%20know%20more%20about%20EasyTouch%20Wellness"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
}

export default function EasyTouchPlusProduct() {
  const { prices, fmt } = usePricing();
  const wp = fmt(prices.wellness_sub);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      try { (window as any).fbq("track", "AddToCart", { content_ids: ["wellness_sub"], content_name: "EasyTouch Wellness", content_type: "product", value: 3999, currency: "INR" }); } catch {}
    }
    navigate("/checkout?sku=wellness_sub");
  };

  return (
    <Layout>
      <StickyBuyBar onBuy={handleBuyNow} />
      <FloatingWhatsApp />

      {/* ═══ SECTION 1 — HERO ═══ */}
      <section className="bg-gradient-to-b from-teal-50/60 to-background pt-20 pb-16">
        <div className="container">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
            >
              Your food is talking to your body.{" "}
              <span className="text-teal-600">Are you listening?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl"
            >
              EasyTouch Wellness reveals exactly how every meal, snack, and fast
              affects YOUR metabolism — in real time. Powered by Nera AI.
            </motion.p>

            {/* Placeholder device visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="relative w-full max-w-lg my-4"
            >
              <div className="absolute inset-0 rounded-3xl bg-teal-300/20 blur-3xl scale-110" />
              <img
                src={easytouchWellnessImg}
                alt="EasyTouch Wellness device showing Metabolic Index reading"
                className="relative w-full rounded-3xl drop-shadow-2xl"
              />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 text-base shadow-lg shadow-teal-200" onClick={handleBuyNow}>
                  Buy Now — {wp} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-teal-200 text-teal-700 hover:bg-teal-50" asChild>
                <a href="#how-it-works">
                  See How It Works <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mt-2"
            >
              {[
                { icon: <BarChart3 className="h-4 w-4" />, text: "12,000+ readings analyzed" },
                { icon: <Brain className="h-4 w-4" />, text: "Nera AI learns your body" },
                { icon: <Truck className="h-4 w-4" />, text: "Ships in 3–5 days" },
                { icon: <RotateCcw className="h-4 w-4" />, text: "30-day returns" },
              ].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {t.icon} {t.text}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — PROBLEM ═══ */}
      <section className="py-20 bg-background">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              You're eating 'healthy'.{" "}
              <span className="text-teal-600">So why isn't it working?</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="h-8 w-8 text-teal-600" />,
                title: "Same food, different bodies",
                desc: "A banana raises one person's metabolic load by 40%. Another person — barely a ripple. Generic diet advice ignores this.",
              },
              {
                icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
                title: "You can't feel metabolic stress",
                desc: "Your body doesn't alert you when a food is quietly overloading your metabolism. You just feel tired, foggy, heavy.",
              },
              {
                icon: <Eye className="h-8 w-8 text-orange-500" />,
                title: "Guesswork is costing you",
                desc: "Without data on YOUR body's response, every meal is a guess. EasyTouch Wellness ends the guessing.",
              },
            ].map((c, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-4 h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">{c.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground">{c.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — PRODUCT INTRO ═══ */}
      <section className="py-20 bg-gradient-to-b from-teal-50/40 to-background">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet <span className="text-teal-600">EasyTouch Wellness</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <img
                src={easytouchFingerImg}
                alt="EasyTouch Wellness device with finger on sensor showing Metabolic Index"
                className="rounded-3xl w-full drop-shadow-2xl"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <ul className="space-y-5">
                {[
                  { icon: <Timer className="h-5 w-5 text-teal-600" />, text: "Measures metabolic load in under 15 seconds" },
                  { icon: <Shield className="h-5 w-5 text-teal-600" />, text: "No needles. No blood. Just your fingertip." },
                  { icon: <Wifi className="h-5 w-5 text-teal-600" />, text: "Connects wirelessly to the Agatsa One app" },
                  { icon: <Brain className="h-5 w-5 text-teal-600" />, text: "Powered by Nera AI — gets smarter with every reading" },
                  { icon: <Smartphone className="h-5 w-5 text-teal-600" />, text: "Works with free Agatsa One app — iOS & Android" },
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">{f.icon}</div>
                    <span className="text-foreground font-medium">{f.text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4 — HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-20 bg-background scroll-mt-20">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Three steps to know your metabolism
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
            {[
              {
                step: "1",
                title: "Place finger on sensor",
                desc: "15-second reading. No preparation needed.",
                icon: <Fingerprint className="h-8 w-8 text-teal-600" />,
              },
              {
                step: "2",
                title: "Nera AI analyzes your response",
                desc: "See your Metabolic Load Score instantly — and how it compares to your personal baseline.",
                icon: <Brain className="h-8 w-8 text-teal-600" />,
              },
              {
                step: "3",
                title: "Learn what YOUR body loves (and hates)",
                desc: "Over time, Nera AI identifies which foods drain you and which ones fuel you. Personalized. Precise.",
                icon: <TrendingUp className="h-8 w-8 text-teal-600" />,
              },
            ].map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 h-full">
                  <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold">{s.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">{s.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="max-w-2xl mx-auto">
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-6 text-center">
              <p className="text-teal-800 font-medium">
                💡 Most users see meaningful patterns in their Metabolic Score within 7 days of consistent use.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ SECTION 5 — SCIENCE ═══ */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              It's not about what you eat.{" "}
              <span className="text-teal-600">It's about what it does to you.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Every time you eat, your body mobilizes resources to process and respond to that food.
              This metabolic response varies by food, time of day, stress, and sleep.
              EasyTouch Wellness captures this signal. Nera AI decodes it for you.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {[
              { stat: "1 in 3 Indians", desc: "has elevated metabolic stress without knowing it" },
              { stat: "67%", desc: "of metabolic responses depend on food timing, not just food choice" },
              { stat: "14 days", desc: "for Nera AI to build your personal metabolic baseline" },
            ].map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl bg-card border border-border p-8 text-center">
                  <p className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{s.stat}</p>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3} className="text-center">
            <p className="text-xs text-muted-foreground max-w-xl mx-auto italic">
              *EasyTouch Wellness measures bioelectrical metabolic markers. Not a metabolic wellness monitor.
              Not intended to diagnose or treat any medical condition.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ SECTION 6 — NERA AI ═══ */}
      <section className="py-20 bg-background">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Nera AI doesn't give generic advice.{" "}
              <span className="text-teal-600">It learns you.</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-indigo-900 rounded-3xl p-16 flex items-center justify-center border border-teal-500/30 shadow-2xl shadow-teal-500/20 overflow-hidden group">
                {/* Animated glow rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-teal-400/20 animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-teal-400/10 animate-[pulse_3s_ease-in-out_infinite]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full border border-indigo-400/5 animate-[pulse_4s_ease-in-out_infinite]" />
                </div>
                {/* Floating particles */}
                <div className="absolute top-8 left-12 w-2 h-2 bg-teal-400/40 rounded-full animate-drift" />
                <div className="absolute bottom-12 right-10 w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-float" />
                <div className="absolute top-1/3 right-16 w-1 h-1 bg-teal-300/50 rounded-full animate-float-slow" />
                {/* Content */}
                <div className="relative text-center space-y-4 z-10">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-400/30 group-hover:scale-110 transition-transform duration-500">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <p className="font-bold text-xl text-white tracking-wide">Nera AI</p>
                  <p className="text-sm text-teal-300/90 max-w-[200px]">Your personal metabolic intelligence engine</p>
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-xs text-teal-400 font-medium tracking-wider uppercase">Active & Learning</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                {[
                  {
                    title: "Your Metabolic Score",
                    desc: "A single number that tracks how your metabolism responds over time. Goes up when you make better choices.",
                    icon: <TrendingUp className="h-6 w-6 text-teal-600" />,
                  },
                  {
                    title: "Food Impact Insights",
                    desc: '"That dal chawal at lunch? It reduced your metabolic load by 18% compared to yesterday\'s meal."',
                    icon: <Coffee className="h-6 w-6 text-teal-600" />,
                  },
                  {
                    title: "Trend Alerts",
                    desc: "Nera AI flags when your metabolic load is consistently elevated and suggests what to investigate.",
                    icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
                  },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">{f.icon}</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                      <p className="text-muted-foreground text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-sm font-medium text-teal-700">
                  <Sparkles className="h-3.5 w-3.5" /> Powered by Nera AI
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7 — WHO IT'S FOR ═══ */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              EasyTouch Wellness is for you if...
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              "You've been told to 'watch what you eat' but don't know what that means for YOUR body",
              "You're pre-diabetic or have a family history and want to be proactive",
              "You're trying to lose weight but nothing seems to work",
              "You're a fitness enthusiast optimizing recovery and energy",
              "You feel tired or foggy after meals and can't figure out why",
              "You want data — not guesswork — about your health",
            ].map((text, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="rounded-2xl border border-border bg-card p-6 flex items-start gap-3 h-full">
                  <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm font-medium">{text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8 — WHAT'S IN THE BOX ═══ */}
      <section id="buy" className="py-20 bg-background scroll-mt-20">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything you need to start
            </h2>
          </AnimatedSection>

          <div className="max-w-md mx-auto mb-12">
            <AnimatedSection delay={0.1}>
              <ul className="space-y-4">
                {[
                  { icon: <Package className="h-5 w-5 text-teal-600" />, text: "EasyTouch Wellness device" },
                  { icon: <Cable className="h-5 w-5 text-teal-600" />, text: "Charging cable" },
                  { icon: <Smartphone className="h-5 w-5 text-teal-600" />, text: "Agatsa One app (free download)" },
                  { icon: <Sparkles className="h-5 w-5 text-teal-600" />, text: "Nera AI metabolic analysis — included" },
                  { icon: <MessageCircle className="h-5 w-5 text-teal-600" />, text: "Setup support via WhatsApp" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                    {item.icon}
                    <span className="text-foreground font-medium text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.2} className="text-center">
            <div className="inline-block bg-card border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl text-muted-foreground line-through">{wp}</span>
                <span className="text-4xl font-bold text-foreground">{wp}</span>
              </div>
              <p className="text-teal-600 font-medium mb-1">Limited Time Offer</p>
              <p className="text-muted-foreground text-sm mb-6">Free shipping across India</p>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-10 text-base shadow-lg shadow-teal-200" onClick={handleBuyNow}>
                Buy Now — {wp} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ SECTION 9 — TESTIMONIALS ═══ */}
      <section className="py-20 bg-muted/20">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What our users are saying
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: "I always thought I was eating healthy. EasyTouch showed me my afternoon fruit was why I was crashing at 4pm. Changed my entire routine.",
                name: "Priya M.",
                city: "Bangalore",
              },
              {
                quote: "As someone managing pre-diabetes naturally, this gives me confidence I'm on the right track. The Nera Score actually motivates me.",
                name: "Rajesh K.",
                city: "Delhi",
              },
              {
                quote: "My doctor told me to track my food habits. This shows me cause and effect for my body specifically — not generic charts.",
                name: "Anjali S.",
                city: "Mumbai",
              },
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-4 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed italic">"{t.quote}"</p>
                  <p className="text-muted-foreground text-sm mt-auto">— {t.name}, {t.city}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 10 — FAQ ═══ */}
      <section className="py-20 bg-background">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Common questions</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {[
                {
                  q: "Does it measure blood sugar?",
                  a: "No. EasyTouch Wellness is not a blood glucose monitor. It measures bioelectrical metabolic markers that reflect how your body responds to food — what we call 'metabolic load'. It is not intended to diagnose or monitor any medical condition. If you need medical-grade monitoring, consult your doctor.",
                },
                {
                  q: "Do I need to prick my finger?",
                  a: "No needles, no blood. Place your fingertip on the sensor for 15 seconds.",
                },
                {
                  q: "How is this different from a glucometer?",
                  a: "A glucometer measures blood from a sample. EasyTouch Wellness measures your body's metabolic response through your fingertip — different measurement, different purpose.",
                },
                {
                  q: "Do I need an Agatsa One subscription?",
                  a: "Basic readings and your Nera Score are free. Advanced food impact insights require an Agatsa One subscription (₹149/month).",
                },
                {
                  q: "How long before I see results?",
                  a: "Most users see meaningful patterns within 7–14 days of 2–3 readings per day.",
                },
                {
                  q: "What's your return policy?",
                  a: "30-day no-questions-asked return.",
                },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4">
                  <AccordionTrigger className="text-left text-foreground font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ SECTION 11 — FINAL CTA ═══ */}
      <section className="py-20 bg-gradient-to-b from-teal-50/60 to-background">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your metabolism has a story.{" "}
              <span className="text-teal-600">Start reading it.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              EasyTouch Wellness — {wp}. Free shipping. 30-day returns.
            </p>
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-10 text-base shadow-lg shadow-teal-200" onClick={handleBuyNow}>
                Buy EasyTouch Wellness — {wp} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-muted-foreground text-sm mt-6">
              Questions?{" "}
              <a
                href="https://wa.me/918826283840?text=Hi,%20I%20want%20to%20know%20more%20about%20EasyTouch%20Wellness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 underline hover:text-teal-700"
              >
                WhatsApp us at +91 88262 83840
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Legal footer line */}
      <div className="bg-muted/30 py-4 border-t border-border">
        <div className="container">
          <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
            EasyTouch Wellness is a wellness device, not a medical device. Not intended to diagnose, treat, cure, or prevent any disease.
            Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </Layout>
  );
}
