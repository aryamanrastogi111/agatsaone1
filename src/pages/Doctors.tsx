import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Activity,
  Scale,
  Shield,
  Bell,
  Eye,
  UserMinus,
  BarChart3,
  CheckCircle2,
  Stethoscope,
  Smartphone,
  FileText,
  Quote,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Doctors() {
  return (
    <Layout>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-24 md:py-32">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6"
          >
            <Stethoscope className="h-4 w-4" />
            For Doctors & Clinics
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
          >
            Monitor every patient, 24/7 —{" "}
            <span className="text-primary">from your desk.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Clinical-grade ECG, HRV, blood pressure, body composition, and sleep
            — delivered as AI-interpreted reports to your portal. Know who needs
            attention before they call you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="text-base group">
              <a
                href="https://ecg-lab-portal-b4yda2wdqa-el.a.run.app/provider/register"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Start free — no card required
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            Used by 600+ doctors · CDSCO Class IIa certified · CE Mark · ISO
            13485
          </motion.p>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
          >
            How it works
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
          >
            Three simple steps. No hardware hassle on your end.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Smartphone,
                title: "You invite a patient",
                desc: "Enter their phone number in your portal. They receive a notification on Agatsa One.",
              },
              {
                step: "02",
                icon: Activity,
                title: "Patient wears the device",
                desc: "We ship a clinical-grade device to your patient. They sync data daily — no effort required from them.",
              },
              {
                step: "03",
                icon: FileText,
                title: "You read the AI report",
                desc: "Every week, Nera AI generates an interpreted summary. Abnormal findings trigger an instant alert to your portal.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                <Card className="h-full border-none shadow-md bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl font-black text-primary/10 mb-4">
                      {item.step}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DEVICES ---------- */}
      <section className="py-20">
        <div className="container max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
          >
            Devices your patients use
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
          >
            Clinical-grade hardware, shipped directly to your patient.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                name: "Sanket ECG",
                tagline: "Lead I + II in 30 seconds",
                desc: "The world's smallest medical-grade ECG. CDSCO-approved, used in 600+ clinics. AI classifies 15+ arrhythmias instantly.",
                price: "₹999/patient/month",
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
              {
                icon: Activity,
                name: "Rhythm Band",
                tagline: "24/7 HRV, BP & sleep",
                desc: "Worn like a fitness band. Continuously tracks HRV, optical blood pressure, SpO2, and 8-hour sleep staging every night.",
                price: "₹1,799/patient/month",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Scale,
                name: "Smart Scale",
                tagline: "26 body metrics in one step",
                desc: "Bioelectrical impedance analysis. Visceral fat, muscle mass, bone density, metabolic rate — weekly trend reports.",
                price: "₹1,499/patient/month",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
            ].map((d, i) => (
              <motion.div
                key={d.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 2}
              >
                <Card className="h-full border shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div
                      className={`w-12 h-12 rounded-xl ${d.bg} flex items-center justify-center mb-4`}
                    >
                      <d.icon className={`h-6 w-6 ${d.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {d.name}
                    </h3>
                    <p className="text-sm font-medium text-primary mb-3">
                      {d.tagline}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {d.desc}
                    </p>
                    <span className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground">
                      {d.price}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PORTAL FEATURES ---------- */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
          >
            What you see in your portal
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: FileText,
                text: "Weekly AI-interpreted report per patient — no manual reading required",
              },
              {
                icon: Bell,
                text: "Instant alert if ECG shows abnormal rhythm or critical reading",
              },
              {
                icon: BarChart3,
                text: "HRV trend, sleep score, BP history — all in one view",
              },
              {
                icon: Shield,
                text: "Patient data shared only after they accept your invite",
              },
              {
                icon: UserMinus,
                text: "Remove any patient anytime — data access stops immediately",
              },
              {
                icon: Eye,
                text: "Full visibility across your entire patient panel at a glance",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-foreground text-sm leading-relaxed pt-2">
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section className="py-20">
        <div className="container max-w-3xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-center text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Device cost is separate — billed per kit dispatched. No upfront
            inventory commitment.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <Card className="overflow-hidden border shadow-md">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-4 font-semibold text-foreground">
                        Plan
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground">
                        Patients
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        plan: "Starter",
                        patients: "Up to 10",
                        price: "Free to start",
                        highlight: true,
                      },
                      {
                        plan: "Growth",
                        patients: "Up to 50",
                        price: "₹249/patient/month",
                      },
                      {
                        plan: "Pro",
                        patients: "Up to 200",
                        price: "₹299/patient/month",
                      },
                      {
                        plan: "Enterprise",
                        patients: "Unlimited",
                        price: "Contact us",
                      },
                    ].map((row, i) => (
                      <tr
                        key={row.plan}
                        className={`border-b last:border-0 ${
                          row.highlight ? "bg-primary/5" : ""
                        }`}
                      >
                        <td className="p-4 font-medium text-foreground flex items-center gap-2">
                          {row.plan}
                          {row.highlight && (
                            <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">
                              Popular
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {row.patients}
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          {row.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="text-center mt-8"
          >
            <Button asChild size="lg" className="text-base group">
              <a
                href="https://ecg-lab-portal-b4yda2wdqa-el.a.run.app/provider/register"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Register your clinic free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ---------- SOCIAL PROOF ---------- */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <Card className="border-none shadow-lg bg-card">
              <CardContent className="p-8 md:p-12 text-center">
                <Quote className="h-10 w-10 text-primary/20 mx-auto mb-6" />
                <p className="text-lg md:text-xl text-foreground leading-relaxed italic mb-6">
                  "I can see my post-MI patients' HRV trends without them
                  visiting the clinic. The ECG alert caught an arrhythmia in a
                  patient who had no symptoms."
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  — Cardiologist, India
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            {[
              "97.8% concordance with cardiologist interpretation",
              "1.3M+ ECGs analyzed",
              "CDSCO Class IIa certified",
            ].map((stat) => (
              <div
                key={stat}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {stat}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-20">
        <div className="container max-w-2xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-center text-foreground mb-10"
          >
            Frequently asked questions
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "Do patients need to buy the device?",
                  a: "No. You prescribe it, we ship it to them. The cost is included in your per-patient subscription.",
                },
                {
                  q: "What if a patient doesn't have a smartphone?",
                  a: "Agatsa One works on any Android or iOS phone from 2018 onwards. Most patients already have a compatible device.",
                },
                {
                  q: "Is this HIPAA / data compliant?",
                  a: "All data is encrypted in transit and at rest. Patient data is shared with you only after explicit consent via the app.",
                },
                {
                  q: "Can I remove a patient?",
                  a: "Yes. Removing a patient from your portal immediately revokes your access to their data.",
                },
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="py-20 bg-primary/5">
        <div className="container max-w-2xl text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Start monitoring your first 10 patients free.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground mb-8"
          >
            No credit card. No upfront cost. Device shipped within 3 days of
            patient enrollment.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <Button asChild size="lg" className="text-base group">
              <a
                href="https://ecg-lab-portal-b4yda2wdqa-el.a.run.app/provider/register"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Register your clinic
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
