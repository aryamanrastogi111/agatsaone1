// src/pages/admin/Team.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Users, Shield, Search, X, ToggleLeft, ToggleRight } from "lucide-react";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

const ROLES = ["admin", "operations", "sales", "support", "inventory_manager", "finance_viewer", "marketing_viewer"];

const ROLE_COLORS: Record<string, string> = {
  admin:             "bg-red-500/20 text-red-400",
  operations:        "bg-blue-500/20 text-blue-400",
  sales:             "bg-green-500/20 text-green-400",
  support:           "bg-yellow-500/20 text-yellow-400",
  inventory_manager: "bg-purple-500/20 text-purple-400",
  finance_viewer:    "bg-cyan-500/20 text-cyan-400",
  marketing_viewer:  "bg-pink-500/20 text-pink-400",
};

const ROLE_ACCESS: Record<string, string[]> = {
  admin:             ["All modules — full access"],
  operations:        ["Orders", "Shipping", "Returns", "Inventory"],
  sales:             ["Leads", "Customers", "Coupons", "Analytics (read)"],
  support:           ["Tickets", "Customers", "Orders (read)", "Returns"],
  inventory_manager: ["Inventory", "Products (read)", "Shipping"],
  finance_viewer:    ["Analytics", "Orders (read)", "Coupons (read)"],
  marketing_viewer:  ["Analytics (read)", "Coupons", "Leads (read)"],
};

const DEPARTMENTS = ["Engineering", "Operations", "Sales", "Support", "Marketing", "Finance", "Management", "Other"];

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "operations", department: DEPARTMENTS[0] });

  const fetchMembers = async () => {
    const { data } = await supabase.from("team_members").select("*").order("created_at", { ascending: false });
    if (data) setMembers(data);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const saveForm = async () => {
    await supabase.from("team_members").insert({ ...form });
    setFormOpen(false);
    setForm({ name: "", email: "", role: "operations", department: DEPARTMENTS[0] });
    fetchMembers();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("team_members").update({ is_active: !current }).eq("id", id);
    fetchMembers();
    if (selected?.id === id) setSelected(s => s ? { ...s, is_active: !current } : null);
  };

  const updateRole = async (id: string, role: string) => {
    await supabase.from("team_members").update({ role }).eq("id", id);
    fetchMembers();
    if (selected?.id === id) setSelected(s => s ? { ...s, role } : null);
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = members.filter(m => m.is_active).length;
  const roleCount = new Set(members.map(m => m.role)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Team & Access</h2>
          <p className="text-sm text-gray-400">Manage internal team members and role-based access</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
          <Plus size={14} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Users size={22} className="text-blue-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Total Members</p><p className="text-2xl font-bold text-white">{members.length}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Users size={22} className="text-green-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Active</p><p className="text-2xl font-bold text-white">{activeCount}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Shield size={22} className="text-purple-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Roles in Use</p><p className="text-2xl font-bold text-white">{roleCount}</p></div>
        </div>
      </div>

      {/* Role access reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Role Access Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Object.entries(ROLE_ACCESS).map(([role, access]) => (
            <div key={role} className="bg-gray-800/50 rounded-lg p-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role] ?? ""}`}>
                {role.replace(/_/g, " ")}
              </span>
              <ul className="mt-2 space-y-0.5">
                {access.map(a => <li key={a} className="text-xs text-gray-400">• {a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search team members…"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Member</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-left px-5 py-3">Department</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-500">No team members yet</td></tr>
                )}
                {filtered.map(m => (
                  <tr key={m.id} onClick={() => setSelected(m)}
                    className={`cursor-pointer hover:bg-gray-800/40 transition-colors ${selected?.id === m.id ? "bg-gray-800/60" : ""}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-semibold shrink-0">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[m.role] ?? "bg-gray-500/20 text-gray-400"}`}>
                        {m.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{m.department ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={e => { e.stopPropagation(); toggleActive(m.id, m.is_active); }}
                        className={`text-xs px-2 py-0.5 rounded-full transition-colors ${m.is_active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        {m.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{format(new Date(m.created_at), "MMM d, yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full lg:w-72 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Member Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xl font-bold">
                {selected.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{selected.name}</p>
                <p className="text-xs text-gray-400">{selected.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div><p className="text-gray-400">Department</p><p className="text-white">{selected.department ?? "—"}</p></div>
              <div><p className="text-gray-400">Added</p><p className="text-white">{format(new Date(selected.created_at), "MMM d, yyyy")}</p></div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Change Role</p>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map(r => (
                  <button key={r} onClick={() => updateRole(selected.id, r)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors
                      ${selected.role === r ? ROLE_COLORS[r] : "bg-gray-800 text-gray-400 hover:text-white"}`}>
                    {r.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => toggleActive(selected.id, selected.is_active)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors
                ${selected.is_active ? "bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400" : "bg-green-500/20 hover:bg-green-500/30 text-green-400"}`}>
              {selected.is_active ? <><ToggleLeft size={14} /> Deactivate</> : <><ToggleRight size={14} /> Activate</>}
            </button>
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add Team Member</h3>
              <button onClick={() => setFormOpen(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
            </div>
            {[
              { label: "Full Name *", key: "name", type: "text" },
              { label: "Email Address *", key: "email", type: "email" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-400 block mb-1">Role</label>
              <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
              </select>
              {form.role && (
                <p className="text-xs text-gray-500 mt-1">Access: {ROLE_ACCESS[form.role]?.join(", ")}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Department</label>
              <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={saveForm} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium">Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
