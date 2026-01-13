import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export function ProductsPortfolioSection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete ecosystem of health monitoring devices, each designed
            with medical-grade precision for home and professional use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-500">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted/50 to-muted/30 p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05)_0%,transparent_70%)]" />
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    className="max-h-48 object-contain relative z-10"
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-primary text-sm font-medium">
                        {product.tagline}
                      </p>
                    </div>
                    {product.price && (
                      <span className="text-lg font-bold text-foreground">
                        {product.price}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {product.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        className="text-sm text-foreground flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                  {product.isExternal ? (
                    <Button asChild className="w-full btn-glow group/btn">
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Visit website
                        <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  ) : (
                    <Button asChild className="w-full btn-glow group/btn">
                      <Link
                        to={product.link}
                        className="flex items-center justify-center gap-2"
                      >
                        Learn more
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg" className="group">
            <Link to="/products" className="flex items-center gap-2">
              View all products
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
