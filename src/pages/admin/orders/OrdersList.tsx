// src/pages/admin/orders/OrdersList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Download } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  shipping_city: string;
  shipping_state: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-500/20 text-yellow-400",
  confirmed:  "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped:    "bg-cyan-500/20 text-cyan-400",
  delivered:  "bg-green-500/20 text-green-400",
  cancelled:  "bg-red-500/20 text-red-400",
  refunded:   "bg-gray-500/20 text-gray-400",
  paid:       "bg-green-500/20 text-green-400",
  failed:     "bg-red-500/20 text-red-400",
  unfulfilled:"bg-gray-500/20 text-gray-400",
  partial:    "bg-orange-500/20 text-orange-400",
  fulfilled:  "bg-green-500/20 text-green-400",
};

const PAGE_SIZE = 20;

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select("id, order_number, email, phone, total, status, payment_status, fulfillment_status, shipping_city, shipping_state, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (paymentFilter !== "all") query = query.eq("payment_status", paymentFilter);
    if (search) query = query.or(`order_number.ilike.%${search}%,email.ilike.%${search}%`);

    const { data, count } = await query;
    setOrders((data ?? []) as Order[]);
    setTotal(count ?? 0);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [search, statusFilter, paymentFilter, page]);

  const exportCSV = () => {
    const headers = ["Order #", "Email", "Total", "Status", "Payment", "City", "Date"];
    const rows = orders.map((o) => [
      o.order_number, o.email, o.total,
      o.status, o.payment_status,
      `${o.shipping_city}, ${o.shipping_state}`,
      new Date(o.created_at).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Orders</h2>
          <p className="text-sm text-gray-400">{total} total orders</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg border border-gray-700"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order # or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => { setPaymentFilter(e.target.value); setPage(0); }}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Payment</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Location</th>
                <th className="text-right px-5 py-3 font-medium">Total</th>
                <th className="text-right px-5 py-3 font-medium hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link to={`/admin/orders/${order.id}`}
                      className="font-medium text-blue-400 hover:text-blue-300">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="text-white">{order.email}</p>
                    {order.phone && <p className="text-xs text-gray-400">{order.phone}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.payment_status] ?? ""}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400 text-xs">
                    {order.shipping_city}, {order.shipping_state}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-white">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-right hidden sm:table-cell text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * PAGE_SIZE >= total}
              className="px-3 py-1.5 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
