import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Scale, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LowStockBadge } from "@/components/shop/LowStockBadge";
import corebalanceImg from "@/assets/corebalance-hero.webp";

export function ProductHighlightCoreBalance() {
  const features = [
    { icon: Scale, text: "10+ body composition metrics" },
    { icon: TrendingUp, text: "Track muscle, fat & water" },
    { icon: Users, text: "Multi-user profile support" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-background to-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/50 to-emerald-100/30 rounded-3xl blur-3xl" />
              <img
                src={corebalanceImg}
                alt="CoreBalance BMI Scale"
                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Body Composition
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              CoreBalance BMI
            </h2>
            <p className="text-xl text-primary font-medium mb-4">
              Beyond Just Weight
            </p>
            <p className="text-muted-foreground text-lg mb-4">
              An advanced body composition analyzer that gives you insights beyond the scale. Understand your body better with professional-grade accuracy at home.
            </p>

            {/* FOMO low-stock banner */}
            <LowStockBadge productKey="corebalance" variant="banner" className="mb-6" />

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
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/devices/smart-scale" className="flex items-center gap-2">
                  Explore CoreBalance
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-2xl font-bold text-foreground">₹1,999</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
