// src/pages/admin/Tickets.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Search, Ticket, AlertCircle, Clock, CheckCircle, X } from "lucide-react";
import { format } from "date-fns";

interface SupportTicket {
  id: string;
  customer_name: string;
  customer_email: string;
  type: string;
  priority: string;
  status: string;
  order_number: string;
  subject: string;
  issue_summary: string;
  internal_notes: string;
  resolution_notes: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-red-500/20 text-red-400",
  in_progress: "bg-yellow-500/20 text-yellow-400",
  resolved:    "bg-green-500/20 text-green-400",
  closed:      "bg-gray-500/20 text-gray-400",
};

const PRIORITY_COLORS: Record<string, string> = {
  low:    "bg-gray-500/20 text-gray-400",
  medium: "bg-blue-500/20 text-blue-400",
  high:   "bg-orange-500/20 text-orange-400",
  urgent: "bg-red-600/30 text-red-300",
};

const TICKET_TYPES = ["Product Issue", "Shipping", "Billing", "App Support", "Returns", "Device Setup", "Feature Request", "Other"];

export default function Tickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [notes, setNotes] = useState({ internal: "", resolution: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", customer_email: "", order_number: "",
    type: TICKET_TYPES[0], priority: "medium", subject: "", issue_summary: "",
  });

  const fetchData = async () => {
    const { data } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const selectTicket = (t: SupportTicket) => {
    setSelected(t);
    setNotes({ internal: t.internal_notes ?? "", resolution: t.resolution_notes ?? "" });
  };

  const updateTicket = async (id: string, patch: Partial<SupportTicket>) => {
    await supabase.from("support_tickets").update(patch).eq("id", id);
    fetchData();
    if (selected?.id === id) setSelected(s => s ? { ...s, ...patch } : null);
  };

  const saveNotes = async () => {
    if (!selected) return;
    await updateTicket(selected.id, { internal_notes: notes.internal, resolution_notes: notes.resolution });
  };

  const createTicket = async () => {
    await supabase.from("support_tickets").insert({ ...form });
    setFormOpen(false);
    setForm({ customer_name: "", customer_email: "", order_number: "", type: TICKET_TYPES[0], priority: "medium", subject: "", issue_summary: "" });
    fetchData();
  };

  const filtered = tickets.filter(t => {
    const matchSearch =
      (t.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const openCount = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;
  const urgentCount = tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Support Tickets</h2>
          <p className="text-sm text-gray-400">Internal customer support queue</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
          <Plus size={14} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Ticket size={22} className="text-red-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Open</p><p className="text-2xl font-bold text-white">{openCount}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Clock size={22} className="text-yellow-400 shrink-0" />
          <div><p className="text-sm text-gray-400">In Progress</p><p className="text-2xl font-bold text-white">{inProgressCount}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <AlertCircle size={22} className="text-orange-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Urgent</p><p className="text-2xl font-bold text-white">{urgentCount}</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="all">All Status</option>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
              <option value="all">All Priority</option>
              {["low", "medium", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Subject</th>
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Priority</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading && <tr><td colSpan={6} className="text-center py-12 text-gray-500">Loading…</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-500">No tickets found</td></tr>}
                {filtered.map(t => (
                  <tr key={t.id} onClick={() => selectTicket(t)}
                    className={`cursor-pointer hover:bg-gray-800/40 transition-colors ${selected?.id === t.id ? "bg-gray-800/60" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-white max-w-[200px] truncate">{t.subject}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white text-xs">{t.customer_name ?? "—"}</p>
                      <p className="text-gray-400 text-xs">{t.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{t.type ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[t.priority] ?? ""}`}>{t.priority}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[t.status] ?? ""}`}>{t.status.replace("_", " ")}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{format(new Date(t.created_at), "MMM d, HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full lg:w-96 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Ticket Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
            </div>
            <div>
              <p className="text-white font-medium">{selected.subject}</p>
              {selected.issue_summary && <p className="text-gray-400 text-xs mt-1">{selected.issue_summary}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Customer", val: selected.customer_name },
                { label: "Email", val: selected.customer_email },
                { label: "Type", val: selected.type },
                { label: "Order", val: selected.order_number },
              ].filter(f => f.val).map(f => (
                <div key={f.label}>
                  <p className="text-gray-400">{f.label}</p>
                  <p className="text-white">{f.val}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Status</p>
              <div className="flex gap-1.5 flex-wrap">
                {Object.keys(STATUS_COLORS).map(s => (
                  <button key={s} onClick={() => updateTicket(selected.id, { status: s } as any)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors
                      ${selected.status === s ? STATUS_COLORS[s] : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Internal Notes</label>
                <textarea value={notes.internal} onChange={e => setNotes(n => ({ ...n, internal: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Resolution Notes</label>
                <textarea value={notes.resolution} onChange={e => setNotes(n => ({ ...n, resolution: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-blue-500" />
              </div>
              <button onClick={saveNotes} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                Save Notes
              </button>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg p-6 space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Create Ticket</h3>
              <button onClick={() => setFormOpen(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 block mb-1">Customer Name</label>
                <input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-400 block mb-1">Customer Email</label>
                <input type="email" value={form.customer_email} onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-400 block mb-1">Order Number</label>
                <input value={form.order_number} onChange={e => setForm(p => ({ ...p, order_number: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
              <div><label className="text-xs text-gray-400 block mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select></div>
              <div><label className="text-xs text-gray-400 block mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                  {["low", "medium", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                </select></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 block mb-1">Subject *</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" /></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 block mb-1">Issue Summary</label>
                <textarea value={form.issue_summary} onChange={e => setForm(p => ({ ...p, issue_summary: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none focus:outline-none focus:border-blue-500" /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={createTicket} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
