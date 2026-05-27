// src/pages/admin/Tickets.tsx
import { useEffect, useState, useCallback } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { supabase as authClient } from "@/integrations/supabase/client";
import {
  Plus, Search, Ticket, AlertCircle, Clock, X, Send, MessageSquare, Lock, CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

interface SupportTicket {
  id: string; ticket_number?: string; customer_name: string; customer_email: string;
  customer_phone?: string; type: string; priority: string; status: string;
  category?: string; sub_issue?: string; order_number: string; subject: string;
  issue_summary: string; internal_notes: string; resolution_notes: string;
  questionnaire_answers?: Array<{ question: string; answer: string }>;
  created_at: string; updated_at: string; sla_due_at?: string;
}
interface TicketMessage {
  id: string; ticket_id: string; sender_type: "customer" | "staff" | "system";
  sender_name: string; sender_email: string; body: string;
  is_internal_note: boolean; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700", in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700", closed: "bg-gray-100 text-gray-600",
};
const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-600", medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700", urgent: "bg-red-100 text-red-700",
};
const TICKET_TYPES = ["Product Issue", "Shipping", "Billing", "App Support", "Returns", "Device Setup", "Feature Request", "Other"];

const CANNED = [
  { label: "Acknowledged", body: "Hi {name},\n\nThanks for reaching out — we've received your request and our team is looking into it. We'll get back to you within 24 hours.\n\n— Agatsa Support" },
  { label: "Ask for video", body: "Hi {name},\n\nCould you please share a short 10-15 second video showing the issue? It will help us diagnose it faster.\n\n— Agatsa Support" },
  { label: "Order processed", body: "Hi {name},\n\nYour order has been processed and will be shipped shortly. You'll receive a tracking link by email.\n\n— Agatsa Support" },
];

export default function Tickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [notes, setNotes] = useState({ internal: "", resolution: "" });
  const [reply, setReply] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sending, setSending] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ customer_name: "", customer_email: "", order_number: "", type: TICKET_TYPES[0], priority: "medium", subject: "", issue_summary: "" });

  const fetchData = useCallback(async () => {
    const { data } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  }, []);

  const fetchMessages = useCallback(async (ticketId: string) => {
    const { data } = await supabase.from("ticket_messages").select("*").eq("ticket_id", ticketId).order("created_at", { ascending: true });
    setMessages(data || []);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectTicket = (t: SupportTicket) => {
    setSelected(t);
    setNotes({ internal: t.internal_notes ?? "", resolution: t.resolution_notes ?? "" });
    setReply("");
    setIsInternalNote(false);
    fetchMessages(t.id);
  };

  const updateTicket = async (id: string, patch: Partial<SupportTicket>) => {
    await supabase.from("support_tickets").update(patch).eq("id", id);
    fetchData();
    if (selected?.id === id) setSelected(s => s ? { ...s, ...patch } : null);
  };

  const saveNotes = async () => {
    if (!selected) return;
    await updateTicket(selected.id, { internal_notes: notes.internal, resolution_notes: notes.resolution } as Partial<SupportTicket>);
  };

  const sendReply = async (markResolved = false) => {
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      const { error } = await authClient.functions.invoke("ticket-reply", {
        body: { ticket_id: selected.id, body: reply.trim(), is_internal_note: isInternalNote, mark_resolved: markResolved },
      });
      if (error) throw error;
      setReply("");
      setIsInternalNote(false);
      await fetchMessages(selected.id);
      await fetchData();
      if (markResolved) setSelected(s => s ? { ...s, status: "resolved" } : null);
    } catch (e) {
      console.error(e);
      alert("Failed to send reply. Make sure you're logged in as admin.");
    } finally { setSending(false); }
  };

  const createTicket = async () => {
    if (!form.subject.trim()) return;
    await supabase.from("support_tickets").insert({ ...form });
    setFormOpen(false);
    setForm({ customer_name: "", customer_email: "", order_number: "", type: TICKET_TYPES[0], priority: "medium", subject: "", issue_summary: "" });
    fetchData();
  };

  const filtered = tickets.filter(t => {
    const matchSearch = (t.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.customer_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (t.ticket_number ?? "").toLowerCase().includes(search.toLowerCase());
    return matchSearch && (statusFilter === "all" || t.status === statusFilter) && (priorityFilter === "all" || t.priority === priorityFilter);
  });

  const openCount = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;
  const urgentCount = tickets.filter(t => t.priority === "urgent" && t.status !== "closed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-sm text-gray-500">Internal customer support queue</p>
        </div>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
          <Plus size={14} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Ticket size={22} className="text-red-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Open</p><p className="text-2xl font-bold text-gray-900">{openCount}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Clock size={22} className="text-yellow-500 shrink-0" />
          <div><p className="text-sm text-gray-500">In Progress</p><p className="text-2xl font-bold text-gray-900">{inProgressCount}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <AlertCircle size={22} className="text-orange-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Urgent</p><p className="text-2xl font-bold text-gray-900">{urgentCount}</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…"
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">
              <option value="all">All Status</option>
              {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">
              <option value="all">All Priority</option>
              {["low", "medium", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Ticket</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Priority</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading…</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">No tickets found</td></tr>}
                {filtered.map(t => (
                  <tr key={t.id} onClick={() => selectTicket(t)} className={`cursor-pointer hover:bg-gray-50 ${selected?.id === t.id ? "bg-blue-50/50" : ""}`}>
                    <td className="px-5 py-3.5">
                      {t.ticket_number && <p className="text-[10px] text-gray-400 font-mono">{t.ticket_number}</p>}
                      <p className="font-medium text-gray-900 max-w-[220px] truncate">{t.subject}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-gray-900 text-xs font-medium">{t.customer_name ?? "—"}</p>
                      <p className="text-gray-400 text-xs">{t.customer_email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{t.category ?? t.type ?? "—"}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[t.priority] ?? ""}`}>{t.priority}</span></td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[t.status] ?? ""}`}>{t.status.replace("_", " ")}</span></td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{format(new Date(t.created_at), "MMM d, HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full lg:w-[480px] bg-white border border-gray-200 rounded-xl p-5 space-y-4 shrink-0 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                {selected.ticket_number && <p className="text-[10px] text-gray-400 font-mono">{selected.ticket_number}</p>}
                <h3 className="font-semibold text-gray-900 text-sm">{selected.subject}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X size={14} /></button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Customer", val: selected.customer_name },
                { label: "Email", val: selected.customer_email },
                { label: "Phone", val: selected.customer_phone },
                { label: "Category", val: selected.category ?? selected.type },
                { label: "Issue", val: selected.sub_issue },
                { label: "Order #", val: selected.order_number },
              ].filter(f => f.val).map(f => (
                <div key={f.label}>
                  <p className="text-gray-400">{f.label}</p>
                  <p className="text-gray-900 font-medium break-words">{f.val}</p>
                </div>
              ))}
            </div>

            {selected.questionnaire_answers && selected.questionnaire_answers.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                <p className="font-semibold text-amber-900 mb-1.5">Self-help steps tried:</p>
                <ul className="space-y-1">
                  {selected.questionnaire_answers.map((q, i) => (
                    <li key={i} className="text-amber-900"><strong>{q.answer.toUpperCase()}:</strong> {q.question}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-1.5 font-medium">Status</p>
              <div className="flex gap-1.5 flex-wrap">
                {Object.keys(STATUS_COLORS).map(s => (
                  <button key={s} onClick={() => updateTicket(selected.id, { status: s } as Partial<SupportTicket>)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${selected.status === s ? STATUS_COLORS[s] : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation thread */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1.5">
                <MessageSquare size={12} /> Conversation ({messages.length})
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {messages.length === 0 && <p className="text-xs text-gray-400 italic">Original issue: {selected.issue_summary}</p>}
                {messages.map(m => (
                  <div key={m.id} className={`p-3 rounded-lg text-xs ${
                    m.is_internal_note ? "bg-yellow-50 border border-yellow-200" :
                    m.sender_type === "staff" ? "bg-blue-50 border border-blue-100" :
                    "bg-gray-50 border border-gray-100"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 flex items-center gap-1">
                        {m.is_internal_note && <Lock size={10} className="text-yellow-700" />}
                        {m.sender_type === "staff" ? `Staff · ${m.sender_name || "—"}` : m.sender_name || "Customer"}
                      </span>
                      <span className="text-gray-400">{format(new Date(m.created_at), "MMM d, HH:mm")}</span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply composer */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">Reply</p>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={isInternalNote} onChange={e => setIsInternalNote(e.target.checked)} className="rounded" />
                  Internal note (not emailed)
                </label>
              </div>
              <div className="flex gap-1 flex-wrap">
                {CANNED.map(c => (
                  <button key={c.label} onClick={() => setReply(c.body.replace("{name}", selected.customer_name || "there"))}
                    className="text-[10px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700">
                    {c.label}
                  </button>
                ))}
              </div>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={4}
                placeholder={isInternalNote ? "Internal note for your team…" : "Type your reply — this will be emailed to the customer…"}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm resize-none focus:outline-none focus:border-blue-500" />
              <div className="flex gap-2">
                <button onClick={() => sendReply(false)} disabled={sending || !reply.trim()}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5">
                  <Send size={12} /> {sending ? "Sending…" : isInternalNote ? "Save note" : "Send reply"}
                </button>
                {!isInternalNote && (
                  <button onClick={() => sendReply(true)} disabled={sending || !reply.trim()}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> Resolve
                  </button>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Internal Notes (summary)</label>
                <textarea value={notes.internal} onChange={e => setNotes(n => ({ ...n, internal: e.target.value }))}
                  rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Resolution Notes</label>
                <textarea value={notes.resolution} onChange={e => setNotes(n => ({ ...n, resolution: e.target.value }))}
                  rows={2} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm resize-none" />
              </div>
              <button onClick={saveNotes} className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium">Save Notes</button>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-lg p-6 space-y-4 overflow-y-auto max-h-[90vh] shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create Ticket</h3>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Customer Name", key: "customer_name", type: "text" },
                { label: "Customer Email", key: "customer_email", type: "email" },
                { label: "Order Number", key: "order_number", type: "text" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label>
                  <input type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Type</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">
                  {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">
                  {["low", "medium", "high", "urgent"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1 font-medium">Subject *</label>
                <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1 font-medium">Issue Summary</label>
                <textarea value={form.issue_summary} onChange={e => setForm(p => ({ ...p, issue_summary: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm resize-none" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={createTicket} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
