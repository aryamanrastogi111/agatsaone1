import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home as HomeIcon, Building2, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";

const solutions = [
  {
    id: "home",
    icon: HomeIcon,
    title: "For Home Users",
    subtitle: "Personal Health Monitoring",
    description: "Take charge of your health from the comfort of your home. Our devices are designed to be easy to use, with clear results you can understand and share with your doctor.",
    benefits: [
      "Monitor your health daily without clinic visits",
      "Easy-to-read reports you can share with doctors",
      "Peace of mind for you and your family",
      "Track trends over time to catch issues early"
    ],
    products: ["SanketLife", "EasyTouch Rhythm", "Zlu – Sleep Aid", "CoreBalance BMI"],
    cta: "Explore Home Products",
    link: "/products"
  },
  {
    id: "clinics",
    icon: Building2,
    title: "For Clinics & Hospitals",
    subtitle: "Healthcare Facility Integration",
    description: "Enhance your practice with medical-grade monitoring devices that integrate seamlessly into your workflow. Provide better care with accurate, instant results.",
    benefits: [
      "Medical-grade accuracy certified for clinical use",
      "Quick screening for high patient volumes",
      "Digital records for easy documentation",
      "Cost-effective compared to traditional equipment"
    ],
    products: ["SanketLife Pro", "CoreBalance Clinical", "Multi-device licensing"],
    cta: "Request Demo",
    link: "/support#contact"
  },
  {
    id: "enterprise",
    icon: Briefcase,
    title: "For Enterprises",
    subtitle: "Corporate Wellness Programs",
    description: "Invest in your team's health with comprehensive wellness solutions. Our enterprise packages help you build a healthier, more productive workforce.",
    benefits: [
      "Bulk device procurement with volume discounts",
      "Custom wellness program design",
      "Employee health analytics dashboard",
      "Dedicated support and training"
    ],
    products: ["Custom device bundles", "Health screening camps", "API integration"],
    cta: "Contact Sales",
    link: "/support#contact"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Solutions = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <HomeIcon className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Solutions for Everyone
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you're monitoring your health at home, running a clinic,
              or building a corporate wellness program — we have solutions
              tailored for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              const isReversed = index % 2 === 1;

              return (
                <motion.div
                  key={solution.id}
                  id={solution.id}
                  variants={itemVariants}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    isReversed ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={isReversed ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-primary font-medium">
                          {solution.subtitle}
                        </p>
                        <h2 className="text-3xl font-bold text-foreground">
                          {solution.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg mb-6">
                      {solution.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {solution.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="lg">
                      <Link to={solution.link} className="flex items-center gap-2">
                        {solution.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className={`${isReversed ? "lg:order-1" : ""}`}>
                    <div className="bg-muted/50 rounded-2xl p-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Recommended Products
                      </h3>
                      <div className="space-y-3">
                        {solution.products.map((product, i) => (
                          <div
                            key={i}
                            className="bg-background rounded-xl p-4 flex items-center justify-between group hover:shadow-md transition-shadow"
                          >
                            <span className="font-medium text-foreground">
                              {product}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether you need one device or a thousand, we're here to help you
              find the right solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/support#contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Solutions;
