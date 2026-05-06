import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Offer ends at midnight IST tonight
export const MAY10_CODE = "MAY10";
export const MAY10_END_DATE = new Date("2026-05-06T23:59:59+05:30");
// Offer closed — force inactive everywhere
export const isMay10Active = () => false;

const STORAGE_KEY = "may10bold-bar-dismissed";

function useCountdown(target: Date) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0, expired: false });
  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
      return {
        h: Math.floor(diff / 3.6e6),
        m: Math.floor((diff / 6e4) % 60),
        s: Math.floor((diff / 1000) % 60),
        expired: false,
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

export const TodayOnlyOfferBar = () => {
  const [dismissed, setDismissed] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = useCountdown(MAY10_END_DATE);

  useEffect(() => {
    if (!isMay10Active()) return;
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  if (dismissed || !isMay10Active() || t.expired) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAY10_CODE);
      setCopied(true);
      toast.success("Coupon code copied!", { position: "top-center", duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white z-[60]"
      >
        <div className="container py-2">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-sm pr-8">
            <span className="font-bold tracking-wide">⚡ TODAY ONLY</span>
            <span className="hidden sm:inline opacity-90">·</span>
            <span className="font-medium">
              <span className="font-bold">10% OFF</span> with code
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur px-2 py-0.5 rounded transition"
            >
              <span className="font-mono font-bold">{MAY10_CODE}</span>
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                ) : (
                  <motion.span key="cp" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="h-3.5 w-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <span className="hidden sm:inline opacity-90">·</span>
            <span className="font-mono text-xs sm:text-sm bg-black/20 px-2 py-0.5 rounded">
              Ends in {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem(STORAGE_KEY, "true");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
