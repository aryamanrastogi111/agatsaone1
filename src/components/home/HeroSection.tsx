import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import zluHeroImg from "@/assets/zlu-hero.png";
import corebalanceHeroImg from "@/assets/corebalance-hero.png";
import sanketlifeHeroImg from "@/assets/sanketlife-hero.png";
import easytouchHeroImg from "@/assets/easytouch-hero.webp";

const heroProducts = [
  {
    id: "sanketlife",
    name: "SanketLife",
    image: sanketlifeHeroImg,
    tagline: "Pocket ECG Monitor",
    description: "Capture medical-grade ECG readings anytime, anywhere with this compact heart monitoring device.",
  },
  {
    id: "zlu",
    name: "Zlu",
    image: easytouchHeroImg,
    tagline: "Smart Blood Glucose Monitor",
    description: "Accurate, fast blood glucose testing with Bluetooth connectivity and smart app integration.",
  },
  {
    id: "easytouch-rhythm",
    name: "Easytouch Rhythm",
    image: zluHeroImg,
    tagline: "Wireless Vital Signs Monitor",
    description: "Monitor SpO2, heart rate, and sleep patterns with clinical-grade precision from your wrist.",
  },
  {
    id: "corebalance",
    name: "CoreBalance",
    image: corebalanceHeroImg,
    tagline: "Smart Body Composition Scale",
    description: "Track weight, BMI, muscle mass, and body fat with advanced bioelectrical impedance analysis.",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-x-hidden bg-background py-12 lg:py-20">
      {/* Multi-layer background depth system */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary radial gradient - centered behind carousel */}
        <div className="absolute top-1/2 right-0 lg:right-1/4 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-radial from-primary/8 via-primary/3 to-transparent rounded-full blur-3xl" />
        
        {/* Secondary directional gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-primary/5" />
        
        {/* Subtle light ray effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-br from-white/3 via-transparent to-transparent transform -skew-x-12" />
        
        {/* Animated floating orbs for depth */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-4 md:right-20 w-20 md:w-32 h-20 md:h-32 bg-primary/6 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [15, -15, 15], x: [5, -5, 5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-32 left-4 md:left-10 w-32 md:w-48 h-32 md:h-48 bg-primary/4 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/3 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-2xl"
        />
      </div>

      {/* Ecosystem context - faint product silhouettes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Wearable band silhouette - top right */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 right-10 lg:right-32 w-20 h-40 opacity-[0.04]"
        >
          <div className="w-full h-full bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-full blur-xl" />
        </motion.div>
        
        {/* BMI scale silhouette - bottom left */}
        <div className="absolute -bottom-8 -left-8 w-36 h-12 opacity-[0.03]">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-lg blur-lg" />
        </div>
        
        {/* Abstract medical device - far right */}
        <div className="absolute top-1/2 -right-16 w-24 h-32 opacity-[0.05] hidden lg:block">
          <div className="w-full h-full bg-gradient-to-bl from-primary via-primary/40 to-transparent rounded-2xl blur-xl" />
        </div>
      </div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 hero-texture pointer-events-none" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
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
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
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

          {/* Product Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Glow effect behind carousel */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-2xl scale-110" />
            
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: true,
                }),
              ]}
              className="w-full max-w-md mx-auto relative"
            >
              <CarouselContent>
                {heroProducts.map((product) => (
                  <CarouselItem key={product.id}>
                    <Link to={`/products/${product.id}`} className="block group">
                      <div className="relative bg-gradient-to-br from-white/80 to-accent/30 dark:from-accent/40 dark:to-accent/20 backdrop-blur-sm rounded-2xl p-6 overflow-hidden border border-white/30 dark:border-primary/10 shadow-[0_25px_60px_-15px_rgba(0,186,199,0.15),0_10px_30px_-5px_rgba(0,0,0,0.08)]">
                        {/* Cyan rim light effect */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/10" />
                        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        
                        {/* Decorative circles with enhanced glow */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/15 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/8 rounded-full blur-xl" />
                        
                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-white/10 rounded-2xl" />

                        {/* Product image with enhanced styling */}
                        <div className="relative aspect-square flex items-center justify-center mb-4">
                          {/* Cyan reflection glow beneath product */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-xl rounded-full" />
                          
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,186,199,0.2)] group-hover:scale-105 group-hover:rotate-1 transition-all duration-500"
                          />
                        </div>

                        {/* Product info */}
                        <div className="relative text-center space-y-2">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {product.tagline}
                          </span>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons */}
              <CarouselPrevious className="left-0 lg:-left-4 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="right-0 lg:-right-4 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground" />
            </Carousel>

            {/* Dots indicator hint */}
            <div className="flex justify-center gap-2 mt-4">
              {heroProducts.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-primary/30"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
