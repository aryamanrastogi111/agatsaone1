import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Stethoscope, Building2, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const partnerTypes = [
  {
    icon: Stethoscope,
    title: "For Doctors & Clinics",
    desc: "Join the Agatsa Provider Network. Monitor patients remotely, receive ECG and vitals data, and extend your care beyond clinic walls — at no cost.",
    benefits: ["Free provider account", "Patient vitals dashboard", "ECG review and sharing tools", "Referral revenue share"],
    link: "/for-doctors",
    cta: "Learn More",
  },
  {
    icon: Building2,
    title: "For Hospitals",
    desc: "Deploy Agatsa for post-discharge cardiac monitoring. Reduce readmissions, improve outcomes, and offer patients a seamless home-monitoring experience.",
    benefits: ["White-label capability", "EHR integration", "Bulk device pricing", "Dedicated success manager"],
    link: "/for-hospitals",
    cta: "Learn More",
  },
  {
    icon: Briefcase,
    title: "For Corporates",
    desc: "Add cardiac health screening to your employee wellness programme. Biometric screening camps, anonymous aggregate dashboards, and individual care plans.",
    benefits: ["Employee health screening", "Anonymous aggregate reports", "On-site screening camps", "Custom wellness programmes"],
    link: "/for-corporates",
    cta: "Learn More",
  },
];

export default function Partner() {
  useSEO({ title: "Partner with Agatsa — Doctors, Hospitals, Corporates", description: "Partner with Agatsa to bring AI-powered cardiac monitoring to your patients, employees, or community. Free for doctors. SaaS for hospitals. Custom for corporates." });

  return (
    <SiteLayout>
      <section className="pt-28 pb-16 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Partnerships</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Partner with Agatsa</h1>
          <p className="text-lg text-muted-foreground mt-4">Whether you're a doctor, hospital, or employer — there's a way to bring AI-powered health monitoring to the people you serve.</p>
        </motion.div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {partnerTypes.map((p, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
              <p.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{p.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {p.benefits.map((b, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <Link to={p.link} className="mt-6">
                <Button className="w-full rounded-full bg-primary text-primary-foreground">{p.cta} <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold">Have a different partnership idea?</h2>
          <p className="mt-2 opacity-90">We're open to distribution partners, resellers, academic collaborators, and NGO partnerships.</p>
          <a href="mailto:partnerships@agatsa.com">
            <Button className="mt-6 rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8">Email partnerships@agatsa.com</Button>
          </a>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
