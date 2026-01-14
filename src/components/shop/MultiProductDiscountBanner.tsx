import { motion } from "framer-motion";
import { Tag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface MultiProductDiscountBannerProps {
  variant?: "compact" | "full" | "inline";
  className?: string;
}

export function MultiProductDiscountBanner({ variant = "full", className = "" }: MultiProductDiscountBannerProps) {
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full ${className}`}>
        <Tag className="h-3 w-3 text-green-600" />
        <span className="text-xs font-medium text-green-700 dark:text-green-400">
          10% off when you buy 2+ products
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`flex items-center gap-2 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg ${className}`}
      >
        <Tag className="h-4 w-4 text-green-600 flex-shrink-0" />
        <p className="text-sm font-medium text-green-700 dark:text-green-400">
          Buy 2+ products & save 10%
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-4 md:p-6 ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.05)_0%,transparent_50%)]" />
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Multi-Product Discount
            </h3>
            <p className="text-sm text-muted-foreground">
              Buy any 2 or more products and get <span className="font-semibold text-green-600">10% off</span> your entire order
            </p>
          </div>
        </div>
        
        <Link to="/products">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Shop All Products
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
