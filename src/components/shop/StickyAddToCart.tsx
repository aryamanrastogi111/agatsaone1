import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyAddToCartProps {
  productName: string;
  /** Formatted unit price string e.g. "₹2,499" */
  price: string;
  /** Raw numeric unit price for quantity calculation */
  unitPrice?: number;
  onAddToCart: (quantity: number) => void;
  isLoading?: boolean;
  themeColor?: string;
  outOfStock?: boolean;
  /** Label for the buy button. Defaults to "Buy Now" */
  buyLabel?: string;
}

export const StickyAddToCart = ({
  productName,
  price,
  unitPrice,
  onAddToCart,
  isLoading = false,
  themeColor = "primary",
  outOfStock = false,
  buyLabel = "Buy Now",
}: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    setAddingToCart(true);
    onAddToCart(qty);
    setTimeout(() => setAddingToCart(false), 500);
  };

  const colorClasses: Record<string, string> = {
    primary: "bg-primary hover:bg-primary/90",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };

  const totalDisplay = unitPrice
    ? `₹${(unitPrice * qty).toLocaleString("en-IN")}`
    : price;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t shadow-lg"
        >
          <div className="container py-3">
            <div className="flex items-center justify-between gap-3">
              {/* Product info */}
              <div className="min-w-0 flex-shrink">
                <p className="font-semibold text-foreground truncate text-sm sm:text-base">{productName}</p>
                <p className="text-sm font-bold text-foreground">{totalDisplay}</p>
              </div>

              {outOfStock ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  Out of Stock
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-9 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 h-9 flex items-center justify-center text-sm font-semibold text-foreground">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      className="w-8 h-9 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Buy button */}
                  <Button
                    size="lg"
                    className={`gap-2 px-5 sm:px-6 ${colorClasses[themeColor] || colorClasses.primary}`}
                    onClick={handleClick}
                    disabled={addingToCart || isLoading}
                  >
                    {addingToCart ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">{buyLabel}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
