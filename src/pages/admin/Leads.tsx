// src/pages/admin/Leads.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Search, X } from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  interest_category: string;
  stage: string;
  notes: string;
  follow_up_date: string;
  created_at: string;
}

const STAGES = ["new", "contacted", "demo_scheduled", "proposal_sent", "negotiating", "won", "lost"] as const;

const STAGE_COLORS: Record<string, string> = {
  new:            "bg-gray-100 text-gray-600",
  contacted:      "bg-blue-100 text-blue-700",
  demo_scheduled: "bg-purple-100 text-purple-700",
  proposal_sent:  "bg-yellow-100 text-yellow-700",
  negotiating:    "bg-orange-100 text-orange-700",
  won:            "bg-green-100 text-green-700",
  lost:           "bg-red-100 text-red-700",
};

const STAGE_LABELS: Record<string, string> = {
  new: "New", contacted: "Contacted", demo_scheduled: "Demo", proposal_sent: "Proposal",
  negotiating: "Negotiating", won: "Won", lost: "Lost",
};

const SOURCES = ["Website", "WhatsApp", "LinkedIn", "Conference", "Referral", "Doctor", "Distributor", "Campaign", "Cold Call", "Other"];
const CATEGORIES = ["SanketLife", "ZLU", "CoreBalance", "EasyTouch Rhythm", "EasyTouch Plus", "SDK / API", "Distribution", "Partnership", "Other"];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", phone: "", email: "",
    source: SOURCES[0], interest_category: CATEGORIES[0],
    stage: "new", notes: "", follow_up_date: "",
  });

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const saveLead = async () => {
    if (!form.name.trim()) return;
    await supabase.from("leads").insert({
      name: form.name, company: form.company, phone: form.phone, email: form.email,
      source: form.source, interest_category: form.interest_category,
      stage: form.stage, notes: form.notes,
      follow_up_date: form.follow_up_date || null,
    });
    setFormOpen(false);
    setForm({ name: "", company: "", phone: "", email: "", source: SOURCES[0], interest_category: CATEGORIES[0], stage: "new", notes: "", follow_up_date: "" });
    fetchLeads();
  };

  const updateStage = async (id: string, stage: string) => {
    await supabase.from("leads").update({ stage }).eq("id", id);
    fetchLeads();
    if (selected?.id === id) setSelected(s => s ? { ...s, stage } : null);
  };

  const filtered = leads.filter(l => {
    const matchSearch = (l.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.company ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || l.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-sm text-gray-500">CRM pipeline for doctors, distributors, and partners</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors font-medium">
          <Plus size={14} /> Add Lead
        </button>
      </div>

      {/* Pipeline bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-medium">Pipeline Overview</p>
        <div className="flex gap-2 flex-wrap">
          {STAGES.map(stage => {
            const count = leads.filter(l => l.stage === stage).length;
            return (
              <button key={stage} onClick={() => setStageFilter(stageFilter === stage ? "all" : stage)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border font-medium
                  ${stageFilter === stage ? "border-blue-300 " + STAGE_COLORS[stage] : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"}`}>
                <span>{STAGE_LABELS[stage]}</span>
                <span className="font-bold">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Lead</th>
                  <th className="text-left px-5 py-3 font-medium">Source</th>
                  <th className="text-left px-5 py-3 font-medium">Interest</th>
                  <th className="text-left px-5 py-3 font-medium">Stage</th>
                  <th className="text-left px-5 py-3 font-medium">Follow Up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No leads found</td></tr>}
                {filtered.map(lead => (
                  <tr key={lead.id} onClick={() => setSelected(lead)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === lead.id ? "bg-blue-50/50" : ""}`}>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.company ?? lead.email ?? ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{lead.source ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{lead.interest_category ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STAGE_COLORS[lead.stage] ?? ""}`}>
                        {STAGE_LABELS[lead.stage]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {lead.follow_up_date ? format(new Date(lead.follow_up_date), "MMM d, yyyy") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full lg:w-80 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shrink-0 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Lead Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X size={16} /></button>
            </div>
            <div className="space-y-2.5 text-sm">
              {[
                { label: "Name", val: selected.name },
                { label: "Company", val: selected.company },
                { label: "Email", val: selected.email },
                { label: "Phone", val: selected.phone },
                { label: "Source", val: selected.source },
                { label: "Interest", val: selected.interest_category },
                { label: "Notes", val: selected.notes },
              ].filter(f => f.val).map(f => (
                <div key={f.label}>
                  <p className="text-xs text-gray-400">{f.label}</p>
                  <p className="text-gray-900 text-sm">{f.val}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">Move Stage</p>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map(s => (
                  <button key={s} onClick={() => updateStage(selected.id, s)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors font-medium
                      ${selected.stage === s ? STAGE_COLORS[s] : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {STAGE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-lg p-6 space-y-4 overflow-y-auto max-h-[90vh] shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Name *", key: "name" }, { label: "Company", key: "company" },
                { label: "Phone", key: "phone" }, { label: "Email", key: "email" },
              ].map(f => (
                <div key={f.key} className={f.key === "name" ? "col-span-2" : ""}>
                  <label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Source</label>
                <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500">
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Interest</label>
                <select value={form.interest_category} onChange={e => setForm(p => ({ ...p, interest_category: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Stage</label>
                <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500">
                  {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1 font-medium">Follow Up Date</label>
                <input type="date" value={form.follow_up_date} onChange={e => setForm(p => ({ ...p, follow_up_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1 font-medium">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm resize-none focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveLead} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Save Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
