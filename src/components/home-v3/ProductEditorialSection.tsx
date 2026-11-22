import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StrikePrice } from "@/components/StrikePrice";
import { usePricing, type DeviceSku } from "@/hooks/useDevicePricing";
import sanketlifeImg from "@/assets/sanketlife-hand-new.webp";
import easytouchImg from "@/assets/easytouch-meal-bg.webp";
import rhythmImg from "@/assets/rhythm-band-lifestyle.png.asset.json";
import { Reveal } from "./Reveal";

const items: { eyebrow: string; name: string; sku: DeviceSku; title: string; body: string; trial: string; link: string; image: string; wellnessOnly?: boolean }[] = [
  {
    eyebrow: "Heart",
    name: "SanketLife 2.0",
    sku: "ecg_bundle",
    title: "A 12-lead ECG that fits in your pocket.",
    body: "Record an ECG at home in moments and share it with your doctor. Readings flow into Agatsa One, where NERA AI helps you follow changes over time.",
    trial: "Includes 14 days of NERA AI Premium",
    link: "/devices/sanketlife-ecg",
    image: sanketlifeImg,
  },
  {
    eyebrow: "Metabolic wellness",
    name: "EasyTouch Wellness",
    sku: "wellness_sub",
    title: "Understand how your meals affect you.",
    body: "A non-invasive check of your metabolic wellness trends, with no finger pricks. Build a picture of your meal responses day by day.",
    trial: "Includes 7 days of NERA AI",
    link: "/devices/easytouch-wellness",
    image: easytouchImg,
    wellnessOnly: true,
  },
  {
    eyebrow: "Wearable",
    name: "Rhythm Band",
    sku: "band_sub",
    title: "Spikes, detected on their own.",
    body: "Wear it through the day. Rhythm Band notices post-meal spikes automatically — you log the food and it is filed into your personal food profile.",
    trial: "Includes 7 days of NERA AI",
    link: "/rhythm",
    image: rhythmImg.url,
    wellnessOnly: true,
  },
];

export function ProductEditorialSection() {
  const { prices, loading } = usePricing();
  return (
    <section id="devices" className="py-20 md:py-32">
      <div className="section-shell">
        <Reveal className="max-w-2xl mb-16 md:mb-24">
          <p className="section-eyebrow mb-4">The devices</p>
          <h2 className="section-title text-4xl md:text-5xl">Three ways to see more of yourself.</h2>
        </Reveal>
        <div className="space-y-20 md:space-y-32">
          {items.map((it, i) => (
            <div key={it.name} className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <Reveal className={i % 2 ? "md:order-2" : ""}>
                <div className="overflow-hidden rounded-[2rem] quiet-card aspect-[4/3]">
                  <img src={it.image} alt={it.name} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="section-eyebrow mb-3">{it.eyebrow}</p>
                <p className="font-display text-2xl md:text-3xl font-extrabold tracking-tight luxe-text-gradient mb-4">{it.name}</p>
                <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight">{it.title}</h3>
                <p className="mt-5 text-muted-foreground text-lg leading-relaxed">{it.body}</p>
                <p className="mt-4 text-sm font-medium text-primary-glow">{it.trial}</p>
                {it.wellnessOnly && (
                  <p className="mt-3 text-xs text-muted-foreground/70">For wellness purposes only — not intended for clinical or diagnostic use.</p>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  {loading ? <span className="h-7 w-24 bg-muted animate-pulse rounded" /> : <StrikePrice sku={it.sku} price={prices[it.sku]} size="sm" showLabel={false} />}
                  <Link to={it.link} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
                    Buy / Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
