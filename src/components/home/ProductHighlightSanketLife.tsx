import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LowStockBadge } from "@/components/shop/LowStockBadge";
import sanketlifeImg from "@/assets/sanketlife-hero.png";

export function ProductHighlightSanketLife() {
  const features = [
    { icon: Heart, text: "Medical-grade 12-lead ECG" },
    { icon: Shield, text: "Clinically validated accuracy" },
    { icon: Smartphone, text: "Instant PDF reports via app" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-background to-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-4">
              Heart Health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              SanketLife
            </h2>
            <p className="text-xl text-primary font-medium mb-4">
              Your Heart, in Your Hands
            </p>
            <p className="text-muted-foreground text-lg mb-4">
              A portable, medical-grade ECG device that lets you monitor your heart health anytime, anywhere. Get hospital-quality cardiac readings without the hospital visit.
            </p>

            {/* FOMO low-stock banner */}
            <LowStockBadge productKey="sanketlife" variant="banner" className="mb-6" />

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-rose-600" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
                <Link to="/devices/sanketlife-ecg" className="flex items-center gap-2">
                  Explore SanketLife
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/50 to-rose-100/30 rounded-3xl blur-3xl" />
              <img
                src={sanketlifeImg}
                alt="SanketLife ECG Device"
                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
