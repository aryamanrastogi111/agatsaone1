import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StockUrgencyBar } from "@/components/shop/StockUrgencyBar";
import { StrikePrice } from "@/components/StrikePrice";
import { shipDateLabel } from "@/lib/shipDate";
import { usePricing } from "@/hooks/useDevicePricing";
import sanketlifeImg from "@/assets/sanketlife-hero-new.webp";
import easytouchImg from "@/assets/easytouch-wellness-device.webp";
import rhythmImg from "@/assets/easytouch-rhythm-new.webp";
import scaleImg from "@/assets/core-balance.webp";

const deviceDefs = [
  {
    name: "SanketLife ECG",
    sku: "ecg_bundle" as const,
    badge: "CDSCO Certified",
    tagline: "12-lead hospital-grade ECG in your pocket",
    stat: "98.15% sensitivity",
    link: "/devices/sanketlife-ecg",
    slug: "sanketlife",
    image: sanketlifeImg,
  },
  {
    name: "EasyTouch Wellness",
    sku: "wellness_sub" as const,
    badge: null,
    tagline: "Non-invasive blood glucose trends, no pricks",
    stat: "8 vitals in 60 seconds",
    link: "/devices/easytouch-wellness",
    slug: "easytouch-wellness",
    image: easytouchImg,
  },
  {
    name: "EasyTouch Rhythm Band",
    sku: "band_sub" as const,
    badge: null,
    tagline: "24/7 wellness monitoring on your wrist",
    stat: "Sleep, HRV, steps, SpO2",
    link: "/devices/rhythm-band",
    slug: "easytouch-rhythm",
    image: rhythmImg,
  },
  {
    name: "Agatsa Smart Scale",
    sku: "scale_sub" as const,
    badge: null,
    tagline: "14 body metrics. One step. One app.",
    stat: "BMI, body fat, muscle mass",
    link: "/devices/smart-scale",
    slug: "corebalance",
    image: scaleImg,
  },
];

export function DeviceShowcaseSection() {
  const { prices, fmt, emi, loading } = usePricing();

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            This Is Where Agatsa Comes In
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, easy-to-use devices to track your health regularly from home.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every Agatsa device is designed to work seamlessly with the Agatsa One app and Nera AI.
            Clinically validated. Pair in minutes. Monitor for life.
          </p>
        </motion.div>

        {/* Cards — horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
          {deviceDefs.map((device, i) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="min-w-[260px] md:min-w-0 flex flex-col bg-card rounded-3xl border border-border p-6 hover:shadow-purple transition-shadow duration-300"
            >
              <div className="aspect-[3/2] bg-muted rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                <img src={device.image} alt={device.name} className="w-full h-full object-contain p-4" />
              </div>

              {device.badge && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2.5 py-1 mb-2">
                  {device.badge}
                </span>
              )}

              <h3 className="text-base font-bold text-foreground mb-1">{device.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{device.tagline}</p>
              <p className="text-xs font-medium text-primary mb-3">{device.stat}</p>

              <div className="mt-auto space-y-2">
                <StockUrgencyBar productKey={device.slug} />
                <div className="flex items-center justify-between gap-2">
                  {loading ? (
                    <span className="h-6 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    <StrikePrice sku={device.sku} price={prices[device.sku]} size="sm" showLabel={false} />
                  )}
                  <Link
                    to={device.link}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="flex items-center justify-between text-xs mt-0.5">
                  <p className="text-primary font-medium">{emi(prices[device.sku])}</p>
                  <span className="font-semibold text-green-600">📦 {shipDateLabel()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
