import { Link } from "react-router-dom";
import { ArrowRight, User, Stethoscope, Handshake, FlaskConical } from "lucide-react";
import { Reveal } from "./Reveal";

const audiences = [
  {
    icon: User,
    title: "For you and your family",
    desc: "Personal health devices — from a pocket 12-lead ECG to a wellness band — with NERA AI insights you can actually understand, at home and on your terms.",
    link: "/devices",
    cta: "Explore devices",
  },
  {
    icon: Stethoscope,
    title: "For doctors, hospitals & providers",
    desc: "Validated ECG and connected monitoring that keeps you close to patients between visits — built for clinics, hospitals and telehealth teams.",
    link: "/for-doctors",
    cta: "For healthcare",
  },
  {
    icon: Handshake,
    title: "For distributors, OEMs & technology partners",
    desc: "Distribute Agatsa devices, white-label our platform, or build your own product on our SDK and APIs.",
    link: "/partner-with-us",
    cta: "Partner with us",
  },
  {
    icon: FlaskConical,
    title: "For research & strategic partners",
    desc: "Collaborate on real-world health research built on one of India's largest connected-health datasets and our published studies.",
    link: "/science",
    cta: "See the science",
  },
];

export function AudienceSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="section-shell">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="section-eyebrow mb-4">Who we build for</p>
          <h2 className="section-title text-4xl md:text-5xl">One platform. Four audiences.</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08} className="h-full">
              <Link to={a.link} className="group flex flex-col h-full quiet-card p-7 transition hover:border-primary/40">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <a.icon className="h-5 w-5 text-primary-glow" strokeWidth={1.75} />
                </div>
                <h3 className="font-display text-lg font-bold leading-snug mb-3">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{a.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-glow mt-6 group-hover:gap-2.5 transition-all">
                  {a.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
