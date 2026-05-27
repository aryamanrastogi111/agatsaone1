import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bell,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Lock,
  Search,
  Send,
  Sparkles,
  Stethoscope,
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Users,
  Cpu,
  Wallet,
} from "lucide-react";

const TEAL = "#0D9488";

const NAV_ITEMS = [
  { Icon: LayoutDashboard, label: "Dashboard", active: true },
  { Icon: Stethoscope, label: "My Patients", count: "47" },
  { Icon: Activity, label: "ECG Reports", count: "20" },
  { Icon: Bell, label: "Alerts", count: "3", urgent: true },
  { Icon: FileText, label: "Weekly Reports" },
  { Icon: Send, label: "Messages" },
];

const KPIS = [
  { label: "ECGs read", value: "20", sub: "today", color: "text-slate-900" },
  { label: "Urgent", value: "1", sub: "review now", color: "text-red-600" },
  { label: "Borderline", value: "2", sub: "today", color: "text-amber-600" },
  { label: "Stable", value: "17", sub: "auto-cleared", color: "text-emerald-600" },
];

const QUEUE = [
  { name: "Rajesh Kumar", age: "58 · M", note: "AFib detected · HRV ↓ 3 days · BP 152/96", tag: "URGENT", color: "red", dot: "bg-red-500" },
  { name: "Sunita Verma", age: "62 · F", note: "ST-T changes · Sleep 48 · Sugar spike", tag: "REVIEW", color: "amber", dot: "bg-amber-500" },
  { name: "Anil Joshi", age: "54 · M", note: "Borderline QT · HRV trending up", tag: "REVIEW", color: "amber", dot: "bg-amber-500" },
  { name: "Meena Gupta", age: "67 · F", note: "Normal sinus rhythm · Adherence 100%", tag: "STABLE", color: "emerald", dot: "bg-emerald-500" },
  { name: "Vikas Sharma", age: "49 · M", note: "Normal · HRV improving · Weight ↓ 1.2kg", tag: "STABLE", color: "emerald", dot: "bg-emerald-500" },
];

const FEATURES = [
  { Icon: LayoutDashboard, title: "Doctor Portal (1 year free)", body: "Triage panel, daily ECG results, Nera AI briefing, messages — one screen." },
  { Icon: Cpu, title: "Nera AI Morning Briefing", body: "20 ECGs reviewed overnight. Stable auto-cleared, urgent flagged for you." },
  { Icon: Users, title: "Enrol patients in 60 seconds", body: "Hand them a clinic card — they download the app and link to your dashboard." },
  { Icon: ShieldCheck, title: "Clinic-grade ECG kit", body: "Same SanketLife device trusted by AIIMS, leading cardiologists & national media." },
  { Icon: FileText, title: "Weekly patient reports", body: "Auto-generated PDFs you can share with patients or upload to records." },
  { Icon: Bell, title: "Smart alerts that matter", body: "Only the patients who need you today. No noise, no false alarms." },
];

export function HeartGuardTeaserSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: TEAL }}>
            For Doctors · HeartGuard
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            A clinic-grade ECG kit, a doctor portal, and a new earning stream
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Nera AI reads 20 ECGs every morning so you don't have to. Triage in 6 minutes,
            keep patients monitored at home, and earn ₹3,000+/month per enrolled patient.
          </p>
        </div>

        {/* Laptop Mockup */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="ml-3 flex flex-1 items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-[11px] text-slate-500">
              <Lock className="h-3 w-3" /> portal.agatsa.one / dashboard
            </div>
          </div>

          <div className="grid grid-cols-12">
            {/* Sidebar */}
            <aside className="col-span-12 border-b border-slate-200 bg-white p-4 sm:col-span-3 sm:border-b-0 sm:border-r">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: TEAL }}>
                  <HeartPulse className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-tight">Agatsa One</p>
                  <p className="text-[10px] text-slate-500">Doctor Portal</p>
                </div>
              </div>
              <nav className="mt-5 space-y-1 text-[12px]">
                {NAV_ITEMS.map((it, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-md px-2.5 py-1.5 ${it.active ? "bg-purple-50 text-purple-700 font-semibold" : "text-slate-600"}`}
                  >
                    <span className="flex items-center gap-2">
                      <it.Icon className="h-3.5 w-3.5" />
                      {it.label}
                    </span>
                    {it.count && (
                      <span className={`rounded-full px-1.5 text-[10px] font-bold ${it.urgent ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"}`}>
                        {it.count}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </aside>

            {/* Main */}
            <main className="col-span-12 bg-slate-50 p-5 sm:col-span-9 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Tuesday, 12 Nov · 7:42 AM</p>
                  <h4 className="mt-0.5 text-lg font-bold tracking-tight">Good morning, Dr. Mehta</h4>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                  <Search className="h-3.5 w-3.5" /> Search patient…
                </div>
              </div>

              {/* Nera briefing */}
              <div className="mt-4 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Nera AI · Morning Briefing</p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-700">
                  I reviewed <strong>20 ECGs</strong> overnight. <strong className="text-emerald-600">17 stable</strong>,
                  <strong className="text-amber-600"> 2 borderline</strong>, <strong className="text-red-600">1 needs urgent review</strong>.
                  Estimated triage time: <strong>6 minutes</strong>.
                </p>
              </div>

              {/* KPIs */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {KPIS.map((k, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{k.label}</p>
                    <p className={`mt-1 text-2xl font-bold tracking-tight ${k.color}`}>{k.value}</p>
                    <p className="text-[10px] text-slate-500">{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Scrollable triage queue */}
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
                  <p className="text-[12px] font-semibold tracking-tight">Today's Triage Queue</p>
                  <p className="text-[10px] text-slate-500">Sorted by Nera priority</p>
                </div>
                <div className="max-h-[180px] divide-y divide-slate-100 overflow-y-auto text-[12px]">
                  {QUEUE.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <span className={`h-2 w-2 flex-shrink-0 rounded-full ${p.dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {p.name} <span className="font-normal text-slate-400">· {p.age}</span>
                        </p>
                        <p className="truncate text-[11px] text-slate-500">{p.note}</p>
                      </div>
                      <span
                        className={`hidden rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider sm:inline-block ${
                          p.color === "red" ? "bg-red-100 text-red-700" : p.color === "amber" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {p.tag}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Features grid + Earnings rail */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Features (scrollable on mobile, 2-col on lg) */}
          <div className="lg:col-span-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              What's inside HeartGuard
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${TEAL}15`, color: TEAL }}
                  >
                    <f.Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-slate-900">{f.title}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings card */}
          <aside className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              New earning stream
            </p>
            <div
              className="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${TEAL} 0%, #0F766E 100%)` }}
            >
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <p className="text-[11px] font-bold uppercase tracking-wider">Monthly earning potential</p>
              </div>
              <p className="mt-4 flex items-baseline gap-1 text-4xl font-bold tracking-tight">
                <IndianRupee className="h-6 w-6" /> 30,000
                <span className="text-sm font-normal text-white/80">/month</span>
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-white/90">
                At just 10 enrolled patients × ₹3,000/month each. Scale at your own pace.
              </p>

              <div className="mt-5 space-y-2 border-t border-white/20 pt-4 text-[12px]">
                {[
                  { label: "5 patients", value: "₹15,000/mo" },
                  { label: "10 patients", value: "₹30,000/mo" },
                  { label: "25 patients", value: "₹75,000/mo" },
                  { label: "50 patients", value: "₹1,50,000/mo" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-white/80">{r.label}</span>
                    <span className="font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-[11px]">
                <TrendingUp className="h-3.5 w-3.5" />
                First 100 doctors: <strong>1 year free portal</strong> (₹12,000 value)
              </div>
            </div>

            <Link
              to="/heartguard"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore HeartGuard for Doctors
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
