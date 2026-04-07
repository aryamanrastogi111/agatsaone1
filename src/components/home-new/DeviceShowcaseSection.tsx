import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const devices = [
  {
    name: "SanketLife ECG",
    badge: "CDSCO Certified",
    tagline: "12-lead hospital-grade ECG in your pocket",
    stat: "98.15% sensitivity",
    price: "₹4,999",
    link: "/devices/sanketlife-ecg",
    emoji: "🫀",
  },
  {
    name: "EasyTouch Wellness",
    badge: null,
    tagline: "Optical glucose + BP + SpO2, no needles",
    stat: "98.56% validated at Medanta",
    price: "₹3,499",
    link: "/devices/easytouch-wellness",
    emoji: "💡",
  },
  {
    name: "EasyTouch Rhythm Band",
    badge: null,
    tagline: "24/7 wellness monitoring on your wrist",
    stat: "Sleep, HRV, steps, SpO2",
    price: "₹2,999",
    link: "/devices/rhythm-band",
    emoji: "⌚",
  },
  {
    name: "Agatsa Smart Scale",
    badge: null,
    tagline: "14 body metrics. One step. One app.",
    stat: "BMI, body fat, muscle mass",
    price: "₹2,499",
    link: "/devices/smart-scale",
    emoji: "⚖️",
  },
];

export function DeviceShowcaseSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            The Devices
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Medical-grade hardware. Consumer-grade simplicity.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every Agatsa One device is clinically validated, CDSCO-approved, and designed to be
            used by anyone — no medical training required.
          </p>
        </motion.div>

        {/* Cards — horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
          {devices.map((device, i) => (
            <motion.div
              key={device.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="min-w-[260px] md:min-w-0 flex flex-col bg-card rounded-3xl border border-border p-6 hover:shadow-purple transition-shadow duration-300"
            >
              {/* Image placeholder */}
              <div className="aspect-[3/2] bg-muted rounded-2xl flex items-center justify-center mb-4">
                <span className="text-5xl">{device.emoji}</span>
              </div>

              {device.badge && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full px-2.5 py-1 mb-2">
                  {device.badge}
                </span>
              )}

              <h3 className="text-base font-bold text-foreground mb-1">{device.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{device.tagline}</p>
              <p className="text-xs font-medium text-primary mb-3">{device.stat}</p>

              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{device.price}</span>
                <Link
                  to={device.link}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
