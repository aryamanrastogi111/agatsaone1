import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Monitor, Users, BarChart3, Check } from "lucide-react";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const demoIncludes = [
  "Live walkthrough of the Agatsa Provider Portal",
  "Device demonstration — ECG, EasyTouch, Rhythm Band, Smart Scale",
  "Nera AI capabilities and Care Programme overview",
  "Pricing and deployment options for your use case",
  "Q&A with our partnerships team",
];

export default function Demo() {
  useSEO({ title: "Email Agatsa One for Providers", description: "For provider, hospital, clinic, and corporate enquiries, email Agatsa at info@agatsa.com." });

  return (
    <SiteLayout>
      <section className="pt-8 pb-8 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">For Providers</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Email us at info@agatsa.com</h1>
          <p className="text-lg text-muted-foreground mt-4">For provider, hospital, clinic, and corporate enquiries, contact the Agatsa team directly by email.</p>
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

      {/* Contact */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-[1fr_380px] gap-12">
          <motion.div {...fade} className="bg-card border border-border rounded-2xl p-8 space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Email us at info@agatsa.com</h2>
            <p className="text-muted-foreground">
              For provider demos, hospital deployments, clinic onboarding, and corporate enquiries, please email us directly at info@agatsa.com.
            </p>
            <a href="mailto:info@agatsa.com?subject=Provider Demo Enquiry" className="inline-block rounded-full px-8 py-3 bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Email us at info@agatsa.com
            </a>
          </motion.div>

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
