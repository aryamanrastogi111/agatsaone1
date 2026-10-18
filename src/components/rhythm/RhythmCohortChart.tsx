import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { RHYTHM_COHORTS } from "@/data/rhythmResearch";

export function RhythmCohortChart() {
  return <figure className="rhythm-research-chart mt-8 rounded-lg border border-border bg-card p-5 md:p-8">
    <figcaption className="mb-6"><h3 className="text-lg font-semibold">The data behind the research</h3><p className="mt-2 text-sm">Reported observations, by wearable cohort</p></figcaption>
    <div className="h-[280px] w-full" role="img" aria-label="Research observations: Apple Watch 19,379; Rhythm Band 83,090; Samsung Galaxy Watch 2,939">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={RHYTHM_COHORTS.map(cohort => ({ ...cohort, label: cohort.device === "EasyTouch Rhythm Band" ? "Rhythm Band" : cohort.device === "Samsung Galaxy Watch" ? "Galaxy Watch" : cohort.device }))} margin={{ top: 10, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--rhythm-chart-grid)" />
          <XAxis dataKey="label" tick={{ fill: "var(--rhythm-chart-text)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--rhythm-chart-text)", fontSize: 12 }} tickFormatter={value => `${value / 1000}k`} axisLine={false} tickLine={false} width={40} />
          <Tooltip cursor={false} formatter={(value: number) => [value.toLocaleString("en-IN"), "Observations"]} />
          <Bar dataKey="observations" maxBarSize={90} radius={[4,4,0,0]}>{RHYTHM_COHORTS.map(cohort => <Cell key={cohort.device} fill={cohort.device === "EasyTouch Rhythm Band" ? "var(--rhythm-chart-primary)" : "var(--rhythm-chart-secondary)"} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <p className="mt-4 text-xs leading-relaxed">Source: Agatsa's cross-device retrospective manuscript. This graph shows dataset size, not measurement accuracy or clinical performance.</p>
  </figure>;
}