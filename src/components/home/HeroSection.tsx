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
import { ArrowRight, Sparkles } from "lucide-react";

import zluHeroImg from "@/assets/zlu-hero.png";
import corebalanceHeroImg from "@/assets/corebalance-hero.png";
import sanketlifeHeroImg from "@/assets/sanketlife-hero.png";
import easytouchHeroImg from "@/assets/easytouch-hero.webp";
import agatsaProductsFamily from "@/assets/agatsa-products-family.png";

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
    <>
      {/* ===== MOBILE HERO (lg:hidden) ===== */}
      <section className="lg:hidden relative min-h-[100svh] flex flex-col overflow-hidden bg-gradient-to-b from-background via-accent/30 to-background">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl"
          />
        </div>

        {/* Top section - Compact headline */}
        <div className="relative z-10 pt-8 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Smart Health Devices</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-foreground leading-tight"
          >
            {/* Staggered letter animation */}
            <span className="inline-block overflow-hidden">
              {"Your Health,".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.15 + i * 0.025,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>{" "}
            <span className="relative inline-block">
              {/* Gradient shimmer text */}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="relative inline-block bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] bg-clip-text text-transparent"
              >
                Simplified
              </motion.span>
              
              {/* Glowing underline */}
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full shadow-[0_0_15px_rgba(0,186,199,0.4)]"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              />
            </span>
          </motion.h1>
        </div>

        {/* Center section - Full-width product carousel */}
        <div className="flex-1 relative z-10 flex items-center py-6">
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
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {heroProducts.map((product, index) => (
                <CarouselItem key={product.id} className="pl-2 basis-[85%]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link to={`/products/${product.id}`} className="block group">
                      <div className="relative mx-2 bg-gradient-to-br from-white/90 to-accent/40 dark:from-accent/30 dark:to-accent/10 backdrop-blur-xl rounded-3xl p-5 border border-white/50 dark:border-primary/20 shadow-[0_30px_80px_-20px_rgba(0,186,199,0.25)]">
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-primary/20" />
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        
                        {/* Product image - large and centered */}
                        <div className="relative aspect-square flex items-center justify-center mb-4">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-primary/25 blur-2xl rounded-full" />
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,186,199,0.3)] group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        {/* Product info */}
                        <div className="text-center space-y-2">
                          <span className="inline-block px-3 py-1.5 bg-primary/15 text-primary text-xs font-semibold rounded-full tracking-wide uppercase">
                            {product.tagline}
                          </span>
                          <h3 className="text-2xl font-bold text-foreground">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* View button */}
                        <div className="mt-4 flex justify-center">
                          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                            View Product
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Bottom section - CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 px-6 pb-8 space-y-3"
        >
          <Button asChild size="lg" className="w-full text-base h-14 btn-glow group">
            <Link to="/products" className="flex items-center justify-center gap-2">
              Explore All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full text-base h-14 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/device-finder">Find Your Perfect Device</Link>
          </Button>
          
          {/* Swipe hint */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            ← Swipe to explore products →
          </p>
        </motion.div>
      </section>

      {/* ===== DESKTOP HERO (hidden lg:block) ===== */}
      <section className="hidden lg:flex relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
        {/* Dynamic background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large gradient orb */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl"
          />
          
          {/* Secondary orb */}
          <motion.div
            animate={{ 
              scale: [1.1, 1, 1.1],
              x: [-20, 20, -20],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/10 via-primary/5 to-transparent rounded-full blur-3xl"
          />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [-20, 20, -20],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 4 + i, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              className="absolute w-2 h-2 bg-primary/40 rounded-full blur-sm"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + i * 15}%`,
              }}
            />
          ))}
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,186,199,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,186,199,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container relative z-10 px-8 py-16 flex flex-col justify-center">
          {/* Top section - Hero text + Product Family Image */}
          <div className="flex items-center gap-12 mb-16">
            {/* Left - Text Content */}
            <div className="flex-1 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary tracking-wide uppercase">Award-Winning Health Technology</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-6"
              >
                <span className="block">Take Control of</span>
                <span className="relative inline-block">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] bg-clip-text text-transparent"
                  >
                    Your Health
                  </motion.span>
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-muted-foreground max-w-xl mb-8"
              >
                Professional-grade health monitoring devices designed for everyday use. 
                Track ECG, blood glucose, body rhythms, and body composition — all from the comfort of home.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <Button asChild size="lg" className="text-base h-14 px-8 btn-glow group">
                  <Link to="/products" className="flex items-center gap-2">
                    Explore All Products
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base h-14 px-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link to="/device-finder">Find Your Device</Link>
                </Button>
              </motion.div>
            </div>
            
            {/* Right - Product Family Image (Square) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="w-[420px] h-[420px] xl:w-[480px] xl:h-[480px] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/20 rounded-3xl blur-2xl" />
                <img 
                  src={agatsaProductsFamily}
                  alt="Agatsa Health Devices - Complete Product Family"
                  className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>
          </div>

          {/* Products Grid - All 4 products displayed */}
          <div className="grid grid-cols-4 gap-6">
            {heroProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Link 
                  to={`/products/${product.id}`} 
                  className="group block relative bg-gradient-to-br from-white/80 to-accent/40 dark:from-accent/30 dark:to-accent/10 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-primary/20 shadow-[0_20px_60px_-15px_rgba(0,186,199,0.15)] hover:shadow-[0_30px_80px_-15px_rgba(0,186,199,0.25)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  {/* Top accent line */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  
                  {/* Product image */}
                  <div className="relative aspect-square mb-4 flex items-center justify-center">
                    {/* Glow under product */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-primary/20 blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain drop-shadow-[0_15px_35px_rgba(0,186,199,0.2)] group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Product info */}
                  <div className="relative text-center">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2 tracking-wide uppercase">
                      {product.tagline}
                    </span>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* View link */}
                  <div className="relative mt-4 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Medical Grade Accuracy</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>100,000+ Happy Users</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span>Award Winning Technology</span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
