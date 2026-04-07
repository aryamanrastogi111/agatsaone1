import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Monitor, BarChart3, Smartphone, ClipboardList, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const fade = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const stats = [
  { num: "1 in 3", desc: "Corporate heart attacks affect employees under 45", src: "(Indian Heart Journal, 2024)" },
  { num: "₹28 lakhs", desc: "Average cost of a single cardiac hospitalisation including productivity loss", src: "" },
  { num: "72%", desc: "Of employees with cardiac risk have never had an ECG", src: "" },
];

const features = [
  { icon: Monitor, title: "Biometric screening camps", body: "On-site ECG and vitals screening for your entire workforce. No equipment purchase required. Agatsa deploys everything." },
  { icon: BarChart3, title: "Anonymous aggregate dashboard", body: "See your organisation's health risk profile without individual data. Risk distribution, programme adherence, improvement metrics." },
  { icon: Smartphone, title: "Employee app and devices", body: "Subsidised or fully-funded device bundles for high-risk employees. ECG, wellness monitor, band, or smart scale." },
  { icon: ClipboardList, title: "Care programme enrolment", body: "Structured 8-week Corporate Wellness Programme for eligible employees — daily tasks, AI nudges, HR reporting." },
  { icon: FileText, title: "HR reporting", body: "Monthly aggregate reports: risk distribution, programme adherence, improvement metrics. Fully anonymised. DPDP Act compliant." },
  { icon: ShieldCheck, title: "Insurance data", body: "Aggregate health improvement data to support group insurance premium renegotiation with your insurer." },
];

const tiers = [
  { name: "Small Team", range: "20–99 employees", price: "From ₹699/employee/month", desc: "Biometric screening + individual Nera AI + basic HR dashboard", popular: false },
  { name: "Enterprise", range: "100–499 employees", price: "From ₹599/employee/month", desc: "Everything + Care programme enrolment + quarterly health reports", popular: true },
  { name: "Large Enterprise", range: "500+ employees", price: "From ₹499/employee/month", desc: "Everything + volume pricing + dedicated health programme manager", popular: false },
];

export default function ForCorporatesPage() {
  useSEO({ title: "Corporate Cardiac Health Programme — Agatsa One for Employers", description: "Prevent cardiac events in your workforce. Biometric screening, anonymous aggregate dashboards, employee care programmes. ROI from day one." });

  const [formData, setFormData] = useState({ company: "", employees: "", name: "", phone: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll respond within 24 hours.");
    setFormData({ company: "", employees: "", name: "", phone: "", email: "" });
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-32 pb-20" style={{ background: "linear-gradient(180deg, #F8F4FF 0%, #FFFFFF 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>FOR CORPORATES</span>
            <h1 className="mt-4 font-extrabold leading-tight" style={{ color: "#1A1A2E", fontSize: "clamp(34px,4vw,52px)" }}>
              Your best employees are also your highest cardiac risks.
            </h1>
            <p className="mt-4 text-lg max-w-[520px]" style={{ color: "#4A4A68" }}>
              High-performing professionals are 2.4x more likely to have undetected hypertension. 1 in 3 corporate heart attacks happens to someone under 45. Stress, sedentary work, and delayed medical care are a lethal combination. Agatsa One Corporate changes that.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="rounded-full px-8 py-4 text-base" style={{ background: "#7C4DFF" }}>Request a Corporate Demo</Button>
              <Button variant="outline" className="rounded-full px-8 py-4 text-base" style={{ borderColor: "#7C4DFF", color: "#7C4DFF" }}>Download Corporate Brochure</Button>
            </div>
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <img src="https://placehold.co/560x420/7C4DFF/FFFFFF?text=Corporate+Dashboard" alt="Corporate Dashboard" className="rounded-3xl w-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>THE DATA</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>The data your HR team needs to see</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {stats.map((s, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center p-8 rounded-3xl border border-border bg-card">
                <p className="font-extrabold" style={{ fontSize: "clamp(48px,5vw,72px)", color: "#7C4DFF" }}>{s.num}</p>
                <p className="mt-2 text-base" style={{ color: "#1A1A2E" }}>{s.desc}</p>
                {s.src && <p className="mt-1 text-xs" style={{ color: "#4A4A68" }}>{s.src}</p>}
              </motion.div>
            ))}
          </div>
          <motion.p variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-3xl mx-auto text-center text-base" style={{ color: "#4A4A68" }}>
            Your health insurance covers treatment. It doesn't prevent it. Agatsa One Corporate gives you a proactive programme that identifies at-risk employees before an event — and gives them the tools to reverse that risk.
          </motion.p>
        </div>
      </section>

      {/* What Corporates Get */}
      <section className="py-20" style={{ background: "#F8F4FF" }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>WHAT YOU GET</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>A complete corporate cardiac health programme.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl p-8 border border-border">
                <f.icon size={32} style={{ color: "#7C4DFF" }} />
                <h3 className="mt-4 text-lg font-bold" style={{ color: "#1A1A2E" }}>{f.title}</h3>
                <p className="mt-2 text-sm" style={{ color: "#4A4A68" }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>THE MATHS</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>The maths work. Here's why.</h2>
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-[800px] mx-auto rounded-3xl p-12" style={{ background: "#F8F4FF" }}>
            <p className="text-base leading-relaxed" style={{ color: "#4A4A68" }}>
              A company with 500 employees. Average salary ₹12 lakhs/year. If 3 employees have a cardiac event this year, the total cost (hospitalisation + productivity loss + replacement) is approximately ₹84 lakhs. Agatsa One Corporate for 500 employees costs ₹1.5 lakhs/year. If we prevent even one cardiac event, the ROI is 56x.
            </p>
            <div className="mt-8 text-center">
              <p className="font-extrabold" style={{ fontSize: "clamp(48px,5vw,64px)", color: "#7C4DFF" }}>56x ROI</p>
              <p className="mt-2 text-base" style={{ color: "#4A4A68" }}>if just one cardiac event is prevented in a 500-person team</p>
            </div>
            <div className="mt-6 text-center">
              <Link to="/roi-calculator" className="text-sm font-medium hover:underline" style={{ color: "#7C4DFF" }}>Calculate your organisation's ROI →</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20" style={{ background: "#F8F4FF" }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>PRICING</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>Programmes from ₹499/employee/month</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {tiers.map((t, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className={`relative bg-card rounded-3xl p-8 border ${t.popular ? "border-2" : "border-border"}`}
                style={t.popular ? { borderColor: "#7C4DFF" } : {}}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1 rounded-full" style={{ background: "#7C4DFF" }}>Most Popular</span>
                )}
                <h3 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>{t.name}</h3>
                <p className="mt-1 text-sm" style={{ color: "#4A4A68" }}>{t.range}</p>
                <p className="mt-4 text-lg font-extrabold" style={{ color: "#7C4DFF" }}>{t.price}</p>
                <p className="mt-3 text-sm" style={{ color: "#4A4A68" }}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm" style={{ color: "#4A4A68" }}>Volume discounts available for 1,000+ employees. Contact us for custom pricing.</p>
        </div>
      </section>

      {/* Final CTA + Form */}
      <section className="py-20" style={{ background: "#7C4DFF" }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold">Healthy employees don't just cost less. They perform better.</h2>
            <p className="mt-4 text-lg opacity-80 max-w-xl mx-auto">Get a custom quote for your organisation. Programmes from 20 to 10,000+ employees.</p>
          </motion.div>
          <motion.form variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="mt-10 bg-card text-foreground rounded-2xl p-8 max-w-[560px] mx-auto shadow-xl space-y-4 text-left"
          >
            <div>
              <label className="text-sm font-medium" style={{ color: "#1A1A2E" }}>Company name</label>
              <Input value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1A1A2E" }}>Number of employees</label>
              <Select value={formData.employees} onValueChange={v => setFormData(p => ({ ...p, employees: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="20-99">20–99</SelectItem>
                  <SelectItem value="100-499">100–499</SelectItem>
                  <SelectItem value="500-999">500–999</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1A1A2E" }}>Contact name</label>
              <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1A1A2E" }}>Phone number</label>
              <Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required placeholder="+91" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1A1A2E" }}>Email address</label>
              <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full rounded-full py-4 text-base" style={{ background: "#7C4DFF" }}>Request Corporate Quote</Button>
            <p className="text-xs text-center" style={{ color: "#4A4A68" }}>We'll respond within 24 hours with a customised proposal.</p>
          </motion.form>
        </div>
      </section>
    </SiteLayout>
  );
}
