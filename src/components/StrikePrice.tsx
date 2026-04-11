import { formatINR, MRP_PRICES, type DeviceSku } from "@/hooks/useDevicePricing";
import { Badge } from "@/components/ui/badge";

interface StrikePriceProps {
  sku: DeviceSku;
  price: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show the discount % badge */
  showBadge?: boolean;
  /** Show "Limited Time Offer" label */
  showLabel?: boolean;
  className?: string;
}

export function StrikePrice({
  sku,
  price,
  size = "lg",
  showBadge = true,
  showLabel = true,
  className = "",
}: StrikePriceProps) {
  const mrp = MRP_PRICES[sku];
  const discount = Math.round(((mrp - price) / mrp) * 100);

  const sizeClasses = {
    sm: { mrp: "text-sm", price: "text-lg font-bold", badge: "text-[10px]" },
    md: { mrp: "text-base", price: "text-2xl font-bold", badge: "text-xs" },
    lg: { mrp: "text-lg", price: "text-4xl font-extrabold", badge: "text-xs" },
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`${s.mrp} text-muted-foreground line-through`}>
        {formatINR(mrp)}
      </span>
      <span className={`${s.price} text-foreground`}>
        {formatINR(price)}
      </span>
      {showBadge && discount > 0 && (
        <Badge variant="secondary" className={`${s.badge} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800`}>
          {discount}% OFF
        </Badge>
      )}
      {showLabel && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 rounded-full px-2 py-0.5">
          Limited Time
        </span>
      )}
    </div>
  );
}
