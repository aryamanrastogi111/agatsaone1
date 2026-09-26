import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Award, Trophy, Newspaper, PlayCircle, ExternalLink, FileText, Building2, Star, Sparkles } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import type { VideoItem } from "@/components/VideoCard";

import sanketlifeHero from "@/assets/sanketlife-hero-new.webp";
import forbesNehaRastogi from "@/assets/forbes-neha-rastogi.jpg";
import aegisGrahamBellAward from "@/assets/aegis-graham-bell-award.webp";
import betterindiaSanketlife from "@/assets/betterindia-sanketlife.webp";
import entrepreneurAgatsa from "@/assets/entrepreneur-india-agatsa.jpg";
import aniNewsAgatsa from "@/assets/ani-news-agatsa.jpg";

import awardAegis from "@/assets/award-aegis-grahambell.webp";
import awardBioIndia from "@/assets/award-bio-india.webp";
import awardIgp from "@/assets/award-igp.webp";
import awardMashelkar from "@/assets/award-anjani-mashelkar.webp";
import awardMbillionth from "@/assets/award-mbillionth-new.png";

// PDFs live in Supabase Storage (bucket: media-recognition) and are opened via
// signed URLs minted on mount. This avoids ad-blocker false positives that hit
// the Lovable CDN path (`/__l5e/…`) and the `public/` folder size limits on hosting.
const PDF_FILES = {
  nidhi: "75-Promising-Startups-NIDHI-Seed-Support-Program.pdf",
  womenpreneurs: "CTB-75-womenpreneurs-of-India.pdf",
  ije: "Indian_Journal_of_Electrocardilogy.pdf",
  springer2016: "s40064-016-1932-z.pdf",
  sciRep2024: "s41598-024-84265-8.pdf",
  publications1Pager: "sanketlife-publications-1pager.pdf",
} as const;

type PdfKey = keyof typeof PDF_FILES;


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

const governmentRecognition: Array<{ title: string; body: string; icon: typeof Building2; pdfKey: PdfKey }> = [
  { title: "75 Promising Startups — NIDHI Seed Support Program", body: "Featured by Department of Science & Technology, Govt. of India (Vigyan Prasar, 2022).", icon: Building2, pdfKey: "nidhi" },
  { title: "75 Womenpreneurs of India", body: "Founder Neha Rastogi featured among India's top 75 women entrepreneurs.", icon: Star, pdfKey: "womenpreneurs" },
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
  { outlet: "The Better India", title: "How SanketLife Helps Prevent Heart Attacks & Detect Cardiac Symptoms", year: "2021", link: "https://thebetterindia.com/317906/how-to-prevent-heart-attack-detect-cardiac-symptoms-ecg-device-sanketlife-rahul-neha-rastogi-noida/", featured: true, img: betterindiaSanketlife, imgAlt: "Rahul and Neha Rastogi — SanketLife ECG device, The Better India" },
  { outlet: "Forbes India", title: "Self-Made Women: Neha Rastogi — Monitoring Heart Rates with a Keychain", year: "2020", link: "https://www.forbesindia.com/article/self-made-women-2020/neha-rastogi-monitoring-heart-rates-with-a-keychain/58069/1", featured: true, img: forbesNehaRastogi, imgAlt: "Neha Rastogi — Forbes India Self-Made Women 2020" },
  { outlet: "ANI News", title: "Agatsa Wins Aegis Graham Bell Award for Smallest ECG Device — SanketLife", year: "2022", link: "https://www.aninews.in/news/business/business/agatsa-wins-aegis-graham-bell-award-for-smallest-ecg-device-sanket-life20220308101813/", featured: true, img: aniNewsAgatsa, imgAlt: "Agatsa founders — Aegis Graham Bell Award, ANI News" },
  { outlet: "NEWS9 Live", title: "Agatsa's Life-Saving SanketLife 2.0", year: "—" },
  { outlet: "ET Now", title: "Rise with India Award feature", year: "—" },
  { outlet: "Entrepreneur India", title: "Portable ECG Maker Agatsa Raises INR 125 Million", year: "2022", link: "https://india.entrepreneur.com/news-and-trends/portable-ecg-maker-agatsa-raises-inr-125-million/427643", featured: true, img: entrepreneurAgatsa, imgAlt: "Agatsa founders — We Democratise Heart Health, Entrepreneur India" },
  { outlet: "YourStory", title: "Agatsa Software — Marico Innovation for India Awards", year: "2020", link: "https://yourstory.com/2020/10/problem-product-innovation-marico-awards" },
  { outlet: "Express Healthcare", title: "Healthcare Innovation Award feature", year: "—" },
  { outlet: "India SME Forum", title: "India SME 100 recognition", year: "—" },
];

export default function MediaRecognition() {
  useSEO({
    title: "Media & Recognition — Agatsa One | Awards, Press, Clinical Publications",
    description:
      "Awards, media features, expert videos and 14+ peer-reviewed clinical publications recognising Agatsa's SanketLife ECG and health devices. Featured by Govt. of India, Forbes, AIIMS and more.",
  });

  // Serve PDFs from same-origin /public path. Cross-domain URLs (Supabase, Lovable CDN)
  // get flagged by Chrome/uBlock ad-blockers as ERR_BLOCKED_BY_CLIENT.
  const pdfLinks: Record<PdfKey, string> = {
    nidhi: `/media-recognition/${PDF_FILES.nidhi}`,
    womenpreneurs: `/media-recognition/${PDF_FILES.womenpreneurs}`,
    ije: `/media-recognition/${PDF_FILES.ije}`,
    springer2016: `/media-recognition/${PDF_FILES.springer2016}`,
    sciRep2024: `/media-recognition/${PDF_FILES.sciRep2024}`,
    publications1Pager: `/media-recognition/${PDF_FILES.publications1Pager}`,
  };

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
            {governmentRecognition.map((r) => {
              const href = pdfLinks[r.pdfKey];
              return (
                <a
                  key={r.title}
                  href={href || "#"}
                  onClick={(e) => { if (!href) e.preventDefault(); }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-card border border-border rounded-2xl p-6 transition-all block ${href ? "hover:border-primary hover:shadow-md cursor-pointer" : "opacity-70 cursor-wait"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <r.icon className="h-6 w-6 text-primary mb-3" />
                    <FileText className="h-4 w-4 text-primary/60" />
                  </div>
                  <h3 className="font-bold text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.body}</p>
                  <p className="text-xs text-primary font-semibold mt-3 inline-flex items-center gap-1">View PDF <ExternalLink className="h-3 w-3" /></p>
                </a>
              );
            })}


          </div>
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
              >
                {"link" in m && m.link ? (
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all group relative ${("featured" in m && m.featured) ? "border-primary/50 ring-2 ring-primary/20 shadow-md" : "border-border hover:border-primary"}`}
                  >
                    {("featured" in m && m.featured) && (
                      <>
                        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-3">
                          <img src={"img" in m && m.img ? m.img : forbesNehaRastogi} alt={"imgAlt" in m && m.imgAlt ? m.imgAlt : m.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Featured
                          </div>
                        </div>
                      </>
                    )}
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{m.outlet}</p>
                      <p className="text-sm font-medium text-foreground mt-2 leading-snug">{m.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                        {m.year !== "—" && <span>{m.year}</span>}
                        {m.year !== "—" && " · "}
                        <span className="text-primary font-semibold inline-flex items-center gap-1">Read article <ExternalLink className="h-3 w-3" /></span>
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{m.outlet}</p>
                    <p className="text-sm font-medium text-foreground mt-2 leading-snug">{m.title}</p>
                    {m.year !== "—" && <p className="text-xs text-muted-foreground mt-1">{m.year}</p>}
                  </div>
                )}
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
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a
              href={pdfLinks.publications1Pager || "#"}
              onClick={(e) => { if (!pdfLinks.publications1Pager) e.preventDefault(); }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3 transition-colors"
            >
              <FileText className="h-4 w-4" /> Download Publications 1-Pager
            </a>
            <a
              href="mailto:info@agatsa.com?subject=Media%20%26%20Recognition%20Enquiry"
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 border border-white/40 text-primary-foreground hover:bg-primary-foreground/20 font-semibold px-6 py-3 transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> info@agatsa.com
            </a>
          </div>

        </motion.div>
      </section>
    </SiteLayout>
  );
}
