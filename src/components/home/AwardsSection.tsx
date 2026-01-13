import { motion } from "framer-motion";

// Import product images
import sanketlifeHeroImg from "@/assets/sanketlife-hero.png";
import easytouchHeroImg from "@/assets/easytouch-hero.webp";
import zluHeroImg from "@/assets/zlu-hero.png";
import corebalanceHeroImg from "@/assets/corebalance-hero.png";

// Import award images
import awardAegisImg from "@/assets/award-aegis-grahambell.png";
import awardBioIndiaImg from "@/assets/award-bio-india.jpg";
import awardIgpImg from "@/assets/award-igp.jpg";
import awardMashelkarImg from "@/assets/award-anjani-mashelkar.png";

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

const products = [
  {
    id: "sanketlife",
    name: "SanketLife",
    image: sanketlifeHeroImg,
    position: "left-0 bottom-0",
    size: "w-40 md:w-56",
    zIndex: "z-20",
  },
  {
    id: "easytouch",
    name: "EasyTouch Rhythm",
    image: easytouchHeroImg,
    position: "left-1/4 bottom-4",
    size: "w-32 md:w-44",
    zIndex: "z-10",
  },
  {
    id: "zlu",
    name: "Zlu",
    image: zluHeroImg,
    position: "right-1/4 bottom-4",
    size: "w-32 md:w-44",
    zIndex: "z-10",
  },
  {
    id: "corebalance",
    name: "CoreBalance",
    image: corebalanceHeroImg,
    position: "right-0 bottom-0",
    size: "w-40 md:w-56",
    zIndex: "z-20",
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

        {/* TOP: Awards & Recognition Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
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
                <div className="aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 group-hover:border-primary/20">
                  <img
                    src={award.image}
                    alt={award.name}
                    className="w-full h-full object-cover transition-all duration-300"
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

        {/* BOTTOM: Product Credibility Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          {/* Products Composition */}
          <div className="relative max-w-4xl mx-auto">
            {/* Background subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent rounded-3xl" />
            
            {/* Products Row */}
            <div className="relative flex items-end justify-center gap-2 md:gap-6 py-8 px-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative ${product.zIndex} flex-shrink-0`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`${product.size} h-auto object-contain drop-shadow-xl`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Micro-text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Built by an award-winning team. Trusted by users, clinicians, and institutions.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
