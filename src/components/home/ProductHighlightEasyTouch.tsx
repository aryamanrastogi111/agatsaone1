import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Zap, Sun, Heart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import easytouchImg from "@/assets/easytouch-rhythm-new.png";

export function ProductHighlightEasyTouch() {
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
            <p className="text-muted-foreground text-lg mb-6">
              More than a fitness tracker — EasyTouch Rhythm reveals the hidden patterns behind your energy, fatigue, clarity, and calm by tracking 5 interconnected body rhythms.
            </p>

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

            <div className="flex flex-wrap gap-4 items-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/products/easytouch-rhythm" className="flex items-center gap-2">
                  Explore EasyTouch Rhythm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-2xl font-bold text-foreground">₹4,999</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
