// src/pages/admin/ActivityLogs.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Activity, Search, Filter } from "lucide-react";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: any;
  new_value: any;
  ip_address: string;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  create: "bg-green-500/20 text-green-400",
  update: "bg-blue-500/20 text-blue-400",
  delete: "bg-red-500/20 text-red-400",
  status_change: "bg-yellow-500/20 text-yellow-400",
  login: "bg-purple-500/20 text-purple-400",
  export: "bg-cyan-500/20 text-cyan-400",
};

const ENTITY_ICONS: Record<string, string> = {
  order: "📦", product: "🛍️", customer: "👤", coupon: "🎟️",
  inventory: "🏭", return: "↩️", lead: "🎯", ticket: "🎫",
  subscription: "🔄", team_member: "👥", setting: "⚙️",
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [selected, setSelected] = useState<ActivityLog | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (data) setLogs(data);
      setLoading(false);
    })();
  }, []);

  const entityTypes = Array.from(new Set(logs.map(l => l.entity_type))).filter(Boolean);
  const actionTypes = Array.from(new Set(logs.map(l => l.action))).filter(Boolean);

  const filtered = logs.filter(l => {
    const matchSearch =
      (l.user_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.action ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (l.entity_type ?? "").toLowerCase().includes(search.toLowerCase());
    const matchEntity = entityFilter === "all" || l.entity_type === entityFilter;
    const matchAction = actionFilter === "all" || l.action === actionFilter;
    return matchSearch && matchEntity && matchAction;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Activity Logs</h2>
        <p className="text-sm text-gray-400">Audit trail — every change made by your team</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-800 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actions…"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            </div>
            {entityTypes.length > 0 && (
              <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="all">All Entities</option>
                {entityTypes.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            )}
            {actionTypes.length > 0 && (
              <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="all">All Actions</option>
                {actionTypes.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Action</th>
                  <th className="text-left px-5 py-3">Entity</th>
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading && <tr><td colSpan={4} className="text-center py-12 text-gray-500">Loading…</td></tr>}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <Activity size={32} className="mx-auto text-gray-700 mb-2" />
                      <p className="text-gray-500 text-sm">No activity logs yet</p>
                      <p className="text-gray-600 text-xs mt-1">Actions performed in the admin panel will appear here</p>
                    </td>
                  </tr>
                )}
                {filtered.map(log => (
                  <tr key={log.id} onClick={() => setSelected(selected?.id === log.id ? null : log)}
                    className={`cursor-pointer hover:bg-gray-800/40 transition-colors ${selected?.id === log.id ? "bg-gray-800/60" : ""}`}>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ACTION_COLORS[log.action] ?? "bg-gray-500/20 text-gray-400"}`}>
                        {log.action?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm">{ENTITY_ICONS[log.entity_type] ?? "📋"}</span>
                      <span className="text-gray-300 ml-1.5 text-xs capitalize">{log.entity_type}</span>
                      {log.entity_id && <span className="text-gray-600 text-xs ml-1 font-mono">#{log.entity_id.slice(0, 8)}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{log.user_email ?? log.user_id?.slice(0, 8) ?? "System"}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full lg:w-80 bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">Log Detail</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div><p className="text-gray-400">Action</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ACTION_COLORS[selected.action] ?? ""}`}>{selected.action}</span>
              </div>
              <div><p className="text-gray-400">Entity</p><p className="text-white capitalize">{selected.entity_type} — {selected.entity_id}</p></div>
              <div><p className="text-gray-400">User</p><p className="text-white">{selected.user_email ?? "Unknown"}</p></div>
              <div><p className="text-gray-400">Time</p><p className="text-white">{format(new Date(selected.created_at), "PPpp")}</p></div>
              {selected.ip_address && <div><p className="text-gray-400">IP</p><p className="text-white font-mono">{selected.ip_address}</p></div>}
            </div>
            {selected.old_value && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Before</p>
                <pre className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 overflow-auto max-h-32">
                  {JSON.stringify(selected.old_value, null, 2)}
                </pre>
              </div>
            )}
            {selected.new_value && (
              <div>
                <p className="text-xs text-gray-400 mb-1">After</p>
                <pre className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 overflow-auto max-h-32">
                  {JSON.stringify(selected.new_value, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
