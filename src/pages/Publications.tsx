import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { FileText, Download, BookOpen, FlaskConical, Award, HeartPulse, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import rhythmBandSugarTrendPdf from "@/assets/publications/rhythm-band-sugar-trend-study.pdf";
import crossDeviceReproducibilityPdf from "@/assets/publications/cross-device-reproducibility-study.pdf";
import galaxyWatchSugarTrendPdf from "@/assets/publications/galaxy-watch-sugar-trend-study.pdf";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const ecgPublications = [
  {
    title:
      "Assessment of Diagnostic Accuracy of SanketLife — A Wireless, Pocket-Sized ECG Biosensor — in Comparison to Standard 12-Lead ECG in the Detection of Cardiovascular Diseases in a Tertiary Care Setting",
    journal: "Indian Pacing and Electrophysiology Journal",
    year: "2019",
    description:
      "A prospective diagnostic accuracy trial at Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru, comparing SanketLife against the hospital-grade GE-2000 12-lead ECG across 100 cardiology OPD patients.",
    finding: "98.15% sensitivity and 100% specificity in diagnosing major cardiovascular conditions (Major Minnesota codes).",
    pdf: "/media-recognition/Assessment_of_diagnostic_accuracy_of_SanketLife.pdf",
    link: "https://pubmed.ncbi.nlm.nih.gov/31866552/",
  },
  {
    title:
      "Diagnostic Accuracy of SanketLife Wireless ECG Biosensor vs Standard 12-Lead ECG — ResearchGate Repository",
    journal: "ResearchGate",
    year: "2019",
    description:
      "The same Sri Jayadeva Institute diagnostic accuracy trial, hosted on ResearchGate — the academic research network — providing open access to the full manuscript, figures and citation data for the international research community.",
    finding: "98.15% sensitivity and 100% specificity in diagnosing major cardiovascular conditions (Major Minnesota codes).",
    researchgate: "https://www.researchgate.net/publication/341072588",
  },
  {
    title:
      "Wireless, Pocket-Sized ECG Monitor: A Potential Tool used in the Detection of Cardiovascular Disease",
    journal: "Journal of Advanced Research in Medical Science and Technology",
    year: "2016",
    description:
      "A peer-reviewed study by Agatsa's founding team evaluating the accuracy of a pocket-sized, leadless, Bluetooth-connected 6-lead ECG monitor — the precursor to SanketLife — against a traditional hospital ECG machine, with sensitivity and specificity measured across field-tested patient interviews.",
    finding:
      "Demonstrated reliable remote cardiac monitoring with high concordance to standard ECG, establishing the feasibility of smartphone-connected, pocket-sized ECG for everyday cardiac care.",
    link: "http://paper.researchbib.com/view/paper/71855",
  },
  {
    title:
      "Identifying the Prevalence of the Life-Threatening Atrial Fibrillation Using a Smartphone-Based Wireless Electrocardiography Device: An Observational Study",
    journal: "Journal of the Practice of Cardiovascular Sciences",
    year: "2019",
    description:
      "An observational study by Agatsa's R&D team evaluating SanketLife's 12-lead and single-lead recordings across homes, diagnostic labs and hospital OPDs, with every report verified by a certified ECG expert and cardiologist.",
    finding: "SanketLife effectively captured atrial fibrillation cases across every care setting — from home self-monitoring to tertiary care.",
    pdf: "/media-recognition/Identifying_the_Prevalence_of_the_Life-threatening-2.pdf",
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
  {
    title:
      "Acceptance and Feasibility of Handheld Tele-ECG for Community Cardiac Screening in Urban Slum Populations",
    journal: "Indian Journal of Community Health",
    year: "2020",
    description:
      "A six-month, 410-patient field study at an urban health training centre attached to a tertiary care teaching hospital, evaluating SanketLife handheld Tele-ECG as a screening tool for walk-in patients and attenders.",
    finding:
      "97.5% of respondents were satisfied with handheld Tele-ECG, with abnormal readings (LVH 15.4%) confirmed by standard 12-lead ECG at the referral hospital — demonstrating 95% correlation and reliable community screening.",
    pdf: "/media-recognition/Acceptance_and_feasibility_for_handheld_Tele-ECG.pdf",
    link: "https://www.iaph.org.in/index.php/iaph/article/view/786",
  },
  {
    title:
      "Mass HCQ Prophylaxis in India's Urban Slums during COVID-19",
    journal: "BMJ Opinion",
    year: "2020",
    description:
      "A commentary published in BMJ Opinion during India's nationwide COVID-19 lockdown, examining the Brihanmumbai Municipal Corporation's seven-week mass chloroquine/hydroxychloroquine (CQ/HCQ) prophylaxis rollout for Dharavi and Mumbai's urban slums, and the ethical and epidemiological concerns of community-wide HCQ administration without rigorous monitoring or ethical approval.",
    finding:
      "Calls for an ethically approved randomised controlled trial (ring-vaccination design) before mass HCQ prophylaxis, alongside environmental sewage surveillance, self-collected gargle-and-spit testing, and dignified community quarantine — rather than police-led enforcement of unproven prophylaxis in marginalised slum populations.",
    pdf: "/media-recognition/Lancet_publications_1.pdf",
    link: "https://www.bmj.com/",
  },
  {
    title:
      "Assessment of Diagnostic Accuracy of SanketLife: A Wireless Portable ECG Biosensor in Comparison to Standard 12-Lead ECG in the Detection of Cardiovascular Diseases in a Tertiary Care Setting",
    journal: "Journal of the American College of Cardiology (JACC)",
    year: "2020",
    description:
      "A peer-reviewed abstract published in JACC — the flagship journal of the American College of Cardiology, USA — presenting the Sri Jayadeva Institute diagnostic accuracy trial of SanketLife against the standard 12-lead ECG, with co-authors from Texas A&M Health Science Center and Emory University, USA.",
    finding:
      "SanketLife demonstrated high diagnostic agreement with standard 12-lead ECG for major cardiovascular conditions, presented on the world's largest cardiology research platform.",
    link: "https://www.jacc.org/doi/10.1016/S0735-1097(20)30677-5",
  },
  {
    title:
      "Minimal or No Touch Electrocardiography Recording and Remote Heart Rhythm Monitoring during COVID-19 Pandemic Era",
    journal: "Indonesian Journal of Cardiology",
    year: "2020",
    description:
      "A review by cardiologists at Mohammad Hoesin General Hospital, Palembang, Indonesia, examining wireless, minimal/no-touch ECG technologies — including SanketLife — for remote heart rhythm monitoring of COVID-19 patients without risking viral transmission through electrode contact.",
    finding:
      "Wireless touch-based ECG devices enable safe remote cardiac monitoring of COVID-19 patients while protecting healthcare workers from exposure.",
    link: "https://www.ijconline.id/index.php/ijc/article/view/1010/548",
  },
];

const metabolicPublications: typeof ecgPublications = [
  {
    title:
      "Physiological Directional Concordance of a Wearable-Derived Sugar-Trend Algorithm Using EasyTouch Rhythm Band Data and Logged Meals",
    journal: "Agatsa One — Retrospective Observational Feasibility Study",
    year: "2026",
    description:
      "A retrospective observational feasibility analysis of the Agatsa One sugar-trend algorithm applied to EasyTouch Rhythm Band data — 83,090 observations from 128 real-world users and 3,190 logged meals — testing bidirectional transitions, meal-anchored directional response, post-peak recovery, timing-shift sensitivity and an orthogonal fasting-to-postprandial reference check.",
    finding:
      "Across 78,475 consecutive transitions the rise:fall ratio was 0.986; 66.2% of evaluable meal events showed an upward excursion; 78.0% of post-peak trajectories subsequently declined; and 20/21 participants (95.2%) showed higher median post-meal than fasting reference values (+26 mg/dL) — supporting physiological directional responsiveness, not numerical blood-glucose accuracy.",
    pdf: rhythmBandSugarTrendPdf,
  },
  {
    title:
      "Cross-Device Reproducibility of Physiological Directional Concordance in a Wearable-Derived Sugar-Trend Algorithm",
    journal: "Agatsa One — Retrospective Multi-Cohort Reproducibility Study",
    year: "2026",
    description:
      "A standalone retrospective multi-cohort study testing whether the Agatsa One sugar-trend algorithm exhibits reproducible bidirectional, meal-associated, recovery and physiological-state behavior across three distinct wearable ecosystems — Apple Watch (19,379 observations, 145 users), Samsung Galaxy Watch (2,939 observations, 28 users) and EasyTouch Rhythm Band (83,090 observations, 128 users).",
    finding:
      "Near-unity rise:fall ratios were reproduced across all three devices (1.006, 0.978, 0.986); meal-associated directionality, post-peak recovery and orthogonal fasting-to-postprandial ordering were present in every cohort — convergent evidence for device-spanning physiological directional responsiveness, distinct from numerical glucose validation.",
    pdf: crossDeviceReproducibilityPdf,
  },
  {
    title:
      "Physiological Directional Concordance of a Wearable-Derived Sugar-Trend Algorithm Using Samsung Galaxy Watch Data and Logged Meals",
    journal: "Agatsa One — Retrospective Observational Feasibility Study",
    year: "2026",
    description:
      "A retrospective observational feasibility analysis of the Agatsa One sugar-trend algorithm applied to Samsung Galaxy Watch data — 2,939 stored observations from 28 users and 837 logged meals — testing bidirectional transitions, meal-anchored directional response, post-peak recovery, timing-shift sensitivity and an orthogonal fasting-to-postprandial reference check.",
    finding:
      "Across 2,524 consecutive watch transitions the rise:fall ratio was 0.978 (24.3% rises, 24.9% falls); 63.9% of post-peak trajectories subsequently declined; and all 10/10 participants with paired fasting and post-meal reference measurements showed higher median post-meal values (+42 mg/dL) — supporting physiological directional responsiveness, not numerical blood-glucose accuracy.",
    pdf: galaxyWatchSugarTrendPdf,
  },
];

const institutions = [
  "Sri Jayadeva Institute of Cardiovascular Sciences & Research, Bengaluru",
  "Narayana Health, Bengaluru",
  "Multiple multi-centre field deployments across India",
];

function PublicationCard({ p, i }: { p: (typeof ecgPublications)[number]; i: number }) {
  return (
    <motion.article
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
            {p.researchgate && (
              <a href={p.researchgate} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="rounded-full">
                  <BookOpen className="h-4 w-4 mr-2" /> View on ResearchGate
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

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
            { stat: "13", label: "Peer-Reviewed Papers" },
            { stat: "1.5 Cr+", label: "Health Records Analysed" },
          ].map((s, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <p className="text-3xl font-extrabold text-primary">{s.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Two-column sections: SanketLife ECG | Rhythm Band */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fade} className="grid md:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Column 1 — SanketLife ECG */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <HeartPulse className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">Section 01</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">SanketLife ECG Clinical Research</h2>
                </div>
              </div>

              <div className="space-y-6">
                {ecgPublications.map((p, i) => (
                  <PublicationCard key={i} p={p} i={i} />
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
            </div>

            {/* Column 2 — Non-Invasive Blood Glucose / Metabolic Trends (Rhythm Band) */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">Section 02</p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                    Non-Invasive Blood Glucose & Metabolic Trends — Rhythm Band
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                {metabolicPublications.map((p, i) => (
                  <PublicationCard key={i} p={p} i={i} />
                ))}
                <motion.div
                  {...fade}
                  className="bg-card border border-dashed border-border rounded-2xl p-6 md:p-8 text-center"
                >
                  <FlaskConical className="h-7 w-7 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Additional peer-reviewed metabolic-trend validation studies are underway. For
                    research collaborations or early-access enquiries, write to{" "}
                    <a href="mailto:info@agatsa.com" className="text-primary font-medium">
                      info@agatsa.com
                    </a>
                    .
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Validating institutions */}
      <section className="py-16 bg-muted/30">
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
