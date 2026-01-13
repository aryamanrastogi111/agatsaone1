import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import sanketLifeImg from "@/assets/sanket-life.png";
import zluImg from "@/assets/zlu.webp";
import coreBalanceImg from "@/assets/core-balance.png";
import spandanProImg from "@/assets/spandan-pro.png";

const heroProducts = [
  { id: "sanketlife", name: "SanketLife", image: sanketLifeImg },
  { id: "easytouch-rhythm", name: "EasyTouch Rhythm", image: spandanProImg },
  { id: "zlu", name: "Zlu", image: zluImg },
  { id: "corebalance", name: "CoreBalance", image: coreBalanceImg },
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

          {/* Product Showcase - Layered Diagonal Cascade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full h-[420px] md:h-[480px] max-w-xl mx-auto">
              {/* Ambient glow layers */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-cyan-400/15 rounded-full blur-xl" />
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />

              {/* Back layer - CoreBalance (largest, back) */}
              <motion.div
                initial={{ opacity: 0, x: 50, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                whileHover={{ scale: 1.04, zIndex: 50 }}
                className="absolute bottom-6 right-4 md:right-8 z-10"
              >
                <div 
                  className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white/95 backdrop-blur-sm p-4 border border-white/60"
                  style={{ 
                    boxShadow: "0 35px 60px -20px rgba(0,0,0,0.2), 0 10px 20px -10px rgba(0,180,216,0.1)",
                    transform: "perspective(800px) rotateX(5deg) rotateY(-8deg)"
                  }}
                >
                  <img src={coreBalanceImg} alt="CoreBalance" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                </div>
              </motion.div>

              {/* Mid-back layer - Zlu */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                whileHover={{ scale: 1.06, zIndex: 50 }}
                className="absolute bottom-20 left-4 md:left-10 z-20"
              >
                <div 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/95 backdrop-blur-sm p-4 border border-white/60"
                  style={{ 
                    boxShadow: "0 30px 50px -15px rgba(0,0,0,0.18), 0 8px 16px -8px rgba(0,180,216,0.12)",
                    transform: "perspective(800px) rotateX(3deg) rotateY(6deg)"
                  }}
                >
                  <img src={zluImg} alt="Zlu Sleep Aid" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                </div>
              </motion.div>

              {/* Mid-front layer - EasyTouch Rhythm */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                whileHover={{ scale: 1.06, zIndex: 50 }}
                className="absolute top-8 right-8 md:right-16 z-30"
              >
                <div 
                  className="w-34 h-34 md:w-42 md:h-42 rounded-3xl bg-white/95 backdrop-blur-sm p-4 border border-white/60"
                  style={{ 
                    boxShadow: "0 28px 45px -12px rgba(0,0,0,0.17), 0 6px 14px -6px rgba(0,180,216,0.1)",
                    transform: "perspective(800px) rotateX(-4deg) rotateY(-5deg)"
                  }}
                >
                  <img src={spandanProImg} alt="EasyTouch Rhythm" className="w-36 h-36 object-contain" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                </div>
              </motion.div>

              {/* Front layer - SanketLife (hero position, front-center) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                whileHover={{ scale: 1.08, zIndex: 50 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
              >
                <div 
                  className="w-40 h-40 md:w-48 md:h-48 rounded-3xl bg-white p-5 border border-white/80"
                  style={{ 
                    boxShadow: "0 40px 70px -25px rgba(0,0,0,0.25), 0 15px 30px -15px rgba(0,180,216,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
                    transform: "perspective(800px) rotateX(2deg)"
                  }}
                >
                  <img src={sanketLifeImg} alt="SanketLife Device" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
