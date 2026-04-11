import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Zap, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/useDevicePricing";
import { StrikePrice } from "@/components/StrikePrice";
import { RepublicDaySaleBadge, CountdownTimer, CouponCodeBox, isSaleActive } from "@/components/sale";
import { LowStockBadge } from "@/components/shop/LowStockBadge";
import easytouchImg from "@/assets/easytouch-rhythm-new.webp";

export function ProductHighlightEasyTouch() {
  const { prices, fmt } = usePricing();
  const features = [
    { icon: Brain, text: "5 Body Rhythms tracking (Nervous, Kinetic, Circadian, Circulatory, Metabolic)" },
    { icon: Zap, text: "Reveals hidden patterns behind your energy & fatigue" },
    { icon: Flame, text: "Daily Rhythm Score with personalized insights" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-background to-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {isSaleActive() && (
                <RepublicDaySaleBadge className="absolute -top-4 left-4 z-10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 to-blue-100/30 rounded-3xl blur-3xl" />
              <img
                src={easytouchImg}
                alt="EasyTouch Rhythm Smart Band"
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
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              Body Rhythm Intelligence
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              EasyTouch Rhythm
            </h2>
            <p className="text-xl text-primary font-medium mb-4">
              Understand Why Your Body Feels the Way It Does
            </p>
            <p className="text-muted-foreground text-lg mb-4">
              More than a fitness tracker — EasyTouch Rhythm reveals the hidden patterns behind your energy, fatigue, clarity, and calm by tracking 5 interconnected body rhythms.
            </p>

            {/* FOMO low-stock banner */}
            <LowStockBadge productKey="easytouch-rhythm" variant="banner" className="mb-6" />

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
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {isSaleActive() && (
              <div className="bg-gradient-to-r from-orange-500/10 via-background to-green-600/10 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-sm font-medium text-foreground">Republic Day Special — 10% OFF</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <CouponCodeBox variant="inline" />
                  <CountdownTimer variant="compact" />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 items-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/devices/easytouch-wellness" className="flex items-center gap-2">
                  {isSaleActive() ? "Grab 10% OFF" : "Explore EasyTouch Rhythm"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <StrikePrice sku="band_sub" price={prices.band_sub} size="md" showLabel={false} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
