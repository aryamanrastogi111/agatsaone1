import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Moon, Leaf, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import zluImg from "@/assets/zlu-device-new.webp";

export function ProductHighlightZlu() {
  const features = [
    { icon: Moon, text: "Gentle, natural sleep induction" },
    { icon: Leaf, text: "No medication needed" },
    { icon: Battery, text: "Portable & USB-C rechargeable" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-background to-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Better Sleep
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Zlu – Sleep Aid
            </h2>
            <p className="text-xl text-primary font-medium mb-4">
              Rest Better, Naturally
            </p>
            <p className="text-muted-foreground text-lg mb-6">
              A non-invasive sleep support device that helps you achieve deeper, more restful sleep without medication. Perfect for those seeking natural solutions to sleep challenges.
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
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <Link to="/products/zlu" className="flex items-center gap-2">
                  Explore Zlu
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-2xl font-bold text-foreground">₹4,999</span>
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
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/50 to-indigo-100/30 rounded-3xl blur-3xl" />
              <img
                src={zluImg}
                alt="Zlu Sleep Aid Device"
                className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
