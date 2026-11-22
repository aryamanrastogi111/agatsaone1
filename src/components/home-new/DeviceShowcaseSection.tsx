import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { StrikePrice } from "@/components/StrikePrice";
import { shipDateLabel } from "@/lib/shipDate";
import { usePricing, type DeviceSku } from "@/hooks/useDevicePricing";
import sanketlifeImg from "@/assets/sanketlife-hero-new.webp";
import easytouchImg from "@/assets/easytouch-wellness-device.webp";
import rhythmImg from "@/assets/easytouch-rhythm-band.webp";
import zluImg from "@/assets/zlu-device-new.webp";

interface DeviceDef {
  name: string;
  sku?: DeviceSku;
  badge: string | null;
  tagline: string;
  stat: string;
  link: string;
  slug: string;
  image?: string;
}

const deviceDefs: DeviceDef[] = [
  {
    name: "SanketLife 2.0",
    sku: "ecg_bundle",
    badge: "Clinically validated",
    tagline: "12-lead hospital-grade ECG in your pocket",
    stat: "98.15% sensitivity",
    link: "/devices/sanketlife-ecg",
    slug: "sanketlife",
    image: sanketlifeImg,
  },
  {
    name: "EasyTouch Wellness",
    sku: "wellness_sub",
    badge: null,
    tagline: "Non-invasive metabolic wellness trends, no pricks",
    stat: "8 vitals in 60 seconds",
    link: "/devices/easytouch-wellness",
    slug: "easytouch-wellness",
    image: easytouchImg,
  },
  {
    name: "Rhythm Band",
    sku: "band_sub",
    badge: "Wearable",
    tagline: "Everyday metabolic trends, detected on their own",
    stat: "Automatic spike detection",
    link: "/rhythm",
    slug: "rhythm",
    image: rhythmImg,
  },
  {
    name: "Zlu",
    sku: "multivital",
    badge: null,
    tagline: "Natural sleep support, without medication",
    stat: "Calm, restful sleep",
    link: "/devices/zlu",
    slug: "zlu",
    image: zluImg,
  },
  {
    name: "MultiVital",
    badge: "All-in-one",
    tagline: "Everyday vital-sign monitoring in one device",
    stat: "Multiple vitals, one reading",
    link: "/devices",
    slug: "multivital",
  },
];

export function DeviceShowcaseSection() {
  const { prices, emi, loading } = usePricing();

  return (
    <section id="devices" className="py-16 md:py-24 bg-background">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <p className="section-eyebrow mb-3">The ecosystem</p>
          <h2 className="section-title text-3xl md:text-4xl mb-4">
            AI-enabled personal health monitoring devices, built for home.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every Agatsa device pairs with the Agatsa One app in minutes, where Nera AI
            turns your readings into clear, personal insights. Clinically validated. Monitored for life.
          </p>
        </motion.div>

        {/* Cards — horizontal scroll on mobile, 5-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible scrollbar-hide">
          {deviceDefs.map((device, i) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="min-w-[240px] lg:min-w-0 flex flex-col quiet-card p-5"
            >
              <div className="aspect-[3/2] bg-muted rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                {device.image ? (
                  <img src={device.image} alt={device.name} className="w-full h-full object-contain p-4" loading="lazy" decoding="async" />
                ) : (
                  <span className="font-display text-2xl font-extrabold text-foreground/20">{device.name}</span>
                )}
              </div>

              {device.badge && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2.5 py-1 mb-2">
                  {device.badge}
                </span>
              )}

              <h3 className="font-display text-base font-bold text-foreground mb-1">{device.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{device.tagline}</p>
              <p className="text-xs font-medium text-primary mb-3">{device.stat}</p>

              <div className="mt-auto space-y-2">
                <StockUrgencyBar productKey={device.slug} />
                <div className="flex items-center justify-between gap-2">
                  {device.sku ? (
                    loading ? (
                      <span className="h-6 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      <StrikePrice sku={device.sku} price={prices[device.sku]} size="sm" showLabel={false} />
                    )
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coming soon</span>
                  )}
                  <Link
                    to={device.link}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {device.sku && (
                  <div className="flex items-center justify-between text-xs mt-0.5">
                    <p className="text-primary font-medium">{emi(prices[device.sku])}</p>
                    <span className="font-semibold text-success">📦 {shipDateLabel()}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
