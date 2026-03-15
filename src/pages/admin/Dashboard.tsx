// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Link } from "react-router-dom";
import {
  TrendingUp, ShoppingCart, Clock, AlertTriangle, ArrowUpRight
} from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  createdOrders: number;
  revenueToday: number;
  ordersToday: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
}

interface RecentOrder {
  id: string;
  razorpay_order_id: string;
  customer_name: string | null;
  customer_email: string | null;
  amount: number;
  status: string;
  created_at: string;
}

interface LowStockItem {
  variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  inventory_quantity: number;
}

const STATUS_COLORS: Record<string, string> = {
  created:    "bg-yellow-500/20 text-yellow-400",
  paid:       "bg-green-500/20 text-green-400",
  failed:     "bg-red-500/20 text-red-400",
  refunded:   "bg-gray-500/20 text-gray-400",
  pending:    "bg-yellow-500/20 text-yellow-400",
  confirmed:  "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped:    "bg-cyan-500/20 text-cyan-400",
  delivered:  "bg-green-500/20 text-green-400",
  cancelled:  "bg-red-500/20 text-red-400",
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [allOrdersRes, recentRes, lowStockRes] = await Promise.all([
        supabase.from("orders").select("amount, status, created_at"),
        supabase.from("orders")
          .select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase.rpc("get_low_stock_variants", { threshold: 5 }).throwOnError().then(
          (r) => r,
          () => ({ data: [] as LowStockItem[] })
        ),
      ]);

      if (allOrdersRes.data) {
        const all = allOrdersRes.data;
        const paid = all.filter((o) => o.status === "paid");
        const today = all.filter((o) => o.created_at >= todayStart);
        const thisMonth = all.filter((o) => o.created_at >= monthStart);

        setStats({
          totalRevenue: paid.reduce((s, o) => s + (o.amount ?? 0), 0),
          totalOrders: all.length,
          paidOrders: paid.length,
          createdOrders: all.filter((o) => o.status === "created").length,
          revenueToday: today.filter((o) => o.status === "paid").reduce((s, o) => s + (o.amount ?? 0), 0),
          ordersToday: today.length,
          revenueThisMonth: thisMonth.filter((o) => o.status === "paid").reduce((s, o) => s + (o.amount ?? 0), 0),
          ordersThisMonth: thisMonth.length,
        });
      }

      if (recentRes.data) setRecentOrders(recentRes.data as RecentOrder[]);
      if (lowStockRes.data) setLowStock(lowStockRes.data as LowStockItem[]);
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
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-gray-400">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (All Time)"
          value={fmt(stats?.totalRevenue ?? 0)}
          sub={`${fmt(stats?.revenueThisMonth ?? 0)} this month`}
          icon={TrendingUp}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          label="Total Orders"
          value={String(stats?.totalOrders ?? 0)}
          sub={`${stats?.ordersToday ?? 0} today`}
          icon={ShoppingCart}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          label="Paid Orders"
          value={String(stats?.paidOrders ?? 0)}
          sub={`${stats?.ordersThisMonth ?? 0} this month`}
          icon={TrendingUp}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          label="Today's Revenue"
          value={fmt(stats?.revenueToday ?? 0)}
          sub={`${stats?.ordersToday ?? 0} orders today`}
          icon={Clock}
          color="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Paid",      value: stats?.paidOrders ?? 0,    color: "text-green-400" },
          { label: "Pending",   value: stats?.createdOrders ?? 0, color: "text-yellow-400" },
          { label: "This Month",value: stats?.ordersThisMonth ?? 0,color: "text-blue-400" },
          { label: "Today",     value: stats?.ordersToday ?? 0,   color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h3 className="font-semibold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {recentOrders.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">No orders yet</p>
            )}
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to="/admin/orders"
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white font-mono text-xs">
                    {order.razorpay_order_id ?? order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-400">{order.customer_name ?? order.customer_email ?? "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-white">₹{order.amount?.toLocaleString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-yellow-400" />
              Low Stock
            </h3>
            <Link to="/admin/products" className="text-xs text-blue-400 hover:text-blue-300">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {lowStock.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">All products well stocked</p>
            )}
            {lowStock.map((item) => (
              <div key={item.variant_id} className="px-5 py-3.5">
                <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
                <p className="text-xs text-gray-400">{item.variant_name} · SKU: {item.sku ?? "—"}</p>
                <p className={`text-xs font-semibold mt-1 ${item.inventory_quantity === 0 ? "text-red-400" : "text-yellow-400"}`}>
                  {item.inventory_quantity === 0 ? "Out of stock" : `${item.inventory_quantity} left`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
