import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  },
  {
    id: "easytouch-rhythm",
    name: "EasyTouch Rhythm",
    image: easytouchHeroImg,
    tagline: "5 Body Rhythms",
    benefit: "Track glucose & vitals",
    icon: Activity,
  },
  {
    id: "zlu",
    name: "Zlu",
    image: zluHeroImg,
    tagline: "Sleep Device",
    benefit: "Better sleep, naturally",
    icon: Moon,
  },
  {
    id: "corebalance",
    name: "CoreBalance",
    image: corebalanceHeroImg,
    tagline: "Body Scale",
    benefit: "Know your body metrics",
    icon: Scale,
  },
];

const userBenefits = [
  "Medical-grade accuracy at home",
  "No doctor visits needed for monitoring",
  "AI-powered health insights",
  "Share reports with your doctor instantly",
];

export function HeroSection() {
  return (
    <>
      {/* ===== MOBILE HERO ===== */}
      <section className="lg:hidden relative min-h-[100svh] flex flex-col bg-background">
        {/* Subtle gradient background */}
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

          {/* Benefits strip */}
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

        {/* Product cards carousel - Premium glass cards */}
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
                        {/* Sale badge */}
                        {product.id === "easytouch-rhythm" && isSaleActive() && (
                          <RepublicDaySaleBadge size="sm" className="absolute top-3 right-3 z-10" />
                        )}
                        
                        {/* Product image with premium backdrop */}
                        <div className="relative aspect-[4/3] p-6 flex items-center justify-center bg-gradient-to-b from-transparent to-muted/20">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
                          <img
                            src={product.image}
                            alt={product.name}
                            className="relative w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        {/* Info bar */}
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
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-muted/30 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]"
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

              {/* Benefits list */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {userBenefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
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

            {/* RIGHT: Premium floating product showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[600px]"
            >
              {/* Main featured product - larger, centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] z-20"
              >
                <Link to="/products/sanketlife" className="block group">
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-white to-muted/20 dark:from-muted/30 dark:via-muted/20 dark:to-background border border-border/50 shadow-[0_25px_80px_-20px_rgba(0,186,199,0.25),0_10px_30px_-10px_rgba(0,0,0,0.1)]">
                    {/* Glow effect */}
                    <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Image area */}
                    <div className="relative aspect-square p-8 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent" />
                      <motion.img
                        src={sanketlifeHeroImg}
                        alt="SanketLife"
                        className="relative w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,186,199,0.2)]"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="px-6 py-5 border-t border-border/30 bg-gradient-to-b from-background/90 to-background backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                            Pocket ECG
                          </p>
                          <h3 className="text-xl font-bold text-foreground">
                            SanketLife
                          </h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                          <ArrowRight className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Floating product cards - positioned around the main one */}
              {[
                { product: heroProducts[1], position: "top-4 right-4", delay: 0.5 },
                { product: heroProducts[2], position: "bottom-8 left-0", delay: 0.6 },
                { product: heroProducts[3], position: "bottom-4 right-8", delay: 0.7 },
              ].map(({ product, position, delay }, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                  whileHover={{ y: -8, scale: 1.02, zIndex: 30 }}
                  className={`absolute ${position} w-[200px] z-10`}
                >
                  <Link to={`/products/${product.id}`} className="block group">
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-muted/20 dark:from-muted/20 dark:to-background border border-border/40 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(0,186,199,0.2)] transition-shadow duration-300">
                      {/* Sale badge */}
                      {product.id === "easytouch-rhythm" && isSaleActive() && (
                        <RepublicDaySaleBadge size="sm" className="absolute top-2 right-2 z-10" />
                      )}
                      
                      {/* Image */}
                      <div className="aspect-square p-4 flex items-center justify-center bg-gradient-to-b from-transparent to-muted/10">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Info bar */}
                      <div className="px-4 py-3 border-t border-border/30 bg-background/80 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {product.tagline}
                            </p>
                            <h3 className="text-sm font-semibold text-foreground">
                              {product.name}
                            </h3>
                          </div>
                          <product.icon className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-primary/10 rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-primary/5 rounded-full pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
