import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { FileText, Download, BookOpen, FlaskConical, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const publications = [
  {
    title: "Validation of a Pocket-Size 12-Lead ECG Device for Ambulatory Cardiac Screening",
    journal: "Indian Journal of Electrocardiology",
    year: "2024",
    description:
      "A clinical validation study of SanketLife's leadless, sequential 12-lead ECG technology against hospital-grade simultaneous ECG systems, conducted at Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru.",
    finding: "98.15% ECG sensitivity for arrhythmia detection in ambulatory patients.",
    pdf: "/__l5e/assets-v1/e76847be-3971-4209-b354-11e3771063cc/Indian_Journal_of_Electrocardilogy.pdf",
  },
  {
    title: "Accuracy of Smartphone-Connected ECG Devices in Remote Cardiac Monitoring",
    journal: "SpringerPlus (BMC)",
    year: "2016",
    description:
      "Peer-reviewed evaluation of smartphone-connected ECG acquisition, demonstrating high concordance with standard 12-lead hospital equipment across a diverse patient population.",
    finding: "High concordance with hospital-grade ECG across diverse patient groups.",
    pdf: "/__l5e/assets-v1/4928c199-0b6a-4b76-b725-fb0b302b8cb8/s40064-016-1932-z.pdf",
  },
  {
    title: "Feasibility of Handheld ECG Technology for Early Detection of Cardiac Abnormalities",
    journal: "Scientific Reports (Nature Portfolio)",
    year: "2024",
    description:
      "Published research examining the feasibility and diagnostic reliability of handheld, leadless ECG technology for early detection of cardiac abnormalities in real-world settings.",
    finding: "Handheld ECG showed clinically acceptable diagnostic reliability for early detection.",
    pdf: "/__l5e/assets-v1/245bc160-1394-4543-abe1-b3de0248f6ad/s41598-024-84265-8.pdf",
  },
];

const institutions = [
  "Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru",
  "Narayana Health, Bengaluru",
  "Multiple multi-centre field deployments across India",
];

export default function Publications() {
  useSEO({
    title: "Clinical Publications & Peer-Reviewed Research — Agatsa",
    description:
      "Peer-reviewed clinical research validating Agatsa's SanketLife ECG technology, published in the Indian Journal of Electrocardiology, SpringerPlus and Scientific Reports.",
  });

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="pt-8 pb-10 text-center"
        style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}
      >
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            Clinical Evidence
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
            Clinical Publications & Peer-Reviewed Research
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Our technology is not just engineered — it is clinically validated and published in
            peer-reviewed medical journals. Explore the research behind SanketLife and the Agatsa
            health platform.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-background">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "98.15%", label: "ECG Sensitivity" },
            { stat: "3+", label: "Peer-Reviewed Papers" },
            { stat: "2", label: "Top Cardiac Institutes" },
            { stat: "1.5 Cr+", label: "Health Records Analysed" },
          ].map((s, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <p className="text-3xl font-extrabold text-primary">{s.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Publications list */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {publications.map((p, i) => (
            <motion.article
              key={i}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {p.journal} · {p.year}
                  </p>
                  <h2 className="text-xl font-bold text-foreground mt-1">{p.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
                  <p className="text-sm font-medium text-foreground mt-3 flex items-start gap-2">
                    <FlaskConical className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {p.finding}
                  </p>
                  <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                    <Button variant="outline" className="rounded-full">
                      <Download className="h-4 w-4 mr-2" /> Read Full Paper (PDF)
                    </Button>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}

          {/* 1-pager */}
          <motion.article
            {...fade}
            className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Summary Document
                </p>
                <h2 className="text-xl font-bold mt-1">SanketLife Publications — One-Page Overview</h2>
                <p className="text-sm opacity-90 mt-2 leading-relaxed">
                  A concise one-page summary of all clinical validations and publications covering
                  the SanketLife ECG platform — ideal for clinicians, partners and researchers.
                </p>
                <a
                  href="/__l5e/assets-v1/db0cfb04-1b0a-4fd0-86fb-195ced4b3e49/sanketlife-publications-1pager.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4"
                >
                  <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
                    <Download className="h-4 w-4 mr-2" /> Download Overview (PDF)
                  </Button>
                </a>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Validating institutions */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fade}>
            <Award className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Validated at India's Leading Cardiac Institutions</h2>
            <div className="mt-6 space-y-3">
              {institutions.map((inst, i) => (
                <p key={i} className="text-muted-foreground text-sm md:text-base">
                  {inst}
                </p>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-8">
              For research collaborations or clinical enquiries, write to{" "}
              <a href="mailto:info@agatsa.com" className="text-primary font-medium">
                info@agatsa.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
