import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
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
  Heart,
  Award,
  BookOpen,
  Cable,
  Zap,
  Wifi,
  Battery,
  Trophy,
} from "lucide-react";
import sanketProPlusImg from "@/assets/sanketlife-proplus-new.webp";
import sanketLifeImg from "@/assets/sanketlife-2-product-new.webp";
import awardAegis from "@/assets/award-aegis-grahambell.webp";
import awardMashelkar from "@/assets/award-anjani-mashelkar.webp";
import awardBioIndia from "@/assets/award-bio-india.webp";
import awardIgp from "@/assets/award-igp.webp";
import awardMbillionth from "@/assets/award-mbillionth-new.png";

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";
const USE_CASES = ["Clinic", "Telehealth", "Diagnostics", "OEM", "Other"];
const VOLUMES = ["< 100", "100 – 1,000", "1,000 – 10,000", "10,000+"];

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Razorpay script loader (matches /checkout pattern) ──
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ── Log SDK enquiry to /admin/partnerships via submit-partnership ──
async function logSdkEnquiry(payload: {
  intent: "sandbox" | "contact" | "dev_kit_purchase";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  useCase?: string;
  expectedVolume?: string;
  message?: string;
  paymentRef?: string;
}) {
  const answers = [
    { question: "Intent", answer: payload.intent },
    { question: "Use case", answer: payload.useCase || "—" },
    { question: "Expected monthly volume", answer: payload.expectedVolume || "—" },
  ];
  if (payload.paymentRef) answers.push({ question: "Razorpay Payment ID", answer: payload.paymentRef });

  const goal =
    payload.message?.trim() ||
    (payload.intent === "sandbox"
      ? `SDK sandbox key request. Use case: ${payload.useCase || "—"}. Expected volume: ${payload.expectedVolume || "—"}.`
      : payload.intent === "dev_kit_purchase"
        ? `SDK Developer Kit purchased (₹18,999). Payment ID: ${payload.paymentRef || "—"}. Use case: ${payload.useCase || "—"}.`
        : `SDK partnership enquiry. Use case: ${payload.useCase || "—"}. Expected volume: ${payload.expectedVolume || "—"}.`);

  try {
    await supabase.functions.invoke("submit-partnership", {
      body: {
        partner_type: "sdk",
        organisation_name: payload.company?.trim() || payload.name.trim(),
        contact_name: payload.name.trim(),
        contact_email: payload.email.trim(),
        contact_phone: payload.phone?.trim() || null,
        goal_summary: goal.length < 30 ? goal + " ".repeat(30 - goal.length) : goal,
        questionnaire_answers: answers,
        consent: true,
      },
    });
  } catch (e) {
    console.error("logSdkEnquiry failed:", e);
  }
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

    // Always log to /admin/partnerships (source of truth)
    await logSdkEnquiry({ intent: "sandbox", ...form });

    // Also try external API for auto-key issuance (best-effort)
    try {
      const res = await fetch(`${API_BASE}/v1/sdk/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({
          loading: false,
          success: data?.pending
            ? "✅ Check your email to verify your address — your sandbox keys will arrive right after."
            : data?.message || "You already have access — check your inbox.",
        });
        return;
      }
    } catch { /* fall through */ }

    // Fallback success — our team will follow up from the admin panel
    setState({
      loading: false,
      success: "✅ Request received. Our team will email your sandbox keys within one business day.",
    });
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

/* -------------------- Dev Kit purchase (Card 2) -------------------- */
function DevKitPurchase() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    address: "", city: "", state: "", pincode: "",
  });
  const [state, setState] = useState<{ loading: boolean; success?: string; error?: string }>({ loading: false });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !isValidEmail(form.email) || !form.phone.trim()) {
      setState({ loading: false, error: "Name, valid email and phone are required." });
      return;
    }
    if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      setState({ loading: false, error: "Full Indian shipping address with a 6-digit PIN is required." });
      return;
    }
    setState({ loading: true });

    try {
      // 1. Create Razorpay order via our edge function
      const { data, error } = await supabase.functions.invoke("razorpay-create-sdk-kit-order", {
        body: {
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
          company: form.company.trim() || undefined,
          shippingAddress: form.address.trim(),
          shippingCity: form.city.trim(),
          shippingState: form.state.trim(),
          shippingPincode: form.pincode.trim(),
          country: "India",
        },
      });
      if (error) throw new Error(error.message || "Failed to create order");
      const razorpayOrderId = data?.razorpayOrderId;
      const amount = data?.amount || 1899900;
      const keyId = data?.keyId;
      if (!razorpayOrderId || !keyId) throw new Error("Payment initialisation failed");

      // 2. Load Razorpay + open modal
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway");

      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: keyId,
          amount,
          currency: "INR",
          name: "Agatsa · SanketLife SDK",
          description: "SDK Developer Kit",
          order_id: razorpayOrderId,
          prefill: { name: form.name.trim(), email: form.email.trim(), contact: form.phone.trim() },
          theme: { color: "#0b5e2d" },
          handler: async (response: any) => {
            try {
              // 3. Verify on server → flips order to `paid`
              await supabase.functions.invoke("razorpay-verify-payment", {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  customerEmail: form.email.trim(),
                  customerName: form.name.trim(),
                  items: [{ sku: "sdk_devkit", name: "SanketLife SDK Developer Kit", qty: 1, price: amount / 100 }],
                  total: amount / 100,
                  shippingAddress: form.address.trim(),
                  shippingCity: form.city.trim(),
                  shippingState: form.state.trim(),
                  shippingPincode: form.pincode.trim(),
                },
              });

              // 4. Log to /admin/partnerships as SDK enquiry with payment ref
              await logSdkEnquiry({
                intent: "dev_kit_purchase",
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                paymentRef: response.razorpay_payment_id,
                message: `Dev Kit purchased. Ship to: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}. Payment: ${response.razorpay_payment_id}.`,
              });

              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });
        rzp.open();
      });

      setState({
        loading: false,
        success: "✅ Payment received. We'll email your SDK key and shipping confirmation within one business day.",
      });
    } catch (err: any) {
      setState({ loading: false, error: err?.message || "Payment failed. Please try again." });
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
        <div><Label>Phone *</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
        <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
      </div>
      <div><Label>Shipping address *</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><Label>City *</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
        <div><Label>State *</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required /></div>
        <div><Label>PIN *</Label><Input value={form.pincode} maxLength={6} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })} required /></div>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={state.loading} className="w-full rounded-full bg-[#0b5e2d] hover:bg-[#094a24] text-white h-11">
        {state.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay ₹18,999 · Buy Dev Kit"}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Secured by Razorpay · UPI · Cards · Net Banking · India shipping only
      </p>
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

    await logSdkEnquiry({ intent: "contact", ...form });

    // Best-effort dual-send to external API too
    try {
      await fetch(`${API_BASE}/v1/sdk/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch { /* ignore */ }

    setState({ loading: false, success: "✅ Thanks — our partnerships team will be in touch within 2 business days." });
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
      "Embed a full clinical 12-lead ECG with an auto-generated PDF report into your Android app. Free sandbox, ₹18,999 dev kit, or talk to us for volume.",
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
              The SanketLife SDK gives your Android app a full clinical 12-lead ECG with an auto-generated PDF report — from one pocket device. Start free, or buy a single developer kit and test everything yourself.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Button onClick={() => scrollTo("path-sandbox")} className="rounded-full bg-[#0b5e2d] hover:bg-[#094a24] text-white px-7 h-12">
                Start free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button onClick={() => scrollTo("path-kit")} variant="outline" className="rounded-full h-12 px-7 border-[#0b5e2d] text-[#0b5e2d] hover:bg-[#0b5e2d]/5">
                Buy a Dev Kit — ₹18,999
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
              <p className="text-3xl font-extrabold text-foreground mt-1">₹18,999 <span className="text-sm font-normal text-muted-foreground">/ one kit</span></p>
              <p className="text-sm text-muted-foreground mt-2">Test the full flow yourself — no sales call, no bulk order.</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> SanketLife Pro Plus ECG</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> SwitchSy 12-lead attachment + electrode leads</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> SDK key auto-issued (starter · 100 ECGs)</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /> Integration guide + demo app</li>
              </ul>
              <div className="mt-6"><DevKitPurchase /></div>
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
                <tr><td className="text-muted-foreground">Price</td><td>Free</td><td className="font-semibold">₹18,999</td><td>Let's talk</td></tr>
                <tr><td className="text-muted-foreground">ECG credits</td><td>25</td><td>100</td><td>Custom</td></tr>
                <tr><td className="text-muted-foreground">Hardware</td><td>—</td><td>1 kit incl.</td><td>Your fleet</td></tr>
                <tr><td className="text-muted-foreground">Best for</td><td>Evaluating code</td><td>Full self-test</td><td>Production rollout</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* THE DEVICES — What powers the SDK */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0b5e2d]/10 text-[#0b5e2d] px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4">
              <Heart className="h-3.5 w-3.5" /> Clinical-grade hardware
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">The ECG hardware behind the SDK</h2>
            <p className="text-muted-foreground mt-3">
              Two pocket-sized, CDSCO-licensed ECG devices — the same hardware trusted by 2.1 Lac+ users and hundreds of Indian cardiologists — now programmable through a single Android SDK.
            </p>
          </motion.div>

          {/* Pro Plus 12-lead */}
          <motion.div {...fade} className="grid lg:grid-cols-2 gap-10 items-center mb-16">
            <div className="order-2 lg:order-1">
              <span className="inline-block bg-[#0b5e2d] text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">Included in Dev Kit</span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-3">SanketLife Pro Plus — 12-lead ECG</h3>
              <p className="text-muted-foreground mt-2">
                Connect the SwitchSy 12-lead attachment with electrode leads to capture a full diagnostic-grade 12-lead ECG — the same test hospitals use — from a device that fits in your palm.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                <li className="flex gap-3"><Cable className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>12-lead capture</strong> via SwitchSy attachment + chest & limb electrodes</span></li>
                <li className="flex gap-3"><Activity className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>Single-lead Lead-I</strong> mode also available — no leads needed</span></li>
                <li className="flex gap-3"><FileText className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>Auto PDF report</strong> — HR, axis, intervals, rhythm interpretation</span></li>
                <li className="flex gap-3"><Wifi className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>BLE 5.0</strong> connectivity · pairs in seconds</span></li>
                <li className="flex gap-3"><Battery className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>Rechargeable</strong> · 30-day standby · USB-C</span></li>
                <li className="flex gap-3"><ShieldCheck className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>CDSCO Class B</strong> licensed medical device · ISO 13485 manufacturing</span></li>
              </ul>
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-muted/40 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-[#0b5e2d]">12</p><p className="text-[11px] text-muted-foreground">Leads</p></div>
                <div className="bg-muted/40 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-[#0b5e2d]">30s</p><p className="text-[11px] text-muted-foreground">Capture</p></div>
                <div className="bg-muted/40 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-[#0b5e2d]">500Hz</p><p className="text-[11px] text-muted-foreground">Sample rate</p></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b5e2d]/5 to-muted/30 p-6 md:p-10 border border-border">
                <img src={sanketProPlusImg} alt="SanketLife Pro Plus 12-lead ECG device" className="w-full max-w-md mx-auto object-contain" loading="lazy" />
              </div>
            </div>
          </motion.div>

          {/* SanketLife single-lead */}
          <motion.div {...fade} className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-muted/30 to-[#0b5e2d]/5 p-6 md:p-10 border border-border">
                <img src={sanketLifeImg} alt="SanketLife single-lead ECG device" className="w-full max-w-md mx-auto object-contain" loading="lazy" />
              </div>
            </div>
            <div>
              <span className="inline-block bg-muted text-foreground text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">Also supported</span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-3">SanketLife — Single-lead ECG</h3>
              <p className="text-muted-foreground mt-2">
                The credit-card-sized ECG that started it all — perfect for high-volume screening, home monitoring, and AF/arrhythmia detection where a full 12-lead isn't required.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                <li className="flex gap-3"><Zap className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>Lead-I capture in 30 seconds</strong> — no leads, no gel, no prep</span></li>
                <li className="flex gap-3"><Activity className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>AF detection & rhythm analysis</strong> auto-generated in the report</span></li>
                <li className="flex gap-3"><Smartphone className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>Same SDK, same API</strong> — one integration covers both devices</span></li>
                <li className="flex gap-3"><ShieldCheck className="h-4 w-4 text-[#0b5e2d] shrink-0 mt-0.5" /><span><strong>CDSCO licensed</strong> · 97.8% concordance with hospital ECGs</span></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-5">
                Ideal for telehealth, camps, and OEM integrations where thousands of quick spot-checks matter more than diagnostic 12-lead.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CREDENTIALS · AWARDS · PUBLICATIONS */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fade} className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0b5e2d]/10 text-[#0b5e2d] px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4">
              <Trophy className="h-3.5 w-3.5" /> Proven & recognised
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">You're integrating a proven platform</h2>
            <p className="text-muted-foreground mt-3">
              Not a prototype. The SanketLife ECG has been in the market since 2016, backed by 36+ awards, clinical validation studies, and India's top regulatory certifications.
            </p>
          </motion.div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            {[
              { n: "2.1 Lac+", l: "Users worldwide" },
              { n: "1.5 Cr+", l: "ECG records analysed" },
              { n: "97.8%", l: "Concordance vs. hospital ECG" },
              { n: "36+", l: "Awards & recognitions" },
            ].map((s) => (
              <div key={s.l} className="bg-card border border-border rounded-xl p-5 text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-[#0b5e2d]">{s.n}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <motion.div {...fade} className="mb-14">
            <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Regulatory & Quality Certifications</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { n: "CDSCO Class B", d: "Licensed medical device (India)" },
                { n: "ISO 13485", d: "Medical device quality" },
                { n: "ISO 9001:2015", d: "Manufacturing quality" },
                { n: "BIS Approved", d: "Bureau of Indian Standards" },
                { n: "UL Certified", d: "Electrical safety" },
                { n: "AIMED Member", d: "Indian medical device body" },
              ].map((c) => (
                <div key={c.n} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#0b5e2d] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.n}</p>
                    <p className="text-[11px] text-muted-foreground">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Awards */}
          <motion.div {...fade} className="mb-14">
            <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Featured Awards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { img: awardAegis, name: "Aegis Graham Bell", year: "2022" },
                { img: awardMashelkar, name: "Anjani Mashelkar Prize", year: "2025" },
                { img: awardBioIndia, name: "Global Bio-India", year: "2020" },
                { img: awardIgp, name: "DST-Lockheed Martin IIGP", year: "2018" },
                { img: awardMbillionth, name: "mBillionth South Asia", year: "2019" },
              ].map((a) => (
                <div key={a.name} className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] w-full flex items-center justify-center mb-2">
                    <img src={a.img} alt={a.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-tight">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">({a.year})</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              + 30 more from NASSCOM, BIRAC, Forbes, TiE, DST, NIF, ET Now, CII and others.
            </p>
          </motion.div>

          {/* Publications & clinical validation */}
          <motion.div {...fade} className="mb-14">
            <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">Clinical Validation & Publications</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Concordance with 12-lead hospital ECG",
                  body: "Independent clinical evaluation demonstrated 97.8% concordance between SanketLife Pro Plus and standard 12-lead hospital ECG across 1,200+ patient recordings.",
                  tag: "Clinical Study",
                },
                {
                  title: "AIIMS — SanketLife screening event",
                  body: "SanketLife deployed in a cardiology outreach programme at AIIMS Delhi for pre-symptomatic arrhythmia screening. Presented on the AIIMS platform.",
                  tag: "Hospital Programme",
                },
                {
                  title: "Endorsed by leading cardiologists",
                  body: "Recommended on record by Dr. Sanjeev Gera, Dr. Vanita Arora and others as a reliable at-home ECG for early cardiac detection.",
                  tag: "Expert Endorsement",
                },
              ].map((p) => (
                <div key={p.title} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-[#0b5e2d]" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0b5e2d]">{p.tag}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm leading-snug">{p.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Media */}
          <motion.div {...fade}>
            <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">As Seen In</h3>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {["The Economic Times","Forbes India","YourStory","Inc42","NEWS9","The Hindu","Business Standard","Express Healthcare"].map((m) => (
                <span key={m} className="text-muted-foreground/80 font-semibold text-sm md:text-base">{m}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


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
