import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Heart, Activity, Moon, Scale, Check, ChevronRight } from "lucide-react";
import { RepublicDaySaleBadge, isSaleActive } from "@/components/sale";

import zluHeroImg from "@/assets/zlu-hero.png";
import corebalanceHeroImg from "@/assets/corebalance-hero.png";
import sanketlifeHeroImg from "@/assets/sanketlife-hero.png";
import easytouchHeroImg from "@/assets/easytouch-hero.webp";

const heroProducts = [
  {
    id: "sanketlife",
    name: "SanketLife",
    image: sanketlifeHeroImg,
    tagline: "Pocket ECG",
    benefit: "Detect heart issues early",
    icon: Heart,
    accent: "from-rose-500/20 to-red-500/5",
  },
  {
    id: "easytouch-rhythm",
    name: "EasyTouch Rhythm",
    image: easytouchHeroImg,
    tagline: "5 Body Rhythms",
    benefit: "Track glucose & vitals",
    icon: Activity,
    accent: "from-primary/20 to-cyan-500/5",
  },
  {
    id: "zlu",
    name: "Zlu",
    image: zluHeroImg,
    tagline: "Sleep Device",
    benefit: "Better sleep, naturally",
    icon: Moon,
    accent: "from-indigo-500/20 to-violet-500/5",
  },
  {
    id: "corebalance",
    name: "CoreBalance",
    image: corebalanceHeroImg,
    tagline: "Smart Scale",
    benefit: "Know your body metrics",
    icon: Scale,
    accent: "from-emerald-500/20 to-teal-500/5",
  },
];

const userBenefits = [
  "Medical-grade accuracy at home",
  "No doctor visits needed",
  "AI-powered insights",
  "Share with your doctor",
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate products
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeProduct = heroProducts[activeIndex];

  return (
    <>
      {/* ===== MOBILE HERO ===== */}
      <section className="lg:hidden relative min-h-[100svh] flex flex-col bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        
        {/* Top content */}
        <div className="relative z-10 pt-6 px-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
              Health monitoring,{" "}
              <span className="text-primary">reimagined.</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Professional monitoring. Zero hassle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            {userBenefits.slice(0, 2).map((benefit, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary"
              >
                <Check className="w-3 h-3" />
                {benefit}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Product carousel */}
        <div className="flex-1 relative z-10 flex items-center pb-4">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 px-5">
              {heroProducts.map((product, index) => (
                <CarouselItem key={product.id} className="pl-3 basis-[80%]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to={`/products/${product.id}`} className="block group">
                      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white to-muted/30 dark:from-muted/20 dark:to-background border border-border/40 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]">
                        {product.id === "easytouch-rhythm" && isSaleActive() && (
                          <RepublicDaySaleBadge size="sm" className="absolute top-3 right-3 z-10" />
                        )}
                        
                        <div className="relative aspect-[4/3] p-6 flex items-center justify-center bg-gradient-to-b from-transparent to-muted/20">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                          <img
                            src={product.image}
                            alt={product.name}
                            className="relative w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        <div className="px-5 py-4 border-t border-border/30 bg-background/80 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                {product.tagline}
                              </p>
                              <h3 className="font-semibold text-foreground">
                                {product.name}
                              </h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                              <ChevronRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Bottom CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 px-5 pb-6 space-y-3"
        >
          <Button asChild size="lg" className="w-full h-12 text-base group">
            <Link to="/products" className="flex items-center justify-center gap-2">
              Shop All Devices
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full h-12 text-base text-primary">
            <Link to="/device-finder">Help me choose →</Link>
          </Button>
        </motion.div>
      </section>

      {/* ===== DESKTOP HERO ===== */}
      <section className="hidden lg:block relative min-h-[92vh] overflow-hidden bg-background">
        {/* Animated background based on active product */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className={`absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l ${activeProduct.accent} to-transparent`}
            />
          </AnimatePresence>
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[150px]"
          />
        </div>

        <div className="container relative z-10 h-full min-h-[92vh] flex items-center">
          <div className="grid grid-cols-2 gap-20 items-center w-full py-16">
            
            {/* LEFT: Text content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
                  <Heart className="w-4 h-4" />
                  Trusted by 100,000+ Indians
                </span>
                
                <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-[1.1]">
                  Health monitoring,{" "}
                  <span className="text-primary">reimagined.</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-lg">
                  Track ECG, blood glucose response, sleep quality, and body composition with devices trusted by doctors and designed for you.
                </p>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {userBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {benefit}
                  </div>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 pt-2"
              >
                <Button asChild size="lg" className="h-14 px-8 text-base group">
                  <Link to="/products" className="flex items-center gap-2">
                    Explore Devices
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Link to="/device-finder">Take the Quiz</Link>
                </Button>
              </motion.div>
            </div>

            {/* RIGHT: Single rotating product showcase */}
            <div className="relative flex flex-col items-center">
              {/* Main product display */}
              <div className="relative w-full max-w-[480px] aspect-square">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-primary/15" />
                <div className="absolute inset-6 rounded-full border border-primary/10" />
                
                {/* Glow behind product */}
                <motion.div
                  key={`glow-${activeIndex}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-12 rounded-full bg-gradient-radial from-primary/15 to-transparent blur-2xl"
                />

                {/* Product image with crossfade */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center p-12"
                  >
                    <Link to={`/products/${activeProduct.id}`} className="block group w-full h-full relative">
                      {/* Sale badge */}
                      {activeProduct.id === "easytouch-rhythm" && isSaleActive() && (
                        <RepublicDaySaleBadge size="md" className="absolute -top-2 right-8 z-10" />
                      )}
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,186,199,0.25)] group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Product info card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 text-center"
                >
                  <Link to={`/products/${activeProduct.id}`} className="group inline-block">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <activeProduct.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary uppercase tracking-wider">
                        {activeProduct.tagline}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {activeProduct.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {activeProduct.benefit}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      {activeProduct.id === "easytouch-rhythm" && isSaleActive() ? "Grab 10% OFF" : "View Details"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Product selector dots/thumbnails */}
              <div className="flex items-center gap-3 mt-8">
                {heroProducts.map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => setActiveIndex(index)}
                    className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                      index === activeIndex 
                        ? "w-16 h-16 ring-2 ring-primary ring-offset-2 ring-offset-background" 
                        : "w-12 h-12 opacity-50 hover:opacity-80 grayscale hover:grayscale-0"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted" />
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex gap-2 mt-4">
                {heroProducts.map((_, index) => (
                  <div
                    key={index}
                    className="h-1 w-8 rounded-full bg-muted overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: index === activeIndex ? "100%" : "0%"
                      }}
                      transition={{ 
                        duration: index === activeIndex ? 4 : 0,
                        ease: "linear"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
