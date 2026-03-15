import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { MultiProductDiscountBanner } from "@/components/shop/MultiProductDiscountBanner";
import { LowStockBadge } from "@/components/shop/LowStockBadge";

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-400 h-full flex flex-col">
                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-muted/60 via-muted/30 to-background/40 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.06)_0%,transparent_70%)]" />
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-4 relative z-10 drop-shadow-lg"
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-primary text-xs font-medium mt-0.5 mb-2">
                    {product.tagline}
                  </p>
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  {/* Low stock / out-of-stock badge */}
                  {!product.isExternal && (
                    <div className="mb-2">
                      <LowStockBadge productKey={product.id} variant="badge" />
                    </div>
                  )}
                  {product.price && (
                    <p className="text-sm font-bold text-foreground mb-3">{product.price}</p>
                  )}
                  {product.isExternal ? (
                    <Button asChild size="sm" className="w-full btn-glow group/btn text-xs">
                      <a href={product.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                        Visit website
                        <ExternalLink className="h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="w-full btn-glow group/btn text-xs">
                      <Link to={product.link} className="flex items-center justify-center gap-1.5">
                        Explore
                        <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Multi-Product Discount Banner */}
        <MultiProductDiscountBanner className="mt-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
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
