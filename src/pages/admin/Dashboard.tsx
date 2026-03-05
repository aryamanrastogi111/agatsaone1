// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Link } from "react-router-dom";
import {
  TrendingUp, ShoppingCart, Package, Users,
  AlertTriangle, ArrowUpRight, Clock
} from "lucide-react";

interface Stats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  revenue_today: number;
  revenue_this_month: number;
  orders_today: number;
  orders_this_month: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  email: string;
  total: number;
  status: string;
  payment_status: string;
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
  pending:    "bg-yellow-500/20 text-yellow-400",
  confirmed:  "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped:    "bg-cyan-500/20 text-cyan-400",
  delivered:  "bg-green-500/20 text-green-400",
  cancelled:  "bg-red-500/20 text-red-400",
  refunded:   "bg-gray-500/20 text-gray-400",
  paid:       "bg-green-500/20 text-green-400",
  failed:     "bg-red-500/20 text-red-400",
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string;
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [statsRes, ordersRes, stockRes] = await Promise.all([
        supabase.rpc("get_dashboard_stats"),
        supabase.from("orders")
          .select("id, order_number, email, total, status, payment_status, created_at")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase.rpc("get_low_stock_variants", { threshold: 5 }),
      ]);

      if (statsRes.data) setStats(statsRes.data as Stats);
      if (ordersRes.data) setRecentOrders(ordersRes.data as RecentOrder[]);
      if (stockRes.data) setLowStock(stockRes.data as LowStockItem[]);
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

  const fmt = (n: number) => `₹${n?.toLocaleString("en-IN") ?? 0}`;

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
          value={fmt(stats?.total_revenue ?? 0)}
          sub={`${fmt(stats?.revenue_this_month ?? 0)} this month`}
          icon={TrendingUp}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          label="Total Orders"
          value={String(stats?.total_orders ?? 0)}
          sub={`${stats?.orders_today ?? 0} today`}
          icon={ShoppingCart}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          label="Pending Orders"
          value={String(stats?.pending_orders ?? 0)}
          sub={`${stats?.processing_orders ?? 0} processing`}
          icon={Clock}
          color="bg-yellow-500/20 text-yellow-400"
        />
        <StatCard
          label="Today's Revenue"
          value={fmt(stats?.revenue_today ?? 0)}
          sub={`${stats?.orders_today ?? 0} orders today`}
          icon={TrendingUp}
          color="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Shipped",   value: stats?.shipped_orders ?? 0,   color: "text-cyan-400" },
          { label: "Delivered", value: stats?.delivered_orders ?? 0, color: "text-green-400" },
          { label: "Cancelled", value: stats?.cancelled_orders ?? 0, color: "text-red-400" },
          { label: "Processing",value: stats?.processing_orders ?? 0,color: "text-purple-400" },
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
                to={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-white">{order.order_number}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.payment_status] ?? ""}`}>
                    {order.payment_status}
                  </span>
                  <span className="text-sm font-semibold text-white">₹{order.total?.toLocaleString("en-IN")}</span>
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
