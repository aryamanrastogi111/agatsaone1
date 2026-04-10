import { useInventory } from "@/hooks/useInventory";

interface StockUrgencyBarProps {
  /** product slug, product id, or variant id */
  productKey: string;
  /** Max stock level for full bar (default 50) */
  maxStock?: number;
  className?: string;
}

export function StockUrgencyBar({ productKey, maxStock = 50, className = "" }: StockUrgencyBarProps) {
  const { getQuantity, loading } = useInventory();

  if (loading) return null;

  const qty = getQuantity(productKey);
  // Don't show if we have no data or stock is above threshold
  if (qty === null || qty > 20) return null;
  // Don't show for out of stock — a separate badge handles that
  if (qty <= 0) return null;

  const pct = Math.max(5, Math.min(100, (qty / maxStock) * 100));
  const isCritical = qty <= 5;
  const isLow = qty <= 10;

  const barColor = isCritical
    ? "bg-destructive"
    : isLow
    ? "bg-amber-500"
    : "bg-amber-400";

  const textColor = isCritical
    ? "text-destructive"
    : "text-amber-600 dark:text-amber-400";

  const label = isCritical
    ? `⚡ Hurry! Only ${qty} left in stock`
    : qty <= 10
    ? `🔥 Selling fast — only ${qty} left`
    : `Only ${qty} left in stock`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${textColor}`}>{label}</span>
        {isCritical && (
          <span className="text-[10px] font-bold text-destructive animate-pulse uppercase tracking-wider">
            Almost gone
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor} ${isCritical ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
