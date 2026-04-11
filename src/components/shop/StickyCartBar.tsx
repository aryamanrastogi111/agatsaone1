import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * A persistent sticky bar at the bottom of the page showing cart summary.
 * Visible whenever there are items in the cart.
 */
export const StickyCartBar = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const formatINR = (amount: number) =>
    "₹" + amount.toLocaleString("en-IN");

  const handleCheckout = () => {
    const skuList = items.flatMap((item) =>
      Array(item.quantity).fill(item.productId)
    );
    if (skuList.length > 0) {
      navigate(`/checkout?sku=${skuList.join(",")}`);
    }
  };

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
        >
          <div className="container py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={clearCart}
                  className="shrink-0 rounded-full p-1 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Clear cart"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative shrink-0">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {totalItems} {totalItems === 1 ? "device" : "devices"} · {formatINR(totalPrice)}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                variant="secondary"
                size="sm"
                className="gap-1.5 rounded-full px-5 font-semibold shrink-0"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
