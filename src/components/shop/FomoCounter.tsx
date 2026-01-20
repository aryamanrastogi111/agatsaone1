import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle } from "lucide-react";
import { fetchProductByHandle } from "@/lib/shopify";

interface FomoCounterProps {
  productHandle: string;
  lowStockThreshold?: number;
  className?: string;
}

export const FomoCounter = ({
  productHandle,
  lowStockThreshold = 20,
  className = "",
}: FomoCounterProps) => {
  const [inventory, setInventory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const product = await fetchProductByHandle(productHandle);
        if (product?.variants?.edges?.[0]?.node?.quantityAvailable !== undefined) {
          setInventory(product.variants.edges[0].node.quantityAvailable);
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, [productHandle]);

  if (loading || inventory === null) return null;

  const isLowStock = inventory <= lowStockThreshold;
  const isCriticalStock = inventory <= 5;

  return (
    <AnimatePresence>
      {inventory > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`inline-flex items-center gap-2 ${className}`}
        >
          {isCriticalStock ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30">
              <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
              <span className="text-sm font-semibold text-destructive">
                Only {inventory} left! Order now
              </span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                🔥 Selling fast! Only {inventory} units left
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                ✓ {inventory} in stock
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
