import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import agatsaProducts from "@/assets/agatsa-products-family.webp";

const fade = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const team = [
  { photo: "https://placehold.co/280x280/7C4DFF/FFFFFF?text=RR", name: "Rahul Rastogi", title: "Co-founder & CEO", bio: "Electronics and telecommunications engineer turned medical-device entrepreneur. After his father Arun Kumar survived a sudden heart attack in 2013, Rahul set out to make hospital-grade ECG technology small enough to fit in a pocket and affordable enough for every Indian family. He leads product, engineering, and strategy at Agatsa." },
  { photo: "https://placehold.co/280x280/1A73E8/FFFFFF?text=NR", name: "Neha Rastogi", title: "Co-founder & COO", bio: "Electronics and telecommunications engineer who co-founded Agatsa with her husband Rahul in 2014 after the family's brush with cardiac disease. Neha oversees operations, partnerships, and distribution — building the networks that now put Agatsa devices into hospitals, clinics, defence units, and homes across India." },
];

const milestones = [
  { year: "2014", text: "Agatsa founded by Rahul and Neha Rastogi in Noida after Rahul's father survives a heart attack. Work begins on a pocket-sized ECG." },
  { year: "2015", text: "First SanketLife prototype built — a keychain-sized 12-lead ECG monitor." },
  { year: "2017", text: "First clinical validation at Sri Jayadeva Institute. 98.15% ECG sensitivity confirmed." },
  { year: "2018", text: "CDSCO Class B Medical Device license received. Commercial launch." },
  { year: "2020", text: "10,000 users milestone. EasyTouch Wellness Monitor launched." },
  { year: "2022", text: "Clinical validation across 15,000 users for optical monitoring (98.56%)." },
  { year: "2023", text: "Agatsa One app launched — unifying all devices in one platform." },
  { year: "2024", text: "2.1 Lac+ users. Nera AI engine launched." },
  { year: "2025", text: "Nera voice assistant launched. Care Programmes launched. B2B SaaS platform launched." },
  { year: "2026", text: "2.1 Lac+ users. Worldwide app availability. Camp screening. AI multimodal pipeline live." },
];

const regs = [
  { title: "CDSCO License", sub: "MFG/MD/2023/000231", body: "Class B Medical Device under Medical Devices Rules, 2017" },
  { title: "ISO 13485", sub: "Quality Management", body: "ISO 13485-compliant manufacturing quality management system" },
  { title: "Clinical Validation", sub: "Three independent studies", body: "Sri Jayadeva Institute (ECG, 2022) — 98.15% sensitivity. Narayana Health (ECG) — 98.5% accuracy. 15,000-user validation study (optical monitoring, 2023) — 98.56% accuracy." },
  { title: "Data Privacy", sub: "DPDP Act compliant", body: "India's Digital Personal Data Protection Act (2023). Data stored on Indian servers. No data sold to third parties." },
];

export default function About() {
  useSEO({ title: "About Agatsa — India's AI Health Monitoring Company | Nera AI", description: "Founded in 2015. CDSCO certified. 2.1 Lac+ users. Clinical validation at Sri Jayadeva and 15,000-user studies. Meet the team behind India's most trusted cardiac monitoring app." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-8 pb-8" style={{ background: "#1A1A2E" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>OUR MISSION</span>
            <h1 className="mt-6 font-extrabold text-white leading-tight" style={{ fontSize: "clamp(34px,4vw,52px)" }}>
              We believe preventable deaths are not inevitable.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-background">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.p variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-lg md:text-xl leading-relaxed text-center" style={{ color: "#4A4A68" }}>
            Every year, 2.8 million Indians die from cardiovascular disease — most of them preventable. Not because medicine doesn't know how to treat heart disease. Because most people never know they're at risk until it's too late. Agatsa One exists to change that. We build medical-grade health monitoring technology that is affordable, accessible, and intelligent — powered by AI, connected to doctors, and designed for the 1.4 billion people who deserve a fighting chance.
          </motion.p>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-20" style={{ background: "#F8F4FF" }}>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>OUR STORY</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>Why we built this</h2>
            <p className="mt-6 text-base leading-relaxed" style={{ color: "#4A4A68" }}>
              In 2013, Rahul Rastogi's father Arun Kumar suffered a sudden heart attack. He survived — just in time — but the experience exposed a painful gap. Rahul and his wife Neha, both electronics and telecommunications engineers, searched the market for a simple, affordable device that could spot heart trouble early at home. Nothing existed. So they decided to build it themselves.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#4A4A68" }}>
              In 2014 they founded Agatsa out of Noida and began shrinking the bulky hospital ECG into something that could fit on a keychain. The result was SanketLife — a pocket-sized 12-lead ECG monitor that lets anyone capture a hospital-grade reading in 60 seconds and share it with a doctor. Early customers included ONGC field engineers in remote locations and defence forces operating far from hospitals. The Marico Innovation Foundation backed the journey.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#4A4A68" }}>
              Today, more than 2.1 Lac+ individuals — from ICU patients to village health workers to busy executives — use Agatsa devices. The next chapter, Agatsa One, brings everything together: devices, AI, data, and community. One app. One AI. One health story.
            </p>
          </motion.div>
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <img src={agatsaProducts} alt="Agatsa Team and Products" className="rounded-3xl w-full" />
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>THE TEAM</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>The people behind Agatsa One</h2>
            <p className="mt-2 text-base" style={{ color: "#4A4A68" }}>Three co-founders. Three disciplines. One mission.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-10">
            {team.map((p, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <img src={p.photo} alt={p.name} className="w-48 h-48 rounded-full mx-auto object-cover" />
                <h3 className="mt-6 text-2xl font-bold" style={{ color: "#1A1A2E" }}>{p.name}</h3>
                <p className="text-base font-medium" style={{ color: "#7C4DFF" }}>{p.title}</p>
                {"loc" in p && <p className="text-sm mt-1" style={{ color: "#4A4A68" }}>{(p as any).loc}</p>}
                <p className="mt-3 text-sm leading-relaxed text-left" style={{ color: "#4A4A68" }}>{p.bio}</p>
                {"edu" in p && p.edu && <p className="mt-2 text-xs italic" style={{ color: "rgba(74,74,104,0.7)" }}>{p.edu}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Structure */}
      <section className="py-20" style={{ background: "#F8F4FF" }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>CORPORATE STRUCTURE</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>How we're structured</h2>
          </motion.div>
          <div className="max-w-xl mx-auto">
            <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-2xl p-8 border" style={{ background: "#F8F4FF", borderColor: "rgba(124,77,255,0.2)" }}>
              <p className="text-3xl">🇮🇳</p>
              <h3 className="mt-3 text-xl font-bold" style={{ color: "#1A1A2E" }}>Agatsa Software Pvt. Ltd.</h3>
              <p className="text-sm font-medium mt-1" style={{ color: "#7C4DFF" }}>India — Hardware & Clinical Validation</p>
              <p className="mt-3 text-sm" style={{ color: "#4A4A68" }}>Develops, manufactures, and validates all Agatsa medical devices. Holds CDSCO licenses. Manages India operations, distribution, and clinical partnerships. Based in Delhi, India.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>OUR JOURNEY</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>From a Delhi garage to 2.1 Lac+ users.</h2>
          </motion.div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5" style={{ background: "#7C4DFF", opacity: 0.2 }} />
            {milestones.map((m, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className={`relative pl-12 md:pl-0 mb-10 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}
              >
                <div className={`absolute w-3 h-3 rounded-full top-1.5 left-2.5 md:left-auto ${i % 2 === 0 ? "md:right-[-6.5px]" : "md:left-[-6.5px]"}`} style={{ background: "#7C4DFF" }} />
                <p className="text-xl font-extrabold" style={{ color: "#7C4DFF" }}>{m.year}</p>
                <p className="mt-1 text-sm" style={{ color: "#4A4A68" }}>{m.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory */}
      <section className="py-20" style={{ background: "#F8F4FF" }}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>REGULATORY STANDING</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>Regulated. Validated. Certified.</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {regs.map((r, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-lg font-bold" style={{ color: "#1A1A2E" }}>{r.title}</h3>
                <p className="text-sm font-medium mt-1" style={{ color: "#7C4DFF" }}>{r.sub}</p>
                <p className="mt-3 text-sm" style={{ color: "#4A4A68" }}>{r.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#7C4DFF" }}>PRESS</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold" style={{ color: "#1A1A2E" }}>In the news</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {["Press coverage coming soon — contact info@agatsa.com", "Media enquiry? We respond within 24 hours", "For partnership and investor enquiries: info@agatsa.com"].map((t, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-2xl p-8 border border-dashed border-border bg-muted/30 flex items-center justify-center text-center min-h-[120px]">
                <p className="text-sm" style={{ color: "#4A4A68" }}>{t}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm" style={{ color: "#4A4A68" }}>Media enquiries: info@agatsa.com | Investor relations: info@agatsa.com</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20" style={{ background: "#7C4DFF" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Be part of the mission.</h2>
            <p className="mt-4 text-lg text-white/80">Join 2.1 Lac+ users taking control of their cardiac health.</p>
            <Link to="/app"><Button className="mt-8 rounded-full px-10 py-5 text-base font-semibold" style={{ background: "white", color: "#7C4DFF" }}>Download Agatsa One Free</Button></Link>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
