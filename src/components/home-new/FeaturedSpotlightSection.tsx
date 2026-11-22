import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { StrikePrice } from "@/components/StrikePrice";
import { shipDateLabel } from "@/lib/shipDate";
import { usePricing } from "@/hooks/useDevicePricing";
import sanketlifeImg from "@/assets/sanketlife-2-product-new.webp";

const highlights = [
  "12-lead hospital-grade ECG in 60 seconds",
  "98.15% sensitivity, validated at Sri Jayadeva Institute",
  "14 days of Nera AI Premium included free",
  "Pocket-sized — no wires, no gels, no appointments",
];

export function FeaturedSpotlightSection() {
  const { prices, emi, loading } = usePricing();

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="section-shell">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl bg-muted border border-border overflow-hidden aspect-[4/3]"
          >
            <img
              src={sanketlifeImg}
              alt="SanketLife 2.0 personal 12-lead ECG device"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-foreground bg-background/90 backdrop-blur px-3 py-1.5 rounded-full">
              Featured device
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="section-eyebrow mb-3">SanketLife 2.0</p>
            <h2 className="section-title text-3xl md:text-4xl mb-4">
              The ECG your cardiologist trusts. In your pocket.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
              A touch-based 12-lead ECG that connects to Agatsa One, where Nera AI reads every
              recording and flags what needs attention — in plain words.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-success" />
                  </span>
                  <span className="font-medium">{h}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
              {loading ? (
                <span className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <StrikePrice sku="ecg_bundle" price={prices.ecg_bundle} size="lg" showLabel={false} />
              )}
              <span className="text-sm text-primary font-medium">{emi(prices.ecg_bundle)}</span>
              <span className="text-sm font-semibold text-success">📦 {shipDateLabel()}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/devices/sanketlife-ecg"
                className="inline-flex items-center gap-2 bg-foreground text-background rounded-full px-7 py-3.5 font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                Buy SanketLife 2.0 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/devices"
                className="inline-flex items-center gap-2 border border-border text-foreground rounded-full px-7 py-3.5 font-semibold hover:border-foreground/40 transition-colors text-sm"
              >
                Compare all devices
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
