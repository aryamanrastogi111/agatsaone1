import { motion } from "framer-motion";

interface RepublicDaySaleBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export const RepublicDaySaleBadge = ({ size = "md", className = "" }: RepublicDaySaleBadgeProps) => {
  if (size === "sm") {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1 bg-gradient-to-r from-orange-500/10 via-background to-green-600/10 border border-primary/30 rounded-full px-2 py-0.5 ${className}`}
      >
        <span className="text-[10px]">🇮🇳</span>
        <span className="text-[10px] font-semibold text-primary">10% OFF</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
      animate={{ scale: 1, opacity: 1, rotate: -3 }}
      whileHover={{ scale: 1.05 }}
      className={`relative inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600 p-0.5 rounded-lg shadow-lg ${className}`}
    >
      <div className="flex items-center gap-1.5 bg-background rounded-md px-3 py-1.5">
        <span className="text-sm">🇮🇳</span>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground leading-tight">Republic Day</span>
          <span className="text-sm font-bold text-primary leading-tight">10% OFF</span>
        </div>
      </div>
    </motion.div>
  );
};
