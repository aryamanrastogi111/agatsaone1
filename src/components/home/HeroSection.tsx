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
    color: "from-red-500/20 to-rose-500/10",
  },
  {
    id: "easytouch-rhythm",
    name: "EasyTouch Rhythm",
    image: easytouchHeroImg,
    tagline: "5 Body Rhythms",
    benefit: "Track glucose & vitals",
    icon: Activity,
    color: "from-primary/20 to-cyan-500/10",
  },
  {
    id: "zlu",
    name: "Zlu",
    image: zluHeroImg,
    tagline: "Sleep Device",
    benefit: "Better sleep, naturally",
    icon: Moon,
    color: "from-indigo-500/20 to-purple-500/10",
  },
  {
    id: "corebalance",
    name: "CoreBalance",
    image: corebalanceHeroImg,
    tagline: "Body Scale",
    benefit: "Know your body metrics",
    icon: Scale,
    color: "from-emerald-500/20 to-teal-500/10",
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

        {/* Product cards carousel */}
        <div className="flex-1 relative z-10 flex items-center pb-4">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-3 px-5">
              {heroProducts.map((product, index) => (
                <CarouselItem key={product.id} className="pl-3 basis-[75%]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to={`/products/${product.id}`} className="block group">
                      <div className={`relative rounded-2xl p-4 bg-gradient-to-br ${product.color} border border-border/50 overflow-hidden`}>
                        {/* Sale badge */}
                        {product.id === "easytouch-rhythm" && isSaleActive() && (
                          <RepublicDaySaleBadge size="sm" className="absolute top-2 right-2 z-10" />
                        )}
                        
                        {/* Product image */}
                        <div className="aspect-square mb-3 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <product.icon className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {product.tagline}
                            </span>
                          </div>
                          <h3 className="font-bold text-foreground text-lg">
                            {product.name}
                          </h3>
                          <p className="text-sm text-primary font-medium">
                            {product.benefit}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="absolute bottom-4 right-4">
                          <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
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
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="container relative z-10 h-full min-h-[92vh] flex items-center">
          <div className="grid grid-cols-2 gap-16 items-center w-full py-16">
            
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

            {/* RIGHT: Product grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-5">
                {heroProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="group block relative"
                    >
                      <div className={`relative rounded-2xl p-5 bg-gradient-to-br ${product.color} border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden`}>
                        {/* Sale badge */}
                        {product.id === "easytouch-rhythm" && isSaleActive() && (
                          <RepublicDaySaleBadge size="sm" className="absolute top-3 right-3 z-10" />
                        )}
                        
                        {/* Product image */}
                        <div className="aspect-square mb-4 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        {/* Product info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <product.icon className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {product.tagline}
                            </span>
                          </div>
                          <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product.benefit}
                          </p>
                        </div>

                        {/* Hover arrow */}
                        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
