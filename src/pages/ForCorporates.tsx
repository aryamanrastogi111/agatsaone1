import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Monitor, BarChart3, Smartphone, ClipboardList, FileText, ShieldCheck } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const stats = [
  { num: "1 in 3", desc: "Corporate heart attacks affect employees under 45", src: "(Source: Indian cardiovascular health research)" },
  { num: "₹28 lakhs", desc: "Average cost of a single cardiac hospitalisation including productivity loss", src: "" },
  { num: "72%", desc: "Of employees with cardiac risk have never had an ECG", src: "" },
];

const features = [
  { icon: Monitor, title: "Biometric screening camps", body: "On-site ECG and vitals screening for your entire workforce. No equipment purchase required. Agatsa deploys everything." },
  { icon: BarChart3, title: "Anonymous aggregate dashboard", body: "See your organisation's health risk profile without individual data. Risk distribution, programme adherence, improvement metrics." },
  { icon: Smartphone, title: "Employee app and devices", body: "Device bundles available for your employees at standard pricing — ECG, wellness monitor, band, or smart scale. Bulk order pricing available for 50+ units. Contact us for bulk quotes." },
  { icon: ClipboardList, title: "Care programme enrolment", body: "Structured 8-week Corporate Wellness Programme for eligible employees — daily tasks, AI nudges, HR reporting." },
  { icon: FileText, title: "HR reporting", body: "Monthly aggregate reports: risk distribution, programme adherence, improvement metrics. Fully anonymised. DPDP Act compliant." },
  { icon: ShieldCheck, title: "Aggregate health insights", body: "Monthly anonymised aggregate reports showing risk distribution and programme adherence across your workforce. Useful for HR planning and occupational health reviews." },
];

const corpPlans = [
  {
    name: "Starter",
    tagline: "For small teams",
    price: "₹199",
    capacity: "Up to 10 monitored employees",
    capacityStyle: "bg-gray-100 text-gray-600",
    highlighted: false,
    features: [
      { ok: true, text: "ECG + vitals dashboard" },
      { ok: true, text: "Nera AI health scores" },
      { ok: true, text: "Camp screening module" },
      { ok: true, text: "Basic HR aggregate report" },
      { ok: false, text: "Care programme enrolment" },
      { ok: false, text: "Bulk import" },
    ],
    cta: "Get Started Free",
    ctaStyle: "border-2 border-[#7C4DFF] text-[#7C4DFF] hover:bg-purple-50 bg-transparent",
    href: "mailto:info@agatsa.com?subject=Corporate Starter",
  },
  {
    name: "Growth",
    tagline: "For growing companies",
    price: "₹249",
    capacity: "Up to 50 monitored employees",
    capacityStyle: "bg-purple-100 text-purple-700",
    highlighted: true,
    badge: "⭐ Most Popular",
    features: [
      { ok: true, text: "Everything in Starter" },
      { ok: true, text: "Corporate Wellness Programme enrolment" },
      { ok: true, text: "Monthly aggregate HR reports (anonymised)" },
      { ok: true, text: "Multi-admin access" },
      { ok: true, text: "Bulk employee import (CSV)" },
      { ok: false, text: "API access" },
    ],
    cta: "Contact Us",
    ctaStyle: "bg-[#7C4DFF] text-white shadow-lg shadow-purple-200 hover:bg-purple-700",
    href: "mailto:info@agatsa.com?subject=Corporate Growth",
  },
  {
    name: "Pro",
    tagline: "For large organisations",
    price: "₹299",
    capacity: "Up to 200 monitored employees",
    capacityStyle: "bg-gray-100 text-gray-600",
    highlighted: false,
    features: [
      { ok: true, text: "Everything in Growth" },
      { ok: true, text: "Quarterly on-site screening camp" },
      { ok: true, text: "REST API access" },
      { ok: true, text: "Dedicated health programme manager" },
      { ok: true, text: "Custom alert thresholds" },
    ],
    cta: "Contact Us",
    ctaStyle: "border-2 border-gray-200 text-gray-700 hover:border-purple-400 hover:text-purple-700 bg-transparent",
    href: "mailto:info@agatsa.com?subject=Corporate Pro",
  },
  {
    name: "Enterprise",
    tagline: "For large enterprises",
    price: "₹349",
    capacity: "Unlimited employees",
    capacityStyle: "bg-green-100 text-green-700",
    highlighted: false,
    features: [
      { ok: true, text: "Everything in Pro" },
      { ok: true, text: "Unlimited employee capacity" },
      { ok: true, text: "White-label employee app" },
      { ok: true, text: "HR system integration (custom)" },
      { ok: true, text: "Dedicated CSM + SLA" },
    ],
    cta: "Talk to Sales",
    ctaStyle: "bg-[#1A1A2E] text-white hover:bg-gray-800",
    href: "mailto:info@agatsa.com?subject=Corporate Enterprise",
  },
];

export default function ForCorporatesPage() {
  useSEO({ title: "Corporate Cardiac Health Programme — Agatsa One for Employers", description: "Prevent cardiac events in your workforce. Biometric screening, anonymous aggregate dashboards, employee care programmes. Per-employee pricing from ₹199/month." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-8 pb-8" style={{ background: "linear-gradient(180deg, #F8F4FF 0%, #FFFFFF 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C4DFF]">FOR CORPORATES</span>
            <h1 className="mt-4 font-extrabold leading-tight text-[#1A1A2E]" style={{ fontSize: "clamp(34px,4vw,52px)" }}>
              Your best employees are also your highest cardiac risks.
            </h1>
            <p className="mt-4 text-lg max-w-[520px] text-[#4A4A68]">
              High-performing professionals are 2.4x more likely to have undetected hypertension. 1 in 3 corporate heart attacks happens to someone under 45. Stress, sedentary work, and delayed medical care are a lethal combination. Agatsa One Corporate changes that.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="mailto:info@agatsa.com?subject=Corporate Enquiry" className="rounded-full px-8 py-4 text-base font-semibold text-white bg-[#7C4DFF] hover:opacity-90 transition">Email us at info@agatsa.com</a>
            </div>
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80" alt="Team of corporate employees collaborating in an office" loading="lazy" className="rounded-3xl w-full h-[420px] object-cover shadow-xl" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C4DFF]">THE DATA</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">The data your HR team needs to see</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {stats.map((s, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center p-8 rounded-3xl border border-border bg-card">
                <p className="font-extrabold text-[#7C4DFF]" style={{ fontSize: "clamp(48px,5vw,72px)" }}>{s.num}</p>
                <p className="mt-2 text-base text-[#1A1A2E]">{s.desc}</p>
                {s.src && <p className="mt-1 text-xs text-[#4A4A68]">{s.src}</p>}
              </motion.div>
            ))}
          </div>
          <motion.p variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto text-center text-base text-[#4A4A68]">
            Your health insurance covers treatment. It doesn't prevent it. Agatsa One Corporate gives you a proactive programme that identifies at-risk employees before an event — and gives them the tools to reverse that risk.
          </motion.p>
        </div>
      </section>

      {/* What Corporates Get */}
      <section className="py-20 bg-[#F8F4FF]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C4DFF]">WHAT YOU GET</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">A complete corporate cardiac health programme.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white rounded-2xl p-8 border border-gray-200">
                <f.icon size={32} className="text-[#7C4DFF]" />
                <h3 className="mt-4 text-lg font-bold text-[#1A1A2E]">{f.title}</h3>
                <p className="mt-2 text-sm text-[#4A4A68]">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C4DFF]">THE VALUE</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">Prevention pays for itself.</h2>
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto rounded-3xl p-12 bg-[#F8F4FF]">
            <h3 className="text-[28px] font-bold text-[#1A1A2E]">One prevented cardiac event pays for years of monitoring.</h3>
            <div className="mt-4 text-base text-[#4A4A68] space-y-4">
              <p>
                The average cardiac hospitalisation costs ₹3–5 lakhs. Add productivity loss, replacement hiring, and insurance premium impact — and a single event can cost a company ₹15–25 lakhs.
              </p>
              <p>
                Agatsa One helps identify at-risk employees early, get them into structured monitoring programmes, and build the kind of consistent daily habits that reduce cardiovascular risk over time.
              </p>
              <p>
                We can't promise to prevent every cardiac event. We can promise that your employees will be monitored, alerted, and supported — and that you'll have the data to prove your organisation takes health seriously.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#F8F4FF]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C4DFF]">PRICING</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#1A1A2E]">Pay per monitored employee. No flat fees.</h2>
            <p className="mt-3 text-lg text-[#4A4A68] max-w-xl mx-auto">You only pay for employees who are actively enrolled in monitoring. A team member not using the platform = zero cost.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {corpPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fade}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`rounded-3xl p-8 bg-white flex flex-col relative ${
                  plan.highlighted
                    ? "border-2 border-[#7C4DFF] shadow-2xl shadow-purple-100 z-10"
                    : "border border-gray-200 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7C4DFF] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`text-xl font-bold ${plan.highlighted ? "text-[#7C4DFF]" : "text-[#1A1A2E]"}`}>{plan.name}</h3>
                <p className="text-sm text-[#4A4A68] mt-1">{plan.tagline}</p>
                <div className="mt-6">
                  <span className={`text-5xl font-extrabold ${plan.highlighted ? "text-[#7C4DFF]" : "text-[#1A1A2E]"}`}>{plan.price}</span>
                  <span className="text-[15px] text-[#4A4A68]">/employee/month</span>
                </div>
                <span className={`inline-block mt-3 ${plan.capacityStyle} rounded-full px-3 py-1 text-sm font-medium w-fit`}>
                  {plan.capacity}
                </span>
                <div className="border-t border-gray-100 my-6" />
                <ul className="space-y-3 text-sm text-[#4A4A68] flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">{f.ok ? "✅" : "❌"}</span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href={plan.href} className="block">
                    <button className={`w-full rounded-full py-3.5 font-semibold text-base transition-colors ${plan.ctaStyle}`}>
                      {plan.cta}
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-center mt-8 max-w-3xl mx-auto text-[#4A4A68]">
            All prices exclude GST. Volume discounts available for 1,000+ employees. Annual billing available at 10% discount.
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#7C4DFF]">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold">Healthy employees don't just cost less. They perform better.</h2>
            <p className="mt-4 text-lg opacity-80 max-w-xl mx-auto">Get a custom quote for your organisation. Programmes from 10 to 10,000+ employees.</p>
          </motion.div>

          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-10 bg-white rounded-2xl p-10 max-w-lg mx-auto shadow-xl text-center"
          >
            <h3 className="text-[22px] font-bold text-[#1A1A2E]">Get a custom quote</h3>
            <p className="mt-2 text-[15px] text-[#4A4A68]">
              Email us your company size, industry, and what you're trying to achieve at info@agatsa.com.
            </p>
            <a
              href="mailto:info@agatsa.com?subject=Corporate Wellness Quote Request&body=Company name: %0ANumber of employees: %0AContact name: %0APhone: %0AWhat you're looking for: "
              className="block mt-6 w-full rounded-full py-4 font-bold text-base text-white bg-[#7C4DFF] hover:bg-purple-700 transition text-center"
            >
              Email us at info@agatsa.com
            </a>
            <p className="text-xs text-gray-400 mt-3">Direct email only — no automatic email sending system.</p>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
