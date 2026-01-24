import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Sale ends January 26, 2026 at 11:59:59 PM IST
const SALE_END_DATE = new Date('2026-01-26T23:59:59+05:30');

interface CountdownTimerProps {
  variant?: "compact" | "full" | "inline";
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ variant = "full", className = "" }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = SALE_END_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isExpired) {
    return (
      <div className={`text-muted-foreground text-sm ${className}`}>
        Offer has ended
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (variant === "inline") {
    return (
      <span className={`font-mono text-sm font-medium ${className}`}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <span className="text-xs text-muted-foreground">Ends in:</span>
        <div className="flex items-center gap-1 font-mono text-sm font-semibold">
          {timeLeft.days > 0 && (
            <>
              <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">{timeLeft.days}d</span>
              <span className="text-muted-foreground">:</span>
            </>
          )}
          <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">{formatNumber(timeLeft.hours)}</span>
          <span className="text-muted-foreground">:</span>
          <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-muted-foreground">:</span>
          <span className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">{formatNumber(timeLeft.seconds)}</span>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${className}`}>
      <p className="text-sm text-muted-foreground mb-2">Offer ends in:</p>
      <div className="flex items-center gap-2">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hrs" },
          { value: timeLeft.minutes, label: "Min" },
          { value: timeLeft.seconds, label: "Sec" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center border border-primary/20">
                <span className="text-2xl font-bold text-foreground font-mono">
                  {formatNumber(item.value)}
                </span>
              </div>
              {/* Subtle tricolour accent line */}
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-full opacity-60" />
            </div>
            <span className="text-xs text-muted-foreground mt-1.5">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const isSaleActive = () => new Date() < SALE_END_DATE;
export const SALE_CODE = "REPUBLIC10";
export const SALE_DISCOUNT_PERCENT = 10;
