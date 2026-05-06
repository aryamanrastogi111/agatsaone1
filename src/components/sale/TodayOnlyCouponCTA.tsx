import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { MAY10_CODE, MAY10_END_DATE, isMay10Active } from "./TodayOnlyOfferBar";

interface Props {
  className?: string;
}

export const TodayOnlyCouponCTA = ({ className = "" }: Props) => {
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!isMay10Active()) return null;

  const diff = Math.max(0, MAY10_END_DATE.getTime() - now);
  const h = Math.floor(diff / 3.6e6);
  const m = Math.floor((diff / 6e4) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAY10_CODE);
      setCopied(true);
      toast.success("Coupon code copied! Apply at checkout.", { position: "top-center", duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 rounded-xl border-2 border-dashed border-orange-400 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 p-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">⚡</span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">Today Only · 10% OFF</p>
            <p className="text-[11px] text-orange-900/70 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Ends in {pad(h)}:{pad(m)}:{pad(s)}
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-white border-2 border-orange-400 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition flex-shrink-0"
        >
          <span className="font-mono font-bold text-sm text-orange-700">{MAY10_CODE}</span>
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check className="h-4 w-4 text-green-600" />
              </motion.span>
            ) : (
              <motion.span key="cp" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy className="h-4 w-4 text-orange-600" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};
