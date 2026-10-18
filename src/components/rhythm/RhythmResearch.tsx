import { ArrowUpRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RHYTHM_COHORTS, RHYTHM_PAPERS } from "@/data/rhythmResearch";
import crossDeviceStudy from "@/assets/publications/cross-device-reproducibility-study.pdf";
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
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">These papers explain general scientific principles. None tested or endorsed EasyTouch Rhythm Band. CGM findings do not validate Rhythm Band's inferred sugar-response trends.</p>
      </div>
    </section>
    <section className="rhythm-section" id="agatsa-research">
      <div className="rhythm-container">
        <p className="rhythm-eyebrow">Agatsa research / 02</p>
        <h2 className="rhythm-heading max-w-3xl">Researching Food-Response Patterns Across Wearables</h2>
        <p className="rhythm-copy mt-5 max-w-2xl">We studied real-world wearable data to understand whether similar meal-related patterns could be identified across different devices.</p>
        <div className="mt-10 grid gap-8 border-y border-border py-8 md:grid-cols-3">
          {RHYTHM_COHORTS.map(cohort => <div key={cohort.device} className="rounded-lg border border-border bg-muted p-6">
            <h3 className="text-base font-semibold">{cohort.device}</h3>
            <p className="mt-4 text-3xl font-semibold">{cohort.observations.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-sm text-muted-foreground">observations · {cohort.users} users in this cohort</p>
          </div>)}
        </div>
        <RhythmCohortChart />
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_2fr]">
          <div><p className="text-3xl font-semibold text-primary">105,408</p><p className="mt-1 text-sm text-muted-foreground">observations across three separate cohorts</p></div>
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>Our retrospective analysis observed meal-related rise and recovery patterns across the wearable platforms. Cohorts were analysed separately and may overlap; the user counts are not a total of unique participants.</p>
            <p>This analysis did not include synchronised CGM-matched reference measurements. It does not establish sugar measurement accuracy, diagnostic performance or equivalence to a CGM or glucometer. The supplied report is an Agatsa research manuscript, not an independently verified peer-reviewed publication.</p>
            <Button asChild variant="outline"><a href={crossDeviceStudy} target="_blank" rel="noopener noreferrer"><FileText className="mr-2 h-4 w-4" />Read the research manuscript <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
          </div>
        </div>
      </div>
    </section>
  </>;
}