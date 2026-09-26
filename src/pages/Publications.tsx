import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { FileText, Download, BookOpen, FlaskConical, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const publications = [
  {
    title:
      "Assessment of Diagnostic Accuracy of SanketLife — A Wireless, Pocket-Sized ECG Biosensor — in Comparison to Standard 12-Lead ECG in the Detection of Cardiovascular Diseases in a Tertiary Care Setting",
    journal: "Indian Pacing and Electrophysiology Journal",
    year: "2019",
    description:
      "A prospective diagnostic accuracy trial at Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru, comparing SanketLife against the hospital-grade GE-2000 12-lead ECG across 100 cardiology OPD patients.",
    finding: "98.15% sensitivity and 100% specificity in diagnosing major cardiovascular conditions (Major Minnesota codes).",
    pdf: "/media-recognition/Indian_Journal_of_Electrocardilogy.pdf",
    link: "https://pubmed.ncbi.nlm.nih.gov/31866552/",
  },
  {
    title:
      "Identifying the Prevalence of the Life-Threatening Atrial Fibrillation Using a Smartphone-Based Wireless Electrocardiography Device: An Observational Study",
    journal: "Journal of the Practice of Cardiovascular Sciences",
    year: "2019",
    description:
      "An observational study by Agatsa's R&D team evaluating SanketLife's 12-lead and single-lead recordings across homes, diagnostic labs and hospital OPDs, with every report verified by a certified ECG expert and cardiologist.",
    finding: "SanketLife effectively captured atrial fibrillation cases across every care setting — from home self-monitoring to tertiary care.",
    pdf: "/media-recognition/Identifying_the_Prevalence_of_the_Life-threatening.pdf",
    link: "https://journals.lww.com/jpcs/fulltext/2019/05030/identifying_the_prevalence_of_the_life_threatening.11.aspx",
  },
  {
    title:
      "Cross-Sectional Study to Find Out the Prevalence of Cardiovascular Diseases Through Detection of ECG Abnormalities in Undiagnosed Population Using a Handheld ECG Device, SanketLife Pro Plus",
    journal: "Indian Journal of Clinical Practice",
    year: "2024",
    description:
      "A cross-sectional screening study conducted at a free ECG camp in the OPD of Indraprastha Apollo Hospitals, New Delhi, assessing ECG findings in 100 general OPD patients not previously diagnosed with any cardiovascular disease.",
    finding: "Detected silent ischemia signals (ST depression, T-wave inversions) in an undiagnosed population — evidence for mass ECG screening.",
    link: "https://ojs.ijcp.in/index.php/IJCP/article/view/946",
  },
  {
    title: "Accuracy of Smartphone-Connected ECG Devices in Remote Cardiac Monitoring",
    journal: "SpringerPlus (BMC)",
    year: "2016",
    description:
      "Peer-reviewed evaluation of smartphone-connected ECG acquisition, demonstrating high concordance with standard 12-lead hospital equipment across a diverse patient population.",
    finding: "High concordance with hospital-grade ECG across diverse patient groups.",
    pdf: "/media-recognition/s40064-016-1932-z.pdf",
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
            { stat: "100%", label: "ECG Specificity" },
            { stat: "4", label: "Peer-Reviewed Papers" },
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
                  <div className="flex flex-wrap gap-3 mt-4">
                    {p.pdf && (
                      <a href={p.pdf} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-full">
                          <Download className="h-4 w-4 mr-2" /> Read Full Paper (PDF)
                        </Button>
                      </a>
                    )}
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-full">
                          <BookOpen className="h-4 w-4 mr-2" /> View on Journal Site
                        </Button>
                      </a>
                    )}
                  </div>
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
                  href="/media-recognition/sanketlife-publications-1pager.pdf"
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
