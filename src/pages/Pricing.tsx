import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const fade = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const individualPlans = (annual: boolean) => [
  {
    name: "Free", price: "₹0", period: "forever", tagline: "For getting started", badge: null,
    highlighted: false, cta: "Download Free", ctaStyle: "outline" as const, note: "No credit card required",
    features: [
      { text: "Connect up to 1 device", ok: true }, { text: "Store and view all readings", ok: true },
      { text: "Basic reading history (7 days)", ok: true }, { text: "Manual health log", ok: true },
      { text: "Nera AI analysis", ok: false }, { text: "Weekly health reports", ok: false },
      { text: "Nera Health Score", ok: false }, { text: "Care Programmes", ok: false },
      { text: "Doctor sharing", ok: false }, { text: "Voice assistant", ok: false },
      { text: "Family sharing", ok: false },
    ],
  },
  {
    name: "Nera AI Monthly", price: annual ? "₹333" : "₹599", period: "per month",
    extra: annual ? "billed ₹3,999/year" : undefined,
    tagline: "Full AI monitoring", badge: { text: "Most Popular", bg: "#7C4DFF" }, highlighted: true,
    cta: "Start 7-Day Free Trial", ctaStyle: "filled" as const, note: "7 days free · Cancel anytime",
    features: [
      { text: "Connect unlimited devices", ok: true }, { text: "Full reading history (unlimited)", ok: true },
      { text: "Nera AI analysis on every reading", ok: true }, { text: "Weekly AI health reports", ok: true },
      { text: "Nera Health Score (updated live)", ok: true }, { text: "All 5 Care Programmes", ok: true },
      { text: "Share with doctors (up to 3)", ok: true }, { text: "Family sharing (up to 3 members)", ok: true },
      { text: "Priority support", ok: true }, { text: "Voice assistant (Nera voice)", ok: false },
      { text: "Advanced AI risk modelling", ok: false },
    ],
  },
  {
    name: "Nera AI Yearly", price: "₹3,999", period: "per year", tagline: "Best value — save 44%",
    badge: { text: "Best Value", bg: "#22C55E" }, highlighted: false,
    cta: "Start 7-Day Free Trial", ctaStyle: "outline" as const, note: "Save ₹3,189 vs monthly",
    features: [
      { text: "Everything in Nera AI Monthly", ok: true }, { text: "2 months free vs monthly billing", ok: true },
      { text: "Annual health summary report (PDF)", ok: true }, { text: "Priority feature access", ok: true },
      { text: "Voice assistant (Nera voice)", ok: false },
    ],
  },
  {
    name: "Nera AI Premium", price: "₹999", period: "per month", tagline: "Maximum intelligence",
    badge: null, highlighted: false, cta: "Get Premium", ctaStyle: "outline" as const, note: undefined,
    features: [
      { text: "Everything in Nera AI Monthly", ok: true }, { text: "Nera Voice Assistant (unlimited)", ok: true },
      { text: "Advanced multimodal AI risk modelling", ok: true }, { text: "STEMI & arrhythmia priority alerts (SMS + call)", ok: true },
      { text: "Doctor sharing (unlimited)", ok: true }, { text: "Family sharing (up to 10)", ok: true },
      { text: "Quarterly health review (video call)", ok: true }, { text: "White-glove onboarding", ok: true },
      { text: "Priority feature access", ok: true }, { text: "Dedicated support line", ok: true },
      { text: "Early access to new features", ok: true },
    ],
  },
];

const bizRows = [
  { label: "Price", values: ["₹4,999/mo", "₹14,999/mo", "₹39,999/mo", "Custom"] },
  { label: "Provider seats", values: ["5", "25", "100", "Unlimited"] },
  { label: "Active patients", values: ["100", "500", "2,000", "Unlimited"] },
  { label: "ECG AI analysis", values: [true, true, true, true] },
  { label: "Care programmes", values: ["Basic (2)", "All 5", "All 5", "Custom"] },
  { label: "White label", values: [false, false, true, true] },
  { label: "EHR integration", values: [false, false, true, true] },
  { label: "Camp screening", values: [false, true, true, true] },
  { label: "Dedicated CSM", values: [false, false, true, true] },
  { label: "SLA", values: ["99%", "99.5%", "99.9%", "99.99%"] },
];

const faqs = [
  { q: "Is the free trial really free? Do I need a credit card?", a: "Yes, fully free. No credit card required for the free plan or the trial. For iOS and Android, the trial is handled entirely through the App Store or Play Store — you can cancel before the trial ends and will not be charged." },
  { q: "What happens to my data if I cancel my subscription?", a: "Your data is never deleted when you cancel. You can still access your full reading history on the free plan. You lose access to AI analysis and reports, but your health data is yours — always." },
  { q: "Can I change plans at any time?", a: "Yes. Upgrade anytime and the new plan takes effect immediately. Downgrade at the end of your current billing period. Switching from monthly to annual gives you an immediate prorated credit." },
  { q: "Are devices sold separately from the subscription?", a: "Yes. Devices (SanketLife ECG, EasyTouch Wellness, Rhythm Band, Smart Scale) are purchased once — no recurring hardware fee. The subscription covers Nera AI analysis, reports, and premium app features. Devices work with the free plan too — you'll just have limited AI features." },
  { q: "Do you offer family plans?", a: "Nera AI Monthly and Yearly plans include family sharing for up to 3 members. Nera AI Premium includes up to 10 family members. Each family member gets their own health profile, readings, and AI analysis — all managed from the primary account holder's app." },
];

const CellValue = ({ v }: { v: string | boolean }) =>
  typeof v === "boolean"
    ? v ? <Check size={18} style={{ color: "#22C55E" }} /> : <X size={18} className="text-muted-foreground opacity-40" />
    : <span className="text-sm">{v}</span>;

export default function PricingPage() {
  useSEO({ title: "Pricing — Free, ₹599/month, ₹3,999/year, Premium | Agatsa One", description: "Agatsa One is free to download. Nera AI subscription from ₹599/month. Annual plan saves 44%. Business plans from ₹4,999/month. No hidden fees. Cancel anytime." });

  const [tab, setTab] = useState<"individual" | "business">("individual");
  const [annual, setAnnual] = useState(true);
  const plans = individualPlans(annual);

  return (
    <SiteLayout>
      {/* Header */}
      <section className="pt-8 pb-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h1 className="font-extrabold leading-tight" style={{ color: "#1A1A2E", fontSize: "clamp(34px,4vw,52px)" }}>
              Simple, honest pricing.<br />AI health monitoring for every budget.
            </h1>
            <p className="mt-4 text-lg max-w-[560px] mx-auto" style={{ color: "#4A4A68" }}>
              Start free. Upgrade when you're ready. Cancel anytime. No hidden fees, no lock-ins, no dark patterns.
            </p>
          </motion.div>

          <div className="mt-8 inline-flex rounded-full bg-muted p-1">
            {(["individual", "business"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${tab === t ? "text-white" : ""}`}
                style={tab === t ? { background: "#7C4DFF" } : {}}
              >
                {t === "individual" ? "For Individuals" : "For Businesses"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {tab === "individual" ? (
        <section className="pb-20 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className={`text-sm font-medium ${!annual ? "opacity-100" : "opacity-50"}`} style={{ color: "#1A1A2E" }}>Monthly</span>
              <Switch checked={annual} onCheckedChange={setAnnual} />
              <span className={`text-sm font-medium ${annual ? "opacity-100" : "opacity-50"}`} style={{ color: "#1A1A2E" }}>Annual</span>
              {annual && <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: "#22C55E" }}>SAVE 44%</span>}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((p, i) => (
                <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className={`relative rounded-3xl p-8 border bg-card flex flex-col ${p.highlighted ? "border-2 shadow-2xl lg:scale-105 z-10" : "border-border"}`}
                  style={p.highlighted ? { borderColor: "#7C4DFF", boxShadow: "0 25px 50px -12px rgba(124,77,255,0.15)" } : {}}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full whitespace-nowrap" style={{ background: p.badge.bg }}>{p.badge.text}</span>
                  )}
                  <h3 className="text-lg font-bold" style={{ color: "#1A1A2E" }}>{p.name}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-extrabold" style={{ color: "#7C4DFF" }}>{p.price}</span>
                    <span className="text-sm ml-1" style={{ color: "#4A4A68" }}>/ {p.period}</span>
                  </div>
                  {p.extra && <p className="text-xs mt-1" style={{ color: "#4A4A68" }}>{p.extra}</p>}
                  <p className="text-sm mt-2" style={{ color: "#4A4A68" }}>{p.tagline}</p>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm">
                        {f.ok ? <Check size={16} className="mt-0.5 shrink-0" style={{ color: "#22C55E" }} /> : <X size={16} className="mt-0.5 shrink-0 text-muted-foreground opacity-40" />}
                        <span style={{ color: f.ok ? "#1A1A2E" : "#9CA3AF" }}>{f.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/app" className="mt-6">
                    <Button className={`w-full rounded-full py-3 text-sm ${p.ctaStyle === "filled" ? "text-white" : ""}`}
                      variant={p.ctaStyle === "filled" ? "default" : "outline"}
                      style={p.ctaStyle === "filled" ? { background: "#7C4DFF" } : { borderColor: "#7C4DFF", color: "#7C4DFF" }}
                    >{p.cta}</Button>
                  </Link>
                  {p.note && <p className="text-xs text-center mt-2" style={{ color: "#4A4A68" }}>{p.note}</p>}
                </motion.div>
              ))}
            </div>

            <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mt-12 rounded-2xl p-6 border" style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
            >
              <p className="text-sm" style={{ color: "#92400E" }}>
                🎁 Buy any Agatsa device and get 3 months Nera AI Premium free. SanketLife ECG includes 3 months (₹1,797 value). EasyTouch and band purchases include 3 months Nera AI Monthly (₹1,797 value).
              </p>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="pb-20 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-sm mb-10" style={{ color: "#4A4A68" }}>For clinics, hospitals, and corporates. Prices exclude GST. Annual billing available at 15% discount.</p>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-sm font-medium" style={{ color: "#4A4A68" }}>Feature</th>
                    {["Starter", "Growth", "Pro", "Enterprise"].map((h, i) => (
                      <th key={h} className={`p-4 text-center text-sm font-bold ${i === 2 ? "rounded-t-2xl" : ""}`}
                        style={i === 2 ? { background: "#F3EEFF", color: "#7C4DFF" } : { color: "#1A1A2E" }}
                      >
                        {h}
                        {i === 2 && <span className="block text-xs font-medium mt-1">Most Popular</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bizRows.map((r, ri) => (
                    <tr key={ri} className="border-t border-border">
                      <td className="p-4 text-sm font-medium" style={{ color: "#1A1A2E" }}>{r.label}</td>
                      {r.values.map((v, vi) => (
                        <td key={vi} className="p-4 text-center" style={vi === 2 ? { background: "#FAFAFF" } : {}}>
                          <div className="flex justify-center"><CellValue v={v} /></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-6">
              {["Starter", "Growth", "Pro", "Enterprise"].map((tier, ti) => (
                <div key={tier} className={`rounded-2xl p-6 border ${ti === 2 ? "border-2" : "border-border"} bg-card`}
                  style={ti === 2 ? { borderColor: "#7C4DFF" } : {}}
                >
                  <h3 className="text-lg font-bold" style={{ color: "#1A1A2E" }}>{tier}</h3>
                  {ti === 2 && <span className="text-xs font-bold text-white px-3 py-0.5 rounded-full" style={{ background: "#7C4DFF" }}>Most Popular</span>}
                  <ul className="mt-4 space-y-2">
                    {bizRows.map((r, ri) => (
                      <li key={ri} className="flex justify-between text-sm">
                        <span style={{ color: "#4A4A68" }}>{r.label}</span>
                        <span className="font-medium"><CellValue v={r.values[ti]} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button className="rounded-full px-10 py-4 text-base text-white" style={{ background: "#7C4DFF" }}>Schedule a Demo</Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold" style={{ color: "#1A1A2E" }}>Frequently asked questions</h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6">
                <AccordionTrigger className="text-left text-sm font-semibold" style={{ color: "#1A1A2E" }}>{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm" style={{ color: "#4A4A68" }}>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20" style={{ background: "#F8F4FF" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold" style={{ color: "#1A1A2E" }}>Not sure which plan is right? Start free.</h2>
            <p className="mt-4 text-base" style={{ color: "#4A4A68" }}>
              Download Agatsa One and try the full app with your devices. Upgrade to Nera AI when you're ready. Most users upgrade within 2 weeks of trying their first AI health report.
            </p>
            <Link to="/app"><Button className="mt-8 rounded-full px-10 py-4 text-base text-white" style={{ background: "#7C4DFF" }}>Download Free</Button></Link>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
