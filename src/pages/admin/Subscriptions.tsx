// src/pages/admin/Subscriptions.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, RefreshCw, Search, CheckCircle, XCircle, Clock, X } from "lucide-react";
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
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  payment_status: string;
  renewal_date: string | null;
  start_date: string | null;
  notes: string | null;
  plan_id: string | null;
  subscription_plans?: { name: string; code: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  active:    "bg-green-100 text-green-700",
  trial:     "bg-blue-100 text-blue-700",
  paused:    "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  expired:   "bg-gray-100 text-gray-600",
  paid:      "bg-green-100 text-green-700",
  unpaid:    "bg-red-100 text-red-700",
  pending:   "bg-yellow-100 text-yellow-700",
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
    if (subsRes.data) setSubs(subsRes.data as Subscription[]);
    if (plansRes.data) setPlans(plansRes.data as Plan[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const savePlan = async () => {
    if (!planForm.name.trim() || !planForm.code.trim()) return;
    await supabase.from("subscription_plans").insert({
      name: planForm.name,
      code: planForm.code.toLowerCase().replace(/\s+/g, "-"),
      billing_frequency: planForm.billing_frequency,
      price: planForm.price,
      trial_days: planForm.trial_days,
      included_services: planForm.included_services.split(",").map(s => s.trim()).filter(Boolean),
    });
    setPlanForm(f => ({ ...f, open: false, name: "", code: "" }));
    fetchData();
  };

  const saveSub = async () => {
    if (!subForm.customer_name.trim()) return;
    await supabase.from("subscriptions").insert({
      customer_name: subForm.customer_name,
      customer_email: subForm.customer_email || null,
      customer_phone: subForm.customer_phone || null,
      plan_id: subForm.plan_id || null,
      status: subForm.status,
      payment_status: subForm.payment_status,
      renewal_date: subForm.renewal_date || null,
      notes: subForm.notes || null,
      start_date: new Date().toISOString().split("T")[0],
    });
    setSubForm(f => ({ ...f, open: false, customer_name: "", customer_email: "", customer_phone: "" }));
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
          <h2 className="text-xl font-bold text-gray-900">Subscriptions</h2>
          <p className="text-sm text-gray-500">Manage plans and subscriber accounts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPlanForm(f => ({ ...f, open: true }))}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-300 transition-colors shadow-sm">
            <Plus size={14} /> New Plan
          </button>
          <button onClick={() => setSubForm(f => ({ ...f, open: true }))}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors shadow-sm">
            <Plus size={14} /> Add Subscriber
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <CheckCircle size={24} className="text-green-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-gray-900">{activeCount}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Clock size={24} className="text-blue-500 shrink-0" />
          <div><p className="text-sm text-gray-500">On Trial</p><p className="text-2xl font-bold text-gray-900">{trialCount}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <XCircle size={24} className="text-red-400 shrink-0" />
          <div><p className="text-sm text-gray-500">Cancelled / Expired</p><p className="text-2xl font-bold text-gray-900">{expiredCount}</p></div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 border border-gray-200 rounded-lg p-1 w-fit">
        {(["subs", "plans"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
              ${tab === t ? "bg-white text-gray-900 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "subs" ? "Subscribers" : "Plans"}
          </button>
        ))}
      </div>

      {tab === "subs" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers…"
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 bg-gray-50 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Plan</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Payment</th>
                  <th className="text-left px-5 py-3 font-medium">Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>}
                {!loading && filteredSubs.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No subscribers found</td></tr>
                )}
                {filteredSubs.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{s.customer_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{s.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{s.subscription_plans?.name ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.status] ?? "bg-gray-100 text-gray-600"}`}>{s.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.payment_status] ?? "bg-gray-100 text-gray-600"}`}>{s.payment_status}</span>
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
            <div className="col-span-3 bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <RefreshCw size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No plans created yet. Create your first plan.</p>
            </div>
          )}
          {plans.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{p.code}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">₹{p.price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">/ {p.billing_frequency} · {p.trial_days}d trial</p>
              </div>
              {p.included_services?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.included_services.map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Plan Form Modal */}
      {planForm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create Subscription Plan</h3>
              <button onClick={() => setPlanForm(f => ({ ...f, open: false }))} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            {[
              { label: "Plan Name", key: "name", type: "text" },
              { label: "Code (unique identifier)", key: "code", type: "text" },
              { label: "Price (₹)", key: "price", type: "number" },
              { label: "Trial Days", key: "trial_days", type: "number" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label>
                <input type={f.type} value={(planForm as any)[f.key]}
                  onChange={e => setPlanForm(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Billing Frequency</label>
              <select value={planForm.billing_frequency} onChange={e => setPlanForm(p => ({ ...p, billing_frequency: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm">
                {["monthly", "quarterly", "half-yearly", "yearly", "one-time"].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Included Services (comma-separated)</label>
              <input value={planForm.included_services} onChange={e => setPlanForm(p => ({ ...p, included_services: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPlanForm(f => ({ ...f, open: false }))} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={savePlan} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Save Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Form Modal */}
      {subForm.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add Subscriber</h3>
              <button onClick={() => setSubForm(f => ({ ...f, open: false }))} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            {[
              { label: "Customer Name *", key: "customer_name", type: "text" },
              { label: "Email", key: "customer_email", type: "email" },
              { label: "Phone", key: "customer_phone", type: "tel" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label>
                <input type={f.type} value={(subForm as any)[f.key]}
                  onChange={e => setSubForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Plan</label>
              <select value={subForm.plan_id} onChange={e => setSubForm(f => ({ ...f, plan_id: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm">
                <option value="">— No plan —</option>
                {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Status</label>
                <select value={subForm.status} onChange={e => setSubForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm">
                  {["active", "trial", "paused", "cancelled", "expired"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Payment Status</label>
                <select value={subForm.payment_status} onChange={e => setSubForm(f => ({ ...f, payment_status: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm">
                  {["paid", "unpaid", "pending"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Renewal Date</label>
              <input type="date" value={subForm.renewal_date} onChange={e => setSubForm(f => ({ ...f, renewal_date: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setSubForm(f => ({ ...f, open: false }))} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={saveSub} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
