import { motion } from "framer-motion";

import awardAegisImg from "@/assets/award-aegis-grahambell.webp";
import awardBioIndiaImg from "@/assets/award-bio-india.webp";
import awardIgpImg from "@/assets/award-igp.webp";
import awardMashelkarImg from "@/assets/award-anjani-mashelkar.webp";

const awards = [
  { id: "aegis", name: "Aegis Graham Bell Award", image: awardAegisImg },
  { id: "bio-india", name: "Global Bio-India Award", image: awardBioIndiaImg },
  { id: "igp", name: "India Innovation Growth Programme", image: awardIgpImg },
  { id: "mashelkar", name: "Anjani Mashelkar Prize", image: awardMashelkarImg },
];

const certifications = [
  "ISO 13485",
  "BIS Approved",
  "CDSCO Licensed",
  "ISO 9001:2015",
];

const mediaLogos = [
  "The Economic Times",
  "YourStory",
  "Inc42",
  "TechCrunch",
  "The Hindu",
];

export function AwardsTrustSection() {
  return (
    <section className="py-16 md:py-20 bg-muted/20 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Award-Winning Innovation. Certified Quality.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Recognised by national and international bodies for breakthrough health technology.
          </p>
        </motion.div>

        {/* Award Logos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 mb-12"
        >
          {awards.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
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
              <p className="text-center text-xs md:text-sm font-medium text-foreground mt-2.5 group-hover:text-primary transition-colors">
                {award.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {certifications.map((cert) => (
            <span
              key={cert}
              className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-foreground"
            >
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
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {mediaLogos.map((logo) => (
              <span
                key={logo}
                className="text-muted-foreground/70 font-semibold text-base md:text-lg hover:text-foreground transition-colors"
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
