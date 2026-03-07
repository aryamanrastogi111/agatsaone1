// src/pages/admin/Subscriptions.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, RefreshCw, Search, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Plan {
  id: string;
  name: string;
  code: string;
  billing_frequency: string;
  price: number;
  is_active: boolean;
  trial_days: number;
  included_services: string[];
}

interface Subscription {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: string;
  payment_status: string;
  renewal_date: string;
  start_date: string;
  notes: string;
  plan_id: string;
  subscription_plans?: { name: string; code: string };
}

const STATUS_COLORS: Record<string, string> = {
  active:    "bg-green-500/20 text-green-400",
  trial:     "bg-blue-500/20 text-blue-400",
  paused:    "bg-yellow-500/20 text-yellow-400",
  cancelled: "bg-red-500/20 text-red-400",
  expired:   "bg-gray-500/20 text-gray-400",
  paid:      "bg-green-500/20 text-green-400",
  unpaid:    "bg-red-500/20 text-red-400",
  pending:   "bg-yellow-500/20 text-yellow-400",
};

export default function Subscriptions() {
  const [tab, setTab] = useState<"subs" | "plans">("subs");
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planForm, setPlanForm] = useState({ open: false, name: "", code: "", billing_frequency: "monthly", price: 0, trial_days: 0, included_services: "" });
  const [subForm, setSubForm] = useState({ open: false, customer_name: "", customer_email: "", customer_phone: "", plan_id: "", status: "active", payment_status: "paid", renewal_date: "", notes: "" });

  const fetchData = async () => {
    const [subsRes, plansRes] = await Promise.all([
      supabase.from("subscriptions").select("*, subscription_plans(name, code)").order("created_at", { ascending: false }),
      supabase.from("subscription_plans").select("*").order("created_at", { ascending: false }),
    ]);
    if (subsRes.data) setSubs(subsRes.data);
    if (plansRes.data) setPlans(plansRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const savePlan = async () => {
    await supabase.from("subscription_plans").insert({
      name: planForm.name,
      code: planForm.code.toLowerCase().replace(/\s+/g, "-"),
      billing_frequency: planForm.billing_frequency,
      price: planForm.price,
      trial_days: planForm.trial_days,
      included_services: planForm.included_services.split(",").map(s => s.trim()).filter(Boolean),
    });
    setPlanForm(f => ({ ...f, open: false }));
    fetchData();
  };

  const saveSub = async () => {
    await supabase.from("subscriptions").insert({
      customer_name: subForm.customer_name,
      customer_email: subForm.customer_email,
      customer_phone: subForm.customer_phone,
      plan_id: subForm.plan_id || null,
      status: subForm.status,
      payment_status: subForm.payment_status,
      renewal_date: subForm.renewal_date || null,
      notes: subForm.notes,
      start_date: new Date().toISOString().split("T")[0],
    });
    setSubForm(f => ({ ...f, open: false }));
    fetchData();
  };

  const filteredSubs = subs.filter(s =>
    (s.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.customer_email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = subs.filter(s => s.status === "active").length;
  const trialCount = subs.filter(s => s.status === "trial").length;
  const expiredCount = subs.filter(s => ["cancelled", "expired"].includes(s.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Subscriptions</h2>
          <p className="text-sm text-gray-400">Manage plans and subscriber accounts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPlanForm(f => ({ ...f, open: true }))}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
            <Plus size={14} /> New Plan
          </button>
          <button onClick={() => setSubForm(f => ({ ...f, open: true }))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
            <Plus size={14} /> Add Subscriber
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle size={24} className="text-green-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Active</p><p className="text-2xl font-bold text-white">{activeCount}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Clock size={24} className="text-blue-400 shrink-0" />
          <div><p className="text-sm text-gray-400">On Trial</p><p className="text-2xl font-bold text-white">{trialCount}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <XCircle size={24} className="text-red-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Cancelled / Expired</p><p className="text-2xl font-bold text-white">{expiredCount}</p></div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit">
        {(["subs", "plans"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
              ${tab === t ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
            {t === "subs" ? "Subscribers" : "Plans"}
          </button>
        ))}
      </div>

      {tab === "subs" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers…"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Plan</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Payment</th>
                  <th className="text-left px-5 py-3">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading…</td></tr>}
                {!loading && filteredSubs.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-500">No subscribers found</td></tr>}
                {filteredSubs.map(s => (
                  <tr key={s.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white">{s.customer_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{s.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300">{s.subscription_plans?.name ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] ?? ""}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s.payment_status] ?? ""}`}>{s.payment_status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {s.renewal_date ? format(new Date(s.renewal_date), "MMM d, yyyy") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "plans" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.length === 0 && !loading && (
            <div className="col-span-3 bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-500">No plans created yet. Create your first plan.</p>
            </div>
          )}
          {plans.map(p => (
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{p.code}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹{p.price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">/ {p.billing_frequency} · {p.trial_days}d trial</p>
              </div>
              {p.included_services?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.included_services.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Plan Form Modal */}
      {planForm.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Create Subscription Plan</h3>
            {[
              { label: "Plan Name", key: "name", type: "text" },
              { label: "Code (unique identifier)", key: "code", type: "text" },
              { label: "Price (₹)", key: "price", type: "number" },
              { label: "Trial Days", key: "trial_days", type: "number" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                <input type={f.type} value={(planForm as any)[f.key]}
                  onChange={e => setPlanForm(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Billing Frequency</label>
              <select value={planForm.billing_frequency} onChange={e => setPlanForm(p => ({ ...p, billing_frequency: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                {["monthly", "quarterly", "half-yearly", "yearly", "one-time"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Included Services (comma-separated)</label>
              <input value={planForm.included_services} onChange={e => setPlanForm(p => ({ ...p, included_services: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPlanForm(f => ({ ...f, open: false }))} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={savePlan} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Save Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Form Modal */}
      {subForm.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Add Subscriber</h3>
            {[
              { label: "Customer Name", key: "customer_name", type: "text" },
              { label: "Email", key: "customer_email", type: "email" },
              { label: "Phone", key: "customer_phone", type: "tel" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                <input type={f.type} value={(subForm as any)[f.key]}
                  onChange={e => setSubForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Plan</label>
              <select value={subForm.plan_id} onChange={e => setSubForm(f => ({ ...f, plan_id: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                <option value="">— No plan —</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Status</label>
                <select value={subForm.status} onChange={e => setSubForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  {["active", "trial", "paused", "cancelled", "expired"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Payment Status</label>
                <select value={subForm.payment_status} onChange={e => setSubForm(f => ({ ...f, payment_status: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  {["paid", "unpaid", "pending"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Renewal Date</label>
              <input type="date" value={subForm.renewal_date} onChange={e => setSubForm(f => ({ ...f, renewal_date: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSubForm(f => ({ ...f, open: false }))} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={saveSub} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
