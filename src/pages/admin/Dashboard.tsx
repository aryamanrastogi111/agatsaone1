// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  TrendingUp, ShoppingCart, Clock, AlertTriangle, ArrowUpRight, IndianRupee,
} from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  revenueToday: number;
  ordersToday: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
}

interface RecentOrder {
  id: string;
  razorpay_order_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  amount: number;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  created:    "bg-yellow-100 text-yellow-700",
  paid:       "bg-green-100 text-green-700",
  failed:     "bg-red-100 text-red-700",
  refunded:   "bg-gray-100 text-gray-600",
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-cyan-100 text-cyan-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string; sub?: string;
  icon: any; accent: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${accent}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [allRes, recentRes] = await Promise.all([
        supabase
          .from("orders")
          .select("amount, status, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("orders")
          .select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (allRes.data) {
        const all = allRes.data as { amount: number; status: string; created_at: string }[];
        const paidStatuses = ["paid", "confirmed", "processing", "shipped", "delivered"];
        const paid = all.filter(o => paidStatuses.includes(o.status));
        const today = all.filter(o => o.created_at >= todayStart);
        const thisMonth = all.filter(o => o.created_at >= monthStart);

        setStats({
          totalRevenue: paid.reduce((s, o) => s + (o.amount ?? 0), 0),
          totalOrders: all.length,
          paidOrders: paid.length,
          pendingOrders: all.filter(o => o.status === "created" || o.status === "pending").length,
          revenueToday: today.filter(o => o.status === "paid").reduce((s, o) => s + (o.amount ?? 0), 0),
          ordersToday: today.length,
          revenueThisMonth: thisMonth.filter(o => o.status === "paid").reduce((s, o) => s + (o.amount ?? 0), 0),
          ordersThisMonth: thisMonth.length,
        });
      }

      if (recentRes.data) setRecentOrders(recentRes.data as RecentOrder[]);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fmt = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (All Time)"
          value={fmt(stats?.totalRevenue ?? 0)}
          sub={`${fmt(stats?.revenueThisMonth ?? 0)} this month`}
          icon={IndianRupee}
          accent="bg-green-100 text-green-600"
        />
        <StatCard
          label="Total Orders"
          value={String(stats?.totalOrders ?? 0)}
          sub={`${stats?.ordersToday ?? 0} today`}
          icon={ShoppingCart}
          accent="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Paid Orders"
          value={String(stats?.paidOrders ?? 0)}
          sub={`${stats?.ordersThisMonth ?? 0} this month`}
          icon={TrendingUp}
          accent="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          label="Today's Revenue"
          value={fmt(stats?.revenueToday ?? 0)}
          sub={`${stats?.ordersToday ?? 0} orders today`}
          icon={Clock}
          accent="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Paid",       value: stats?.paidOrders ?? 0,      color: "text-green-600" },
          { label: "Pending",    value: stats?.pendingOrders ?? 0,   color: "text-yellow-600" },
          { label: "This Month", value: stats?.ordersThisMonth ?? 0, color: "text-blue-600" },
          { label: "Today",      value: stats?.ordersToday ?? 0,     color: "text-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
          )}
          {recentOrders.map(order => (
            <Link
              key={order.id}
              to="/admin/orders"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-mono text-xs text-gray-700 font-medium">
                  {order.razorpay_order_id ?? order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-gray-400">{order.customer_name ?? order.customer_email ?? "—"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
                <span className="text-sm font-bold text-gray-900">₹{order.amount?.toLocaleString("en-IN")}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick stats footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{stats?.pendingOrders ?? 0} Pending</p>
            <p className="text-xs text-gray-400">Awaiting payment</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <TrendingUp size={18} className="text-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{fmt(stats?.revenueThisMonth ?? 0)}</p>
            <p className="text-xs text-gray-400">Revenue this month</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <ShoppingCart size={18} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{stats?.ordersThisMonth ?? 0} orders</p>
            <p className="text-xs text-gray-400">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
