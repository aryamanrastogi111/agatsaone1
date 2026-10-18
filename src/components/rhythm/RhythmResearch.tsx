import { ArrowUpRight, BrainCircuit, Smartphone, Watch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHYTHM_COHORTS, RHYTHM_PAPERS } from "@/data/rhythmResearch";
import { RhythmCohortChart } from "./RhythmCohortChart";

export function RhythmResearch() {
  return <>
    <section className="rhythm-section bg-muted" id="science">
      <div className="rhythm-container">
        <p className="rhythm-eyebrow">Published science / 01</p>
        <h2 className="rhythm-heading max-w-3xl">Your Food. Your Body.<br />Your Response.</h2>
        <p className="rhythm-copy mt-5 max-w-2xl">Two people can eat the same meal and respond differently. Researchers have spent years studying why — and what food and lifestyle choices can change.</p>
        <div className="rhythm-paper-list mt-10" aria-label="Published nutrition research">
          {RHYTHM_PAPERS.map((paper, i) => <article className="rhythm-paper" key={paper.author}>
            <div className="flex justify-between text-sm text-primary"><span>0{i + 1}</span><span>{paper.year}</span></div>
            <p className="mt-5 text-xs text-muted-foreground">{paper.journal}</p>
            <h3 className="mt-2 text-lg font-semibold">{paper.topic}</h3>
            <p className="mt-4 text-sm font-semibold">{paper.finding}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{paper.detail}</p>
            <p className="mt-4 text-sm font-medium">{paper.takeaway}</p>
            <Button variant="link" asChild className="mt-auto justify-start px-0 pt-6 text-primary"><a href={paper.url} target="_blank" rel="noopener noreferrer">{paper.author} <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
          </article>)}
        </div>
      </div>
    </section>
    <section className="rhythm-section" id="agatsa-research">
      <div className="rhythm-container">
        <p className="rhythm-eyebrow">Agatsa research / 02</p>
        <h2 className="rhythm-heading max-w-3xl">One Agatsa Algorithm.<br />Two Wearable Platforms.</h2>
        <p className="rhythm-copy mt-5 max-w-3xl">We built NERA AI, brought it into Agatsa One, and connected the experience to Apple Watch and EasyTouch Rhythm Band. Our research asks a practical question: can wearable-derived sugar trends show meal-linked rises and subsequent falls in everyday life?</p>
        <div className="mt-8 grid gap-6 border-y border-border py-7 md:grid-cols-3">
          {[{ icon: BrainCircuit, title: "NERA AI", copy: "Agatsa’s proprietary algorithm interprets wearable signals as inferred metabolic trends." }, { icon: Smartphone, title: "Agatsa One", copy: "The app brings those trends together with time-stamped meal logs and meal context." }, { icon: Watch, title: "Two wearable platforms", copy: "Separate retrospective studies examined Apple Watch and Rhythm Band records." }].map(item => <div key={item.title}><item.icon className="h-6 w-6 text-primary" /><h3 className="mt-4 text-lg font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed">{item.copy}</p></div>)}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          <div><p className="text-3xl font-semibold">102,469</p><p className="mt-2 text-sm">stored wearable observations</p></div>
          <div><p className="text-3xl font-semibold">6,591</p><p className="mt-2 text-sm">logged meals across the cohorts</p></div>
          <div><p className="text-3xl font-semibold">~3 months</p><p className="mt-2 text-sm">late May to early September 2026</p></div>
        </div>
        <p className="mt-5 text-sm leading-relaxed">These are retrospective feasibility studies of ordinary app use, not a three-month trial for every participant. Cohorts may overlap; user counts are not combined into a unique participant total.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {RHYTHM_COHORTS.map(cohort => <article key={cohort.device} className="flex flex-col rounded-lg border border-border bg-card p-6">
            <h3 className="text-base font-semibold">{cohort.device}</h3>
            <p className="mt-2 text-xs">{cohort.period}</p>
            <p className="mt-4 text-sm">{cohort.users} users · {cohort.observations.toLocaleString("en-IN")} observations<br />{cohort.meals.toLocaleString("en-IN")} logged meals</p>
            <dl className="mt-6 space-y-5 border-t border-border pt-5">
              <div><dt className="text-sm">Upward trend after a meal</dt><dd className="mt-2 text-3xl font-semibold text-primary">{cohort.mealRise.percent.toFixed(1)}%</dd><dd className="mt-1 text-xs">{cohort.mealRise.positive.toLocaleString("en-IN")} / {cohort.mealRise.total.toLocaleString("en-IN")} evaluable meal events · primary window</dd></div>
              <div><dt className="text-sm">Downward trend after a peak</dt><dd className="mt-2 text-2xl font-semibold">{cohort.recovery.percent.toFixed(1)}%</dd><dd className="mt-1 text-xs">{cohort.recovery.positive.toLocaleString("en-IN")} / {cohort.recovery.total.toLocaleString("en-IN")} evaluable post-peak trajectories</dd></div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed">{cohort.interpretation}</p>
            <p className="mt-auto pt-5 text-xs leading-relaxed">Source: {cohort.source}. Percentages describe observed events.</p>
          </article>)}
        </div>
        <RhythmCohortChart />
        <div className="mt-8 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
          <div><h3 className="text-xl font-semibold">Why this matters</h3><p className="mt-4 text-sm leading-relaxed">The innovation is a way to evaluate inferred metabolic trends using real-world events: meal timing, movement in both directions, and decline after a peak. Both datasets showed consistent meal-linked rises and post-peak falls.</p></div>
          <div><h3 className="text-xl font-semibold">What meal content tells us</h3><p className="mt-4 text-sm leading-relaxed">Not all calories are equal, and not every body responds to the same food in the same way. Agatsa One combines AI-based meal recognition with nutritional intelligence to analyze carbohydrates, proteins, fats, calories and glycemic load. Our real-world studies covering <strong className="font-semibold">6,591 logged meals</strong> reveal that carbohydrate content alone does not reliably explain individual metabolic responses. By connecting meal composition with wearable-derived metabolic trends, our technology creates a foundation for personalized food intelligence — helping users understand which meals are associated with stronger responses, how their bodies recover, and how to make smarter everyday food choices. <strong className="font-semibold">Beyond counting calories. Understanding food and your body’s response to it.</strong></p></div>
        </div>
      </div>
    </section>
  </>;
}