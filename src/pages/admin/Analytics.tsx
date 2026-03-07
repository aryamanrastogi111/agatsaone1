// src/pages/admin/Analytics.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, ShoppingCart, Users, Package } from "lucide-react";
import { format, subDays } from "date-fns";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.name.toLowerCase().includes("revenue")
            ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [statsRes, ordersRes, itemsRes] = await Promise.all([
        supabase.rpc("get_dashboard_stats"),
        supabase.from("orders")
          .select("created_at, total, status")
          .gte("created_at", subDays(new Date(), 30).toISOString())
          .order("created_at"),
        supabase.from("order_items")
          .select("product_name, quantity, total")
          .limit(200),
      ]);

      if (statsRes.data) setStats(statsRes.data);

      // Build 30-day revenue chart
      if (ordersRes.data) {
        const byDay: Record<string, { date: string; revenue: number; orders: number }> = {};
        for (let i = 29; i >= 0; i--) {
          const d = format(subDays(new Date(), i), "MMM d");
          byDay[d] = { date: d, revenue: 0, orders: 0 };
        }
        ordersRes.data.forEach((o: any) => {
          const d = format(new Date(o.created_at), "MMM d");
          if (byDay[d]) {
            byDay[d].revenue += o.total ?? 0;
            byDay[d].orders += 1;
          }
        });
        setRevenueData(Object.values(byDay));

        // Order status pie
        const statusMap: Record<string, number> = {};
        ordersRes.data.forEach((o: any) => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1; });
        setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
      }

      // Top products bar
      if (itemsRes.data) {
        const pMap: Record<string, { name: string; revenue: number; qty: number }> = {};
        itemsRes.data.forEach((item: any) => {
          const name = item.product_name ?? "Unknown";
          if (!pMap[name]) pMap[name] = { name, revenue: 0, qty: 0 };
          pMap[name].revenue += item.total ?? 0;
          pMap[name].qty += item.quantity ?? 0;
        });
        setProductData(
          Object.values(pMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 7)
            .map(p => ({ ...p, name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name }))
        );
      }

      setLoading(false);
    })();
  }, []);

  const fmt = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

  const kpis = [
    { label: "Total Revenue", value: fmt(stats?.total_revenue), sub: `${fmt(stats?.revenue_this_month)} this month`, icon: TrendingUp, color: "text-green-400 bg-green-500/10" },
    { label: "Total Orders", value: String(stats?.total_orders ?? 0), sub: `${stats?.orders_today ?? 0} today`, icon: ShoppingCart, color: "text-blue-400 bg-blue-500/10" },
    { label: "Avg Order Value", value: stats?.total_orders ? fmt(Math.round(stats.total_revenue / stats.total_orders)) : "₹0", sub: "all time", icon: Package, color: "text-purple-400 bg-purple-500/10" },
    { label: "Orders This Month", value: String(stats?.orders_this_month ?? 0), sub: `${fmt(stats?.revenue_this_month)} revenue`, icon: Users, color: "text-cyan-400 bg-cyan-500/10" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-gray-400">Revenue, orders, and product performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{k.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{k.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{k.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${k.color}`}><k.icon size={18} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Revenue & Orders — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Revenue by Product</h3>
          {productData.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No product data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Order Status (Last 30 Days)</h3>
          {statusData.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No order data yet</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    dataKey="value" paddingAngle={3}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 shrink-0">
                {statusData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-300 capitalize">{d.name}</span>
                    <span className="text-gray-500 ml-1">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Fulfillment Status Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pending", value: stats?.pending_orders ?? 0, color: "text-yellow-400" },
            { label: "Shipped", value: stats?.shipped_orders ?? 0, color: "text-blue-400" },
            { label: "Delivered", value: stats?.delivered_orders ?? 0, color: "text-green-400" },
            { label: "Processing", value: stats?.processing_orders ?? 0, color: "text-purple-400" },
            { label: "Cancelled", value: stats?.cancelled_orders ?? 0, color: "text-red-400" },
          ].map(s => (
            <div key={s.label} className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
