// Nera AI plan mapping for device SKUs / productIds
export interface NeraAiPlan {
  plan: "Premium" | "Weekly";
  duration: string;
  value: string;
}

const PLAN_MAP: Record<string, NeraAiPlan> = {
  "ecg_bundle":       { plan: "Premium", duration: "3 months", value: "₹1,197" },
  "bundle_ecg_band":  { plan: "Premium", duration: "3 months", value: "₹1,197" },
  "sanketlife-ecg":   { plan: "Premium", duration: "3 months", value: "₹1,197" },
  "wellness_sub":     { plan: "Weekly",  duration: "3 months", value: "₹897" },
  "easytouch-wellness": { plan: "Weekly", duration: "3 months", value: "₹897" },
  "band_sub":         { plan: "Weekly",  duration: "3 months", value: "₹897" },
  "rhythm-band":      { plan: "Weekly",  duration: "3 months", value: "₹897" },
  "scale_sub":        { plan: "Weekly",  duration: "3 months", value: "₹897" },
  "smart-scale":      { plan: "Weekly",  duration: "3 months", value: "₹897" },
  "multivital":       { plan: "Weekly",  duration: "3 months", value: "₹897" },
};

export function getNeraAiPlan(productId: string): NeraAiPlan | null {
  return PLAN_MAP[productId] ?? null;
}

export function getNeraAiLabel(productId: string): string | null {
  const p = getNeraAiPlan(productId);
  if (!p) return null;
  return `Nera AI ${p.plan} — ${p.duration}`;
}
