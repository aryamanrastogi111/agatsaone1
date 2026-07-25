// EMI display removed site-wide.
export function EmiLine(_props: { price: number }) {
  return null;
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
