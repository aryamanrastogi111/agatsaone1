import { Link } from "react-router-dom";
import { FileText, ArrowUpRight, ShieldCheck } from "lucide-react";
import crossDevice from "@/assets/publications/cross-device-reproducibility-study.pdf";
import rhythmStudy from "@/assets/publications/rhythm-band-sugar-trend-study.pdf";
import { Reveal } from "./Reveal";

const studies = [
  { title: "Cross-device reproducibility study", type: "Research paper", href: crossDevice },
  { title: "Rhythm Band meal-response trend study", type: "Research paper", href: rhythmStudy },
];

const credentials = ["ISO 13485 certified manufacturing", "Made in India"];

export function EvidenceSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="section-shell grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
        <Reveal>
          <p className="section-eyebrow mb-4">Evidence</p>
          <h2 className="section-title text-4xl md:text-5xl">Built on research, not promises.</h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-md">Read our studies and publications in full.</p>
          <ul className="mt-8 space-y-3">
            {credentials.map((c) => (
              <li key={c} className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary-glow" /> {c}</li>
            ))}
          </ul>
          <Link to="/publications" className="mt-8 inline-flex items-center gap-2 font-semibold text-primary-glow">All publications <ArrowUpRight className="h-4 w-4" /></Link>
        </Reveal>
        <div className="space-y-4">
          {studies.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="quiet-card flex items-center gap-5 p-6 group">
                <FileText className="h-8 w-8 shrink-0 text-primary-glow" />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.type}</p>
                  <p className="mt-1 font-display text-lg font-bold">{s.title}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <div className="rounded-[1.5rem] border border-dashed border-border p-6 text-muted-foreground">
              Placeholder — add a hospital validation or peer-reviewed publication here.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
