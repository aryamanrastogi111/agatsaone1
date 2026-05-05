import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

interface PurchaseItem {
  name: string;
  city: string;
  timeAgo: string;
}

const NAMES = [
  "Rajesh", "Priya", "Amit", "Sneha", "Vikram", "Anita", "Rohit", "Pooja",
  "Sandeep", "Meena", "Karan", "Divya", "Manoj", "Ritika", "Faisal", "Lavanya",
  "Aditya", "Shweta", "Rahul", "Anjali", "Tushar", "Maya", "Prateek", "Yogesh",
  "Deepika", "Mahesh", "Smita", "Rohan", "Ananya", "Neelam", "Kavitha", "Suresh",
];

const CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Surat", "Nagpur", "Indore",
  "Bhopal", "Kochi", "Coimbatore", "Vadodara", "Gurugram", "Noida", "Faridabad",
  "Mysuru", "Mangaluru", "Dehradun", "Ranchi", "Patna", "Vizag", "Trivandrum",
];

const TIMES = [
  "just now",
  "2 minutes ago",
  "5 minutes ago",
  "12 minutes ago",
  "23 minutes ago",
  "45 minutes ago",
  "1 hour ago",
  "2 hours ago",
  "3 hours ago",
  "5 hours ago",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const randomPurchase = (): PurchaseItem => ({
  name: pick(NAMES),
  city: pick(CITIES),
  timeAgo: pick(TIMES),
});

export function RecentPurchasePopup({ productName = "EasyTouch Wellness" }: { productName?: string } = {}) {
  const [current, setCurrent] = useState<PurchaseItem | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let timeout: ReturnType<typeof setTimeout>;
    let hideTimeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 10000 + Math.random() * 20000; // 10–30s
      timeout = setTimeout(() => {
        setCurrent(randomPurchase());
        hideTimeout = setTimeout(() => {
          setCurrent(null);
          schedule();
        }, 5000);
      }, delay);
    };

    // First popup after 6s
    timeout = setTimeout(() => {
      setCurrent(randomPurchase());
      hideTimeout = setTimeout(() => {
        setCurrent(null);
        schedule();
      }, 5000);
    }, 6000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, [dismissed]);

  return (
    <AnimatePresence>
      {current && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed z-[60] bottom-24 left-4 sm:left-6 max-w-[320px] sm:max-w-[360px]"
          style={{
            background: "#ffffff",
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(26,26,46,0.18), 0 2px 6px rgba(26,26,46,0.08)",
            border: "1px solid rgba(124,77,255,0.15)",
          }}
        >
          <div className="flex items-start gap-3 p-3 pr-8">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C4DFF,#1A73E8)" }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: "#fff" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] leading-snug"
                style={{ color: "#1A1A2E", fontWeight: 600 }}
              >
                {current.name} from {current.city}
              </p>
              <p
                className="text-[12px] leading-snug mt-0.5"
                style={{ color: "#4A4A68" }}
              >
                purchased {productName}
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: "#7C4DFF", fontWeight: 500 }}
              >
                {current.timeAgo} · Verified purchase
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-black/5 transition"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" style={{ color: "#999" }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
