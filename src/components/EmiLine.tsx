import { useCurrency } from "@/contexts/CurrencyContext";

export function EmiLine({ price }: { price: number }) {
  const { currency } = useCurrency();
  // No-cost EMI is an India-only Razorpay offer — hide for non-INR display.
  if (currency !== "INR") return null;
  const monthly = Math.ceil(price / 12);
  return (
    <p className="text-sm text-muted-foreground/70 mt-0.5">
      or ₹{monthly.toLocaleString("en-IN")}/month · No-cost EMI via Razorpay
    </p>
  );
}

export function TrustBar({ showCDSCO = false }: { showCDSCO?: boolean } = {}) {
  const items = [
    ...(showCDSCO ? ["CDSCO Approved"] : []),
    "Free Shipping",
    "7-Day Return",
    "12-Month Warranty",
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs text-muted-foreground mt-3">
      {items.map((item) => (
        <span key={item}>
          <span className="text-green-600">✓</span> {item}
        </span>
      ))}
    </div>
  );
}
