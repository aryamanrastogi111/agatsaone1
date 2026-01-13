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
    id: "easytouch-rhythm",
    name: "EasyTouch Rhythm",
    image: easytouchHeroImg,
    tagline: "Smart Blood Glucose Monitor",
    description: "Accurate, fast blood glucose testing with Bluetooth connectivity and smart app integration.",
  },
  {
    id: "zlu",
    name: "Zlu",
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
    <section className="relative overflow-hidden bg-background py-12 lg:py-20">
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
              className="w-full max-w-md mx-auto"
            >
              <CarouselContent>
                {heroProducts.map((product) => (
                  <CarouselItem key={product.id}>
                    <Link to={`/products/${product.id}`} className="block group">
                      <div className="relative bg-gradient-to-br from-accent/50 to-accent/20 rounded-2xl p-6 overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl" />

                        {/* Product image */}
                        <div className="relative aspect-square flex items-center justify-center mb-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product info */}
                        <div className="text-center space-y-2">
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
