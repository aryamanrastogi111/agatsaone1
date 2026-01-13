import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Activity, Moon, Scale, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    icon: Heart,
    title: "Heart Health",
    description: "Monitor your cardiac health with medical-grade ECG technology",
    link: "/products/sanketlife",
    product: "SanketLife",
    color: "text-red-500",
    bgColor: "bg-red-50",
    hoverBg: "group-hover:bg-red-100",
  },
  {
    icon: Activity,
    title: "Daily Wellness",
    description: "Track your vitals 24/7 with smart wearable technology",
    link: "/products/easytouch-rhythm",
    product: "EasyTouch Rhythm",
    color: "text-primary",
    bgColor: "bg-accent",
    hoverBg: "group-hover:bg-primary/20",
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Achieve deeper, more restful sleep without medication",
    link: "/products/zlu",
    product: "Zlu – Sleep Aid",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    hoverBg: "group-hover:bg-indigo-100",
  },
  {
    icon: Scale,
    title: "Body Composition",
    description: "Understand your body beyond just weight with advanced analysis",
    link: "/products/corebalance",
    product: "CoreBalance BMI",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    hoverBg: "group-hover:bg-emerald-100",
  },
];

export function ChooseByNeedSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What's your health goal?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect device for your needs. Each Agatsa product is
            designed to address specific health monitoring requirements.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link to={category.link} className="block h-full">
                  <div className="bg-card rounded-xl p-6 h-full border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <motion.div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300",
                        category.bgColor,
                        category.hoverBg
                      )}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={cn("h-7 w-7", category.color)} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <p className="text-xs text-primary font-medium mb-4">
                      Recommended: {category.product}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
