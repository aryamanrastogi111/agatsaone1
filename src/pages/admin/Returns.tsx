// src/pages/admin/Returns.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Search, RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Return {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  reason: string;
  refund_status: string;
  refund_amount: number;
  inspection_notes: string;
  resolution_notes: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  requested:  "bg-yellow-500/20 text-yellow-400",
  approved:   "bg-blue-500/20 text-blue-400",
  rejected:   "bg-red-500/20 text-red-400",
  inspecting: "bg-purple-500/20 text-purple-400",
  refunded:   "bg-green-500/20 text-green-400",
  replaced:   "bg-cyan-500/20 text-cyan-400",
};

const RETURN_REASONS = [
  "Product defective",
  "Wrong product received",
  "Product not as described",
  "Size/fit issue",
  "Changed mind",
  "Missing accessories",
  "Damaged in shipping",
  "Other",
];

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
      order_number: form.order_number,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      reason: form.reason,
      inspection_notes: form.notes,
      status: "requested",
    });
    setFormOpen(false);
    fetchData();
  };

  const filtered = returns.filter(r => {
    const matchSearch =
      (r.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (r.order_number ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
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
          <h2 className="text-xl font-bold text-white">Returns & Refunds</h2>
          <p className="text-sm text-gray-400">Manage return requests and resolution workflow</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
          <Plus size={14} /> New Return
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Clock size={22} className="text-yellow-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Pending</p><p className="text-2xl font-bold text-white">{counts.requested}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle size={22} className="text-blue-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Approved</p><p className="text-2xl font-bold text-white">{counts.approved}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <RotateCcw size={22} className="text-green-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Refunded</p><p className="text-2xl font-bold text-white">{counts.refunded}</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Table */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order or customer…"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="all">All Statuses</option>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Order</th>
                  <th className="text-left px-5 py-3">Reason</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">No return requests found</td></tr>
                )}
                {filtered.map(r => (
                  <tr key={r.id} onClick={() => setSelected(r)}
                    className={`cursor-pointer hover:bg-gray-800/40 transition-colors ${selected?.id === r.id ? "bg-gray-800/60" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white">{r.customer_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{r.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300 font-mono text-xs">{r.order_number ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs max-w-[160px] truncate">{r.reason ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status] ?? ""}`}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-80 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Return Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs text-gray-400">Customer</p><p className="text-white">{selected.customer_name}</p></div>
              <div><p className="text-xs text-gray-400">Email</p><p className="text-gray-300">{selected.customer_email}</p></div>
              <div><p className="text-xs text-gray-400">Order</p><p className="text-gray-300 font-mono">{selected.order_number}</p></div>
              <div><p className="text-xs text-gray-400">Reason</p><p className="text-gray-300">{selected.reason}</p></div>
              {selected.inspection_notes && (
                <div><p className="text-xs text-gray-400">Notes</p><p className="text-gray-300 text-xs">{selected.inspection_notes}</p></div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(STATUS_COLORS).map(s => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors
                      ${selected.status === s ? STATUS_COLORS[s] : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Log Return Request</h3>
            {[
              { label: "Order Number", key: "order_number" },
              { label: "Customer Name", key: "customer_name" },
              { label: "Customer Email", key: "customer_email" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Return Reason</label>
              <select value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                rows={2} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={saveReturn} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
