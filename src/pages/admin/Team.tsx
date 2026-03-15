// src/pages/admin/Team.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Users, Shield, Search, X, ToggleLeft, ToggleRight } from "lucide-react";
import { format } from "date-fns";

interface TeamMember { id: string; name: string; email: string; role: string; department: string; is_active: boolean; created_at: string; }

const ROLES = ["admin","operations","sales","support","inventory_manager","finance_viewer","marketing_viewer"];
const ROLE_COLORS: Record<string,string> = { admin:"bg-red-100 text-red-700", operations:"bg-blue-100 text-blue-700", sales:"bg-green-100 text-green-700", support:"bg-yellow-100 text-yellow-700", inventory_manager:"bg-purple-100 text-purple-700", finance_viewer:"bg-cyan-100 text-cyan-700", marketing_viewer:"bg-pink-100 text-pink-700" };
const DEPARTMENTS = ["Engineering","Operations","Sales","Support","Marketing","Finance","Management","Other"];

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", role:"operations", department:DEPARTMENTS[0] });

  const fetchMembers = async () => {
    const { data } = await supabase.from("team_members").select("*").order("created_at", { ascending: false });
    if (data) setMembers(data);
    setLoading(false);
  };
  useEffect(() => { fetchMembers(); }, []);

  const saveForm = async () => {
    if (!form.name || !form.email) return;
    await supabase.from("team_members").insert({ ...form });
    setFormOpen(false); setForm({ name:"", email:"", role:"operations", department:DEPARTMENTS[0] }); fetchMembers();
  };
  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("team_members").update({ is_active: !current }).eq("id", id);
    fetchMembers(); if (selected?.id === id) setSelected(s => s ? {...s, is_active:!current} : null);
  };
  const updateRole = async (id: string, role: string) => {
    await supabase.from("team_members").update({ role }).eq("id", id);
    fetchMembers(); if (selected?.id === id) setSelected(s => s ? {...s, role} : null);
  };

  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-900">Team & Access</h2><p className="text-sm text-gray-500">Manage team members and roles</p></div>
        <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"><Plus size={14} /> Add Member</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{icon:Users,color:"text-blue-500",label:"Total Members",val:members.length},{icon:Users,color:"text-green-500",label:"Active",val:members.filter(m=>m.is_active).length},{icon:Shield,color:"text-purple-500",label:"Roles in Use",val:new Set(members.map(m=>m.role)).size}].map(s=>(
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm"><s.icon size={22} className={s.color+" shrink-0"}/><div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold text-gray-900">{s.val}</p></div></div>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search team…" className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"/>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50"><th className="text-left px-5 py-3 font-medium">Member</th><th className="text-left px-5 py-3 font-medium">Role</th><th className="text-left px-5 py-3 font-medium">Dept</th><th className="text-left px-5 py-3 font-medium">Status</th><th className="text-left px-5 py-3 font-medium">Added</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {loading && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">No team members yet</td></tr>}
                {filtered.map(m=>(
                  <tr key={m.id} onClick={()=>setSelected(m)} className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id===m.id?"bg-blue-50/50":""}`}>
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">{m.name.charAt(0).toUpperCase()}</div><div><p className="font-medium text-gray-900">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div></div></td>
                    <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[m.role]??"bg-gray-100 text-gray-600"}`}>{m.role.replace(/_/g," ")}</span></td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{m.department??"—"}</td>
                    <td className="px-5 py-3.5"><button onClick={e=>{e.stopPropagation();toggleActive(m.id,m.is_active)}} className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${m.is_active?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>{m.is_active?"Active":"Inactive"}</button></td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{format(new Date(m.created_at),"MMM d, yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selected && (
          <div className="w-full lg:w-72 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shrink-0 shadow-sm">
            <div className="flex items-center justify-between"><h3 className="font-semibold text-gray-900 text-sm">Member Details</h3><button onClick={()=>setSelected(null)} className="text-gray-400 hover:text-gray-700"><X size={14}/></button></div>
            <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">{selected.name.charAt(0).toUpperCase()}</div><div><p className="font-semibold text-gray-900">{selected.name}</p><p className="text-xs text-gray-400">{selected.email}</p></div></div>
            <div><p className="text-xs text-gray-500 mb-2 font-medium">Change Role</p><div className="flex flex-wrap gap-1.5">{ROLES.map(r=>(<button key={r} onClick={()=>updateRole(selected.id,r)} className={`text-xs px-2 py-1 rounded-full transition-colors font-medium ${selected.role===r?ROLE_COLORS[r]:"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{r.replace(/_/g," ")}</button>))}</div></div>
            <button onClick={()=>toggleActive(selected.id,selected.is_active)} className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected.is_active?"bg-red-50 hover:bg-red-100 text-red-600":"bg-green-50 hover:bg-green-100 text-green-600"}`}>{selected.is_active?<><ToggleLeft size={14}/> Deactivate</>:<><ToggleRight size={14}/> Activate</>}</button>
          </div>
        )}
      </div>
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3><button onClick={()=>setFormOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={16}/></button></div>
            {[{label:"Full Name *",key:"name",type:"text"},{label:"Email *",key:"email",type:"email"}].map(f=>(<div key={f.key}><label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label><input type={f.type} value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500"/></div>))}
            <div><label className="text-xs text-gray-500 block mb-1 font-medium">Role</label><select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500">{ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}</select></div>
            <div><label className="text-xs text-gray-500 block mb-1 font-medium">Department</label><select value={form.department} onChange={e=>setForm(p=>({...p,department:e.target.value}))} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500">{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
            <div className="flex gap-3 pt-2"><button onClick={()=>setFormOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">Cancel</button><button onClick={saveForm} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">Add Member</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
