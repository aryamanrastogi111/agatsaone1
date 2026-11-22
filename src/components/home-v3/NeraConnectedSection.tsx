import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import metabolic from "@/assets/rhythm-app-metabolic.jpg.asset.json";
import score from "@/assets/rhythm-app-score.jpeg.asset.json";
import meals from "@/assets/rhythm-app-meals.jpg.asset.json";
import { Reveal, EcgLine } from "./Reveal";

const points = [
  { t: "Collects", d: "Readings from your Agatsa devices arrive in one place, the Agatsa One app." },
  { t: "Connects", d: "NERA AI links heart, meal and activity signals so patterns are easier to see." },
  { t: "Explains", d: "Plain-language insights and trends you can review yourself or share with your doctor." },
];

export function NeraConnectedSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 md:py-32 border-y border-border">
      <div className="luxe-glow absolute left-1/2 top-1/3 -translate-x-1/2 h-[600px] w-[900px] -z-10 opacity-60" />
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="section-eyebrow mb-4">The intelligence layer</p>
          <h2 className="section-title text-4xl md:text-6xl">Connected by <span className="luxe-text-gradient">NERA AI</span></h2>
          <EcgLine className="mt-8 h-8 w-64" />
        </Reveal>
        <div className="mt-14 grid grid-cols-3 gap-3 md:gap-6">
          {[metabolic, score, meals].map((a, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <img src={a.url} alt="Agatsa One health trend screen" loading="lazy" className={`w-full rounded-[1.5rem] border border-border shadow-2xl ${i === 1 ? "md:-translate-y-8" : ""}`} />
            </Reveal>
          ))}
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08} className="quiet-card p-7">
              <p className="font-display text-xl font-bold">{p.t}</p>
              <p className="mt-2 text-muted-foreground leading-relaxed">{p.d}</p>
            </Reveal>
          ))}
        </div>
        <Link to="/nera-ai" className="mt-10 inline-flex items-center gap-2 font-semibold text-primary-glow">Explore NERA AI <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
