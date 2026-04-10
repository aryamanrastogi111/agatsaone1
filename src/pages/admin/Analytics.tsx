import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, IndianRupee, Package, RefreshCw, Calendar, ArrowRight, ArrowDown } from "lucide-react";
import { format, subDays } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
const PAID_STATUSES = ["paid", "confirmed", "processing", "shipped", "delivered"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-500 mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === "number" && (p.name.toLowerCase().includes("revenue") || p.name.toLowerCase().includes("avg"))
            ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
        </p>
      ))}
    </div>
  );
};

type TimeRange = "7d" | "30d" | "90d" | "all";

export default function Analytics() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [revenueData, setRevenueData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productData, setProductData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statusData, setStatusData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dailyStatsData, setDailyStatsData] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<{ stage: string; count: number; color: string }[]>([]);
  const [kpiStats, setKpiStats] = useState({
    totalRevenue: 0, totalOrders: 0, paidOrders: 0,
    monthRevenue: 0, monthOrders: 0, avgOrderValue: 0,
    todayRevenue: 0, todayOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;
    const rangeStart = subDays(new Date(), days).toISOString();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [allRes, rangeRes, todayRes, dailyRes] = await Promise.all([
      db.from("orders").select("amount, status, created_at, items"),
      db.from("orders")
        .select("amount, status, created_at, items")
        .gte("created_at", rangeStart)
        .order("created_at"),
      db.from("orders")
        .select("amount, status")
        .in("status", PAID_STATUSES)
        .gte("created_at", todayStart.toISOString()),
      db.from("daily_stats")
        .select("stat_date, total_orders, total_revenue, avg_order_value, peak_visitors, pending_payments")
        .gte("stat_date", subDays(new Date(), days).toISOString().split("T")[0])
        .order("stat_date", { ascending: true }),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allOrders = (allRes.data ?? []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rangeOrders = (rangeRes.data ?? []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const todayOrders = (todayRes.data ?? []) as any[];

    // KPI stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allPaid = allOrders.filter((o: any) => PAID_STATUSES.includes(o.status));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rangePaid = rangeOrders.filter((o: any) => PAID_STATUSES.includes(o.status));
    const totalRevenue = allPaid.reduce((s: number, o: { amount: number }) => s + (o.amount ?? 0), 0);
    const rangeRevenue = rangePaid.reduce((s: number, o: { amount: number }) => s + (o.amount ?? 0), 0);
    const todayRevenue = todayOrders.reduce((s: number, o: { amount: number }) => s + (o.amount ?? 0), 0);

    setKpiStats({
      totalRevenue,
      totalOrders: allOrders.length,
      paidOrders: allPaid.length,
      monthRevenue: rangeRevenue,
      monthOrders: rangePaid.length,
      avgOrderValue: allPaid.length ? Math.round(totalRevenue / allPaid.length) : 0,
      todayRevenue,
      todayOrders: todayOrders.length,
    });

    // Revenue chart from orders data
    const byDay: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "MMM d");
      byDay[d] = { date: d, revenue: 0, orders: 0 };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rangeOrders.forEach((o: any) => {
      const d = format(new Date(o.created_at), "MMM d");
      if (byDay[d]) {
        if (PAID_STATUSES.includes(o.status)) byDay[d].revenue += o.amount ?? 0;
        byDay[d].orders += 1;
      }
    });
    setRevenueData(Object.values(byDay));

    // Daily stats history
    setDailyStatsData(dailyRes.data ?? []);

    // Status breakdown pie
    const statusMap: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rangeOrders.forEach((o: any) => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1; });
    setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    // Top products
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pMap: Record<string, { name: string; revenue: number; qty: number }> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allOrders.forEach((o: any) => {
      if (!Array.isArray(o.items)) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      o.items.forEach((item: any) => {
        const name = item.productName ?? item.name ?? "Unknown";
        if (!pMap[name]) pMap[name] = { name, revenue: 0, qty: 0 };
        if (PAID_STATUSES.includes(o.status)) pMap[name].revenue += (item.price ?? 0) * (item.quantity ?? 1);
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
  }, [timeRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
  const rangeLabel = timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : timeRange === "90d" ? "90 days" : "all time";

  const kpis = [
    { label: "Total Revenue", value: fmt(kpiStats.totalRevenue), sub: `${fmt(kpiStats.monthRevenue)} in last ${rangeLabel}`, icon: IndianRupee, accent: "bg-green-100 text-green-600" },
    { label: "Today", value: fmt(kpiStats.todayRevenue), sub: `${kpiStats.todayOrders} orders today`, icon: Calendar, accent: "bg-orange-100 text-orange-600" },
    { label: "Paid Orders", value: String(kpiStats.paidOrders), sub: `${kpiStats.monthOrders} in last ${rangeLabel}`, icon: TrendingUp, accent: "bg-emerald-100 text-emerald-600" },
    { label: "Avg Order Value", value: kpiStats.paidOrders ? fmt(kpiStats.avgOrderValue) : "₹0", sub: "per paid order", icon: Package, accent: "bg-purple-100 text-purple-600" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">Revenue, orders, and product performance — real data</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["7d", "30d", "90d", "all"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r === "7d" ? "7D" : r === "30d" ? "30D" : r === "90d" ? "90D" : "All"}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
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

      {/* Revenue & Orders trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue & Orders — Last {rangeLabel}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false}
              interval={timeRange === "7d" ? 0 : timeRange === "30d" ? 4 : 10} />
            <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#10b981" strokeWidth={2} fill="url(#ordGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Stats Trends (from snapshots) */}
      {dailyStatsData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Daily Snapshots — Peak Visitors & Orders</h3>
          <p className="text-xs text-gray-400 mb-4">Captured daily at 11 PM IST</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={dailyStatsData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordSnapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="stat_date"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(d: string) => {
                  const date = new Date(d + "T00:00:00");
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />}
                labelFormatter={(d: string) => {
                  const date = new Date(d + "T00:00:00");
                  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                }}
              />
              <Area type="monotone" dataKey="peak_visitors" name="Peak Visitors" stroke="#f59e0b" strokeWidth={2} fill="url(#visGrad)" />
              <Area type="monotone" dataKey="total_orders" name="Orders" stroke="#8b5cf6" strokeWidth={2} fill="url(#ordSnapGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

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
          <h3 className="font-semibold text-gray-900 mb-4">Order Status — Last {rangeLabel}</h3>
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
