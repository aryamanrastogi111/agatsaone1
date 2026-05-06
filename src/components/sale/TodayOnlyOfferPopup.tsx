import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";
import { MAY10_CODE, MAY10_END_DATE, isMay10Active } from "./TodayOnlyOfferBar";

const STORAGE_KEY = "may10-popup-shown";
const SHOW_DELAY_MS = 10000;

export const TodayOnlyOfferPopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!isMay10Active()) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [open]);

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
      toast.error("Failed to copy code");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white"
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-6 pt-7 pb-6 text-center text-white">
              <div className="text-3xl mb-1">⚡</div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-90">Today Only</p>
              <h2 className="text-3xl font-black mt-1 leading-none">10% OFF</h2>
              <p className="mt-2 text-sm opacity-95">on your entire order</p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-center text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                Use this code at checkout
              </p>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between gap-3 border-2 border-dashed border-orange-400 bg-orange-50 hover:bg-orange-100 transition rounded-xl px-4 py-3"
              >
                <span className="font-mono font-black text-2xl text-orange-700 tracking-widest">
                  {MAY10_CODE}
                </span>
                <span className="flex items-center gap-1.5 bg-orange-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                        <Check className="h-4 w-4" /> Copied
                      </motion.span>
                    ) : (
                      <motion.span key="cp" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                        <Copy className="h-4 w-4" /> Copy
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>

              {/* Timer */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-rose-600" />
                <span className="text-gray-700">Offer ends in</span>
                <span className="font-mono font-bold bg-gray-900 text-white px-2 py-0.5 rounded">
                  {pad(h)}:{pad(m)}:{pad(s)}
                </span>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="mt-5 w-full rounded-full py-3 font-bold text-white hover:opacity-90 transition bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
              >
                Shop Now & Save 10%
              </button>
              <p className="mt-2 text-center text-[11px] text-gray-400">
                Limited time offer · Apply code at checkout
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
