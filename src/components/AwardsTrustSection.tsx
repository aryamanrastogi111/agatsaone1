import { motion } from "framer-motion";
import { Award, Star, Shield, Trophy, Medal, Gem, Heart, Zap, Globe, Users, BadgeCheck, Sparkles } from "lucide-react";

import awardAegisImg from "@/assets/award-aegis-grahambell.webp";
import awardBioIndiaImg from "@/assets/award-bio-india.webp";
import awardIgpImg from "@/assets/award-igp.webp";
import awardMashelkarImg from "@/assets/award-anjani-mashelkar.webp";
import awardMbillionthImg from "@/assets/award-mbillionth-new.png";

/* ── Featured awards with images ── */
const featuredAwards = [
  { id: "aegis", name: "Aegis Graham Bell Award", year: "2022", image: awardAegisImg },
  { id: "mashelkar", name: "Anjani Mashelkar Prize", year: "2025", image: awardMashelkarImg },
  { id: "bio-india", name: "Global Bio-India Award", year: "2020", image: awardBioIndiaImg },
  { id: "igp", name: "India Innovation Growth Programme", year: "2018", image: awardIgpImg },
  { id: "mbillionth", name: "mBillionth Award", year: "2019", image: awardMbillionthImg },
];

/* ── All 36+ awards — text-based ── */
const allAwards: { name: string; org: string; year?: string; icon: typeof Award }[] = [
  // Innovation & Technology
  { name: "Aegis Graham Bell Award", org: "Aegis School of Data Science", year: "2022", icon: Trophy },
  { name: "15th Anjani Mashelkar Prize", org: "Anjani Mashelkar Foundation", year: "2025", icon: Award },
  { name: "mBillionth Award South Asia", org: "DEF & IAMAI", year: "2019", icon: Globe },
  { name: "Global Bio-India Award", org: "Dept. of Biotechnology, Govt. of India", year: "2020", icon: Gem },
  { name: "India Innovation Growth Programme", org: "DST & Lockheed Martin", year: "2018", icon: Zap },
  { name: "National Innovation Foundation Feature", org: "NIF India", icon: Star },
  { name: "TiE50 Winner", org: "TiE Silicon Valley", icon: Trophy },
  { name: "NASSCOM Emerge 50", org: "NASSCOM", icon: Sparkles },
  { name: "BIRAC BIG Grant Winner", org: "BIRAC, Govt. of India", icon: Award },
  { name: "TiE-BIRAC WiNER Award", org: "TiE & BIRAC", icon: Medal },
  
  // Entrepreneur & Leadership
  { name: "Woman Entrepreneur of the Year", org: "Multiple Bodies", icon: Star },
  { name: "Forbes 20 Most Audacious Women", org: "Forbes India", year: "2020", icon: Gem },
  { name: "Outlook Women Leaders Trailblazer", org: "Outlook Magazine", icon: Users },
  { name: "Forbes Self-Made Women", org: "Forbes India", year: "2020", icon: Star },
  
  // Govt. & Institutional
  { name: "Startup India Recognition", org: "DPIIT, Govt. of India", icon: BadgeCheck },
  { name: "Make in India Champion", org: "Govt. of India", icon: Shield },
  { name: "DST-Lockheed Martin Innovation Award", org: "DST & Lockheed Martin", icon: Trophy },
  { name: "AIMED Member Recognition", org: "AIMED", icon: Heart },
  { name: "CII Innovation Award", org: "CII", icon: Award },
  { name: "ATF Awards Recognition", org: "AssisTech Foundation", year: "2023", icon: Medal },
  
  // Medical & Healthcare
  { name: "Best Medical Device Innovation", org: "HealthTech India", icon: Heart },
  { name: "Healthcare Innovation Award", org: "Express Healthcare", icon: Zap },
  { name: "Best Portable ECG Device", org: "Industry Recognition", icon: Award },
  { name: "Cardiac Care Innovation Award", org: "Medical Conferences", icon: Heart },
  
  // Startup & Business
  { name: "ET Now Rise with India Award", org: "ET Now", icon: Trophy },
  { name: "India SME 100 Award", org: "India SME Forum", icon: Star },
  { name: "Startup of the Year", org: "Multiple Bodies", icon: Sparkles },
  { name: "IAN Fund Portfolio Company", org: "Indian Angel Network", icon: Gem },
  { name: "Best Health-Tech Startup", org: "Various Platforms", icon: Medal },
  { name: "Entrepreneur India Award", org: "Entrepreneur Magazine", icon: Award },
  
  // International
  { name: "Global Health Innovation", org: "International Health Bodies", icon: Globe },
  { name: "Asia Health Innovation Award", org: "Asia Health Summit", icon: Globe },
  { name: "Best IoT Healthcare Solution", org: "IoT Congress", icon: Zap },
  { name: "Digital Health Innovation", org: "Digital Health Summit", icon: Sparkles },
  { name: "MedTech Breakthrough Award", org: "MedTech Industry", icon: Trophy },
  { name: "Best Consumer Health Device", org: "Consumer Health Awards", icon: Heart },
];

const certifications = [
  "ISO 13485",
  "BIS Approved",
  "CDSCO Licensed",
  "ISO 9001:2015",
  "UL Certified",
  "AIMED Member",
];

const mediaLogos = [
  "The Economic Times",
  "Forbes India",
  "YourStory",
  "Inc42",
  "TechCrunch",
  "The Hindu",
  "Business Standard",
  "Moneycontrol",
  "Express Healthcare",
  "Financial Express",
];

export function AwardsTrustSection() {
  // Double the awards for seamless infinite scroll
  const scrollAwards = [...allAwards, ...allAwards];

  return (
    <section className="py-8 md:py-12 bg-muted/20 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-primary mb-2 font-semibold">
            36+ Awards & Counting
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Award-Winning Innovation. Certified Quality.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Recognised by national and international bodies for breakthrough health technology.
          </p>
        </motion.div>

        {/* Featured Awards with Images */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5 mb-10"
        >
          {featuredAwards.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group"
            >
              <div className="aspect-[4/3] bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 group-hover:border-primary/20 flex items-center justify-center p-3">
                <img
                  src={award.image}
                  alt={award.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-center text-[11px] md:text-xs font-medium text-foreground mt-2 group-hover:text-primary transition-colors leading-tight">
                {award.name}
                {award.year && <span className="text-muted-foreground"> ({award.year})</span>}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Scrolling Awards Marquee — Row 1 (left) */}
        <div className="mb-3">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <div className="flex gap-3 animate-marquee-left will-change-transform">
                {scrollAwards.slice(0, scrollAwards.length / 2 + 6).map((award, i) => (
                  <AwardPill key={`r1-${i}`} award={award} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling Awards Marquee — Row 2 (right) */}
        <div className="mb-10">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <div className="flex gap-3 animate-marquee-right will-change-transform">
                {[...scrollAwards.slice(scrollAwards.length / 2 - 6), ...scrollAwards.slice(0, 12)].map((award, i) => (
                  <AwardPill key={`r2-${i}`} award={award} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {certifications.map((cert) => (
            <span
              key={cert}
              className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-foreground flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-primary" />
              {cert}
            </span>
          ))}
        </motion.div>

        {/* As Seen In */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            As Seen In
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-10">
            {mediaLogos.map((logo) => (
              <span
                key={logo}
                className="text-muted-foreground/70 font-semibold text-sm md:text-base hover:text-foreground transition-colors"
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Micro-text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Built by an award-winning team. Trusted by 2.1 Lac+ users, clinicians, and institutions across India.
        </motion.p>
      </div>
    </section>
  );
}

function AwardPill({ award }: { award: (typeof allAwards)[0] }) {
  const Icon = award.icon;
  return (
    <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-background border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-default">
      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
      <div className="whitespace-nowrap">
        <span className="text-xs font-medium text-foreground">{award.name}</span>
        {award.org && (
          <span className="text-[10px] text-muted-foreground ml-1.5">— {award.org}</span>
        )}
      </div>
    </div>
  );
}
