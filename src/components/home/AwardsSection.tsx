import { motion } from "framer-motion";

// Import product images
import sanketlifeHeroImg from "@/assets/sanketlife-hero.png";
import easytouchHeroImg from "@/assets/easytouch-hero.webp";
import zluHeroImg from "@/assets/zlu-hero.png";
import corebalanceHeroImg from "@/assets/corebalance-hero.png";

// Awards/certifications data - using placeholder logos that will be monochrome
const awards = [
  {
    id: "ce",
    name: "CE Certified",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/CE_marking_logo.svg/120px-CE_marking_logo.svg.png",
  },
  {
    id: "fda",
    name: "FDA Cleared",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Seal_of_the_United_States_Food_and_Drug_Administration.svg/120px-Seal_of_the_United_States_Food_and_Drug_Administration.svg.png",
  },
  {
    id: "iso",
    name: "ISO 13485",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/ISO_Logo_%28Red_square%29.svg/120px-ISO_Logo_%28Red_square%29.svg.png",
  },
  {
    id: "startup-india",
    name: "Startup India",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Startup_India.svg/200px-Startup_India.svg.png",
  },
  {
    id: "make-in-india",
    name: "Make in India",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Make_In_India.svg/200px-Make_In_India.svg.png",
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
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="group relative"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center p-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:bg-accent/30">
                  <img
                    src={award.logo}
                    alt={award.name}
                    className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                {/* Tooltip */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {award.name}
                </span>
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
