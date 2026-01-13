import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Activity, Moon, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  {
    icon: Heart,
    title: "Heart Health",
    description: "Monitor your cardiac health with medical-grade ECG technology",
    link: "/products#heart",
    product: "SanketLife",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Activity,
    title: "Daily Wellness",
    description: "Track your vitals 24/7 with smart wearable technology",
    link: "/products#wellness",
    product: "EasyTouch Rhythm",
    color: "text-primary",
    bgColor: "bg-accent",
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Achieve deeper, more restful sleep without medication",
    link: "/products/zlu",
    product: "Zlu – Sleep Aid",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Scale,
    title: "Body Composition",
    description: "Understand your body beyond just weight with advanced analysis",
    link: "/products/corebalance",
    product: "CoreBalance BMI",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ChooseByNeedSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 h-full border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-5",
                      category.bgColor
                    )}
                  >
                    <Icon className={cn("h-7 w-7", category.color)} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  <p className="text-xs text-primary font-medium mb-4">
                    Recommended: {category.product}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent group-hover:translate-x-1 transition-transform"
                  >
                    <Link to={category.link} className="flex items-center gap-2">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
