import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyAddToCartProps {
  productName: string;
  price: string;
  onAddToCart: () => void;
  isLoading?: boolean;
  themeColor?: string;
}

export const StickyAddToCart = ({
  productName,
  price,
  onAddToCart,
  isLoading = false,
  themeColor = "primary",
}: StickyAddToCartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past 600px (roughly past hero section)
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = async () => {
    setAddingToCart(true);
    onAddToCart();
    setTimeout(() => setAddingToCart(false), 500);
  };

  const colorClasses: Record<string, string> = {
    primary: "bg-primary hover:bg-primary/90",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };

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
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{productName}</p>
                <p className="text-sm text-muted-foreground">{price}</p>
              </div>
              <Button
                size="lg"
                className={`gap-2 px-6 ${colorClasses[themeColor] || colorClasses.primary}`}
                onClick={handleClick}
                disabled={addingToCart || isLoading}
              >
                {addingToCart ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">Add to Cart</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
