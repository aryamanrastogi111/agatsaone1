import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import sanketlifeImg from "@/assets/sanketlife-hero-new.png";
import easytouchImg from "@/assets/easytouch-wellness-device.png";
import rhythmImg from "@/assets/easytouch-rhythm-new.png";
import scaleImg from "@/assets/core-balance.png";

const devices = [
  {
    name: "SanketLife ECG",
    badge: "CDSCO Certified",
    tagline: "12-lead hospital-grade ECG in your pocket",
    stat: "98.15% sensitivity",
    price: "₹3,999",
    link: "/devices/sanketlife-ecg",
    image: sanketlifeImg,
  },
  {
    name: "EasyTouch Wellness",
    badge: null,
    tagline: "Non-invasive metabolic health + BP + SpO2, no needles",
    stat: "8 vitals in 60 seconds",
    price: "₹3,499",
    link: "/devices/easytouch-wellness",
    image: easytouchImg,
  },
  {
    name: "EasyTouch Rhythm Band",
    badge: null,
    tagline: "24/7 wellness monitoring on your wrist",
    stat: "Sleep, HRV, steps, SpO2",
    price: "₹2,999",
    link: "/devices/rhythm-band",
    image: rhythmImg,
  },
  {
    name: "Agatsa Smart Scale",
    badge: null,
    tagline: "14 body metrics. One step. One app.",
    stat: "BMI, body fat, muscle mass",
    price: "₹2,499",
    link: "/devices/smart-scale",
    image: scaleImg,
  },
];

export function DeviceShowcaseSection() {
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
            Clinically validated. CDSCO-approved. Pair in minutes. Monitor for life.
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
