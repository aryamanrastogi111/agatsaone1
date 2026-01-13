import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import zluHeroImg from "@/assets/zlu-hero.png";
import corebalanceHeroImg from "@/assets/corebalance-hero.png";

const heroProducts = [
  { id: "sanketlife", name: "SanketLife", image: "/placeholder.svg" },
  { id: "easytouch-rhythm", name: "EasyTouch Rhythm", image: "/placeholder.svg" },
  { id: "zlu", name: "Zlu", image: zluHeroImg },
  { id: "corebalance", name: "CoreBalance", image: corebalanceHeroImg },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Health monitoring{" "}
              <span className="text-primary relative">
                made simple.
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Smart, non-invasive health devices designed to help you understand
              your body better — at home and on the go.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="text-base btn-glow group">
                <Link to="/products" className="flex items-center gap-2">
                  Explore Products
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Link to="/device-finder">Find the right device</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Product Showcase - Orbital Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Background circles */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent to-transparent rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.div
                className="absolute inset-8 border-2 border-primary/10 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              />

              {/* Floating products */}
              {heroProducts.map((product, index) => {
                const positions = [
                  "-top-4 left-1/3 w-36 h-36 md:w-44 md:h-44",
                  "top-1/3 -right-4 w-36 h-36 md:w-44 md:h-44",
                  "top-1/3 -left-8 w-44 h-44 md:w-56 md:h-56",
                  "-bottom-4 left-1/3 w-40 h-40 md:w-48 md:h-48",
                ];
                return (
                  <motion.div
                    key={product.id}
                    animate={{ 
                      y: [0, -12, 0],
                      rotate: [0, index % 2 === 0 ? 2 : -2, 0]
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className={`absolute ${positions[index]} cursor-pointer`}
                  >
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.15, duration: 0.5 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
