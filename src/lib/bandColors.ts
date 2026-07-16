// Shared Rhythm Band color catalog + URL encoding for the color line-item note.
// Zero backend contract changes: the color rides on `variantTitle` inside the
// existing cart / orders.items JSON / email / invoice pipeline.

export type BandColor = { id: string; name: string; hex: string };

export const BAND_COLORS: BandColor[] = [
  { id: "olive",      name: "Olive",      hex: "#6B7A3A" },
  { id: "graphite",   name: "Graphite",   hex: "#2E2E2E" },
  { id: "khaki",      name: "Khaki",      hex: "#B8A55C" },
  { id: "slate",      name: "Slate",      hex: "#6B7BA8" },
  { id: "rosewood",   name: "Rosewood",   hex: "#8E3B4E" },
  { id: "terracotta", name: "Terracotta", hex: "#C1502E" },
  { id: "teal",       name: "Teal",       hex: "#1F6F86" },
];

export const BAND_SKU = "band_sub";

export function findBandColorByName(name?: string | null): BandColor | undefined {
  if (!name) return undefined;
  const n = name.trim().toLowerCase();
  return BAND_COLORS.find((c) => c.name.toLowerCase() === n || c.id === n);
}

// URL param: variants=band_sub:Terracotta (comma-separated for multiple SKUs)
export function encodeVariantsParam(map: Record<string, string | undefined>): string {
  const entries = Object.entries(map).filter(([, v]) => !!v);
  if (entries.length === 0) return "";
  return entries.map(([sku, v]) => `${sku}:${encodeURIComponent(v as string)}`).join(",");
}

export function decodeVariantsParam(param: string | null | undefined): Record<string, string> {
  if (!param) return {};
  const out: Record<string, string> = {};
  for (const part of param.split(",")) {
    const [sku, ...rest] = part.split(":");
    if (!sku || rest.length === 0) continue;
    out[sku] = decodeURIComponent(rest.join(":"));
  }
  return out;
}

// Build the standard /checkout URL from cart items, encoding SKUs + variantTitle.
export function buildCheckoutUrl(items: { productId: string; quantity: number; variantTitle?: string }[]): string {
  const skuList = items.flatMap((i) => Array(i.quantity).fill(i.productId));
  if (skuList.length === 0) return "/checkout";
  const variants: Record<string, string> = {};
  for (const i of items) {
    if (i.variantTitle && i.variantTitle !== "Default Title") {
      variants[i.productId] = i.variantTitle;
    }
  }
  const variantsStr = encodeVariantsParam(variants);
  const qs = new URLSearchParams({ sku: skuList.join(",") });
  if (variantsStr) qs.set("variants", variantsStr);
  return `/checkout?${qs.toString()}`;
}
