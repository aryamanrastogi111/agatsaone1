import { motion, AnimatePresence } from "framer-motion";
import { Flame, AlertTriangle, PackageX } from "lucide-react";
import { useInventory } from "@/hooks/useInventory";

interface LowStockBadgeProps {
  /** product slug, product id, or variant id */
  productKey: string;
  /** qty at or below which "low stock" kicks in (default: 10) */
  lowThreshold?: number;
  /** qty at or below which "critical" kicks in (default: 5) */
  criticalThreshold?: number;
  /** visual variant */
  variant?: "badge" | "banner" | "inline";
  className?: string;
}

/**
 * Renders nothing when stock is healthy (> lowThreshold).
 * Shows animated FOMO text when stock ≤ lowThreshold.
 * Shows urgent "Out of Stock" when stock = 0.
 */
export function LowStockBadge({
  productKey,
  lowThreshold = 10,
  criticalThreshold = 5,
  variant = "badge",
  className = "",
}: LowStockBadgeProps) {
  const { getQuantity, loading } = useInventory();

  if (loading) return null;

  const qty = getQuantity(productKey);

  // If we have no data for this key, show nothing
  if (qty === null) return null;

  const isOutOfStock = qty <= 0;
  const isCritical = qty > 0 && qty <= criticalThreshold;
  const isLow = qty > criticalThreshold && qty <= lowThreshold;

  if (!isOutOfStock && !isCritical && !isLow) return null;

  if (variant === "badge") {
    return (
      <AnimatePresence>
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOutOfStock
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : isCritical
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400"
          } ${className}`}
        >
          {isOutOfStock ? (
            <>
              <PackageX className="h-3 w-3" /> Out of Stock
            </>
          ) : isCritical ? (
            <>
              <AlertTriangle className="h-3 w-3 animate-pulse" /> Only {qty} left!
            </>
          ) : (
            <>
              <Flame className="h-3 w-3" /> Only {qty} left
            </>
          )}
        </motion.span>
      </AnimatePresence>
    );
  }

  if (variant === "inline") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 ${className}`}
        >
          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-destructive">
              <PackageX className="h-4 w-4" />
              <span className="text-sm font-semibold">Out of Stock</span>
            </div>
          ) : isCritical ? (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-semibold">Only {qty} left — Order now!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">🔥 Selling fast! Only {qty} units left</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // banner variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 ${
          isOutOfStock
            ? "bg-destructive/10 border border-destructive/20"
            : isCritical
            ? "bg-destructive/10 border border-destructive/25"
            : "bg-amber-500/10 border border-amber-500/25"
        } ${className}`}
      >
        {isOutOfStock ? (
          <PackageX className="h-5 w-5 text-destructive shrink-0" />
        ) : isCritical ? (
          <AlertTriangle className="h-5 w-5 text-destructive animate-pulse shrink-0" />
        ) : (
          <Flame className="h-5 w-5 text-amber-500 shrink-0" />
        )}
        <div>
          {isOutOfStock ? (
            <>
              <p className="text-sm font-bold text-destructive">Currently Out of Stock</p>
              <p className="text-xs text-destructive/70">Check back soon — we restock regularly</p>
            </>
          ) : isCritical ? (
            <>
              <p className="text-sm font-bold text-destructive">
                Almost Gone — Only {qty} unit{qty === 1 ? "" : "s"} remaining!
              </p>
              <p className="text-xs text-destructive/70">Order now to avoid missing out</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                🔥 Selling Fast — Only {qty} units left in stock!
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-500/80">
                High demand — secure yours before it sells out
              </p>
            </>
          )}
        </div>

        {/* Animated urgency pulse for critical */}
        {(isCritical || isLow) && !isOutOfStock && (
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <span
              className={`relative flex h-2.5 w-2.5`}
            >
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isCritical ? "bg-destructive" : "bg-amber-500"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isCritical ? "bg-destructive" : "bg-amber-500"
                }`}
              />
            </span>
            <span className={`text-xs font-semibold ${isCritical ? "text-destructive" : "text-amber-600"}`}>
              {isCritical ? "URGENT" : "LOW STOCK"}
            </span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
