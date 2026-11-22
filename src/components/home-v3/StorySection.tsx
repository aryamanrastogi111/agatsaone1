import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

// Editable placeholders — replace years and milestones with confirmed facts.
const milestones = [
  { year: "Year", title: "Founded", body: "Agatsa begins with a mission to make heart monitoring personal." },
  { year: "Year", title: "SanketLife", body: "A pocket 12-lead ECG designed for use at home." },
  { year: "Year", title: "Agatsa One & NERA AI", body: "One app and one intelligence layer across devices." },
  { year: "Year", title: "Wearables", body: "EasyTouch Wellness and Rhythm Band extend into everyday metabolic wellness." },
];

export function StorySection() {
  return (
    <section className="py-20 md:py-32 border-t border-border">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="section-eyebrow mb-4">Our story</p>
          <h2 className="section-title text-4xl md:text-5xl">Future is near.</h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">Agatsa builds connected health devices in India, with one goal: help people understand their health earlier.</p>
        </Reveal>
        <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {milestones.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.08} className="quiet-card p-7">
              <p className="font-display text-sm font-semibold text-primary-glow">{m.year}</p>
              <p className="mt-3 font-display text-xl font-bold">{m.title}</p>
              <p className="mt-2 text-muted-foreground leading-relaxed">{m.body}</p>
            </Reveal>
          ))}
        </ol>
        <Link to="/about" className="mt-10 inline-flex items-center gap-2 font-semibold text-primary-glow">About Agatsa <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
