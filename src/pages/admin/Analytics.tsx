// src/pages/admin/Analytics.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, IndianRupee, Package } from "lucide-react";
import { format, subDays } from "date-fns";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" && p.name.toLowerCase().includes("revenue")
            ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [kpiStats, setKpiStats] = useState({ totalRevenue: 0, totalOrders: 0, paidOrders: 0, monthRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const monthStart = subDays(new Date(), 30).toISOString();

      const [allRes, recentRes] = await Promise.all([
        supabase.from("orders").select("amount, status, created_at, items"),
        supabase.from("orders")
          .select("amount, status, created_at, items")
          .gte("created_at", monthStart)
          .order("created_at"),
      ]);

      const allOrders = (allRes.data ?? []) as any[];
      const recentOrders = (recentRes.data ?? []) as any[];

      // KPI stats
      const paid = allOrders.filter((o: any) => o.status === "paid");
      const monthPaid = recentOrders.filter((o: any) => o.status === "paid");
      setKpiStats({
        totalRevenue: paid.reduce((s: number, o: any) => s + (o.amount ?? 0), 0),
        totalOrders: allOrders.length,
        paidOrders: paid.length,
        monthRevenue: monthPaid.reduce((s: number, o: any) => s + (o.amount ?? 0), 0),
      });

      // 30-day revenue chart
      const byDay: Record<string, { date: string; revenue: number; orders: number }> = {};
      for (let i = 29; i >= 0; i--) {
        const d = format(subDays(new Date(), i), "MMM d");
        byDay[d] = { date: d, revenue: 0, orders: 0 };
      }
      recentOrders.forEach((o: any) => {
        const d = format(new Date(o.created_at), "MMM d");
        if (byDay[d]) {
          if (o.status === "paid") byDay[d].revenue += o.amount ?? 0;
          byDay[d].orders += 1;
        }
      });
      setRevenueData(Object.values(byDay));

      // Status breakdown pie
      const statusMap: Record<string, number> = {};
      recentOrders.forEach((o: any) => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1; });
      setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

      // Top products from items JSON
      const pMap: Record<string, { name: string; revenue: number; qty: number }> = {};
      allOrders.forEach((o: any) => {
        if (!Array.isArray(o.items)) return;
        o.items.forEach((item: any) => {
          const name = item.productName ?? item.name ?? "Unknown";
          if (!pMap[name]) pMap[name] = { name, revenue: 0, qty: 0 };
          if (o.status === "paid") pMap[name].revenue += (item.price ?? 0) * (item.quantity ?? 1);
          pMap[name].qty += item.quantity ?? 1;
        });
      });
      setProductData(
        Object.values(pMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 6)
          .map(p => ({ ...p, name: p.name.length > 22 ? p.name.slice(0, 22) + "…" : p.name }))
      );

      setLoading(false);
    })();
  }, []);

  const fmt = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

  const kpis = [
    { label: "Total Revenue", value: fmt(kpiStats.totalRevenue), sub: `${fmt(kpiStats.monthRevenue)} last 30 days`, icon: IndianRupee, accent: "bg-green-100 text-green-600" },
    { label: "Total Orders", value: String(kpiStats.totalOrders), sub: "all time", icon: ShoppingCart, accent: "bg-blue-100 text-blue-600" },
    { label: "Paid Orders", value: String(kpiStats.paidOrders), sub: "successfully paid", icon: TrendingUp, accent: "bg-emerald-100 text-emerald-600" },
    { label: "Avg Order Value", value: kpiStats.paidOrders ? fmt(Math.round(kpiStats.totalRevenue / kpiStats.paidOrders)) : "₹0", sub: "per paid order", icon: Package, accent: "bg-purple-100 text-purple-600" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Revenue, orders, and product performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{k.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${k.accent}`}><k.icon size={18} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue & Orders — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue by Product</h3>
          {productData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No product data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={productData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false}
                  tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status (Last 30 Days)</h3>
          {statusData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No order data yet</p>
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
                    <span className="text-gray-600 capitalize">{d.name}</span>
                    <span className="text-gray-400 ml-1 font-semibold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
