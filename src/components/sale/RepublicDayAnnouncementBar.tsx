import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CountdownTimer, SALE_CODE, isSaleActive } from "./CountdownTimer";

const STORAGE_KEY = "republic-sale-bar-dismissed";
const ALLOWED_PATHS = ["/", "/products", "/products/easytouch-rhythm"];

export const RepublicDayAnnouncementBar = () => {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isSaleActive()) return;
    const isDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(isDismissed);
  }, []);

  const isAllowedPath = ALLOWED_PATHS.some(path => 
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path)
  );

  if (dismissed || !isSaleActive() || !isAllowedPath) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  };

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="relative bg-gradient-to-r from-background via-primary/5 to-background border-b z-[60]"
      >
        {/* Tricolour accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-white to-green-600 opacity-60" />
        
        <div className="container py-2.5">
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-sm">
            {/* Flag emoji */}
            <span className="hidden sm:inline">🇮🇳</span>
            
            {/* Main message */}
            <span className="font-medium text-foreground">
              <span className="hidden sm:inline">Republic Day Offer: </span>
              <span className="text-primary font-bold">10% OFF</span>
              <span className="hidden md:inline"> EasyTouch Rhythm</span>
            </span>

            {/* Divider */}
            <span className="hidden sm:block w-px h-4 bg-border" />

            {/* Code copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded transition-colors"
            >
              <span className="text-xs text-muted-foreground">Code:</span>
              <span className="font-mono font-bold text-foreground">{SALE_CODE}</span>
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Divider */}
            <span className="hidden md:block w-px h-4 bg-border" />

            {/* Countdown - hidden on mobile */}
            <div className="hidden md:block">
              <CountdownTimer variant="inline" />
            </div>

            {/* Shop Now link */}
            <Button asChild size="sm" variant="ghost" className="h-7 px-2 gap-1 text-primary hover:text-primary">
              <Link to="/products/easytouch-rhythm">
                <span className="hidden sm:inline">Shop Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
