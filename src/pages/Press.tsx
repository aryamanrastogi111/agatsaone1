import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Download, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const pressHighlights = [
  { date: "March 2025", title: "Agatsa One crosses 2.1 Lac+ users across India", source: "Company Announcement" },
  { date: "January 2025", title: "Nera AI voice health assistant launches in public beta", source: "Product Launch" },
  { date: "November 2024", title: "SanketLife ECG validated at 98.15% sensitivity — Sri Jayadeva Institute", source: "Clinical Validation" },
  { date: "September 2024", title: "EasyTouch Wellness metabolic health monitor — 15,000 active users", source: "Clinical Validation" },
  { date: "July 2024", title: "Agatsa receives CDSCO Class B certification for SanketLife ECG", source: "Regulatory" },
  { date: "March 2024", title: "Agatsa launches 5 AI-guided Care Programmes for chronic disease management", source: "Product Launch" },
  { date: "2023", title: "Agatsa wins mBillionth Award for Health Innovation", source: "Award" },
  { date: "2022", title: "Aegis Graham Bell Award for Innovation in IoT Health", source: "Award" },
];

const mediaKit = [
  "Agatsa brand guidelines (logo, colours, typography)",
  "High-resolution product images (all devices)",
  "Founder headshots and bios",
  "Company fact sheet and backgrounder",
  "Clinical validation summaries",
];

export default function Press() {
  useSEO({ title: "Press & Media — Agatsa One | AI Health Monitoring", description: "Press releases, media coverage, and brand assets for Agatsa. For media enquiries, contact press@agatsa.com." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-28 pb-16 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Press & Media</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Agatsa in the News</h1>
          <p className="text-lg text-muted-foreground mt-4">Press releases, media coverage, awards, and brand resources. For press enquiries, contact <a href="mailto:press@agatsa.com" className="text-primary font-medium">press@agatsa.com</a></p>
        </motion.div>
      </section>

      {/* Key facts */}
      <section className="py-12 bg-background">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "2.1 Lac+", label: "Users" },
            { stat: "2015", label: "Founded" },
            { stat: "98.15%", label: "ECG Sensitivity" },
            { stat: "CDSCO", label: "Class B Certified" },
          ].map((s, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <p className="text-3xl font-extrabold text-primary">{s.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Press Highlights & Milestones</h2>
          <div className="space-y-4">
            {pressHighlights.map((item, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.source}</p>
                </div>
                <span className="text-xs font-medium text-primary whitespace-nowrap">{item.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <Download className="h-8 w-8 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Media Kit</h2>
                <p className="text-muted-foreground mt-1">Download brand assets, product images, and company information for your article or coverage.</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {mediaKit.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="mailto:press@agatsa.com?subject=Media Kit Request">
              <Button className="rounded-full bg-primary text-primary-foreground px-8">
                <Mail className="h-4 w-4 mr-2" /> Request Media Kit
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold">Media Enquiries</h2>
          <p className="mt-2 opacity-90">For interviews, quotes, or story collaboration, reach our communications team.</p>
          <a href="mailto:press@agatsa.com">
            <Button className="mt-6 rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8">
              <ExternalLink className="h-4 w-4 mr-2" /> press@agatsa.com
            </Button>
          </a>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
