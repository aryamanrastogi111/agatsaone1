import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import { SALE_CODE, isSaleActive } from "./CountdownTimer";

const STORAGE_KEY = "republic-sale-pill-dismissed";

export const FloatingCouponPill = () => {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(true); // Start hidden until checked
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if sale is active and not dismissed
    if (!isSaleActive()) {
      setIsVisible(false);
      return;
    }

    const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(isDismissed);
    
    // Show after a small delay for better UX
    if (!isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SALE_CODE);
      setCopied(true);
      toast.success("Coupon code copied!", { 
        position: "top-center",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(() => setDismissed(true), 300);
  };

  if (dismissed || !isSaleActive()) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6"
        >
          <div className="relative">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors z-10"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>

            {/* Main pill */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 bg-background/95 backdrop-blur-lg border border-primary/30 shadow-lg rounded-full pl-4 pr-3 py-2.5 hover:border-primary/50 hover:shadow-xl transition-all group"
            >
              {/* Indian flag indicator */}
              <div className="flex gap-0.5">
                <div className="w-1 h-4 rounded-full bg-orange-500" />
                <div className="w-1 h-4 rounded-full bg-white border border-border" />
                <div className="w-1 h-4 rounded-full bg-green-600" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">10% OFF</span>
                <span className="font-mono font-bold text-foreground">{SALE_CODE}</span>
              </div>

              <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
