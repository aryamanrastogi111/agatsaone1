// src/pages/admin/Returns.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Search, RotateCcw, CheckCircle, Clock, X } from "lucide-react";
import { format } from "date-fns";

interface Return {
  id: string; order_number: string; customer_name: string; customer_email: string;
  status: string; reason: string; refund_status: string; refund_amount: number;
  inspection_notes: string; resolution_notes: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  requested:  "bg-yellow-100 text-yellow-700",
  approved:   "bg-blue-100 text-blue-700",
  rejected:   "bg-red-100 text-red-700",
  inspecting: "bg-purple-100 text-purple-700",
  refunded:   "bg-green-100 text-green-700",
  replaced:   "bg-cyan-100 text-cyan-700",
};

const RETURN_REASONS = ["Product defective", "Wrong product received", "Product not as described", "Changed mind", "Missing accessories", "Damaged in shipping", "Other"];

export default function Returns() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Return | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ order_number: "", customer_name: "", customer_email: "", reason: RETURN_REASONS[0], notes: "" });

  const fetchData = async () => {
    const { data } = await supabase.from("returns").select("*").order("created_at", { ascending: false });
    if (data) setReturns(data);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("returns").update({ status }).eq("id", id);
    fetchData();
    if (selected?.id === id) setSelected(s => s ? { ...s, status } : null);
  };

  const saveReturn = async () => {
    await supabase.from("returns").insert({
      order_number: form.order_number, customer_name: form.customer_name,
      customer_email: form.customer_email, reason: form.reason,
      inspection_notes: form.notes, status: "requested",
    });
    setFormOpen(false);
    setForm({ order_number: "", customer_name: "", customer_email: "", reason: RETURN_REASONS[0], notes: "" });
    fetchData();
  };

  const filtered = returns.filter(r => {
    const matchSearch = (r.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.order_number ?? "").toLowerCase().includes(search.toLowerCase());
    return matchSearch && (statusFilter === "all" || r.status === statusFilter);
  });

  const counts = {
    requested: returns.filter(r => r.status === "requested").length,
    approved: returns.filter(r => r.status === "approved").length,
    refunded: returns.filter(r => r.status === "refunded").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Returns & Refunds</h2>
          <p className="text-sm text-gray-500">Manage return requests and resolution workflow</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={14} /> New Return
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Clock size={22} className="text-yellow-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-gray-900">{counts.requested}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <CheckCircle size={22} className="text-blue-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Approved</p><p className="text-2xl font-bold text-gray-900">{counts.approved}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <RotateCcw size={22} className="text-green-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Refunded</p><p className="text-2xl font-bold text-gray-900">{counts.refunded}</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order or customer…"
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500">
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Reason</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No return requests found</td></tr>}
                {filtered.map(r => (
                  <tr key={r.id} onClick={() => setSelected(r)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === r.id ? "bg-blue-50/50" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{r.customer_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{r.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 font-mono text-xs">{r.order_number ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs max-w-[160px] truncate">{r.reason ?? "—"}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status] ?? ""}`}>{r.status}</span></td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full lg:w-80 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shrink-0 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Return Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X size={14} /></button>
            </div>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs text-gray-400">Customer</p><p className="text-gray-900 font-medium">{selected.customer_name}</p></div>
              <div><p className="text-xs text-gray-400">Email</p><p className="text-gray-700">{selected.customer_email}</p></div>
              <div><p className="text-xs text-gray-400">Order #</p><p className="text-gray-700 font-mono">{selected.order_number}</p></div>
              <div><p className="text-xs text-gray-400">Reason</p><p className="text-gray-700">{selected.reason}</p></div>
              {selected.inspection_notes && <div><p className="text-xs text-gray-400">Notes</p><p className="text-gray-700 text-xs">{selected.inspection_notes}</p></div>}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(STATUS_COLORS).map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors font-medium
                      ${selected.status === s ? STATUS_COLORS[s] : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Log Return Request</h3>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={16} /></button>
            </div>
            {[
              { label: "Order Number", key: "order_number" },
              { label: "Customer Name", key: "customer_name" },
              { label: "Customer Email", key: "customer_email" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Reason</label>
              <select value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500">
                {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm resize-none focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveReturn} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
