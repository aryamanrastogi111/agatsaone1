import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Code2,
  Package,
  MessagesSquare,
  Cpu,
  FileText,
  Activity,
  Smartphone,
  ShieldCheck,
  Stethoscope,
  Building2,
  FlaskConical,
  Users,
  Boxes,
  ArrowRight,
  Loader2,
} from "lucide-react";

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";
const USE_CASES = ["Clinic", "Telehealth", "Diagnostics", "OEM", "Other"];
const VOLUMES = ["< 100", "100 – 1,000", "1,000 – 10,000", "10,000+"];

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* -------------------- Sandbox form (Card 1) -------------------- */
function SandboxForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", useCase: "", expectedVolume: "" });
  const [state, setState] = useState<{ loading: boolean; success?: string; error?: string }>({ loading: false });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !isValidEmail(form.email)) {
      setState({ loading: false, error: "A valid name and email are required." });
      return;
    }
    setState({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/v1/sdk/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setState({
        loading: false,
        success: data.pending
          ? "✅ Check your email to verify your address — your sandbox keys will arrive right after."
          : data.message || "You already have access — check your inbox.",
      });
    } catch (err: any) {
      setState({ loading: false, error: err.message || "Something went wrong." });
    }
  };

  if (state.success) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
        {state.success}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div><Label>Work email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
      </div>
      <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Use case</Label>
          <Select value={form.useCase} onValueChange={(v) => setForm({ ...form, useCase: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{USE_CASES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Expected monthly volume</Label>
          <Select value={form.expectedVolume} onValueChange={(v) => setForm({ ...form, expectedVolume: v })}>
            <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
            <SelectContent>{VOLUMES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={state.loading} className="w-full rounded-full bg-[#0b5e2d] hover:bg-[#094a24] text-white">
        {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get sandbox keys"}
      </Button>
      <p className="text-xs text-muted-foreground">Keys are emailed after you verify your address. No card required.</p>
    </form>
  );
}

/* -------------------- Contact form (Card 3) -------------------- */
function ContactForm({ prefillMessage }: { prefillMessage?: string }) {
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", useCase: "", expectedVolume: "",
    message: prefillMessage || "",
  });
  const [state, setState] = useState<{ loading: boolean; success?: string; error?: string }>({ loading: false });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !isValidEmail(form.email)) {
      setState({ loading: false, error: "A valid name and email are required." });
      return;
    }
    setState({ loading: true });
    try {
      const res = await fetch(`${API_BASE}/v1/sdk/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setState({ loading: false, success: data.message || "Thanks — we'll be in touch shortly." });
    } catch (err: any) {
      setState({ loading: false, error: err.message || "Something went wrong." });
    }
  };

  if (state.success) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
        {state.success}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div><Label>Work email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Use case</Label>
          <Select value={form.useCase} onValueChange={(v) => setForm({ ...form, useCase: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{USE_CASES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Expected monthly volume</Label>
          <Select value={form.expectedVolume} onValueChange={(v) => setForm({ ...form, expectedVolume: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{VOLUMES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div><Label>Message</Label><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={state.loading} className="w-full rounded-full bg-[#0b5e2d] hover:bg-[#094a24] text-white">
        {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
      </Button>
    </form>
  );
}

/* -------------------- Page -------------------- */
const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const audience = [
  { icon: Stethoscope, label: "Clinics & hospitals" },
  { icon: Smartphone, label: "Telehealth platforms" },
  { icon: FlaskConical, label: "Diagnostic labs" },
  { icon: Users, label: "Camp / screening operators" },
  { icon: Boxes, label: "Device OEMs & integrators" },
];

const sdkFeatures = [
  { icon: Activity, title: "12-lead ECG (Pro Plus) + single-lead ECG" },
  { icon: Cpu, title: "SpO₂, Blood Pressure, Temperature" },
  { icon: ShieldCheck, title: "BMI (with the smart scale)" },
  { icon: FileText, title: "Auto cloud processing + clinical PDF report" },
  { icon: Smartphone, title: "On-device history · Android, minSdk 28" },
];

const faqs = [
  { q: "Do I need hardware to start?", a: "No — the sandbox lets you evaluate the integration. Real 12-lead captures need a device (buy a dev kit)." },
  { q: "What do I get with a dev kit?", a: "The device + 12-lead attachment + electrode leads, plus an SDK key, the integration guide and a demo app — everything you need to test end-to-end." },
  { q: "Which platforms are supported?", a: "Android today (minSdk 28). iOS is on the roadmap." },
  { q: "How are keys delivered?", a: "By email, after you verify your address. Keys are never shown on the page." },
];

export default function SdkPartners() {
  useSEO({
    title: "SanketLife SDK — Add clinical 12-lead ECG to your app | Agatsa",
    description:
      "Embed a full 12-lead ECG, SpO₂, BP, temperature and clinical PDF report into your Android app. Free sandbox, ₹14,999 dev kit, or talk to us for volume.",
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative pt-16 pb-20 px-4 overflow-hidden" style={{ background: "linear-gradient(180deg, #f0f7f2 0%, hsl(var(--background)) 100%)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fade}>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0b5e2d]/10 text-[#0b5e2d] px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-5">
              <Code2 className="h-3.5 w-3.5" /> SanketLife SDK · For Partners
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight">
              Add clinical 12-lead ECG <br className="hidden md:block" />
              to your product — <span className="text-[#0b5e2d]">in a day.</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-5 max-w-3xl mx-auto">
              The SanketLife SDK gives your Android app a full 12-lead ECG (plus SpO₂, BP, temperature, BMI and an auto-generated PDF report) from one pocket device. Start free, or buy a single developer kit and test everything yourself.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Button onClick={() => scrollTo("path-sandbox")} className="rounded-full bg-[#0b5e2d] hover:bg-[#094a24] text-white px-7 h-12">
                Start free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button onClick={() => scrollTo("path-kit")} variant="outline" className="rounded-full h-12 px-7 border-[#0b5e2d] text-[#0b5e2d] hover:bg-[#0b5e2d]/5">
                Buy a Dev Kit — ₹14,999
              </Button>
              <Button onClick={() => scrollTo("path-talk")} variant="ghost" className="rounded-full h-12 px-7 text-foreground">
                Talk to us
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4 inline-flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5" /> Android SDK · minSdk 28 · CORS-open REST API
            </p>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade} className="text-3xl font-bold text-center text-foreground">How it works</motion.h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { n: "1", t: "Register", d: "Register the device once — one line of code." },
              { n: "2", t: "Capture", d: "Capture a 12-lead ECG with the guided flow." },
              { n: "3", t: "Report", d: "Get a clinical PDF back automatically." },
            ].map((s, i) => (
              <motion.div key={s.n} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#0b5e2d] text-white flex items-center justify-center font-bold text-lg">{s.n}</div>
                <h3 className="mt-4 font-bold text-lg text-foreground">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-14 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade} className="text-3xl font-bold text-center text-foreground">Who it's for</motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
            {audience.map((a) => (
              <div key={a.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <a.icon className="h-6 w-6 text-[#0b5e2d] mx-auto" />
                <p className="text-sm font-medium text-foreground mt-2">{a.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE 3 PATHS */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fade} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Three ways to get started</h2>
            <p className="text-muted-foreground mt-3">Pick a path — no sales call required.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1 — Sandbox */}
            <motion.div id="path-sandbox" {...fade} className="bg-card border-2 border-border rounded-2xl p-7 flex flex-col scroll-mt-24">
              <div className="flex items-center gap-2 text-[#0b5e2d]"><Code2 className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">Path 1 · Free</span></div>
              <h3 className="text-2xl font-bold text-foreground mt-2">Start free</h3>
              <p className="text-sm text-muted-foreground mt-1">Instant sandbox API keys to evaluate the SDK. <strong>25 free ECG credits.</strong></p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> Full API access</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> No card required</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> Real captures need a device</li>
              </ul>
              <div className="mt-6"><SandboxForm /></div>
            </motion.div>

            {/* Card 2 — Dev Kit */}
            <motion.div id="path-kit" {...fade} className="bg-card border-2 border-[#0b5e2d] rounded-2xl p-7 flex flex-col relative scroll-mt-24 shadow-lg">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0b5e2d] text-white text-xs font-semibold px-3 py-1 rounded-full">Most popular</span>
              <div className="flex items-center gap-2 text-[#0b5e2d]"><Package className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">Path 2 · Hardware</span></div>
              <h3 className="text-2xl font-bold text-foreground mt-2">Developer Kit</h3>
              <p className="text-3xl font-extrabold text-foreground mt-1">₹14,999 <span className="text-sm font-normal text-muted-foreground">/ one kit</span></p>
              <p className="text-sm text-muted-foreground mt-2">Test the full flow yourself — no sales call, no bulk order.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> SanketLife Pro Plus ECG</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> SwitchSy 12-lead attachment + electrode leads</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> SDK key auto-issued (starter · 500 ECGs)</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> Integration guide + demo app</li>
              </ul>
              <div className="mt-auto pt-6 space-y-2">
                <Button
                  onClick={() => scrollTo("path-talk")}
                  className="w-full rounded-full bg-[#0b5e2d] hover:bg-[#094a24] text-white h-11"
                >
                  Request purchase link
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Online checkout coming soon — request a Razorpay link and we'll email it within a business day.
                </p>
              </div>
            </motion.div>

            {/* Card 3 — Talk */}
            <motion.div id="path-talk" {...fade} className="bg-card border-2 border-border rounded-2xl p-7 flex flex-col scroll-mt-24">
              <div className="flex items-center gap-2 text-[#0b5e2d]"><MessagesSquare className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">Path 3 · Volume</span></div>
              <h3 className="text-2xl font-bold text-foreground mt-2">Talk to us</h3>
              <p className="text-sm text-muted-foreground mt-1">Volume pricing, white-label, or custom commercial terms.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> Fleet pricing</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> White-label reports</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> Custom SLAs</li>
              </ul>
              <div className="mt-6"><ContactForm /></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT'S IN THE SDK */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade} className="text-3xl font-bold text-center text-foreground">What's in the SDK</motion.h2>
          <div className="grid md:grid-cols-2 gap-4 mt-10">
            {sdkFeatures.map((f, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[#0b5e2d]/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-[#0b5e2d]" />
                </div>
                <p className="text-foreground font-medium text-sm">{f.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SNAPSHOT */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fade} className="text-3xl font-bold text-center text-foreground">Pricing at a glance</motion.h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-semibold text-foreground"></th>
                  <th className="text-left p-4 font-semibold text-foreground">Sandbox</th>
                  <th className="text-left p-4 font-semibold text-[#0b5e2d]">Dev Kit</th>
                  <th className="text-left p-4 font-semibold text-foreground">Volume</th>
                </tr>
              </thead>
              <tbody className="[&_td]:p-4 [&_td]:border-t [&_td]:border-border">
                <tr><td className="text-muted-foreground">Price</td><td>Free</td><td className="font-semibold">₹14,999</td><td>Let's talk</td></tr>
                <tr><td className="text-muted-foreground">ECG credits</td><td>25</td><td>500</td><td>Custom</td></tr>
                <tr><td className="text-muted-foreground">Hardware</td><td>—</td><td>1 kit incl.</td><td>Your fleet</td></tr>
                <tr><td className="text-muted-foreground">Best for</td><td>Evaluating code</td><td>Full self-test</td><td>Production rollout</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade} className="text-3xl font-bold text-center text-foreground">FAQ</motion.h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.05 }} className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground">{f.q}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 px-4 bg-[#0b5e2d] text-white text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto">
          <Building2 className="h-10 w-10 mx-auto opacity-90" />
          <h2 className="text-3xl font-bold mt-4">Ship a clinical ECG feature this quarter.</h2>
          <p className="mt-3 opacity-90">Start with sandbox keys today. Add hardware when you're ready.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <Button onClick={() => scrollTo("path-sandbox")} className="rounded-full bg-white text-[#0b5e2d] hover:bg-white/90 h-12 px-8 font-semibold">
              Get sandbox keys
            </Button>
            <Button onClick={() => scrollTo("path-talk")} variant="outline" className="rounded-full h-12 px-8 border-white text-white hover:bg-white/10 bg-transparent">
              Talk to us
            </Button>
          </div>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
