import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Contact() {
  useSEO({ title: "Contact Us — Agatsa One", description: "Get in touch with Agatsa. Email care@agatsa.com, call 08069289999, or fill our contact form. We respond within 24 hours." });

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-28 pb-16 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">Contact Us</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">We'd love to hear from you</h1>
          <p className="text-lg text-muted-foreground mt-4">Whether you have a question about devices, subscriptions, partnerships, or anything else — our team is ready to help.</p>
        </motion.div>
      </section>

      {/* Contact cards */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            { icon: Mail, title: "Email Us", detail: "care@agatsa.com", sub: "We respond within 24 hours", href: "mailto:care@agatsa.com" },
            { icon: Phone, title: "Call Us", detail: "08069289999", sub: "Mon–Sat, 9 AM – 6 PM IST", href: "tel:08069289999" },
            { icon: MessageCircle, title: "WhatsApp", detail: "+91 88262 83840", sub: "Quick support via WhatsApp", href: "https://wa.me/918826283840" },
          ].map((c, i) => (
            <motion.a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...fade} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
              <c.icon className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="font-bold text-foreground">{c.title}</h3>
              <p className="text-primary font-semibold mt-1">{c.detail}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Form + Address */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Form */}
          <motion.form {...fade} onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
            <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <Input type="email" placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Input placeholder="Subject" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
            </div>
            <Textarea placeholder="Your message..." rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
            <Button type="submit" className="rounded-full px-8 bg-primary text-primary-foreground">Send Message</Button>
          </motion.form>

          {/* Address */}
          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
            <div>
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Registered Office</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Agatsa Medical Technologies Pvt. Ltd.<br />
                New Delhi, India
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Business Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Saturday<br />9:00 AM – 6:00 PM IST</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h4 className="font-semibold text-foreground text-sm">For Enterprise & Hospital Enquiries</h4>
              <p className="text-sm text-muted-foreground mt-1">Email: <a href="mailto:enterprise@agatsa.com" className="text-primary">enterprise@agatsa.com</a></p>
              <p className="text-sm text-muted-foreground">Or <a href="/for-hospitals" className="text-primary underline">book a hospital demo</a></p>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
