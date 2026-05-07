import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, X, ChevronRight, Scale, Camera, Target, Star,
  ShieldCheck, Loader2, Sparkles, Quote,
  Award, Clock, Flame, Stethoscope, Package, Zap,
} from "lucide-react";
import transformation1 from "@/assets/lose-belly/transformation-1.jpg";
import transformation2 from "@/assets/lose-belly/transformation-2.jpg";
import transformation3 from "@/assets/lose-belly/transformation-3.jpg";
import transformation4 from "@/assets/lose-belly/transformation-4.jpg";
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
import { loadRazorpayScript } from "@/lib/razorpay";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Tier = "standard" | "plus" | "couple";

const TIERS: Record<Tier, { name: string; price: number; label: string }> = {
  standard: { name: "Standard", price: 4999, label: "Start your 90 days" },
  plus: { name: "Plus", price: 9999, label: "Choose Plus" },
  couple: { name: "Couple", price: 7999, label: "Choose Couple" },
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

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<Tier>("standard");
  const [quizOpen, setQuizOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const tierTableRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

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
    setSelectedTier(tier);
    setCheckoutOpen(true);
    trackEvent("tier_select", { tier });
    trackEvent("checkout_open", { tier });
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
              <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-[#0B2A4A] to-[#007A7C] p-6 shadow-2xl">
                <div className="flex h-full flex-col justify-between rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-70">Day 47 / 90</p>
                    <p className="mt-2 text-sm opacity-80">Visceral fat</p>
                    <motion.p
                      initial={{ scale: 0.9 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl font-bold"
                    >
                      9 <span className="text-2xl opacity-60">↓ 3 levels</span>
                    </motion.p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm opacity-80">
                      <span>Waist</span><span>−4.2 cm</span>
                    </div>
                    <div className="flex justify-between text-sm opacity-80">
                      <span>Weight</span><span>−5.8 kg</span>
                    </div>
                    <Progress value={52} className="h-2 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="border-y border-[#0B2A4A]/10 bg-white py-6">
          <div className="container mx-auto grid grid-cols-2 gap-4 px-4 text-center md:grid-cols-4">
            {[
              { n: "21,400+", l: "Indians enrolled" },
              { n: "94%", l: "hit goal in 90 days" },
              { n: "4.8/5", l: "avg rating (1,200+ reviews)" },
              { n: "₹1.2 Cr", l: "refunded — we keep our word" },
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
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Built with doctors. Measured like medicine.</h2>
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
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {(["standard", "plus", "couple"] as Tier[]).map((tier) => (
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
                { name: "Anjali & Rohit", city: "Pune", quote: "My husband and I did the couples tier together. Lost 11 kg between us. Best ₹7,999 we ever spent — and we still cook together every night.", stat: "−11 kg combined · 90 days" },
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
                      { n: "₹1.2 Cr", l: "refunded so far" },
                      { n: "6%", l: "of members claim refunds" },
                      { n: "7 days", l: "to your card, guaranteed" },
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

        {/* FAQ */}
        <section className="bg-[#F7FAFC] py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-center text-3xl font-bold text-[#0B2A4A] md:text-4xl">Common questions</h2>
            <Accordion type="single" collapsible className="mt-10">
              {[
                ["What if I don't have an Agatsa Smart Scale?", "It's rented free with your program. Delivered to your address before Day 0. Returnable on completion."],
                ["What if I miss days during the program?", "The program adjusts. As long as your Day 90 scan hits 2 of 3 goals, you graduate."],
                ["Is this safe for diabetes / pregnancy / heart conditions?", "Please consult your doctor first. Lose Your Belly 90 is a wellness and lifestyle program, not medical treatment."],
                ["For the couples tier, do we both need a scale?", "No — one scale serves both, weighed at separate times."],
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

        {/* CHECKOUT MODAL */}
        <CheckoutModal
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          tier={selectedTier}
        />

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
    couple: [
      "Daily AI coaching for two",
      "60 daily lessons",
      "Smart Scale — yours to keep",
      "Welcome kit: 2× tape, 1 scale shared",
      "Couple-only WhatsApp group",
      "Money-back guarantee (per person)",
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
        {tier === "couple" && <span className="text-base font-normal text-muted-foreground"> (two people)</span>}
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
  const [secondName, setSecondName] = useState("");
  const [secondPhone, setSecondPhone] = useState("");
  const [referral, setReferral] = useState("");
  const [showReferral, setShowReferral] = useState(false);

  useEffect(() => {
    if (open) setStep("form");
  }, [open]);

  const t = TIERS[tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{10}$/.test(phone)) {
      toast({ title: "Please enter a valid name and 10-digit phone.", variant: "destructive" });
      return;
    }
    if (tier === "couple" && (!secondName.trim() || !/^\d{10}$/.test(secondPhone))) {
      toast({ title: "Please enter the second person's details.", variant: "destructive" });
      return;
    }

    setStep("loading");
    try {
      const quizAnswers = JSON.parse(localStorage.getItem("lose_belly_quiz_answers") || "null");
      const { data, error } = await supabase.functions.invoke("lose-belly-checkout", {
        body: {
          name, phone: `+91${phone}`, email: email || undefined, tier,
          secondPersonName: tier === "couple" ? secondName : undefined,
          secondPersonPhone: tier === "couple" ? `+91${secondPhone}` : undefined,
          referralCode: referral || undefined,
          quizAnswers,
          utm: getUTM(),
        },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay failed to load");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: data.razorpayKeyId,
        amount: data.amountPaisa,
        currency: "INR",
        name: "Agatsa One",
        description: `Lose Your Belly 90 — ${t.name}`,
        order_id: data.razorpayOrderId,
        prefill: { name, email, contact: `+91${phone}` },
        theme: { color: "#0B2A4A" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            await supabase.functions.invoke("lose-belly-confirm", {
              body: {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
            });
            trackEvent("payment_success", { tier, amount: t.price });
            navigate(`/lose-belly/welcome?orderId=${response.razorpay_order_id}&phone=${encodeURIComponent(`+91${phone}`)}`);
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
      <DialogContent className="max-w-md">
        {step === "loading" ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-[#0B2A4A]" />
            <p className="mt-4 text-[#0B2A4A]">Creating your enrollment…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#0B2A4A]">
                You're choosing {t.name} — ₹{t.price.toLocaleString("en-IN")}
              </h3>
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
              <Input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
              {tier === "couple" && (
                <>
                  <Input placeholder="Second person's name" value={secondName} onChange={(e) => setSecondName(e.target.value)} required />
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm">+91</span>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Second person's 10-digit phone"
                      value={secondPhone}
                      onChange={(e) => setSecondPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                </>
              )}
              {showReferral ? (
                <Input placeholder="Referral code" value={referral} onChange={(e) => setReferral(e.target.value)} />
              ) : (
                <button type="button" className="text-xs text-[#007A7C] underline" onClick={() => setShowReferral(true)}>
                  Have a referral code?
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send your access link via SMS to this number. The Agatsa One app auto-recognizes you when you log in with this phone.
            </p>
            <Button type="submit" className="h-12 w-full bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90">
              Continue to payment →
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
