export type RhythmAngle = "weight" | "food" | "sugar";

export const RHYTHM_DEFAULT_HERO = {
  headline: "Discover your food and daily wellness patterns.",
  copy: "Your meals. Your movement. Your rest. Rhythm Band and NERA bring your everyday habits and available wellness insights together, so you can explore what matters to you.",
};

export function getRhythmExperience(search: string) {
  return { hero: RHYTHM_DEFAULT_HERO, selectedGoal: getRhythmAngle(search) };
}

export const RHYTHM_CAMPAIGNS = {
  weight: { code: "r01", headline: "Weight Loss Shuru Karo Apni Plate Se.", copy: "Apne meals samjho. Rhythm Band se daily activity track karo. NERA ke saath better food aur lifestyle habits banao.", goal: "Manage My Weight", explanation: "Build better food and activity habits." },
  food: { code: "r02", headline: "Roti, Chawal, Mithai — Kya Aur Kitna Khana Hai?", copy: "Understand your meals, portions and daily food habits. Discover simple changes that can make everyday eating better.", goal: "Understand My Food", explanation: "Make more informed everyday food choices." },
  sugar: { code: "r03", headline: "Sugar Ki Chinta Hai? Apne Khaane Aur Daily Habits Samjho.", copy: "See your food and lifestyle patterns together. Build better eating, activity and sleep habits with Rhythm Band and NERA.", goal: "Build Healthier Sugar Habits", explanation: "Understand the connection between food, movement and daily routines." },
} as const;

export function getRhythmAngle(search: string): RhythmAngle | null {
  const angle = new URLSearchParams(search).get("angle");
  return angle === "weight" || angle === "food" || angle === "sugar" ? angle : null;
}

export function selectRhythmAngle(search: string, angle: RhythmAngle): string {
  const params = new URLSearchParams(search);
  params.set("angle", angle);
  return `?${params.toString()}`;
}

export type RhythmAttribution = { campaignCode: string; source: string | null; medium: string | null; campaign: string | null; content: string | null };

export function getRhythmAttribution(search: string): RhythmAttribution {
  const params = new URLSearchParams(search);
  const angle = getRhythmAngle(search);
  return { campaignCode: angle ? RHYTHM_CAMPAIGNS[angle].code : "r00", source: params.get("utm_source"), medium: params.get("utm_medium"), campaign: params.get("utm_campaign"), content: params.get("utm_content") };
}

// First-party session record only. No meal, condition or goal text goes to an ad provider.
export function recordRhythmInteraction(action: "landing_view" | "hero_cta" | "goal_selection" | "add_to_cart" | "buy_now", search: string): void {
  try {
    const key = "agatsa-rhythm-campaign-v1";
    const saved = JSON.parse(sessionStorage.getItem(key) || "null") as { original: RhythmAttribution; interactions: { action: string; campaignCode: string; at: string }[] } | null;
    const current = getRhythmAttribution(search);
    const record = saved || { original: current, interactions: [] };
    record.interactions = [...record.interactions, { action, campaignCode: current.campaignCode, at: new Date().toISOString() }].slice(-40);
    sessionStorage.setItem(key, JSON.stringify(record));
  } catch { /* Storage may be unavailable; purchases must remain usable. */ }
}