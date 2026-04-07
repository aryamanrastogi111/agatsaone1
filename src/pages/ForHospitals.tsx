import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { BarChart3, Palette, Database, Activity, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const valueProps = [
  { icon: BarChart3, title: "Post-discharge monitoring at scale", body: "Deploy Agatsa One to every cardiac discharge. Patients monitor from home. Your team sees every reading in a unified dashboard. Catch deterioration before the ambulance arrives." },
  { icon: Palette, title: "White-label capability", body: "Deploy under your hospital's brand. 'Apollo Health Monitor', 'Fortis CarePro', 'Narayana Remote' — whatever fits your brand. Full white-label including app icon, colour scheme, and in-app branding." },
  { icon: Database, title: "EHR and HIS integration", body: "API-first architecture integrates with major Indian HIS platforms (Meditech, Infor Cloverleaf, HealthPlix, eHospital). Patient readings flow into existing records. No double data entry." },
  { icon: Activity, title: "Camp screening for community outreach", body: "Deploy bulk ECG and vitals screening camps. Patients scan a QR code, complete a reading, and their results go directly into the Agatsa One system. Camp screening data feeds into your CRM." },
];

const tiers = ["Starter", "Growth", "Pro", "Enterprise"] as const;
const prices = ["₹4,999/mo", "₹14,999/mo", "₹39,999/mo", "Custom"];
const rows: { label: string; values: (string | boolean)[] }[] = [
  { label: "Provider seats", values: ["5", "25", "100", "Unlimited"] },
  { label: "Active patients", values: ["100", "500", "2,000", "Unlimited"] },
  { label: "ECG AI analysis", values: [true, true, true, true] },
  { label: "Care programmes", values: ["Basic (2)", "All 5", "All 5", "Custom"] },
  { label: "White label", values: [false, false, true, true] },
  { label: "EHR integration", values: [false, false, true, true] },
  { label: "Camp screening", values: [false, true, true, true] },
  { label: "Dedicated CSM", values: [false, false, true, true] },
  { label: "SLA", values: ["99%", "99.5%", "99.9%", "99.99%"] },
  { label: "Support", values: ["Email", "Chat", "Phone", "Dedicated"] },
];

const Cell = ({ v }: { v: string | boolean }) =>
  typeof v === "boolean" ? (
    v ? <Check className="text-primary mx-auto" size={20} /> : <X className="text-muted-foreground/40 mx-auto" size={20} />
  ) : (
    <span>{v}</span>
  );

export default function ForHospitalsPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[hsl(var(--dark-bg))] text-white pt-40 pb-24">
        <motion.div className="max-w-4xl mx-auto px-4 text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-4">For Hospitals</p>
          <h1 className="text-4xl md:text-[56px] leading-tight font-extrabold">Remote patient monitoring at hospital scale.</h1>
          <p className="mt-4 text-lg md:text-xl text-white/75 max-w-[640px] mx-auto">Reduce cardiac readmissions. Monitor post-discharge patients automatically. Build a digital health revenue stream. Agatsa One's hospital platform is built for the scale, compliance, and integration requirements of large healthcare institutions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/demo" className="bg-primary text-primary-foreground rounded-full px-8 py-4 font-semibold hover:opacity-90 transition">Schedule a Hospital Demo</Link>
            <button className="border border-white/40 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition">Download Hospital Brochure</button>
          </div>
        </motion.div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-background">
        <motion.div className="max-w-3xl mx-auto px-4 text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">The readmission problem costs Indian hospitals billions.</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-[720px] mx-auto">Cardiac readmission within 30 days of discharge is the most expensive and most preventable outcome in hospital medicine. Studies show that 70% of cardiac readmissions could be prevented with adequate post-discharge monitoring. Most hospitals don't have the infrastructure to provide it. Agatsa One does.</p>
          <div className="mt-10">
            <p className="text-6xl font-extrabold text-primary">1 in 4</p>
            <p className="mt-2 text-foreground font-semibold text-lg">cardiac patients is readmitted within 30 days of discharge in India.</p>
            <p className="text-muted-foreground text-sm mt-1">Most readmissions are preventable with early warning.</p>
          </div>
        </motion.div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-2">What You Get</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Four reasons hospitals choose Agatsa One.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {valueProps.map((v, i) => (
              <motion.div key={i} className="bg-card rounded-3xl border p-8 shadow-sm" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <v.icon className="text-primary mb-4" size={36} />
                <h3 className="text-xl font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-2">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Transparent SaaS pricing for healthcare institutions.</h2>
            <p className="text-muted-foreground mt-2">All plans exclude GST. Annual billing available at 15% discount.</p>
          </motion.div>

          {/* Desktop table */}
          <motion.div className="hidden md:block overflow-x-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-muted-foreground font-medium">Feature</th>
                  {tiers.map((t, i) => (
                    <th key={t} className={`p-4 text-center font-bold text-foreground ${i === 2 ? "border-2 border-primary rounded-t-2xl bg-primary/5" : ""}`}>
                      {t}
                      {i === 2 && <Badge className="ml-2 bg-primary text-primary-foreground text-[10px]">Most Popular</Badge>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium text-foreground">Price</td>
                  {prices.map((p, i) => (
                    <td key={i} className={`p-4 text-center font-bold text-foreground ${i === 2 ? "border-x-2 border-primary bg-primary/5" : ""}`}>{p}</td>
                  ))}
                </tr>
                {rows.map((r, ri) => (
                  <tr key={ri} className="border-b">
                    <td className="p-4 text-foreground">{r.label}</td>
                    {r.values.map((v, vi) => (
                      <td key={vi} className={`p-4 text-center ${vi === 2 ? "border-x-2 border-primary bg-primary/5" : ""} ${ri === rows.length - 1 && vi === 2 ? "border-b-2 rounded-b-2xl" : ""}`}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-6">
            {tiers.map((t, ti) => (
              <motion.div key={t} className={`rounded-2xl border p-6 ${ti === 2 ? "border-2 border-primary bg-primary/5" : "bg-card"}`} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-foreground">{t}</h3>
                  {ti === 2 && <Badge className="bg-primary text-primary-foreground text-[10px]">Most Popular</Badge>}
                </div>
                <p className="text-2xl font-extrabold text-foreground mb-4">{prices[ti]}</p>
                <ul className="space-y-2 text-sm">
                  {rows.map((r, ri) => (
                    <li key={ri} className="flex justify-between">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium text-foreground"><Cell v={r.values[ti]} /></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/demo" className="inline-block bg-primary text-primary-foreground rounded-full px-10 py-4 font-semibold hover:opacity-90 transition text-lg">Schedule a Hospital Demo</Link>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-muted/30">
        <motion.div className="max-w-[800px] mx-auto px-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="bg-card rounded-3xl p-10 border shadow-sm">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Case Study</p>
            <h3 className="text-2xl font-bold text-foreground mb-3">How a 150-bed cardiac hospital reduced 30-day readmissions by 34%</h3>
            <p className="text-muted-foreground mb-4">A mid-size cardiac hospital in Chennai deployed Agatsa One for post-discharge monitoring in their cardiac ICU step-down unit. In 6 months, 30-day readmissions dropped from 18% to 12%.</p>
            <Link to="/case-studies/cardiac-hospital" className="text-primary font-semibold hover:underline">Read the full case study →</Link>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="bg-[hsl(var(--dark-bg))] py-20">
        <motion.div className="max-w-3xl mx-auto px-4 text-center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to build the remote monitoring programme your patients deserve?</h2>
          <p className="mt-4 text-white/75 text-lg">Talk to our hospital partnerships team. We'll design the right deployment for your institution.</p>
          <Link to="/demo" className="inline-block mt-8 bg-primary text-primary-foreground rounded-full px-10 py-5 font-semibold text-lg hover:opacity-90 transition">Schedule a Hospital Demo</Link>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
