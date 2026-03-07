// src/pages/admin/Shipping.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Truck, Search, Package, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Fulfillment {
  id: string;
  order_id: string;
  tracking_number: string;
  carrier: string;
  status: string;
  shipped_at: string;
  estimated_delivery: string;
  delivered_at: string;
  notes: string;
  orders?: { order_number: string; email: string; city: string; state: string };
}

const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-yellow-500/20 text-yellow-400",
  shipped:     "bg-blue-500/20 text-blue-400",
  in_transit:  "bg-purple-500/20 text-purple-400",
  delivered:   "bg-green-500/20 text-green-400",
  failed:      "bg-red-500/20 text-red-400",
  rto:         "bg-orange-500/20 text-orange-400",
  returned:    "bg-gray-500/20 text-gray-400",
};

export default function Shipping() {
  const [fulfillments, setFulfillments] = useState<Fulfillment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("fulfillments")
        .select("*, orders(order_number, email, city, state)")
        .order("created_at", { ascending: false });
      if (data) setFulfillments(data);
      setLoading(false);
    })();
  }, []);

  const filtered = fulfillments.filter(f => {
    const matchSearch =
      (f.tracking_number ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (f.orders?.order_number ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (f.orders?.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || f.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const shipped = fulfillments.filter(f => f.status === "shipped" || f.status === "in_transit").length;
  const delivered = fulfillments.filter(f => f.status === "delivered").length;
  const failed = fulfillments.filter(f => f.status === "failed" || f.status === "rto").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Shipping & Fulfillment</h2>
        <p className="text-sm text-gray-400">Track shipments and logistics operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <Truck size={22} className="text-blue-400 shrink-0" />
          <div><p className="text-sm text-gray-400">In Transit</p><p className="text-2xl font-bold text-white">{shipped}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle2 size={22} className="text-green-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Delivered</p><p className="text-2xl font-bold text-white">{delivered}</p></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <AlertCircle size={22} className="text-red-400 shrink-0" />
          <div><p className="text-sm text-gray-400">Failed / RTO</p><p className="text-2xl font-bold text-white">{failed}</p></div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search AWB, order, email…"
              className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Carrier / AWB</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Destination</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Shipped</th>
                <th className="text-left px-5 py-3">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading && <tr><td colSpan={7} className="text-center py-12 text-gray-500">Loading…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Truck size={32} className="mx-auto text-gray-700 mb-2" />
                    <p className="text-gray-500">No shipments found</p>
                  </td>
                </tr>
              )}
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/orders/${f.order_id}`} className="font-medium text-blue-400 hover:text-blue-300">
                      {f.orders?.order_number ?? f.order_id?.slice(0, 8) ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{f.carrier ?? "—"}</p>
                    <p className="text-xs text-gray-400 font-mono">{f.tracking_number ?? "No AWB"}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-300 text-xs">{f.orders?.email ?? "—"}</td>
                  <td className="px-5 py-3.5 text-gray-300 text-xs">
                    {[f.orders?.city, f.orders?.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[f.status] ?? "bg-gray-500/20 text-gray-400"}`}>
                      {(f.status ?? "—").replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {f.shipped_at ? format(new Date(f.shipped_at), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {f.estimated_delivery ? format(new Date(f.estimated_delivery), "MMM d, yyyy") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Future integration placeholder */}
      <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-6 text-center">
        <Truck size={28} className="mx-auto text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 font-medium">Courier API Integration</p>
        <p className="text-xs text-gray-600 mt-1">Future: Connect Shiprocket, Delhivery, or BlueDart for real-time tracking</p>
      </div>
    </div>
  );
}
