import { useSEO } from "@/hooks/useSEO";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import easytouchHero from "@/assets/easytouch-wellness-hero.png";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const measures = [
  { title: "Optical Glucose Estimate", desc: "Non-invasive estimate using advanced optical sensing — no finger prick" },
  { title: "Blood Pressure", desc: "Systolic and diastolic BP with hypertension stage indicator" },
  { title: "Blood Oxygen (SpO2)", desc: "Oxygen saturation with 94% alert threshold" },
  { title: "Heart Rate", desc: "Pulse rate real-time and trend" },
  { title: "HRV", desc: "Heart rate variability — key stress and recovery indicator" },
  { title: "Perfusion Index", desc: "Signal quality indicator for accurate readings" },
];

const steps = [
  { n: "1", title: "Position your finger on the sensor", copy: "Rest your index finger gently on the EasyTouch sensor. The optical sensor illuminates your finger to measure your glucose, SpO2, and pulse simultaneously. No pain. No preparation." },
  { n: "2", title: "Hold for 60 seconds", copy: "The device takes a 60-second reading, capturing optical data across multiple wavelengths. The Agatsa One app shows a live progress indicator and guides you through the process." },
  { n: "3", title: "Get your complete vital picture", copy: "Nera AI processes all 8 vitals simultaneously — comparing them to your historical trends, flagging anything unusual, and updating your Nera Health Score. Log your meal before readings for glucose impact scoring." },
];

const boxItems = [
  "EasyTouch Wellness device (1 unit)",
  "USB-C charging cable",
  "Quick start guide (English + Hindi)",
  "1-year manufacturer warranty card",
];

const faqs = [
  { q: "How accurate is the optical glucose measurement?", a: "The EasyTouch Wellness optical glucose feature provides an estimate validated at 98.56% accuracy at Medanta. It is highly reliable for trend monitoring — seeing whether your glucose is rising, stable, or falling after meals. For clinical decisions, always confirm with a certified glucometer or HbA1c test as advised by your doctor." },
  { q: "Does it replace a traditional glucometer?", a: "For daily trend monitoring, the EasyTouch is far more convenient — no test strips, no needle pricks. For precise readings required for insulin dosing decisions, your doctor may recommend periodic fingerprick confirmation. Nera AI makes it easy to track both simultaneously." },
  { q: "Who should use the EasyTouch Wellness?", a: "Anyone managing or at risk of diabetes, hypertension, or cardiovascular disease. It's particularly powerful for Type 2 diabetics, pre-diabetics, and anyone with elevated BP who wants daily visibility without the discomfort of traditional fingerprick monitoring." },
  { q: "Does the app show my glucose trend over time?", a: "Yes. Nera AI builds a full glucose trend graph, shows post-meal impact scoring when you log meals, and provides a predicted HbA1c estimate based on 30 days of readings. This is one of the most useful features for diabetic patients." },
  { q: "What happens if my glucose is critically high?", a: "If your fasting glucose exceeds 300 mg/dL or falls below 70 mg/dL, Nera AI sends an immediate alert with guidance to contact your doctor or seek emergency care. On the Diabetic Cardiac Care Programme, these thresholds trigger an escalation protocol." },
];

const relatedDevices = [
  { name: "SanketLife ECG", desc: "Add ECG for complete cardiac + metabolic monitoring", link: "/devices/sanketlife-ecg" },
  { name: "EasyTouch Rhythm Band", desc: "Add 24/7 continuous monitoring", link: "/devices/rhythm-band" },
  { name: "Agatsa Smart Scale", desc: "Complete the picture with body composition", link: "/devices/smart-scale" },
];

export default function EasyTouchWellnessProduct() {
  useSEO({ title: "EasyTouch Wellness — Optical Glucose, BP, SpO2 Monitor | Agatsa One", description: "Non-invasive glucose monitoring with no needles. Plus BP, SpO2, HRV, and 5 more vitals. 98.56% validated at Medanta. ₹3,499. Works with Nera AI." });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-28 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/devices" className="hover:text-primary">Devices</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">EasyTouch Wellness</span>
          </nav>

          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            <motion.img {...fadeUp} src={easytouchHero} alt="EasyTouch Wellness Optical Monitor" className="w-full rounded-3xl shadow-2xl" />

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}>
              <span className="inline-block text-sm font-medium text-white bg-[hsl(217,82%,50%)] rounded-full px-4 py-1.5 mb-4">
                Medanta Validated
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
                EasyTouch Wellness Optical Monitor
              </h1>

              <p className="text-xl md:text-2xl font-bold text-[hsl(217,82%,50%)] mt-3">
                Non-invasive glucose monitoring. No needles. No blood.
              </p>

              <p className="text-lg text-muted-foreground mt-4 max-w-[480px]">
                The EasyTouch Wellness uses advanced optical sensing to estimate glucose levels along with 7 other vital signs — all in one device, in under 60 seconds. Daily monitoring without the discomfort.
              </p>

              <div className="mt-6">
                <span className="text-4xl font-extrabold text-foreground">₹3,499</span>
                <span className="text-sm text-muted-foreground ml-2">inclusive of GST</span>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                  Includes 3 months Nera AI Premium free (₹1,797 value)
                </p>
              </div>

              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">4.6/5 (834 reviews)</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button className="rounded-full px-8 py-4 text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)]">
                  Buy EasyTouch Wellness — ₹3,499
                </Button>
                <Button asChild variant="outline" className="rounded-full px-8 py-4 text-base border-2 border-primary text-primary">
                  <Link to="/app?device=easytouch">Download Agatsa One App (free)</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[hsl(260,100%,97%)] py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { big: "98.56%", label: "Validation Accuracy", sub: "Medanta, Gurugram" },
            { big: "8 Vitals", label: "In one reading", sub: "Glucose, BP, SpO2 + 5 more" },
            { big: "60 Seconds", label: "Complete reading time", sub: "No needles, no prep" },
          ].map((s) => (
            <motion.div key={s.big} {...fadeUp}>
              <p className="text-4xl md:text-5xl font-extrabold text-primary">{s.big}</p>
              <p className="text-base font-medium text-muted-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What It Measures */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold text-foreground">8 vitals. One device. No needles.</h2>
            <p className="text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
              The EasyTouch Wellness captures a comprehensive snapshot of your metabolic and cardiovascular health in a single 60-second reading.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {measures.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card border border-border rounded-2xl p-6 text-left">
                <h3 className="text-base font-bold text-foreground">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[hsl(260,100%,97%)]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-3xl font-bold text-foreground text-center">How to take a reading in 60 seconds</motion.h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.12 }} className="text-center md:text-left">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto md:mx-0">{s.n}</div>
                <h3 className="text-lg font-bold text-foreground mt-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Evidence */}
      <section className="py-20 bg-background">
        <div className="max-w-[800px] mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Clinical Validation</p>
            <h2 className="text-3xl font-bold text-foreground">Validated at Medanta — The Medicity</h2>
          </motion.div>
          <motion.div {...fadeUp} className="bg-[hsl(260,100%,97%)] rounded-3xl p-8 md:p-10">
            <h3 className="text-lg font-bold text-foreground">Medanta — The Medicity, Gurugram</h3>
            <table className="w-full mt-6 text-sm">
              <tbody>
                {[
                  ["Validation accuracy", "98.56%"],
                  ["Parameters validated", "SpO2, pulse rate, optical monitoring parameters"],
                  ["Patient population", "Diverse patient cohort across multiple conditions"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <td className="py-3 text-muted-foreground font-medium">{k}</td>
                    <td className="py-3 text-foreground font-semibold text-right">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <blockquote className="mt-8 bg-card rounded-2xl p-6 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground italic">
                "Optical monitoring parameters including SpO2 and pulse rate showed high concordance with reference standard measurements across a diverse patient population."
              </p>
              <footer className="mt-3 text-xs font-medium text-foreground">— Medanta Clinical Study</footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* In The Box */}
      <section className="py-16 bg-[hsl(260,100%,97%)]">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl font-bold text-foreground text-center mb-8">What's included</motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boxItems.map((item) => (
              <div key={item} className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
                <Package className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 bg-primary/10 rounded-xl border border-primary/20 p-4">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary">3-month Nera AI subscription (₹1,797 value)</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl font-bold text-foreground text-center mb-8">Frequently asked questions</motion.h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Related Devices */}
      <section className="py-16 bg-[hsl(260,100%,97%)]">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Complete your health monitoring setup</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedDevices.map((d) => (
              <Link key={d.name} to={d.link} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all group">
                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{d.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-3">
                  Learn more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to monitor without needles?</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">Your first reading takes under 60 seconds. No setup. No pain.</p>
          <Button className="mt-8 rounded-full px-10 py-5 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
            Buy EasyTouch Wellness — ₹3,499
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
