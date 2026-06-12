import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Activity, Watch, Sparkles, ArrowRight, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    requirement: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, company, email, phone, requirement } = form;
    if (!name.trim() || !company.trim() || !email.trim() || !phone.trim() || !requirement.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-nera-license-enquiry", {
        body: {
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          requirement: requirement.trim(),
        },
      });
      if (error) throw error;
      toast.success("Thanks! Our team will reach out within 1 business day.");
      setForm({ name: "", company: "", email: "", phone: "", requirement: "" });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not send. Please email info@agatsa.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative bg-[hsl(var(--dark-bg))] text-white py-20 md:py-28 overflow-hidden">
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
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3 h-3" />
            Get NERA AI Working For You
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Pick your device.{" "}
            <span className="text-white/60">Or license NERA AI for your own.</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            NERA AI ships free for 1 year with every Agatsa device. Already have a wearable platform?
            License NERA AI as the intelligence layer for your own hardware.
          </p>
        </motion.div>

        {/* Device cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {DEVICES.map((d) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className={`group relative rounded-2xl border bg-gradient-to-br ${d.tone} p-6 flex flex-col backdrop-blur-sm hover:scale-[1.01] transition-transform`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${d.iconTone} mb-5`}>
                <d.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{d.name}</h3>
              <p className="mt-1.5 text-sm text-white/70">{d.tagline}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="w-3 h-3" />
                1 year NERA AI free
              </div>
              <Button asChild size="lg" className="mt-6 btn-glow w-full">
                <Link to={d.href}>
                  {d.cta} <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* B2B License card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 max-w-6xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent p-7 md:p-10 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold uppercase tracking-wider mb-4">
                <Building2 className="w-3 h-3" />
                For Wearable Brands & Enterprises
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                License NERA AI for your own wearable.
              </h3>
              <p className="mt-3 text-white/70 max-w-2xl text-sm md:text-base leading-relaxed">
                Plug NERA's health intelligence engine into your smartwatch, band, ring, or biosensor.
                Health scores, risk drivers, lifestyle correlations and predictive alerts — under your brand.
              </p>
            </div>
            <div className="md:shrink-0">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-base px-7 h-12 btn-glow">
                    Request NERA AI License <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>License NERA AI</DialogTitle>
                    <DialogDescription>
                      Tell us about your product. Our team responds within 1 business day.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="nera-name">Name *</Label>
                        <Input id="nera-name" value={form.name} onChange={update("name")} maxLength={120} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="nera-company">Company *</Label>
                        <Input id="nera-company" value={form.company} onChange={update("company")} maxLength={160} required />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="nera-email">Work email *</Label>
                        <Input id="nera-email" type="email" value={form.email} onChange={update("email")} maxLength={200} required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="nera-phone">Phone *</Label>
                        <Input id="nera-phone" type="tel" value={form.phone} onChange={update("phone")} maxLength={40} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="nera-req">Requirement *</Label>
                      <Textarea
                        id="nera-req"
                        value={form.requirement}
                        onChange={update("requirement")}
                        maxLength={2000}
                        rows={4}
                        placeholder="Briefly describe your device, signals available (HR, HRV, SpO2, ECG, sleep), and what you'd like NERA AI to power."
                        required
                      />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full h-11 btn-glow">
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                      ) : (
                        <>Send Enquiry <ArrowRight className="ml-1 w-4 h-4" /></>
                      )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Goes directly to info@agatsa.com
                    </p>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
