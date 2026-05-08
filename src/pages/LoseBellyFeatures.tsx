import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useSEO } from "@/hooks/useSEO";

type Feature = {
  icon: string;
  color: string;
  title: string;
  body: string;
  pills: string[];
  why?: string;
  badge?: string;
};

const FEATURES: Feature[] = [
  {
    icon: "⚖️", color: "#60A5FA",
    title: "Weekly visceral fat measurement",
    body: "The Agatsa Smart Scale uses Bio-Impedance Analysis — the same technology hospitals use — to measure 26 body metrics including visceral fat level, muscle mass, body fat %, and body age. You step on it barefoot for 5 seconds. The reading auto-syncs to your app.",
    pills: ["BIA technology", "26 body metrics", "5-second scan", "Bluetooth sync"],
    why: "Most programs track weight. This one tracks the fat that actually predicts cardiac and metabolic disease — the fat your bathroom scale never shows you.",
  },
  {
    icon: "🎯", color: "#7C3AED",
    title: "Personalised calorie + macro targets — recalculated every week",
    body: "Your daily calorie target is calculated using the Katch-McArdle formula (uses your lean mass, not just weight) with a clinically safe 0.7%/week loss rate. Refined carb cap starts at 90g/day and tapers to 40g by week 4. Protein floor is 1.6 g/kg lean mass — the level proven to preserve muscle while losing fat.",
    pills: ["Katch-McArdle BMR", "0.7%/week loss rate", "7,700 kcal/kg fat equation", "1,200 kcal safety floor"],
    why: "Generic apps give everyone the same 1,500 kcal target. Yours is calculated from your actual body composition, adjusted as you lose weight.",
  },
  {
    icon: "📸", color: "#22C55E",
    title: "Snap your meal — get instant body-aware feedback",
    body: "Photograph any meal from anywhere in the app. Nera AI identifies the food, estimates macros (calories, protein, carbs, sugar, fiber, sodium), and — if you're in the programme — immediately tells you whether this meal fits your goal today. If it doesn't, you get a specific cheat code: eat half, skip the sauce, walk 20 minutes.",
    pills: ["GPT-4o vision", "7 macros tracked", "Pre-save alignment check", "Specific cheat codes"],
    why: "Most food trackers tell you after you've eaten that you were bad. This tells you before — the only point where behaviour can change.",
  },
  {
    icon: "🌿", color: "#0D9488",
    title: "Plan tomorrow's meals from your own kitchen",
    body: "Every evening, snap your kitchen. Nera AI sees what ingredients you have and builds a full day of meals — breakfast, lunch, dinner, snack — that hit your calorie target, stay under your carb and sugar caps, and meet your protein floor. Don't want to snap? It generates a plan from your last pantry scan, or falls back to a standard Indian kitchen plan. You can replace any one meal once if you don't like it.",
    pills: ["Kitchen snap → instant plan", "Veg / non-veg daily toggle", "1× replace per meal slot", "Plan confirmed = pre-logged meals"],
    why: "Decision fatigue at mealtimes is the #1 reason people abandon healthy eating. This removes the question entirely — your meals are already decided.",
  },
  {
    icon: "🍽️", color: "#059669",
    title: "See all 7 macros update in real time as you eat",
    body: "The Today's Plate card on your home screen shows calories, protein, carbs, fat, sugar, fiber, and sodium — all compared to your personal targets. Each bar is colour-coded: green when you're on track, amber when approaching a cap, red when over. The net calorie deficit badge shows exactly how much belly fat you're burning today.",
    pills: ["7 macros live", "Net calorie deficit badge", "Calorie burn from watch/band", "Instant refresh after every snap"],
    why: "You can't manage what you can't see. This makes your daily nutrition as visible as your phone's battery level.",
  },
  {
    icon: "📚", color: "#F59E0B",
    title: "One lesson per day — the science behind the belly",
    body: "Every day unlocks a 3–5 minute lesson explaining the science behind that day's protocol. Phase 1 (Reset) covers why refined carbs drive visceral fat. Phase 2 (Burn) covers the plateau mechanism and how to break it. Phase 3 (Cement) covers why most people regain weight and how to prevent it. Lessons are written at a 9th-grade reading level — no jargon.",
    pills: ["3 phases: Reset · Burn · Cement", "90 lessons total", "3–5 min per lesson", "Action step each day"],
    why: "Understanding why something works is the strongest predictor of long-term adherence. You're not just following a plan — you're learning how your body works.",
  },
  {
    icon: "🥫", color: "#FF6B35",
    title: "Pantry Coach — your kitchen audited in 10 seconds",
    body: "Snap any shelf in your kitchen. Nera AI scans every item visible and gives a verdict: Keep, Reduce, or Replace. Items flagged for replacement get a swap suggestion (e.g. 'replace Maggi with vermicelli'). When you swap an item, the app confirms whether the replacement aligns with your goal. This is optional — it doesn't affect your compliance score or refund eligibility.",
    pills: ["Keep / Reduce / Replace verdicts", "Swap suggestions", "4 shelf categories", "Optional, never gates your goals"],
  },
  {
    icon: "📞", color: "#7C3AED",
    title: "4 nutritionist 1:1 video calls — Plus plan only",
    body: "Plus plan members are assigned a dedicated nutritionist within 1 week of program start. You get 4 scheduled 1:1 video calls over 90 days — typically at Day 7, Day 30, Day 60, and Day 88. Your nutritionist has full access to your compliance score, visceral fat trend, Today's Plate history, and meal snaps. Calls are conducted over the Agatsa One app — no external links needed.",
    pills: ["Assigned within 1 week", "4 calls over 90 days", "Full data access", "In-app video"],
    badge: "Plus plan only",
  },
  {
    icon: "🏆", color: "#D97706",
    title: "The money-back guarantee — exactly how it works",
    body: "On Day 90, you do a final Smart Scale scan and waist measurement. The app computes whether you hit 2 of 3 goals: waist −5 cm, visceral fat −2 levels, weight −4 kg. If you hit 2 or 3: you graduate with a shareable transformation card. If you hit fewer than 2: a refund button appears in the app. Tap it. ₹4,999 is credited to your original payment card within 7 working days. No support call. No questions. No proof of effort required — the scan data is the proof.",
    pills: ["2 of 3 goals required", "Auto-refund in 7 days", "No questions asked", "Shareable graduation card"],
  },
];

const COMPARISON: Array<[string, string, string]> = [
  ["Smart Scale", "Rented free ↺", "Yours to keep"],
  ["Welcome kit", "Tape + chart", "Tape + chart + playbook"],
  ["Daily AI targets", "✅", "✅"],
  ["Meal photo logging", "✅", "✅"],
  ["Tomorrow's plan", "✅", "✅"],
  ["Pantry Coach", "✅", "✅"],
  ["90 daily lessons", "✅", "✅"],
  ["Nutritionist calls", "—", "4 calls ✅"],
  ["WhatsApp cohort", "Standard group", "Priority group"],
  ["Money-back guarantee", "✅", "✅"],
];

const FAQS = [
  { q: "Do I need the Agatsa Smart Scale to join?", a: "Yes — the scale is how we measure visceral fat, which is the primary goal. For Standard, it's rented free and you return it after Day 90. For Plus, it's yours to keep. The scale ships within 48 hours of purchase." },
  { q: "What if I don't hit 2 of 3 goals — is the refund automatic?", a: "The refund button appears in the app automatically if your Day 90 scan misses 2 of 3 goals. You tap it. We process the refund to your original card in 7 working days. There is no form to fill, no support call, and no proof-of-effort requirement." },
  { q: "Does the nutritionist speak Hindi?", a: "Yes. All nutritionists speak Hindi and English. If you have a regional language preference, mention it on your first call and we'll do our best to accommodate." },
  { q: "What happens to my data after Day 90?", a: "Your health data, scan history, and meal logs remain in the Agatsa One app indefinitely. Your 1-year Nera AI access continues for the remainder of your subscription period regardless of verdict." },
  { q: "Is the calorie target the same for everyone?", a: "No — it's calculated individually using your weight, lean muscle mass (from the Smart Scale), and a clinically safe 0.7%/week loss rate. A 90 kg person and a 65 kg person will have different targets. The target also updates automatically if your weight changes significantly." },
];

export default function LoseBellyFeatures() {
  useSEO({
    title: "Lose Your Belly 90 — Full Feature Breakdown | Agatsa One",
    description:
      "Everything included in the 90-day belly fat programme: Smart Scale BIA, personalised AI targets, meal photo logging, tomorrow's meal plan, pantry coach, daily lessons, and the money-back guarantee explained in full.",
  });

  return (
    <SiteLayout>
      <div className="bg-amber-50/30">
        {/* HERO */}
        <section className="bg-[#1A1A2E] py-16 text-center px-4">
          <div className="mx-auto max-w-3xl">
            <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-5">
              WHAT'S INCLUDED
            </Badge>
            <h1 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight">
              Every feature, explained.
            </h1>
            <p className="mt-4 text-white/70 text-lg">
              No surprises. Here's exactly what you get in all 90 days.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-3xl space-y-10">
            {FEATURES.map((f, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="bg-white rounded-3xl border border-amber-100 p-7 md:p-9 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: `${f.color}1A` }}
                  >
                    <span>{f.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {f.badge && (
                      <span className="inline-block mb-2 text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                        {f.badge}
                      </span>
                    )}
                    <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] leading-tight">
                      {f.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-5 text-[#1A1A2E]/80 leading-relaxed">{f.body}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {f.pills.map((p) => (
                    <span
                      key={p}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: `${f.color}14`, color: f.color }}
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {f.why && (
                  <div className="mt-5 border-l-4 pl-4 py-2" style={{ borderColor: f.color }}>
                    <div className="text-xs font-bold uppercase tracking-wide text-[#1A1A2E]/60 mb-1">
                      Why it matters
                    </div>
                    <p className="text-[#1A1A2E]/85 text-sm leading-relaxed">{f.why}</p>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1A1A2E] mb-8">
              Standard vs Plus
            </h2>
            <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-4 font-bold text-[#1A1A2E]">Feature</th>
                    <th className="text-left px-4 md:px-6 py-4 font-bold text-[#1A1A2E]">Standard <span className="text-amber-700">₹4,999</span></th>
                    <th className="text-left px-4 md:px-6 py-4 font-bold text-[#1A1A2E]">Plus <span className="text-amber-700">₹9,999</span></th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(([feat, std, plus], i) => (
                    <tr key={feat} className={i % 2 ? "bg-amber-50/40" : ""}>
                      <td className="px-4 md:px-6 py-4 font-semibold text-[#1A1A2E]">{feat}</td>
                      <td className="px-4 md:px-6 py-4 text-[#1A1A2E]/80">{std}</td>
                      <td className="px-4 md:px-6 py-4 text-[#1A1A2E]/80">{plus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                className="h-14 rounded-full text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg"
              >
                <Link to="/lose-belly#pricing">Start Standard ₹4,999 →</Link>
              </Button>
              <Button
                asChild
                className="h-14 rounded-full text-base font-bold bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 text-white"
              >
                <Link to="/lose-belly#pricing">Start Plus ₹9,999 →</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1A1A2E] mb-8">
              Questions
            </h2>
            <Accordion type="single" collapsible className="bg-white rounded-3xl border border-amber-100 px-6 shadow-sm">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`q-${i}`} className="border-amber-100">
                  <AccordionTrigger className="text-left font-bold text-[#1A1A2E] hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#1A1A2E]/80 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-gradient-to-br from-[#92400E] via-[#D97706] to-[#FBBF24] py-16 text-center px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-white font-black text-3xl md:text-4xl">Ready to start?</h2>
            <Button
              asChild
              className="mt-8 bg-white text-[#D97706] hover:bg-white/95 rounded-full px-10 py-7 font-black text-lg shadow-xl"
            >
              <Link to="/lose-belly#pricing">See plans and pricing →</Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
