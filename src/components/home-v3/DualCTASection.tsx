import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const cards = [
  { eyebrow: "For you", title: "Start understanding your health.", body: "Pick a device, pair it with Agatsa One, and see your readings come together.", cta: "Shop Devices", href: "/devices", primary: true },
  { eyebrow: "For healthcare partners", title: "Bring Agatsa to your patients.", body: "Clinics, hospitals, distributors and developers — let's talk about working together.", cta: "Partner with Us", href: "/partner-with-us", primary: false, alt: { cta: "Book a demo", href: "/demo" } },
];

export function DualCTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="section-shell grid md:grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1} className="quiet-card relative overflow-hidden p-8 md:p-12">
            {c.primary && <div className="luxe-glow absolute -right-20 -top-20 h-72 w-72 opacity-70" />}
            <div className="relative">
              <p className="section-eyebrow mb-4">{c.eyebrow}</p>
              <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight">{c.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{c.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={c.href} className={c.primary ? "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground" : "inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold hover:border-foreground/40"}>
                  {c.cta} <ArrowRight className="h-4 w-4" />
                </Link>
                {c.alt && <Link to={c.alt.href} className="inline-flex items-center px-4 py-3.5 font-semibold text-primary-glow">{c.alt.cta}</Link>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
