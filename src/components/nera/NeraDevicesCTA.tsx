import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Activity, Watch, Sparkles, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeraLicenseDialog } from "./NeraLicenseDialog";

const DEVICES = [
  {
    name: "SanketLife ECG",
    tagline: "Pocket-sized 12-lead-style ECG",
    cta: "Buy SanketLife ECG",
    href: "/devices/sanketlife-ecg",
    icon: HeartPulse,
    tone: "from-red-500/20 to-rose-500/5 border-red-500/30 text-red-300",
    iconTone: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  {
    name: "EasyTouch Wellness",
    tagline: "Non-invasive metabolic wellness",
    cta: "Buy EasyTouch Wellness",
    href: "/devices/easytouch-wellness",
    icon: Activity,
    tone: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300",
    iconTone: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Rhythm Band",
    tagline: "Continuous rhythm + recovery",
    cta: "Buy Rhythm Band",
    href: "/devices/rhythm-band",
    icon: Watch,
    tone: "from-sky-500/20 to-sky-500/5 border-sky-500/30 text-sky-300",
    iconTone: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  },
] as const;

export default function NeraDevicesCTA() {

  return (
    <section id="nera-for-business" className="relative bg-[hsl(var(--dark-bg))] text-white py-12 md:py-20 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[160px]" />
        <div className="absolute bottom-10 left-1/4 w-[420px] h-[420px] rounded-full bg-secondary/10 blur-[140px]" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-3 md:mb-4">
            <Sparkles className="w-3 h-3" />
            Get NERA AI Working For You
          </div>
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Pick your device.</span>{" "}
            <span className="text-white/70">Or license NERA AI for your own.</span>
          </h2>
          <p className="mt-3 md:mt-5 text-sm md:text-lg text-white/70 max-w-2xl mx-auto">
            NERA AI ships free for 3 months with every Agatsa device. Already have a wearable or
            health platform? License NERA AI as the intelligence layer for your own product.
          </p>
        </motion.div>

        {/* Device cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 max-w-6xl mx-auto">
          {DEVICES.map((d) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className={`group relative rounded-2xl border bg-gradient-to-br ${d.tone} p-4 md:p-6 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 backdrop-blur-sm hover:scale-[1.01] transition-transform`}
            >
              <div className={`shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center border ${d.iconTone} md:mb-4`}>
                <d.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex-1 min-w-0 md:w-full">
                <h3 className="text-base md:text-xl font-bold text-white leading-tight">{d.name}</h3>
                <p className="mt-0.5 md:mt-1.5 text-xs md:text-sm text-white/70">{d.tagline}</p>
                <div className="mt-1 md:mt-2 inline-flex items-center gap-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="w-3 h-3" />
                  3 months NERA AI free
                </div>
                <Button asChild size="sm" className="mt-3 md:mt-5 btn-glow w-full md:h-11 md:text-base">
                  <Link to={d.href}>
                    {d.cta} <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* B2B License card */}
        <motion.div
          id="for-businesses-and-platforms"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-6 md:mt-10 max-w-6xl mx-auto rounded-2xl md:rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent p-5 md:p-10 backdrop-blur-sm scroll-mt-20"
        >
          <div className="flex flex-col gap-5 md:gap-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] md:text-[11px] font-semibold uppercase tracking-wider mb-2.5 md:mb-4">
                <Building2 className="w-3 h-3" />
                For Businesses & Platforms
              </div>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                License NERA AI for your customers.
              </h3>
              <p className="mt-2 md:mt-3 text-white/70 max-w-3xl text-sm md:text-base leading-relaxed">
                Plug NERA's health intelligence engine into your product or programme.
                Health scores, risk drivers, lifestyle correlations and predictive alerts — under your brand.
              </p>
            </div>

            {/* Persona grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
              {[
                { emoji: "🏢", title: "Corporates", desc: "Employee wellness & executive health programmes" },
                { emoji: "🏥", title: "Hospitals & Clinics", desc: "RPM, post-discharge & preventive cardiology" },
                { emoji: "⌚", title: "Wearable / Device OEMs", desc: "Smartwatches, bands, rings, biosensors" },
                { emoji: "💬", title: "Telehealth Platforms", desc: "AI triage, longitudinal insights, nudges" },
              ].map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-3 md:p-4 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="text-xl md:text-2xl mb-1">{p.emoji}</div>
                  <div className="text-xs md:text-sm font-semibold text-white leading-tight">{p.title}</div>
                  <div className="mt-1 text-[11px] md:text-xs text-white/60 leading-snug">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 md:mt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6">
            <p className="text-xs md:text-sm text-white/60">
              Don't see your use case? Tell us — we partner across health, fitness, insurance and research.
            </p>
            <div className="md:shrink-0">
              <NeraLicenseDialog>
                <Button size="lg" className="w-full md:w-auto text-sm md:text-base px-5 md:px-7 h-11 md:h-12 btn-glow">
                  Request NERA AI License <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </NeraLicenseDialog>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
