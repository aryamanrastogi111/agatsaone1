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

          {/* Product Showcase - Premium Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] max-w-xl mx-auto">
              {/* Central cyan glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
              </div>
              
              {/* Secondary ambient glow */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />

              {/* Product Grid - Balanced Asymmetric Layout */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Top Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute top-4 left-[15%] w-28 h-28 md:w-36 md:h-36"
                  style={{ transform: "perspective(500px) rotateY(-5deg)" }}
                >
                  <div className="relative w-full h-full rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] p-3 border border-gray-100/50">
                    <img
                      src={sanketLifeImg}
                      alt="SanketLife Device"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute top-8 right-[10%] w-32 h-32 md:w-40 md:h-40"
                  style={{ transform: "perspective(500px) rotateY(5deg)" }}
                >
                  <div className="relative w-full h-full rounded-2xl bg-white shadow-[0_25px_60px_-20px_rgba(0,0,0,0.18)] p-3 border border-gray-100/50">
                    <img
                      src={spandanProImg}
                      alt="EasyTouch Rhythm"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                    />
                  </div>
                </motion.div>

                {/* Bottom Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute bottom-8 left-[8%] w-30 h-30 md:w-38 md:h-38"
                  style={{ transform: "perspective(500px) rotateY(-3deg) rotateX(2deg)" }}
                >
                  <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white shadow-[0_22px_55px_-18px_rgba(0,0,0,0.16)] p-3 border border-gray-100/50">
                    <img
                      src={zluImg}
                      alt="Zlu Sleep Aid"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute bottom-4 right-[15%] w-28 h-28 md:w-36 md:h-36"
                  style={{ transform: "perspective(500px) rotateY(4deg) rotateX(3deg)" }}
                >
                  <div className="relative w-full h-full rounded-2xl bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] p-3 border border-gray-100/50">
                    <img
                      src={coreBalanceImg}
                      alt="CoreBalance BMI Scale"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
