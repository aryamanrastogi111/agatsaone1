// src/pages/admin/Shipping.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Search, CheckCircle2, Clock, Package, MapPin } from "lucide-react";

interface ShipOrder {
  id: string;
  razorpay_order_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  amount: number;
  status: string;
  items: any;
  paid_at: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  paid:       "bg-blue-100 text-blue-700",
  confirmed:  "bg-purple-100 text-purple-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped:    "bg-cyan-100 text-cyan-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
  created:    "bg-gray-100 text-gray-600",
};

export default function Shipping() {
  const [orders, setOrders] = useState<ShipOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["paid", "confirmed", "processing", "shipped", "delivered"])
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as ShipOrder[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await supabase.from("orders").update({ status }).eq("id", id);
    await fetchOrders();
    setUpdatingId(null);
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      (o.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (o.razorpay_order_id ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (o.shipping_city ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const shipped = orders.filter(o => o.status === "shipped").length;
  const delivered = orders.filter(o => o.status === "delivered").length;
  const pending = orders.filter(o => ["paid", "confirmed", "processing"].includes(o.status)).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Shipping & Fulfillment</h2>
        <p className="text-sm text-gray-500">Manage order dispatch and delivery tracking</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Clock size={22} className="text-yellow-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Awaiting Dispatch</p><p className="text-2xl font-bold text-gray-900">{pending}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Truck size={22} className="text-blue-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Shipped</p><p className="text-2xl font-bold text-gray-900">{shipped}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <CheckCircle2 size={22} className="text-green-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Delivered</p><p className="text-2xl font-bold text-gray-900">{delivered}</p></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer, order ID, or city…"
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500">
          <option value="all">All Statuses</option>
          <option value="paid">Paid (New)</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Truck size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No orders to show</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(o => (
              <div key={o.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs text-gray-600 font-medium">{o.razorpay_order_id ?? o.id.slice(0, 8)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {o.status}
                      </span>
                      <span className="text-sm font-bold text-gray-900">₹{o.amount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <p className="font-medium text-gray-700">{o.customer_name ?? "—"}</p>
                        <p>{o.customer_email ?? "—"}</p>
                        <p>{o.customer_phone ?? "—"}</p>
                      </div>
                      {o.shipping_address && (
                        <div className="flex items-start gap-1.5">
                          <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
                          <div>
                            <p>{o.shipping_address}</p>
                            <p>{[o.shipping_city, o.shipping_state].filter(Boolean).join(", ")} {o.shipping_pincode}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {o.items && Array.isArray(o.items) && o.items.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Package size={11} />
                        {o.items.map((i: any) => `${i.productName ?? i.name} ×${i.quantity}`).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap shrink-0">
                    {o.status === "paid" && (
                      <button onClick={() => updateStatus(o.id, "confirmed")} disabled={updatingId === o.id}
                        className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors">
                        Confirm
                      </button>
                    )}
                    {o.status === "confirmed" && (
                      <button onClick={() => updateStatus(o.id, "processing")} disabled={updatingId === o.id}
                        className="text-xs px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors">
                        Processing
                      </button>
                    )}
                    {(o.status === "processing" || o.status === "confirmed") && (
                      <button onClick={() => updateStatus(o.id, "shipped")} disabled={updatingId === o.id}
                        className="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors">
                        Mark Shipped
                      </button>
                    )}
                    {o.status === "shipped" && (
                      <button onClick={() => updateStatus(o.id, "delivered")} disabled={updatingId === o.id}
                        className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors">
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700 font-medium">Courier API Integration</p>
        </div>
        <p className="text-xs text-blue-600 mt-1">Future: Connect Shiprocket, Delhivery, or BlueDart for automatic AWB generation and real-time tracking</p>
      </div>
    </div>
  );
}
