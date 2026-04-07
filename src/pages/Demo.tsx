import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Monitor, Users, BarChart3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const demoIncludes = [
  "Live walkthrough of the Agatsa Provider Portal",
  "Device demonstration — ECG, EasyTouch, Rhythm Band, Smart Scale",
  "Nera AI capabilities and Care Programme overview",
  "Pricing and deployment options for your use case",
  "Q&A with our partnerships team",
];

export default function Demo() {
  useSEO({ title: "Book a Demo — Agatsa One for Providers", description: "Schedule a personalised demo of Agatsa One. See the provider portal, devices, and Nera AI in action. Free, 30-minute session." });

  const [form, setForm] = useState({ name: "", email: "", phone: "", org: "", role: "", message: "" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Demo request submitted! We'll contact you within 24 hours to schedule.");
    setForm({ name: "", email: "", phone: "", org: "", role: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="pt-16 pb-12 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Book a Demo</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">See Agatsa One in action</h1>
          <p className="text-lg text-muted-foreground mt-4">Schedule a free 30-minute demo with our team. We'll show you the provider portal, devices, and AI capabilities tailored to your use case.</p>
        </motion.div>
      </section>

      {/* What's included */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Monitor, title: "Live Portal Demo", desc: "See the provider dashboard with real patient data" },
            { icon: Users, title: "Device Hands-On", desc: "Watch ECG, metabolic health, and vitals readings in real time" },
            { icon: BarChart3, title: "AI & Analytics", desc: "Explore Nera AI reports and population health dashboards" },
          ].map((f, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6">
              <f.icon className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="font-bold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-[1fr_380px] gap-12">
          <motion.form {...fade} onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Request a Demo</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <Input type="email" placeholder="Work email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Phone (+91)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              <Input placeholder="Organisation name" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} required />
            </div>
            <Input placeholder="Your role (e.g., Cardiologist, Hospital Admin, HR Head)" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
            <Textarea placeholder="Tell us about your use case (optional)" rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            <Button type="submit" className="rounded-full px-8 bg-primary text-primary-foreground w-full sm:w-auto">Schedule Demo</Button>
          </motion.form>

          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-4">
            <h3 className="font-bold text-foreground">What's included in the demo:</h3>
            <ul className="space-y-3">
              {demoIncludes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <div className="bg-card border border-border rounded-xl p-4 mt-6">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Need help?</span><br />Email us at <a href="mailto:info@agatsa.com" className="text-primary font-medium">info@agatsa.com</a></p>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
