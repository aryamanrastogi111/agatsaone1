// Doctor Landing Page
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
  Database,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import doctorsHeroImg from "@/assets/doctors-hero.jpg";

import doctorsPortalImg from "@/assets/doctors-portal-dashboard.jpg";

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
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
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
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
              >
                Clinical-grade ECG, HRV, blood pressure, body composition, and sleep
                — delivered as AI-interpreted reports to your portal. Know who needs
                attention before they call you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
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

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden md:block"
            >
              <img
                src={doctorsHeroImg}
                alt="Doctor monitoring patient ECG data remotely on tablet"
                width={1280}
                height={720}
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- AI DATA SECTION ---------- */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-500">
        <div className="container max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="flex flex-col items-center gap-4"
          >
            <Database className="h-10 w-10 text-white/80" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Powered by 1.5 Crore+ Indian Health Records
            </h2>
            <p className="text-lg text-white/80 max-w-2xl">
              Our AI engine, Nera, is trained on over 1.5 crore real Indian health
              data points — making it one of the largest India-specific health
              datasets. This means more accurate interpretations tuned for Indian
              demographics and conditions.
            </p>
          </motion.div>
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
                title: "Patient uses the device",
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
                color: "text-red-500",
                bg: "bg-red-500/10",
              },
              {
                icon: Activity,
                name: "Rhythm Band",
                tagline: "24/7 HRV, BP & sleep",
                desc: "Worn like a fitness band. Continuously tracks HRV, optical blood pressure, SpO2, and 8-hour sleep staging every night.",
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                icon: Scale,
                name: "Smart Scale",
                tagline: "26 body metrics in one step",
                desc: "Bioelectrical impedance analysis. Visceral fat, muscle mass, bone density, metabolic rate — weekly trend reports.",
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
                    <p className="text-sm text-muted-foreground">
                      {d.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PORTAL FEATURES ---------- */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl">
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

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid sm:grid-cols-1 gap-6">
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

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
            >
              <img
                src={doctorsPortalImg}
                alt="AI-powered health monitoring portal dashboard"
                width={1280}
                height={720}
                loading="lazy"
                className="rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- SOCIAL PROOF ---------- */}
      <section className="py-20">
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
              "1.5 Cr+ Indian health data points powering Nera AI",
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
      <section className="py-20 bg-muted/30">
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-500">
        <div className="container max-w-2xl text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Start monitoring your first 10 patients free.
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="text-lg text-white/80 mb-8"
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
            <Button asChild size="lg" className="text-base group bg-white text-red-600 hover:bg-white/90">
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
