import type { RhythmAngle } from "@/lib/rhythmCampaign";

type RhythmGoal = {
  label: string; heading: string; intro: string; photoAlt: string; benefits: string[];
  science: { summary: string; context: string; citation: string; url: string; participants: number };
};

export const RHYTHM_GOALS: Record<RhythmAngle, RhythmGoal> = {
  weight: {
    label: "Manage my weight", heading: "Your weight goal. Your everyday habits.",
    intro: "You don't need to change everything at once. Start by seeing your meals, movement and rest together, then choose a small change you can keep up.",
    photoAlt: "Illustrative Indian woman preparing for her daily walk by tying her walking shoes",
    benefits: ["Log meals in Agatsa One so you can look back at portions and food choices.", "Track your steps and activity with Rhythm Band to see how movement fits into your day.", "Review sleep and available wellness insights with NERA while building a routine that works for you."],
    science: { participants: 609, summary: "There wasn't one winning diet for everyone.", context: "In a 12-month study of 609 adults with overweight or obesity, healthy low-fat and healthy low-carbohydrate diets produced no significant difference in average weight loss. Both approaches focused on improving food quality.", citation: "Gardner et al. · JAMA, 2018", url: "https://pubmed.ncbi.nlm.nih.gov/29466592/" },
  },
  food: {
    label: "Understand my food", heading: "Your meals deserve a little more context.",
    intro: "Rice, roti or your usual lunch—start with what you actually eat. Looking at meals alongside your routine can make everyday choices feel less like guesswork.",
    photoAlt: "Illustrative home-cooked Indian thali with roti, rice, dal, vegetables and curd being served",
    benefits: ["Add meal context in Agatsa One and look back at what you ate and when.", "See available activity and sleep insights alongside your meals, rather than food in isolation.", "Explore NERA's inferred metabolic trends over time, without treating them as exact sugar readings."],
    science: { participants: 800, summary: "The same meal can produce different responses in different people.", context: "Researchers followed 800 people and recorded responses to 46,898 meals. They found substantial differences in measured sugar responses—even after identical meals.", citation: "Zeevi et al. · Cell, 2015", url: "https://pubmed.ncbi.nlm.nih.gov/26590418/" },
  },
  sugar: {
    label: "Build healthier sugar habits", heading: "Make room for habits you can act on.",
    intro: "When sugar is on your mind, everyday routines matter too. Bring meals, movement and rest into one view, while continuing the checks and advice your clinician recommends.",
    photoAlt: "Illustrative Indian couple taking a gentle neighbourhood walk as part of an after-meal routine",
    benefits: ["Use meal logs to notice your eating times and everyday food habits.", "Track steps and activity to see where a short walk could fit into your routine.", "Review sleep and available wellness patterns with NERA—without using inferred trends to change medication."],
    science: { participants: 41, summary: "When you walk may matter—not just how long.", context: "In 41 adults with type 2 diabetes, walking for 10 minutes after each main meal was compared with one 30-minute daily walk. The measured sugar-response area over the three hours after meals was 12% lower with after-meal walking.", citation: "Reynolds et al. · Diabetologia, 2016", url: "https://pubmed.ncbi.nlm.nih.gov/27747394/" },
  },
};
