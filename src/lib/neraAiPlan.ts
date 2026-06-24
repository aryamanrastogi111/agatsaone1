// Nera AI free-trial mapping per device SKU / productId.
// Every Agatsa device ships with a short free Nera AI trial that auto-activates
// when the customer pairs the device in Agatsa One.

export interface NeraAiPlan {
  /** Nera AI plan tier that the trial unlocks. */
  plan: "Premium" | "Standard";
  /** Trial length, in days. */
  trialDays: number;
  /** Short human label, e.g. "14 days". */
  trialDuration: string;
  /** Short badge string for cards/CTAs, e.g. "14-day Nera AI Premium free". */
  badgeShort: string;
  /** Longer line for hero stacks / "what's included" sections. */
  badgeLong: string;
}

const ECG_PLAN: NeraAiPlan = {
  plan: "Premium",
  trialDays: 14,
  trialDuration: "14 days",
  badgeShort: "14-day Nera AI Premium free",
  badgeLong: "Nera AI included + 14-day Nera AI Premium free",
};

const WELLNESS_PLAN: NeraAiPlan = {
  plan: "Standard",
  trialDays: 7,
  trialDuration: "7 days",
  badgeShort: "7-day Nera AI free",
  badgeLong: "7-day Nera AI subscription free",
};

const RHYTHM_PLAN: NeraAiPlan = {
  plan: "Premium",
  trialDays: 7,
  trialDuration: "7 days",
  badgeShort: "7-day Nera AI Premium free",
  badgeLong: "7-day Nera AI Premium free",
};

const SCALE_PLAN: NeraAiPlan = {
  plan: "Standard",
  trialDays: 7,
  trialDuration: "7 days",
  badgeShort: "7-day Nera AI free",
  badgeLong: "7-day Nera AI free",
};

const PLAN_MAP: Record<string, NeraAiPlan> = {
  // SanketLife ECG family
  "ecg_bundle":        ECG_PLAN,
  "bundle_ecg_band":   ECG_PLAN,
  "sanketlife-ecg":    ECG_PLAN,
  "ecg":               ECG_PLAN,

  // EasyTouch Wellness
  "wellness_sub":      WELLNESS_PLAN,
  "easytouch-wellness":WELLNESS_PLAN,
  "easytouch":         WELLNESS_PLAN,
  "multivital":        WELLNESS_PLAN,

  // Rhythm Band
  "band_sub":          RHYTHM_PLAN,
  "rhythm-band":       RHYTHM_PLAN,
  "easytouch-rhythm":  RHYTHM_PLAN,
  "rhythm":            RHYTHM_PLAN,

  // Smart Scale
  "scale_sub":         SCALE_PLAN,
  "smart-scale":       SCALE_PLAN,
  "corebalance":       SCALE_PLAN,
  "scale":             SCALE_PLAN,
};

export function getNeraAiPlan(productId: string): NeraAiPlan | null {
  return PLAN_MAP[productId] ?? null;
}

/** Short badge label, e.g. "14-day Nera AI Premium free". */
export function getNeraAiLabel(productId: string): string | null {
  return getNeraAiPlan(productId)?.badgeShort ?? null;
}

/** Longer included-line, e.g. "Nera AI included + 14-day Nera AI Premium free". */
export function getNeraAiIncludedLine(productId: string): string | null {
  return getNeraAiPlan(productId)?.badgeLong ?? null;
}

/** Activation copy used on /activate/:code and in transactional emails. */
export function getNeraAiActivationLine(productId: string): string {
  const p = getNeraAiPlan(productId);
  if (!p) return "Your Nera AI trial activates the moment you pair the device in Agatsa One.";
  if (p.plan === "Premium") {
    return `Your ${p.trialDuration} Nera AI Premium trial activates automatically as soon as you pair the device in Agatsa One.`;
  }
  return `Your ${p.trialDuration} Nera AI trial activates automatically as soon as you pair the device in Agatsa One.`;
}
