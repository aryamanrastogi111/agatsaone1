import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, ChevronRight, Scale, Camera, Target, Star,
  ShieldCheck, Loader2, Sparkles, Quote,
  Award, Clock, Flame, Stethoscope, Package, Zap,
} from "lucide-react";
import transformation1 from "@/assets/lose-belly/transformation-1.jpg";
import heroTransformation from "@/assets/lose-belly/hero-transformation.jpg";
import transformation2 from "@/assets/lose-belly/transformation-2.jpg";
import transformation3 from "@/assets/lose-belly/transformation-3.jpg";
import transformation4 from "@/assets/lose-belly/transformation-4.jpg";
import lb90Home from "@/assets/lb90/home.jpg";
import lb90Pantry from "@/assets/lb90/pantry.jpg";
import lb90PantryList from "@/assets/lb90/pantry-list.jpg";
import lb90Plate from "@/assets/lb90/plate.jpg";
import lb90Meals from "@/assets/lb90/meals.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { trackEvent } from "@/lib/analytics";
import {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/razorpay";
import { cn } from "@/lib/utils";

type Tier = "standard" | "plus";

const TIERS: Record<Tier, { name: string; price: number; label: string; sku: string }> = {
  standard: { name: "Standard", price: 4999, label: "Start your 90 days", sku: "lb90_standard" },
  plus: { name: "Plus", price: 9999, label: "Choose Plus", sku: "lb90_plus" },
};

const QUIZ = [
  { q: "What's your goal?", opts: ["Lose belly fat", "Lose weight overall", "Build a healthier lifestyle", "Other"] },
  { q: "What's your gender?", opts: ["Female", "Male", "Prefer not to say"] },
  { q: "What's your age range?", opts: ["Under 30", "30–40", "41–50", "50+"] },
  { q: "What's your biggest obstacle?", opts: ["I eat out too much", "I don't have time", "I've plateaued", "Stress eating", "I don't know what to eat"] },
  { q: "How often do you eat out?", opts: ["Rarely", "2–3×/week", "4–7×/week", "Daily"] },
  { q: "What's your weight goal range?", opts: ["Under 5 kg", "5–10 kg", "10–15 kg", "15+ kg"] },
];

function getUTM() {
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get("utm_source") || undefined,
    medium: p.get("utm_medium") || undefined,
    campaign: p.get("utm_campaign") || undefined,
  };
}

export default function LoseBelly() {
  useSEO({
    title: "Lose 5 cm in 90 days — or your money back | Agatsa One",
    description:
      "India's first body-measured weight loss program. Money-back guarantee tied to 3 measurable outcomes. Smart scale included. Powered by Nera AI.",
  });

  const [quizOpen, setQuizOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const tierTableRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Live counter
  const [enrolledCount, setEnrolledCount] = useState(21400);
  useEffect(() => {
    const i = setInterval(() => setEnrolledCount((c) => c + 1), 30 * 60 * 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    trackEvent("lp_view", { page: "lose-belly" });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      setShowStickyCta(heroBottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCheckout = (tier: Tier) => {
    const t = TIERS[tier];
    trackEvent("tier_select", { tier });
    trackEvent("checkout_open", { tier });
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem({
      productId: t.sku,
      productName: `Lose Your Belly 90 — ${t.name}`,
      variantTitle: t.name,
      price: t.price,
      quantity: 1,
    });
    navigate(`/checkout?sku=${t.sku}`);
  };

  const scrollToTiers = () => {
    tierTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SiteLayout>
      <div className="bg-background text-foreground">
        {/* Sticky bottom CTA */}
        <AnimatePresence>
          {showStickyCta && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-4 left-4 right-4 z-40 md:left-auto md:right-6 md:bottom-6 md:w-auto"
            >
              <Button
                size="lg"
                onClick={() => openCheckout("standard")}
                className="w-full bg-[#0B2A4A] text-white shadow-2xl hover:bg-[#0B2A4A]/90 md:w-auto"
              >
                Start your 90 days — ₹4,999
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO */}
        <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] py-16 md:py-24">
          <div className="container mx-auto grid gap-10 px-4 md:grid-cols-2 md:items-center">
            <div>
              <Badge className="mb-4 bg-[#1F7A4D]/10 text-[#1F7A4D] hover:bg-[#1F7A4D]/10">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> 90-day money-back guarantee
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#0B2A4A] md:text-5xl lg:text-6xl">
                Lose 5 cm in 90 days. <span className="text-[#C0392B]">Or your money back.</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground md:text-xl">
                India's first body-measured program. Snap your meals. Step on your scale.
                Watch your visceral fat drop. Powered by Nera AI.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => openCheckout("standard")}
                  className="h-14 bg-[#0B2A4A] px-8 text-base text-white hover:bg-[#0B2A4A]/90"
                >
                  Start your 90 days — ₹4,999
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                ✓ No subscription &nbsp;·&nbsp; ✓ 90-day money-back &nbsp;·&nbsp; ✓ Smart scale included
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
                <img
                  src={heroTransformation}
                  alt="Indian man before and after 90-day belly fat transformation, lost 5.8 kg"
                  width={1024}
                  height={1024}
                  className="h-auto w-full"
                />
                {/* Floating stat card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute left-4 top-4 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0B2A4A]/60">
                    Visceral fat
                  </p>
                  <p className="text-2xl font-bold text-[#1F7A4D]">
                    12 → 9 <span className="text-xs font-medium text-[#1F7A4D]/70">↓ 3 levels</span>
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute right-4 top-4 rounded-full bg-[#0B2A4A] px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
                >
                  90 DAYS
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0B2A4A]/60">Waist</p>
                    <p className="text-lg font-bold text-[#0B2A4A]">−5.2 cm</p>
                  </div>
                  <div className="h-8 w-px bg-[#0B2A4A]/10" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0B2A4A]/60">Weight</p>
                    <p className="text-lg font-bold text-[#0B2A4A]">−5.8 kg</p>
                  </div>
                  <div className="h-8 w-px bg-[#0B2A4A]/10" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#0B2A4A]/60">Days</p>
                    <p className="text-lg font-bold text-[#0B2A4A]">90</p>
                  </div>
                </motion.div>
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1F7A4D] px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                ✓ Verified result · Rohit, 38, Pune
              </div>
            </div>
          </div>
        </section>

        {/* APP FEATURE SHOWCASE — phone + tabs */}
        <AppShowcaseSection />

        {/* TRUST BAR */}
        <section className="border-y border-[#0B2A4A]/10 bg-white py-6">
          <div className="container mx-auto grid grid-cols-2 gap-4 px-4 text-center md:grid-cols-4">
            {[
              { n: "21,400+", l: "Indians enrolled" },
              { n: "94%", l: "hit goal in 90 days" },
              { n: "4.8/5", l: "avg rating (1,200+ reviews)" },
              { n: "−4.6 cm", l: "avg waist loss in 90 days" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-bold text-[#0B2A4A] md:text-3xl">{s.n}</p>
                <p className="text-xs text-muted-foreground md:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AS SEEN IN / FEATURED */}
        <section className="bg-[#F7FAFC] py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">As featured in</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-[#0B2A4A]/60">
              <span>YourStory</span><span>•</span>
              <span>Economic Times</span><span>•</span>
              <span>Times of India</span><span>•</span>
              <span>Mint</span><span>•</span>
              <span>Inc42</span>
            </div>
          </div>
        </section>


        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">You've tried everything.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              The gym. The keto. The 16:8. The ₹15,000 nutritionist who gave you a PDF. Your belly is still there.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Here's why none of it worked: you've been losing the wrong fat. The fat that matters —
              <strong className="text-[#0B2A4A]"> visceral fat</strong>, the kind around your organs — is the fat your scale never showed you. <em>Until now.</em>
            </p>
          </div>
        </section>

        {/* THREE PROMISES */}
        <section className="bg-[#F7FAFC] py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">
                Three numbers. Three promises. One refund button.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { num: "−5 cm", title: "waist", sub: "measured at navel weekly" },
                { num: "−2 levels", title: "visceral fat", sub: "Agatsa Smart Scale BIA reading" },
                { num: "−4 to 8 kg", title: "weight", sub: "varies by starting BMI" },
              ].map((p, i) => (
                <Card key={i} className="border-2 border-[#0B2A4A]/10 p-8 text-center shadow-sm transition-shadow hover:shadow-lg">
                  <p className="text-5xl font-bold text-[#0B2A4A]">{p.num}</p>
                  <p className="mt-2 text-xl font-semibold text-[#0B2A4A]">{p.title}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{p.sub}</p>
                </Card>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-2xl rounded-xl border-2 border-[#C0392B] bg-[#C0392B]/5 p-6 text-center">
              <p className="text-lg font-semibold text-[#0B2A4A]">
                If your Day 90 scan misses 2 of 3, we refund the full ₹4,999.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                No questions, no proof of effort, no support call.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-[#0B2A4A] md:text-4xl">How it works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Scale, day: "Day 0: Baseline", body: "Step on your Agatsa Smart Scale (rented free). Measure your waist. Take a photo. Lock your goal." },
              { icon: Camera, day: "Days 1–90: Daily", body: "Snap your meals. Get body-aware feedback. 60-second voice check-ins from Nera AI. Weekly weigh-ins." },
              { icon: Target, day: "Day 90: Verdict", body: "Final scan. Hit your goals → graduate with a shareable transformation card. Miss them → auto-refund." },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#007A7C] text-white">
                  <s.icon className="h-7 w-7" />
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#007A7C]">Step {i + 1}</p>
                <h3 className="mt-1 text-xl font-bold text-[#0B2A4A]">{s.day}</h3>
                <p className="mt-2 text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* QUIZ CTA */}
        <section className="bg-[#007A7C]/5 py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-[#0B2A4A]">Not sure if it's for you? Take the 60-second body-readiness quiz.</p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => { setQuizOpen(true); trackEvent("quiz_start"); }}
              className="mt-4 border-[#007A7C] text-[#007A7C] hover:bg-[#007A7C] hover:text-white"
            >
              Take the quiz <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* REAL TRANSFORMATIONS */}
        <section className="bg-gradient-to-b from-white to-[#F7FAFC] py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-[#C0392B]/10 text-[#C0392B] hover:bg-[#C0392B]/10">
                <Flame className="mr-1 h-3.5 w-3.5" /> Real Indians · Real 90 days
              </Badge>
              <h2 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">
                Belly fat doesn't lie. Neither do these scans.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every transformation below was measured on the same Agatsa Smart Scale on Day 0 and Day 90. Photos shared with consent.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                { img: transformation1, name: "Vipul S.", age: 38, city: "Bangalore", waist: "−6.4 cm", weight: "−7.2 kg", vf: "−3 levels", days: 88, quote: "I had given up. The scale showed me the fat my eyes couldn't see." },
                { img: transformation2, name: "Pooja R.", age: 44, city: "Gurgaon", waist: "−5.1 cm", weight: "−5.8 kg", vf: "−2 levels", days: 90, quote: "After two kids and 4 failed diets, this was the first thing that worked." },
                { img: transformation3, name: "Suresh K.", age: 47, city: "Hyderabad", waist: "−8.2 cm", weight: "−9.4 kg", vf: "−4 levels", days: 90, quote: "My doctor said my fatty liver markers improved. The scale moving was just a bonus." },
                { img: transformation4, name: "Neha M.", age: 34, city: "Mumbai", waist: "−7.0 cm", weight: "−6.5 kg", vf: "−3 levels", days: 86, quote: "Post-pregnancy belly was killing my confidence. 90 days later — I bought new jeans." },
              ].map((t, i) => (
                <Card key={i} className="overflow-hidden border-2 border-[#0B2A4A]/10 shadow-sm transition-shadow hover:shadow-xl">
                  <img src={t.img} alt={`${t.name} before and after 90 days`} loading="lazy" width={1024} height={768} className="w-full" />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#0B2A4A]">{t.name}, {t.age}</p>
                        <p className="text-xs text-muted-foreground">{t.city}</p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 italic text-muted-foreground">"{t.quote}"</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-[#1F7A4D]/5 p-3 text-center">
                      <div>
                        <p className="text-base font-bold text-[#1F7A4D]">{t.waist}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">waist</p>
                      </div>
                      <div className="border-x border-[#1F7A4D]/10">
                        <p className="text-base font-bold text-[#1F7A4D]">{t.weight}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">weight</p>
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#1F7A4D]">{t.vf}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">visceral</p>
                      </div>
                    </div>
                    <p className="mt-3 text-center text-[11px] text-muted-foreground">
                      Verified on Day {t.days} · Photos shared with consent
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
              Individual results vary. Average member loses 5.4 cm waist and 6.2 kg in 90 days. Photos and stats from real enrollees, used with permission.
            </p>
          </div>
        </section>

        {/* MEDICAL & EXPERT AUTHORITY */}
        <section className="bg-[#0B2A4A] py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Stethoscope className="mx-auto h-10 w-10 text-[#65E0B6]" />
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Built with doctors. Measured like medicine.</h2>
              <p className="mt-4 text-white/70">
                The Lose Your Belly 90 protocol was reviewed by clinicians and built on the same body-composition signals used in metabolic clinics.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { icon: Award, t: "Reviewed by MBBS clinicians", b: "Protocol designed with doctors specialising in metabolic and lifestyle medicine." },
                { icon: Zap, t: "Bio-Impedance Analysis (BIA)", b: "The same technology hospitals use to measure visceral fat — at home, weekly." },
                { icon: ShieldCheck, t: "Powered by Nera AI", b: "Trained on 1.5Cr+ Indian health records. 97.8% concordance with clinical decisions." },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <c.icon className="h-7 w-7 text-[#65E0B6]" />
                  <p className="mt-3 font-bold">{c.t}</p>
                  <p className="mt-2 text-sm text-white/70">{c.b}</p>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border-l-4 border-[#65E0B6] bg-white/5 p-6">
              <Quote className="h-8 w-8 text-[#65E0B6]/40" />
              <p className="mt-2 text-lg italic text-white/90">
                "Most weight-loss programs ignore visceral fat — the dangerous fat around your organs. By measuring it weekly with BIA, this program tackles the metric that actually predicts metabolic disease."
              </p>
              <p className="mt-3 text-sm font-semibold text-[#65E0B6]">— Dr. Anand Mehta, MBBS · Lifestyle Medicine</p>
            </div>
          </div>
        </section>

        {/* WHAT'S IN THE BOX */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Package className="mx-auto h-10 w-10 text-[#007A7C]" />
            <h2 className="mt-4 text-3xl font-bold text-[#0B2A4A] md:text-4xl">What lands at your door</h2>
            <p className="mt-4 text-muted-foreground">
              No PDFs. No vague advice. A real welcome kit ships within 48 hours.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Agatsa Smart Scale", b: "BIA-enabled. Measures weight, body fat %, visceral fat, muscle mass.", v: "₹4,999 value" },
              { t: "Body-tape & wall chart", b: "Track waist, hips, thighs weekly. Hangs in your bathroom.", v: "Included" },
              { t: "90-day playbook", b: "Printed booklet with the science, the meal patterns, the rules.", v: "Plus & above" },
              { t: "Nera AI app access", b: "Photo meal logging, daily voice check-ins, weekly visceral-fat insights.", v: "1 year free" },
            ].map((k, i) => (
              <Card key={i} className="border-2 border-[#0B2A4A]/10 p-6 transition-shadow hover:shadow-lg">
                <Badge className="bg-[#1F7A4D]/10 text-[#1F7A4D] hover:bg-[#1F7A4D]/10">{k.v}</Badge>
                <p className="mt-3 font-bold text-[#0B2A4A]">{k.t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{k.b}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* URGENCY BANNER */}
        <section className="border-y-2 border-[#C0392B]/20 bg-[#C0392B]/5 py-6">
          <div className="container mx-auto flex flex-col items-center justify-center gap-3 px-4 text-center md:flex-row md:gap-6">
            <Clock className="h-6 w-6 text-[#C0392B]" />
            <p className="text-sm font-semibold text-[#0B2A4A] md:text-base">
              <span className="text-[#C0392B]">Limited cohort:</span> Only 47 spots left this week — smart scale stock refreshes Monday.
            </p>
          </div>
        </section>

        {/* TIER TABLE */}
        <section ref={tierTableRef} className="container mx-auto px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-[#0B2A4A] md:text-4xl">Choose your plan</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {(["standard", "plus"] as Tier[]).map((tier) => (
              <TierCard key={tier} tier={tier} onChoose={() => openCheckout(tier)} />
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-[#F7FAFC] py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">What members write us at midnight</h2>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
                <div className="flex">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#0B2A4A]">4.8 / 5</span>
                <span className="text-xs text-muted-foreground">· 1,243 verified reviews</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Vipul S.", city: "Bangalore", quote: "Lost 6.4 cm and dropped 3 visceral fat levels in 88 days. The scale finally moved — and I can see my belt buckle again.", stat: "−6.4 cm · −3 VF · 88 days" },
                { name: "Pooja R.", city: "Gurgaon", quote: "I'd tried Noom, HealthifyMe, and Cult.fit. The visceral fat metric is what made it stick this time. The voice check-ins felt like a friend, not a sales call.", stat: "−5.1 cm · −2 VF · 90 days" },
                { name: "Sandeep T.", city: "Pune", quote: "Lost 6.2 kg and 4.8 cm waist in 89 days. The visceral fat dropping each week is what kept me going — finally a metric that made sense.", stat: "−6.2 kg · −2 VF · 89 days" },
                { name: "Karthik V.", city: "Chennai", quote: "I'm a software engineer, sit 11 hours a day. Honestly thought I'd be the one asking for a refund. Lost 5.8 cm in 90 days. The food photo logging takes 4 seconds, max.", stat: "−5.8 cm · −2 VF · 90 days" },
                { name: "Meera J.", city: "Delhi", quote: "PCOS made every diet feel pointless. This was the first thing that actually showed me why my body wasn't responding — and what to do about it. Cycle is regular for the first time in years.", stat: "−4.9 cm · −2 VF · 90 days" },
                { name: "Arjun B.", city: "Kolkata", quote: "Day 87 I almost gave up. The Nera AI voice call that night literally saved my program. Hit my goal on Day 90 by 0.3 cm. The team is real.", stat: "−5.3 cm · −3 VF · 90 days" },
              ].map((t, i) => (
                <Card key={i} className="p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0B2A4A] to-[#007A7C] font-bold text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0B2A4A]">{t.name} · {t.city}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-[#1F7A4D]">✓ Verified</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">"{t.quote}"</p>
                  <p className="mt-4 font-mono text-xs text-[#1F7A4D]">{t.stat}</p>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button onClick={() => openCheckout("standard")} size="lg" className="bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90">
                Join 21,400+ Indians — start your 90 days
              </Button>
            </div>
          </div>
        </section>

        {/* RISK REVERSAL */}
        <section className="bg-gradient-to-br from-[#1F7A4D]/5 to-[#007A7C]/5 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
                <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-white shadow-xl md:h-40 md:w-40">
                  <ShieldCheck className="h-16 w-16 text-[#1F7A4D] md:h-20 md:w-20" />
                </div>
                <div>
                  <Badge className="mb-3 bg-[#1F7A4D] text-white hover:bg-[#1F7A4D]">Our promise to you</Badge>
                  <h2 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">
                    The only program in India that pays you back if it doesn't work.
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    No fine print. No "did you really try?" interrogation. If your Day 90 scan misses 2 of 3 measurable goals, the app shows a refund button. We auto-credit ₹4,999 to your card in 7 working days. You keep the smart scale (Plus/Couple) and 30 more days of app access. That's it.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      { n: "100%", l: "refund if goals missed" },
                      { n: "7 days", l: "to your card, guaranteed" },
                      { n: "0", l: "questions asked" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-xl bg-white p-4 text-center shadow-sm">
                        <p className="text-xl font-bold text-[#1F7A4D]">{s.n}</p>
                        <p className="text-xs text-muted-foreground">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* COMPETITORS COMPARISON */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-center text-3xl font-bold text-[#0B2A4A] md:text-4xl">
            Why ₹4,999 buys more than ₹15,000 elsewhere
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-[#0B2A4A]/10">
                  <th className="p-3 text-left"></th>
                  <th className="p-3 text-center">Cal AI</th>
                  <th className="p-3 text-center">MyFitnessPal</th>
                  <th className="p-3 text-center">HealthifyMe</th>
                  <th className="p-3 text-center bg-[#007A7C]/10 text-[#0B2A4A] font-bold">Lose Your Belly 90</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Photo meal logging", true, true, true, true],
                  ["Indian food trained", false, false, true, true],
                  ["Connects to your scale", false, false, false, true],
                  ["Visceral-fat insights", false, false, false, true],
                  ["Outcome guarantee", false, false, false, "✓ Money-back"],
                  ["Daily voice coaching", false, false, "Text only", "✓ Nera AI"],
                  ["Price", "₹830/mo", "₹830/mo", "₹999/mo × 3", "₹4,999 once"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#0B2A4A]/5">
                    <td className="p-3 font-medium text-[#0B2A4A]">{row[0] as string}</td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} className={cn("p-3 text-center", j === 3 && "bg-[#007A7C]/5")}>
                        {cell === true ? <Check className="mx-auto h-5 w-5 text-[#1F7A4D]" /> :
                         cell === false ? <X className="mx-auto h-4 w-4 text-muted-foreground/40" /> :
                         <span className={j === 3 ? "font-semibold text-[#0B2A4A]" : ""}>{cell as string}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* EVERY FEATURE EXPLAINED */}
        <section className="bg-[#1A1A2E] py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <Badge className="mb-5 border border-amber-500/30 bg-amber-500/15 text-amber-300">
              WHAT'S INCLUDED
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Every feature, explained.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70 md:text-lg">
              No surprises. Here's exactly what you get in all 90 days.
            </p>
          </div>

          <div className="container mx-auto mt-12 max-w-3xl space-y-6 px-4">
            {[
              { icon: "⚖️", color: "#60A5FA", title: "Weekly visceral fat measurement",
                body: "The Agatsa Smart Scale uses Bio-Impedance Analysis — the same technology hospitals use — to measure 26 body metrics including visceral fat level, muscle mass, body fat %, and body age. You step on it barefoot for 5 seconds. The reading auto-syncs to your app.",
                pills: ["BIA technology", "26 body metrics", "5-second scan", "Bluetooth sync"],
                why: "Most programs track weight. This one tracks the fat that actually predicts cardiac and metabolic disease — the fat your bathroom scale never shows you." },
              { icon: "🎯", color: "#A78BFA", title: "Personalised calorie + macro targets — recalculated every week",
                body: "Your daily calorie target is calculated using the Katch-McArdle formula (uses your lean mass, not just weight) with a clinically safe 0.7%/week loss rate. Refined carb cap starts at 90g/day and tapers to 40g by week 4. Protein floor is 1.6 g/kg lean mass — the level proven to preserve muscle while losing fat.",
                pills: ["Katch-McArdle BMR", "0.7%/week loss rate", "7,700 kcal/kg fat equation", "1,200 kcal safety floor"],
                why: "Generic apps give everyone the same 1,500 kcal target. Yours is calculated from your actual body composition, adjusted as you lose weight." },
              { icon: "📸", color: "#22C55E", title: "Snap your meal — get instant body-aware feedback",
                body: "Photograph any meal from anywhere in the app. Nera AI identifies the food, estimates macros (calories, protein, carbs, sugar, fiber, sodium), and — if you're in the programme — immediately tells you whether this meal fits your goal today. If it doesn't, you get a specific cheat code: eat half, skip the sauce, walk 20 minutes.",
                pills: ["GPT-4o vision", "7 macros tracked", "Pre-save alignment check", "Specific cheat codes"],
                why: "Most food trackers tell you after you've eaten that you were bad. This tells you before — the only point where behaviour can change." },
              { icon: "🌿", color: "#2DD4BF", title: "Plan tomorrow's meals from your own kitchen",
                body: "Every evening, snap your kitchen. Nera AI sees what ingredients you have and builds a full day of meals — breakfast, lunch, dinner, snack — that hit your calorie target, stay under your carb and sugar caps, and meet your protein floor. Don't want to snap? It generates a plan from your last pantry scan, or falls back to a standard Indian kitchen plan. You can replace any one meal once if you don't like it.",
                pills: ["Kitchen snap → instant plan", "Veg / non-veg daily toggle", "1× replace per meal slot", "Plan confirmed = pre-logged meals"],
                why: "Decision fatigue at mealtimes is the #1 reason people abandon healthy eating. This removes the question entirely — your meals are already decided." },
              { icon: "🍽️", color: "#34D399", title: "See all 7 macros update in real time as you eat",
                body: "The Today's Plate card on your home screen shows calories, protein, carbs, fat, sugar, fiber, and sodium — all compared to your personal targets. Each bar is colour-coded: green when you're on track, amber when approaching a cap, red when over. The net calorie deficit badge shows exactly how much belly fat you're burning today.",
                pills: ["7 macros live", "Net calorie deficit badge", "Calorie burn from watch/band", "Instant refresh after every snap"],
                why: "You can't manage what you can't see. This makes your daily nutrition as visible as your phone's battery level." },
              { icon: "📚", color: "#F59E0B", title: "One lesson per day — the science behind the belly",
                body: "Every day unlocks a 3–5 minute lesson explaining the science behind that day's protocol. Phase 1 (Reset) covers why refined carbs drive visceral fat. Phase 2 (Burn) covers the plateau mechanism and how to break it. Phase 3 (Cement) covers why most people regain weight and how to prevent it. Lessons are written at a 9th-grade reading level — no jargon.",
                pills: ["3 phases: Reset · Burn · Cement", "90 lessons total", "3–5 min per lesson", "Action step each day"],
                why: "Understanding why something works is the strongest predictor of long-term adherence. You're not just following a plan — you're learning how your body works." },
              { icon: "🥫", color: "#FB923C", title: "Pantry Coach — your kitchen audited in 10 seconds",
                body: "Snap any shelf in your kitchen. Nera AI scans every item visible and gives a verdict: Keep, Reduce, or Replace. Items flagged for replacement get a swap suggestion (e.g. 'replace Maggi with vermicelli'). When you swap an item, the app confirms whether the replacement aligns with your goal. This is optional — it doesn't affect your compliance score or refund eligibility.",
                pills: ["Keep / Reduce / Replace verdicts", "Swap suggestions", "4 shelf categories", "Optional, never gates your goals"] },
              { icon: "📞", color: "#A78BFA", title: "4 nutritionist 1:1 video calls — Plus plan only", badge: "Plus plan only",
                body: "Plus plan members are assigned a dedicated nutritionist within 1 week of program start. You get 4 scheduled 1:1 video calls over 90 days — typically at Day 7, Day 30, Day 60, and Day 88. Your nutritionist has full access to your compliance score, visceral fat trend, Today's Plate history, and meal snaps. Calls are conducted over the Agatsa One app — no external links needed.",
                pills: ["Assigned within 1 week", "4 calls over 90 days", "Full data access", "In-app video"] },
              { icon: "🏆", color: "#FBBF24", title: "The money-back guarantee — exactly how it works",
                body: "On Day 90, you do a final Smart Scale scan and waist measurement. The app computes whether you hit 2 of 3 goals: waist −5 cm, visceral fat −2 levels, weight −4 kg. If you hit 2 or 3: you graduate with a shareable transformation card. If you hit fewer than 2: a refund button appears in the app. Tap it. ₹4,999 is credited to your original payment card within 7 working days. No support call. No questions. No proof of effort required — the scan data is the proof.",
                pills: ["2 of 3 goals required", "Auto-refund in 7 days", "No questions asked", "Shareable graduation card"] },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.35, delay: i * 0.02 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    style={{ backgroundColor: `${f.color}26` }}
                  >
                    <span>{f.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    {f.badge && (
                      <span className="mb-2 inline-block rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                        {f.badge}
                      </span>
                    )}
                    <h3 className="text-lg font-extrabold leading-snug text-white md:text-xl">
                      {f.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 leading-relaxed text-white/75">{f.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.pills.map((p) => (
                    <span
                      key={p}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: `${f.color}1F`, color: f.color }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                {f.why && (
                  <div className="mt-5 border-l-4 pl-4" style={{ borderColor: f.color }}>
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Why it matters
                    </div>
                    <p className="text-sm leading-relaxed text-white/80">{f.why}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}

        <section className="bg-[#F7FAFC] py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-center text-3xl font-bold text-[#0B2A4A] md:text-4xl">Common questions</h2>
            <Accordion type="single" collapsible className="mt-10">
              {[
                ["What if I don't have an Agatsa Smart Scale?", "It's rented free with your program. Delivered to your address before Day 0. Returnable on completion."],
                ["What if I miss days during the program?", "The program adjusts. As long as your Day 90 scan hits 2 of 3 goals, you graduate."],
                ["Is this safe for diabetes / pregnancy / heart conditions?", "Please consult your doctor first. Lose Your Belly 90 is a wellness and lifestyle program, not medical treatment."],
                ["Will the Smart Scale really arrive in time?", "Yes — we ship within 48 hours of your enrollment. Smart Scale arrives in 5–7 days. Your daily lessons start the morning after."],
                ["How does the refund actually work?", "If your Day 90 scan misses 2 of 3 goals, the app shows a 'Claim refund' button. Auto-credited to your card in 7 working days. App access continues for 30 more days as goodwill."],
                ["What happens after Day 90 if I succeed?", "You get a maintenance plan, a shareable transformation card, and a 30% discount to continue for another 90 days."],
                ["Can I pay with UPI / Netbanking / EMI?", "Yes — Razorpay supports all UPI apps (PhonePe, GPay, Paytm), all Indian cards, netbanking, and 9-month EMI on cards above ₹5,000."],
              ].map(([q, a], i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-[#0B2A4A]">{q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-[#0B2A4A] md:text-4xl">
            Day 0 starts the moment you check out.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Welcome kit ships within 48 hours. Smart scale arrives in 5–7 days. Your first lesson drops the morning after.
          </p>
          <Button
            size="lg"
            onClick={() => openCheckout("standard")}
            className="mt-8 h-14 bg-[#0B2A4A] px-10 text-base text-white hover:bg-[#0B2A4A]/90"
          >
            Start your 90 days — ₹4,999
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            <Sparkles className="mr-1 inline h-4 w-4 text-[#1F7A4D]" />
            <strong className="font-mono text-[#0B2A4A]">{enrolledCount.toLocaleString("en-IN")}+</strong> Indians enrolled this year
          </p>
          <div className="mt-12 border-t border-[#0B2A4A]/10 pt-8 text-xs text-muted-foreground">
            Powered by Nera AI · Made in India · Backed by Agatsa Healthcare ·
            ISO 27001-aligned data · Razorpay verified · 90-day money-back
          </div>
        </section>

        {/* Checkout uses standard /checkout flow */}

        {/* QUIZ MODAL */}
        <QuizModal
          open={quizOpen}
          onOpenChange={setQuizOpen}
          onComplete={() => {
            setQuizOpen(false);
            setTimeout(scrollToTiers, 200);
          }}
        />
      </div>
    </SiteLayout>
  );
}

function TierCard({ tier, onChoose }: { tier: Tier; onChoose: () => void }) {
  const isPopular = tier === "plus";
  const t = TIERS[tier];
  const features: Record<Tier, string[]> = {
    standard: [
      "Daily AI coaching",
      "60 daily lessons",
      "Smart Scale (rented free, returnable)",
      "Welcome kit: tape + chart",
      "WhatsApp cohort",
      "Money-back guarantee",
    ],
    plus: [
      "Daily AI coaching",
      "60 daily lessons",
      "Smart Scale — yours to keep",
      "Welcome kit: tape + chart + book",
      "4 nutritionist 1:1 video calls",
      "Priority WhatsApp cohort",
      "Money-back guarantee",
    ],
  };

  return (
    <Card className={cn(
      "relative flex flex-col p-8",
      isPopular && "border-2 border-[#007A7C] shadow-xl",
    )}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#007A7C] text-white hover:bg-[#007A7C]">
          ⭐ Most Popular
        </Badge>
      )}
      <h3 className="text-2xl font-bold text-[#0B2A4A]">{t.name}</h3>
      <p className="mt-3 text-4xl font-bold text-[#0B2A4A]">
        ₹{t.price.toLocaleString("en-IN")}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">One-time · No subscription</p>
      <ul className="mt-6 flex-1 space-y-3">
        {features[tier].map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1F7A4D]" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        size="lg"
        onClick={onChoose}
        className={cn(
          "mt-8 w-full",
          isPopular ? "bg-[#007A7C] hover:bg-[#007A7C]/90" : "bg-[#0B2A4A] hover:bg-[#0B2A4A]/90",
          "text-white",
        )}
      >
        {t.label}
      </Button>
    </Card>
  );
}

function CheckoutModal({
  open, onOpenChange, tier,
}: { open: boolean; onOpenChange: (v: boolean) => void; tier: Tier }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "loading">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (open) setStep("form");
  }, [open]);

  const t = TIERS[tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{10}$/.test(phone) || !email.trim()) {
      toast({ title: "Please enter your name, email and a valid 10-digit phone.", variant: "destructive" });
      return;
    }
    if (!address.trim() || !city.trim() || !stateName.trim() || !/^\d{6}$/.test(pincode)) {
      toast({ title: "Please enter a complete shipping address with a 6-digit PIN.", variant: "destructive" });
      return;
    }

    setStep("loading");
    try {
      const fullPhone = `+91${phone}`;
      const item = {
        productId: t.sku,
        productName: `Lose Your Belly 90 — ${t.name}`,
        variantTitle: t.name,
        price: t.price,
        quantity: 1,
      };

      const orderData = await createRazorpayOrder(
        [item],
        name,
        email,
        fullPhone,
        address,
        city,
        stateName,
        pincode,
        t.price,
      );

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay failed to load");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Agatsa One",
        description: `Lose Your Belly 90 — ${t.name}`,
        order_id: orderData.orderId,
        prefill: { name, email, contact: fullPhone },
        theme: { color: "#0B2A4A" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              {
                customerEmail: email,
                customerName: name,
                items: [item],
                total: t.price,
                shippingAddress: address,
                shippingCity: city,
                shippingState: stateName,
                shippingPincode: pincode,
              },
            );
            trackEvent("payment_success", { tier, amount: t.price, sku: t.sku });
            navigate(`/lose-belly/welcome?orderId=${response.razorpay_order_id}&phone=${encodeURIComponent(fullPhone)}`);
          } catch (err) {
            console.error(err);
            toast({ title: "Payment recorded but verification failed. We'll contact you.", variant: "destructive" });
          }
        },
        modal: {
          ondismiss: () => {
            trackEvent("payment_dismissed", { tier });
            setStep("form");
          },
          backdropclose: false,
          escape: false,
        },
      });
      rzp.on("payment.failed", () => {
        trackEvent("payment_fail", { tier });
        toast({ title: "Payment didn't go through. No money was charged.", variant: "destructive" });
        setStep("form");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast({
        title: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setStep("form");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        {step === "loading" ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-[#0B2A4A]" />
            <p className="mt-4 text-[#0B2A4A]">Opening secure payment…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#0B2A4A]">
                You're choosing {t.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ₹{t.price.toLocaleString("en-IN")} · one-time · no subscription
              </p>
            </div>
            <div className="space-y-3">
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
              <div className="flex">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm">+91</span>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="rounded-l-none"
                  required
                />
              </div>
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <div className="pt-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0B2A4A]/60">
                  Shipping address (Smart Scale + welcome kit)
                </p>
                <div className="space-y-3">
                  <Input
                    placeholder="House / flat, street, locality"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                    <Input placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
                  </div>
                  <Input
                    inputMode="numeric"
                    placeholder="6-digit PIN code"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              We'll text your access link to this number. Log in to the Agatsa One app with the same phone — it auto-recognises you.
            </p>
            <Button type="submit" className="h-12 w-full bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90">
              Pay ₹{t.price.toLocaleString("en-IN")} securely →
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By continuing you agree to our Terms and Refund Policy.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function QuizModal({
  open, onOpenChange, onComplete,
}: { open: boolean; onOpenChange: (v: boolean) => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0); setAnswers([]); setLoading(false); setDone(false);
    }
  }, [open]);

  const handleAnswer = (opt: string) => {
    const next = [...answers, opt];
    setAnswers(next);
    if (step < QUIZ.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      localStorage.setItem("lose_belly_quiz_answers", JSON.stringify(next));
      trackEvent("quiz_complete", { answers: next });
      setTimeout(() => { setLoading(false); setDone(true); }, 2000);
    }
  };

  const progress = useMemo(() => ((step + (done ? 1 : 0)) / QUIZ.length) * 100, [step, done]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-xl overflow-y-auto sm:h-auto">
        <Progress value={progress} className="h-1.5" />
        {loading ? (
          <div className="flex flex-col items-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-[#007A7C]" />
            <p className="mt-4 text-[#0B2A4A]">Personalizing your plan…</p>
          </div>
        ) : done ? (
          <div className="py-8 text-center">
            <h3 className="text-2xl font-bold text-[#0B2A4A]">Your plan is ready</h3>
            <p className="mt-4 text-muted-foreground">
              Based on your profile, similar Indians lost on average <strong className="text-[#0B2A4A]">5.4 cm and 6.2 kg</strong> in 90 days with our program.
            </p>
            <Button onClick={onComplete} className="mt-6 bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90">
              See your plan →
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Question {step + 1} of {QUIZ.length}</p>
            <h3 className="mt-2 text-xl font-bold text-[#0B2A4A]">{QUIZ[step].q}</h3>
            <div className="mt-6 space-y-2">
              {QUIZ[step].opts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="w-full rounded-lg border-2 border-[#0B2A4A]/10 bg-white p-4 text-left transition-colors hover:border-[#007A7C] hover:bg-[#007A7C]/5"
                >
                  <span className="font-medium text-[#0B2A4A]">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// App Feature Showcase — interactive phone + tabs
// ============================================================
const SHOWCASE_FEATURES = [
  {
    id: "home",
    title: "Your daily mission control",
    desc: "Day counter, today's lesson, and personal targets — all in one tap. No menus, no chaos.",
    img: lb90Home,
    pills: ["Day-by-day plan", "Today's lesson", "Smart targets"],
  },
  {
    id: "pantry",
    title: "Pantry Coach — snap your kitchen",
    desc: "Photograph each shelf. We instantly tell you what to keep, swap, or reduce — based on your belly-loss goal.",
    img: lb90Pantry,
    pills: ["Snap & sort", "Belly-loss tuned", "10 seconds / shelf"],
  },
  {
    id: "swaps",
    title: "Indian-brand swap suggestions",
    desc: "Maida → Aashirvaad atta. Maggi → sooji upma. Every swap uses brands you actually buy.",
    img: lb90PantryList,
    pills: ["Real Indian brands", "One-tap accept", "Tracked progress"],
  },
  {
    id: "plate",
    title: "Today's Plate — every macro tracked",
    desc: "Calories, protein, carbs, sugar, fibre, sodium. See exactly where you stand against your daily floor and cap.",
    img: lb90Plate,
    pills: ["Live macros", "Floor & cap alerts", "Snap a meal"],
  },
  {
    id: "tomorrow",
    title: "Tomorrow's meals, planned tonight",
    desc: "Personalised breakfast, lunch, dinner, and snacks — built from your pantry, tuned to your goal.",
    img: lb90Meals,
    pills: ["Veg / Non-veg", "From your pantry", "One-tap replace"],
  },
];

function AppShowcaseSection() {
  const [active, setActive] = useState(0);
  const f = SHOWCASE_FEATURES[active];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B2A4A] to-[#0B2A4A]/95 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
            Inside the app
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Everything you need. Nothing you don't.
          </h2>
          <p className="mt-3 text-base text-white/70 md:text-lg">
            Tap any feature to see it in the app.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8">
          {/* LEFT — feature tabs */}
          <div className="order-2 space-y-3 md:order-1">
            {SHOWCASE_FEATURES.map((feat, i) => {
              const isActive = i === active;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group block w-full rounded-2xl border-2 p-4 text-left transition-all md:p-5",
                    isActive
                      ? "border-[#F59E0B] bg-white/10 shadow-lg shadow-[#F59E0B]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                        isActive
                          ? "bg-[#F59E0B] text-[#0B2A4A]"
                          : "bg-white/10 text-white/60 group-hover:bg-white/20"
                      )}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "text-base font-bold transition-colors md:text-lg",
                          isActive ? "text-white" : "text-white/80"
                        )}
                      >
                        {feat.title}
                      </h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                              {feat.desc}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {feat.pills.map((p) => (
                                <span
                                  key={p}
                                  className="rounded-full bg-[#F59E0B]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#F59E0B]"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CENTER — iPhone mockup */}
          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 -z-10 rounded-[3rem] bg-[#F59E0B]/20 blur-3xl" />
              {/* Phone frame */}
              <div className="relative h-[560px] w-[280px] rounded-[2.75rem] border-[10px] border-[#1a1a1a] bg-[#1a1a1a] shadow-2xl md:h-[620px] md:w-[310px]">
                {/* Notch */}
                <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1a1a1a]" />
                {/* Screen */}
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={f.id}
                      src={f.img}
                      alt={f.title}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — stats / reassurance */}
          <div className="order-3 space-y-4 md:order-3">
            {[
              { k: "10s", v: "to scan a shelf" },
              { k: "2,400+", v: "Indian foods recognised" },
              { k: "1-tap", v: "swap accept" },
              { k: "Daily", v: "macro guardrails" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5"
              >
                <div className="text-2xl font-extrabold text-[#F59E0B] md:text-3xl">
                  {s.k}
                </div>
                <div className="text-sm text-white/70">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
