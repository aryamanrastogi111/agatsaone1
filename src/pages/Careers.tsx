import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Heart, Cpu, Users, Rocket, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const values = [
  { icon: Heart, title: "Mission-Driven", desc: "Every line of code and circuit we build serves one goal — making cardiac monitoring accessible to every Indian household." },
  { icon: Cpu, title: "Deep Tech", desc: "We work at the intersection of medical hardware, AI, and mobile software. If you want to build things that truly matter, this is the place." },
  { icon: Users, title: "Small Team, Big Impact", desc: "We're a lean team where every person's contribution is visible. No bureaucracy. Ship fast, learn faster." },
  { icon: Rocket, title: "Growth Stage", desc: "2.1 Lac+ users, CDSCO certified, clinical validation at India's top hospitals. We're scaling — and hiring for the next phase." },
];

const openings = [
  { role: "Embedded Firmware Engineer", dept: "Hardware", location: "New Delhi", type: "Full-time" },
  { role: "Senior Flutter Developer", dept: "Mobile", location: "Remote (India)", type: "Full-time" },
  { role: "AI/ML Engineer — Health AI", dept: "AI", location: "New Delhi / Remote", type: "Full-time" },
  { role: "Clinical Affairs Specialist", dept: "Medical", location: "New Delhi", type: "Full-time" },
  { role: "Growth Marketing Manager", dept: "Marketing", location: "New Delhi", type: "Full-time" },
  { role: "Customer Success Executive", dept: "Support", location: "New Delhi", type: "Full-time" },
];

export default function Careers() {
  useSEO({ title: "Careers at Agatsa — Build India's AI Health Platform", description: "Join Agatsa and help build India's most trusted AI health monitoring platform. Open roles in engineering, AI, clinical affairs, and marketing." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-16 pb-12 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Careers</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Build technology that saves lives</h1>
          <p className="text-lg text-muted-foreground mt-4">We're a team of engineers, designers, doctors, and builders creating India's most advanced AI health monitoring ecosystem. Come build with us.</p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Why Agatsa</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6">
                <v.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Open Positions</h2>
          <p className="text-muted-foreground text-center mb-10">Don't see a role that fits? Send your resume to <a href="mailto:careers@agatsa.com" className="text-primary font-medium">careers@agatsa.com</a></p>
          <div className="space-y-4">
            {openings.map((job, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-foreground">{job.role}</h3>
                  <p className="text-sm text-muted-foreground">{job.dept} · {job.location} · {job.type}</p>
                </div>
                <a href={`mailto:careers@agatsa.com?subject=Application: ${job.role}`}>
                  <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5 text-sm">Apply</Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto px-4">
          <Mail className="h-10 w-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold">Don't see your role?</h2>
          <p className="mt-2 opacity-90">We're always looking for exceptional people. Send your resume and a note about what excites you about Agatsa.</p>
          <a href="mailto:careers@agatsa.com">
            <Button className="mt-6 rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8">Email careers@agatsa.com</Button>
          </a>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
