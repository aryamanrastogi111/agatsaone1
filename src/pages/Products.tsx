import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Heart, Activity, Moon, Scale, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { products } from "@/data/products";

const categoryIcons = {
  heart: Heart,
  wellness: Activity,
  sleep: Moon,
  weight: Scale,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Products = () => {
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
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our complete range of smart health monitoring devices,
              each designed with medical-grade precision for home and
              professional use.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            {products.map((product) => {
              const Icon = categoryIcons[product.category];
              return (
                <motion.div
                  key={product.id}
                  id={product.category}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[5/4] bg-gradient-to-br from-muted/60 via-muted/30 to-background/40 p-4 md:p-5 flex items-center justify-center relative">
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-foreground capitalize">
                          {product.category === "heart" ? "Heart Health" : 
                           product.category === "wellness" ? "Daily Wellness" :
                           product.category === "sleep" ? "Sleep Support" : "Body Composition"}
                        </span>
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-[92%] h-[92%] object-contain drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground">
                            {product.name}
                          </h2>
                          <p className="text-primary text-sm font-medium">
                            {product.tagline}
                          </p>
                        </div>
                        {product.price && (
                          <span className="text-xl font-bold text-foreground">
                            {product.price}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {product.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {product.benefits.map((benefit, index) => (
                          <li
                            key={index}
                            className="text-sm text-foreground flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      {product.features && (
                        <div className="mb-6 flex flex-wrap gap-2">
                          {product.features.map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-auto">
                        {product.isExternal ? (
                          <Button asChild className="w-full">
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              Visit website
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button asChild className="w-full">
                            <Link
                              to={product.link}
                              className="flex items-center justify-center gap-2"
                            >
                              Learn more
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
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
              Need help choosing?
            </h2>
            <p className="text-muted-foreground mb-8">
              Take our quick quiz to find the perfect device for your health goals.
            </p>
            <Button asChild size="lg">
              <Link to="/device-finder">Find the right device</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
