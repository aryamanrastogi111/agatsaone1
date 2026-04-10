import { motion } from "framer-motion";

// Import award images
import awardAegisImg from "@/assets/award-aegis-grahambell.webp";
import awardBioIndiaImg from "@/assets/award-bio-india.webp";
import awardIgpImg from "@/assets/award-igp.webp";
import awardMashelkarImg from "@/assets/award-anjani-mashelkar.webp";

// Awards data with imported images
const awards = [
  {
    id: "aegis-grahambell",
    name: "Aegis Graham Bell Award",
    image: awardAegisImg,
  },
  {
    id: "bio-india",
    name: "Global Bio-India Award",
    image: awardBioIndiaImg,
  },
  {
    id: "igp",
    name: "India Innovation Growth Programme",
    image: awardIgpImg,
  },
  {
    id: "anjani-mashelkar",
    name: "Anjani Mashelkar Prize",
    image: awardMashelkarImg,
  },
];

export function AwardsSection() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Awards & Achievements
          </h2>
          <p className="text-muted-foreground">
            Recognised for innovation, impact, and trust in healthcare.
          </p>
        </motion.div>

        {/* Awards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group relative"
              >
                <div className="aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 group-hover:border-primary/20 flex items-center justify-center p-2">
                  <img
                    src={award.image}
                    alt={award.name}
                    className="w-full h-full object-contain transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                {/* Award name label */}
                <p className="text-center text-sm font-medium text-foreground mt-3 group-hover:text-primary transition-colors">
                  {award.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Micro-text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Built by an award-winning team. Trusted by users, clinicians, and institutions.
        </motion.p>
      </div>
    </section>
  );
}
