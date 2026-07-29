import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Award, BookOpen, Trophy, Newspaper, PlayCircle, ExternalLink, FileText, Building2, Star, Globe } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import type { VideoItem } from "@/components/VideoCard";

import awardAegis from "@/assets/award-aegis-grahambell.webp";
import awardBioIndia from "@/assets/award-bio-india.webp";
import awardIgp from "@/assets/award-igp.webp";
import awardMashelkar from "@/assets/award-anjani-mashelkar.webp";
import awardMbillionth from "@/assets/award-mbillionth-new.png";

import pdfNidhi from "@/assets/pdfs/75-Promising-Startups-NIDHI-Seed-Support-Program.pdf.asset.json";
import pdfWomenpreneurs from "@/assets/pdfs/CTB-75-womenpreneurs-of-India.pdf.asset.json";
import pdfIJE from "@/assets/pdfs/Indian_Journal_of_Electrocardilogy.pdf.asset.json";
import pdfSpringer2016 from "@/assets/pdfs/s40064-016-1932-z.pdf.asset.json";
import pdfSciRep2024 from "@/assets/pdfs/s41598-024-84265-8.pdf.asset.json";
import pdfPublications1Pager from "@/assets/pdfs/sanketlife-publications-1pager.pdf.asset.json";


const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

const stats = [
  { value: "14+", label: "Peer-reviewed publications" },
  { value: "36+", label: "Awards & recognitions" },
  { value: "2.1 Lac+", label: "Users across India" },
  { value: "98.15%", label: "ECG clinical sensitivity" },
];

const featuredAwards = [
  { name: "Aegis Graham Bell Award", year: "2022", org: "Aegis School of Data Science", image: awardAegis },
  { name: "Anjani Mashelkar Prize", year: "2025", org: "Anjani Mashelkar Foundation", image: awardMashelkar },
  { name: "Global Bio-India Award", year: "2020", org: "Dept. of Biotechnology, Govt. of India", image: awardBioIndia },
  { name: "India Innovation Growth Programme", year: "2018", org: "DST & Lockheed Martin", image: awardIgp },
  { name: "mBillionth Award South Asia", year: "2019", org: "DEF & IAMAI", image: awardMbillionth },
];

const governmentRecognition = [
  { title: "75 Promising Startups — NIDHI Seed Support Program", body: "Featured by Department of Science & Technology, Govt. of India (Vigyan Prasar, 2022).", icon: Building2, pdf: pdfNidhi.url },
  { title: "75 Womenpreneurs of India", body: "Founder Neha Rastogi featured among India's top 75 women entrepreneurs.", icon: Star, pdf: pdfWomenpreneurs.url },
  { title: "Startup India — DPIIT Recognition", body: "Recognised startup under Startup India by Govt. of India.", icon: Building2 },
  { title: "BIRAC BIG Grant", body: "Biotechnology Industry Research Assistance Council grant recipient.", icon: Building2 },
  { title: "Make in India Champion", body: "Indigenous medical device design & manufacture.", icon: Globe },
  { title: "NASSCOM Emerge 50", body: "Recognised among India's most promising emerging tech startups.", icon: Trophy },
];


const publications = [
  {
    year: "2020",
    title: "Assessment of Diagnostic Accuracy of SanketLife",
    journal: "Indian Pacing & Electrophysiology Journal (Elsevier · PubMed Indexed)",
    body: "Prospective trial of 100 patients at Sri Jayadeva Institute, Bangalore. Matched gold-standard GE-2000 with 98.15% sensitivity and 100% specificity for LBBB, RBBB, ST-segment changes and AV blocks. Co-authored with Emory University & Texas A&M.",
  },
  {
    year: "2019",
    title: "Identifying Prevalence of Life-Threatening Atrial Fibrillation",
    journal: "Journal of Practical Cardiovascular Sciences · Medknow / Wolters Kluwer",
    body: "Analysed 8,005 SanketLife ECG reports over 2 months across home, OPD and PHC settings. First large-scale real-world SanketLife dataset, confirming feasibility for continuous AFib monitoring across all care levels.",
  },
  {
    year: "2018",
    title: "Wireless, Pocket-Sized ECG Monitor: A Potential Tool in CVD Detection",
    journal: "Journal of Practical Cardiovascular Sciences · AIIMS New Delhi, Dept. of Cardiology",
    body: "AIIMS-led evaluation of SanketLife's diagnostic reliability as a wireless pocket ECG in cardiovascular disease detection.",
  },
  {
    year: "2016",
    title: "Smart Phone ECG — Bridging the Gap",
    journal: "Journal of Advanced Research in Medical Science & Technology · ADR Journals",
    body: "Agatsa's foundational accuracy study. 6-lead ECG intervals validated against a traditional ECG — the first published clinical evidence for SanketLife.",
    pdf: pdfSpringer2016.url,
  },
  {
    year: "2024",
    title: "Indian Journal of Electrocardiology — Featured",
    journal: "Indian Society of Electrocardiology · Vol. 1, February 2024",
    body: "Editorial coverage referencing SanketLife in the official journal of the Indian Society of Electrocardiology (Editors: Dr. Joy Thomas, Dr. Aparna Jaswal).",
    pdf: pdfIJE.url,
  },
  {
    year: "2024",
    title: "Scientific Reports — Nature Portfolio Publication",
    journal: "Scientific Reports · Nature Portfolio (Open Access)",
    body: "Peer-reviewed publication featuring SanketLife's clinical performance data in the Nature Portfolio's Scientific Reports journal.",
    pdf: pdfSciRep2024.url,
  },

  {
    year: "2020",
    title: "Patient Satisfaction in Community ECG Screening",
    journal: "Indian Journal of Community Health · 97.5% satisfaction",
    body: "Community-level screening study using SanketLife, reporting 97.5% patient satisfaction across camp deployments.",
  },
];

const globalCoverage = [
  { region: "India", detail: "IPEJ · IJCH · JPCS · AIIMS · ISECON · IoT Journal · BMJ India" },
  { region: "Indonesia", detail: "Indonesian Journal of Cardiology · COVID-19 ECG protocols" },
  { region: "South Korea", detail: "KISTI ScienceON National DB (200M+ records) · GOLD Open Access" },
];

const expertVideos: VideoItem[] = [
  { id: "u26lsahqY8k", title: "Dr. Sanjeev Gera Recommends SanketLife ECG" },
  { id: "RfXpcoGsJlA", title: "Dr. Vanita Arora — SanketLife: Hero For Your Heart" },
  { id: "LW1dBopGYl4", title: "NEWS9 Live: Agatsa's Life-Saving SanketLife 2.0" },
  { id: "0bLpUCQw-Xc", title: "AIIMS Event — Simplifying Heart Care with SanketLife" },
  { id: "Ird2TuUR0j4", title: "Neha Rastogi at Medical Expo India 2024" },
  { id: "wocf2tnTLmE", title: "Patients & Doctors Embrace SanketLife Pro Plus" },
];

const mediaMentions = [
  { outlet: "Forbes India", title: "20 Most Audacious Women in Business", year: "2020" },
  { outlet: "Forbes India", title: "Self-Made Women list", year: "2020" },
  { outlet: "Outlook Magazine", title: "Women Leaders Trailblazer", year: "—" },
  { outlet: "NEWS9 Live", title: "Agatsa's Life-Saving SanketLife 2.0", year: "—" },
  { outlet: "ET Now", title: "Rise with India Award feature", year: "—" },
  { outlet: "Entrepreneur India", title: "Entrepreneur India Award coverage", year: "—" },
  { outlet: "Express Healthcare", title: "Healthcare Innovation Award feature", year: "—" },
  { outlet: "India SME Forum", title: "India SME 100 recognition", year: "—" },
];

export default function MediaRecognition() {
  useSEO({
    title: "Media & Recognition — Agatsa One | Awards, Press, Clinical Publications",
    description:
      "Awards, media features, expert videos and 14+ peer-reviewed clinical publications recognising Agatsa's SanketLife ECG and health devices. Featured by Govt. of India, Forbes, AIIMS and more.",
  });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-16 pb-12 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Media & Recognition</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Recognised. Published. Trusted.</h1>
          <p className="text-lg text-muted-foreground mt-4">
            A decade of clinical validation, national awards and media coverage — from AIIMS and the Indian Society of Electrocardiology to Forbes, Govt. of India, and international peer-reviewed journals.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background border-y border-border">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <p className="text-3xl md:text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade} className="text-center mb-12">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Awards & Achievements</h2>
            <p className="text-muted-foreground mt-3">Recognised for innovation, impact and trust in healthcare.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {featuredAwards.map((a, i) => (
              <motion.div
                key={a.name}
                {...fade}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group"
              >
                <div className="aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden border border-border/60 flex items-center justify-center p-3 group-hover:border-primary/30 transition-all">
                  <img src={a.image} alt={a.name} className="w-full h-full object-contain" />
                </div>
                <p className="text-center text-sm font-semibold text-foreground mt-3">{a.name}</p>
                <p className="text-center text-xs text-muted-foreground">{a.org} · {a.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government & Institutional Recognition */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fade} className="text-center mb-10">
            <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Government & Institutional Recognition</h2>
            <p className="text-muted-foreground mt-3">Featured by leading Indian science, technology and startup institutions.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {governmentRecognition.map((r: any, i) => {
              const Wrapper: any = r.pdf ? motion.a : motion.div;
              const wrapperProps = r.pdf
                ? { href: r.pdf, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Wrapper
                  key={r.title}
                  {...wrapperProps}
                  {...fade}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`bg-card border border-border rounded-2xl p-6 transition-all block ${r.pdf ? "hover:border-primary hover:shadow-md cursor-pointer" : "hover:border-primary/30"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <r.icon className="h-6 w-6 text-primary mb-3" />
                    {r.pdf && <FileText className="h-4 w-4 text-primary/60" />}
                  </div>
                  <h3 className="font-bold text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.body}</p>
                  {r.pdf && <p className="text-xs text-primary font-semibold mt-3 inline-flex items-center gap-1">View PDF <ExternalLink className="h-3 w-3" /></p>}
                </Wrapper>
              );
            })}

          </div>
        </div>
      </section>

      {/* Clinical Publications */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fade} className="text-center mb-12">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Clinical Publications & Peer-Reviewed Research</h2>
            <p className="text-muted-foreground mt-3">14+ peer-reviewed journals, clinical studies and industry reports · 2016–2025</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { v: "98.15%", l: "Clinical sensitivity vs standard 12-lead ECG (IPEJ, Elsevier · 2020)" },
              { v: "100%", l: "Specificity — zero false positives (Sri Jayadeva Institute, Bangalore)" },
              { v: "8,005", l: "Real-world ECG scans analysed for AFib prevalence (JPCS · 2019)" },
            ].map((k) => (
              <div key={k.v} className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                <p className="text-3xl font-extrabold text-primary">{k.v}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{k.l}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {publications.map((p, i) => (
              <motion.article
                key={p.title}
                {...fade}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                  <h3 className="font-bold text-foreground text-lg">{p.title}</h3>
                  <span className="text-xs font-semibold text-primary whitespace-nowrap">{p.year}</span>
                </div>
                <p className="text-sm text-primary/80 font-medium">{p.journal}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{p.body}</p>
              </motion.article>
            ))}
          </div>

          {/* Global journal coverage */}
          <motion.div {...fade} className="mt-12 bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-foreground text-lg">Global Journal Coverage</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {globalCoverage.map((g) => (
                <div key={g.region} className="border border-border/60 rounded-xl p-4">
                  <p className="text-sm font-semibold text-foreground">{g.region}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Mentions */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fade} className="text-center mb-10">
            <Newspaper className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Media Mentions & Press Coverage</h2>
            <p className="text-muted-foreground mt-3">Featured across national business, health and technology media.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaMentions.map((m, i) => (
              <motion.div
                key={i}
                {...fade}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="bg-card border border-border rounded-xl p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{m.outlet}</p>
                <p className="text-sm font-medium text-foreground mt-2 leading-snug">{m.title}</p>
                {m.year !== "—" && <p className="text-xs text-muted-foreground mt-1">{m.year}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert & Media Videos */}
      <section className="py-16 md:py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fade} className="text-center mb-10">
            <PlayCircle className="h-8 w-8 text-[#7C4DFF] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#7C4DFF] mb-2 font-semibold">Expert & Media Videos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Doctors, hospitals & national media on Agatsa</h2>
            <p className="text-white/60 mt-3 max-w-2xl mx-auto">
              Cardiologists, institutions and journalists on the devices that power Agatsa One.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {expertVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Press CTA */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto px-4">
          <FileText className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold">Writing about Agatsa?</h2>
          <p className="mt-3 opacity-90">
            Download our media kit, request interviews or brand assets. For press enquiries and story collaborations, reach our communications team.
          </p>
          <a
            href="mailto:info@agatsa.com?subject=Media%20%26%20Recognition%20Enquiry"
            className="inline-flex items-center gap-2 mt-6 rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> info@agatsa.com
          </a>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
