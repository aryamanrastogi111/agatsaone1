import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SALE_CODE } from "./CountdownTimer";

interface CouponCodeBoxProps {
  variant?: "compact" | "card" | "inline";
  className?: string;
}

export const CouponCodeBox = ({ variant = "card", className = "" }: CouponCodeBoxProps) => {
  const [copied, setCopied] = useState(false);

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

  if (variant === "inline") {
    return (
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors ${className}`}
      >
        <span className="font-mono bg-primary/10 px-2 py-0.5 rounded">{SALE_CODE}</span>
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
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 transition-colors ${className}`}
      >
        <span className="text-xs text-muted-foreground">Code:</span>
        <span className="font-mono font-semibold text-foreground">{SALE_CODE}</span>
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"
            >
              <Check className="h-3 w-3 text-green-600" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Copy className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    );
  }

  // Card variant
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-4 ${className}`}>
      {/* Subtle tricolour ribbon */}
      <div className="absolute top-0 right-0 w-20 h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
      
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Use code at checkout</p>
          <p className="font-mono text-2xl font-bold text-foreground tracking-wider">{SALE_CODE}</p>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 hover:bg-primary/10"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Code</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};
