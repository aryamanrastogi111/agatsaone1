import { ArrowRight, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHYTHM_GOALS } from "@/data/rhythmGoals";
import type { RhythmAngle } from "@/lib/rhythmCampaign";
import weightPhoto from "@/assets/rhythm-real-aditi.jpg";
import foodPhoto from "@/assets/rhythm-food-rice.jpg";
import habitsPhoto from "@/assets/rhythm-real-menon.jpg";

const PHOTOS = { weight: weightPhoto, food: foodPhoto, sugar: habitsPhoto };

export function RhythmGoalCard({ angle }: { angle: RhythmAngle }) {
  const goal = RHYTHM_GOALS[angle];
  return <article key={angle} className="rhythm-goal-card mt-6 overflow-hidden rounded-lg border border-border bg-card" aria-labelledby={`goal-${angle}`}>
    <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <figure className="relative min-w-0">
        <img src={PHOTOS[angle]} alt={goal.photoAlt} className="h-56 w-full object-cover md:h-full md:max-h-[560px]" />
        <figcaption className="absolute bottom-0 w-full bg-card/95 px-4 py-2 text-xs">Illustrative AI-generated photograph · not a customer outcome</figcaption>
      </figure>
      <div className="min-w-0 p-6 md:p-8">
        <p className="rhythm-eyebrow">Your focus · {goal.label}</p>
        <h3 id={`goal-${angle}`} className="text-2xl font-semibold leading-tight md:text-3xl">{goal.heading}</h3>
        <p className="mt-4 text-base leading-relaxed">{goal.intro}</p>
        <h4 className="mt-6 text-sm font-semibold">How Rhythm Band helps you</h4>
        <ul className="mt-3 space-y-3">{goal.benefits.map(benefit => <li key={benefit} className="flex gap-3 text-sm leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{benefit}</li>)}</ul>
        <Button asChild className="mt-6"><a href="#buy">Find your Rhythm Band <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
      </div>
    </div>
    <div className="border-t border-border bg-accent p-6 md:p-8">
      <p className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-primary" />What the science says</p>
      <p className="mt-3 text-base font-semibold">{goal.science.summary}</p>
      <p className="mt-2 text-sm leading-relaxed">{goal.science.context}</p>
      <a href={goal.science.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4">{goal.science.citation}<ArrowRight className="h-3 w-3" /></a>
      <p className="mt-3 text-xs leading-relaxed">{goal.science.limit}</p>
    </div>
  </article>;
}