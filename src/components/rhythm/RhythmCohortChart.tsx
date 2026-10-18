import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { RHYTHM_COHORTS } from "@/data/rhythmResearch";

export function RhythmCohortChart() {
  return <figure className="rhythm-research-chart mt-8 rounded-lg border border-border bg-card p-5 md:p-8">
    <figcaption className="mb-6"><h3 className="text-lg font-semibold">Meal-linked rise. Post-peak fall.</h3><p className="mt-2 text-sm">Percentage of evaluable events in each separate wearable study — not accuracy scores</p></figcaption>
    <div className="h-[300px] w-full" role="img" aria-label="Meal-linked rise and post-peak decline: Apple Watch 61.9% and 91.3%; Rhythm Band 66.2% and 78.0%; Galaxy Watch 53.7% and 63.9%. Different evaluable event sets; not accuracy scores.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={RHYTHM_COHORTS.map(cohort => ({ mealRise: cohort.mealRise.percent, recovery: cohort.recovery.percent, label: cohort.device === "EasyTouch Rhythm Band" ? "Rhythm Band" : cohort.device === "Samsung Galaxy Watch" ? "Galaxy Watch" : cohort.device }))} margin={{ top: 10, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--rhythm-chart-grid)" />
          <XAxis dataKey="label" tick={{ fill: "var(--rhythm-chart-text)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "var(--rhythm-chart-text)", fontSize: 12 }} tickFormatter={value => `${value}%`} axisLine={false} tickLine={false} width={40} />
          <Tooltip cursor={false} formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="mealRise" name="Meal-linked rise" fill="var(--rhythm-chart-primary)" maxBarSize={60} radius={[4,4,0,0]} />
          <Bar dataKey="recovery" name="Post-peak decline" fill="var(--rhythm-chart-secondary)" maxBarSize={60} radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <p className="mt-4 text-xs leading-relaxed">Source: the three supplied Agatsa wearable manuscripts, Structured Abstract and Results. Meal-rise and recovery use different event sets; denominators are shown in the device cards above. This is not a head-to-head device comparison or a measured sugar curve.</p>
  </figure>;
}