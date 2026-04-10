import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, IndianRupee, Package, RefreshCw, Calendar, ArrowRight, ArrowDown, Users, Clock, MousePointerClick, Globe } from "lucide-react";
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

type TimeRange = "today" | "yesterday" | "7d" | "30d" | "90d" | "all";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pageViewsData, setPageViewsData] = useState<any[]>([]);
  const [audienceQuality, setAudienceQuality] = useState({
    avgDuration: 0, bounceRate: 0, avgPages: 0, totalSessions: 0,
    bySource: [] as { source: string; sessions: number; avgDuration: number; bounceRate: number; avgPages: number }[],
  });
  const [kpiStats, setKpiStats] = useState({
    totalRevenue: 0, totalOrders: 0, paidOrders: 0,
    monthRevenue: 0, monthOrders: 0, avgOrderValue: 0,
    todayRevenue: 0, todayOrders: 0, totalVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const now = new Date();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);

    let days: number;
    let rangeStart: string;
    let rangeEnd: string | null = null;
    if (timeRange === "today") {
      days = 1;
      rangeStart = todayStart.toISOString();
    } else if (timeRange === "yesterday") {
      days = 1;
      rangeStart = yesterdayStart.toISOString();
      rangeEnd = yesterdayEnd.toISOString();
    } else {
      days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;
      rangeStart = subDays(now, days).toISOString();
    }

    let rangeQuery = db.from("orders")
      .select("amount, status, created_at, items")
      .gte("created_at", rangeStart)
      .order("created_at");
    if (rangeEnd) rangeQuery = rangeQuery.lt("created_at", rangeEnd);

    const [allRes, rangeRes, todayRes, dailyRes, pageViewsRes, sessionsRes] = await Promise.all([
      db.from("orders").select("amount, status, created_at, items"),
      rangeQuery,
      db.from("orders")
        .select("amount, status")
        .in("status", PAID_STATUSES)
        .gte("created_at", todayStart.toISOString()),
      db.from("daily_stats")
        .select("stat_date, total_orders, total_revenue, avg_order_value, peak_visitors, pending_payments, total_visitors")
        .gte("stat_date", subDays(now, Math.max(days, 7)).toISOString().split("T")[0])
        .order("stat_date", { ascending: true }),
      db.from("page_views")
        .select("page_path, session_id, created_at, utm_source, utm_medium")
        .gte("created_at", rangeStart)
        .order("created_at", { ascending: false })
        .limit(5000),
      db.from("visitor_sessions")
        .select("session_id, started_at, last_seen_at, page_count, entry_page, exit_page, utm_source, utm_medium, utm_campaign, device, referrer")
        .gte("started_at", rangeStart)
        .order("started_at", { ascending: false })
        .limit(2000),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allOrders = (allRes.data ?? []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rangeOrders = (rangeRes.data ?? []) as any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const todayOrders = (todayRes.data ?? []) as any[];

    // KPI stats — all scoped to selected range
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rangePaid = rangeOrders.filter((o: any) => PAID_STATUSES.includes(o.status));
    const rangeRevenue = rangePaid.reduce((s: number, o: { amount: number }) => s + (o.amount ?? 0), 0);
    const rangeAvg = rangePaid.length ? Math.round(rangeRevenue / rangePaid.length) : 0;
    const todayRevenue = todayOrders.reduce((s: number, o: { amount: number }) => s + (o.amount ?? 0), 0);
    const rangeVisitors = (dailyRes.data ?? []).reduce((s: number, d: any) => s + (d.total_visitors || 0), 0);

    setKpiStats({
      totalRevenue: rangeRevenue,
      totalOrders: rangeOrders.length,
      paidOrders: rangePaid.length,
      monthRevenue: rangeRevenue,
      monthOrders: rangePaid.length,
      avgOrderValue: rangeAvg,
      todayRevenue,
      todayOrders: todayOrders.length,
      totalVisitors: rangeVisitors,
    });

    // Revenue chart from orders data
    const byDay: Record<string, { date: string; revenue: number; orders: number }> = {};
    if (timeRange === "today" || timeRange === "yesterday") {
      // Show hourly breakdown for single-day views
      const baseDate = timeRange === "today" ? todayStart : yesterdayStart;
      for (let h = 0; h < 24; h++) {
        const label = `${h.toString().padStart(2, "0")}:00`;
        byDay[label] = { date: label, revenue: 0, orders: 0 };
      }
      rangeOrders.forEach((o: any) => {
        const h = new Date(o.created_at).getHours();
        const label = `${h.toString().padStart(2, "0")}:00`;
        if (byDay[label]) {
          if (PAID_STATUSES.includes(o.status)) byDay[label].revenue += o.amount ?? 0;
          byDay[label].orders += 1;
        }
      });
    } else {
      for (let i = days - 1; i >= 0; i--) {
        const d = format(subDays(now, i), "MMM d");
        byDay[d] = { date: d, revenue: 0, orders: 0 };
      }
      rangeOrders.forEach((o: any) => {
        const d = format(new Date(o.created_at), "MMM d");
        if (byDay[d]) {
          if (PAID_STATUSES.includes(o.status)) byDay[d].revenue += o.amount ?? 0;
          byDay[d].orders += 1;
        }
      });
    }
    setRevenueData(Object.values(byDay));

    // Daily stats history
    setDailyStatsData(dailyRes.data ?? []);

    // Status breakdown pie
    const statusMap: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rangeOrders.forEach((o: any) => { statusMap[o.status] = (statusMap[o.status] ?? 0) + 1; });
    setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

    // Conversion funnel
    const totalVisitorsForFunnel = rangeVisitors > 0 ? rangeVisitors : rangeOrders.length * 5;
    const totalCheckouts = rangeOrders.length;
    const funnelPaid = rangePaid.length;
    const funnelCancelled = rangeOrders.filter((o: any) => ["cancelled", "refunded"].includes(o.status)).length;
    setFunnelData([
      { stage: rangeVisitors > 0 ? "Visitors" : "Visitors (est.)", count: totalVisitorsForFunnel, color: "#3b82f6" },
      { stage: "Checkout Started", count: totalCheckouts, color: "#8b5cf6" },
      { stage: "Payment Completed", count: funnelPaid, color: "#10b981" },
      { stage: "Cancelled/Refunded", count: funnelCancelled, color: "#ef4444" },
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pMap: Record<string, { name: string; revenue: number; qty: number }> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rangeOrders.forEach((o: any) => {
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

    // Page views by page
    const pvMap: Record<string, { page: string; views: number; unique: Set<string> }> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pageViewsRes.data ?? []).forEach((pv: any) => {
      const p = pv.page_path || "/";
      if (!pvMap[p]) pvMap[p] = { page: p, views: 0, unique: new Set() };
      pvMap[p].views += 1;
      pvMap[p].unique.add(pv.session_id);
    });
    setPageViewsData(
      Object.values(pvMap)
        .map(p => ({ page: p.page.length > 30 ? p.page.slice(0, 30) + "…" : p.page, views: p.views, unique_visitors: p.unique.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 15)
    );

    // Audience quality from visitor_sessions
    const sessions = (sessionsRes.data ?? []) as any[];
    if (sessions.length > 0) {
      const durations = sessions.map((s: any) => {
        const started = new Date(s.started_at).getTime();
        const lastSeen = new Date(s.last_seen_at).getTime();
        return Math.max(0, (lastSeen - started) / 1000); // seconds
      });
      const avgDuration = Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length);
      const bounces = sessions.filter((s: any) => (s.page_count || 1) <= 1).length;
      const bounceRate = Math.round((bounces / sessions.length) * 100);
      const avgPages = +(sessions.reduce((a: number, s: any) => a + (s.page_count || 1), 0) / sessions.length).toFixed(1);

      // By source
      const srcMap: Record<string, { sessions: any[] }> = {};
      sessions.forEach((s: any) => {
        const src = s.utm_source || s.referrer || "direct";
        if (!srcMap[src]) srcMap[src] = { sessions: [] };
        srcMap[src].sessions.push(s);
      });
      const bySource = Object.entries(srcMap)
        .map(([source, { sessions: srcSessions }]) => {
          const srcDurations = srcSessions.map((s: any) => Math.max(0, (new Date(s.last_seen_at).getTime() - new Date(s.started_at).getTime()) / 1000));
          const srcAvgDur = Math.round(srcDurations.reduce((a: number, b: number) => a + b, 0) / srcDurations.length);
          const srcBounces = srcSessions.filter((s: any) => (s.page_count || 1) <= 1).length;
          return {
            source,
            sessions: srcSessions.length,
            avgDuration: srcAvgDur,
            bounceRate: Math.round((srcBounces / srcSessions.length) * 100),
            avgPages: +(srcSessions.reduce((a: number, s: any) => a + (s.page_count || 1), 0) / srcSessions.length).toFixed(1),
          };
        })
        .sort((a, b) => b.sessions - a.sessions)
        .slice(0, 10);

      setAudienceQuality({ avgDuration, bounceRate, avgPages, totalSessions: sessions.length, bySource });
    }

    setLoading(false);
  }, [timeRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fmt = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
  const rangeLabel = timeRange === "today" ? "today" : timeRange === "yesterday" ? "yesterday" : timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : timeRange === "90d" ? "90 days" : "all time";

  const kpis = [
    { label: `Revenue (${rangeLabel})`, value: fmt(kpiStats.totalRevenue), sub: `${kpiStats.paidOrders} paid orders`, icon: IndianRupee, accent: "bg-green-100 text-green-600" },
    { label: `Visitors (${rangeLabel})`, value: kpiStats.totalVisitors.toLocaleString("en-IN"), sub: "total unique visitors", icon: Users, accent: "bg-blue-100 text-blue-600" },
    { label: `Paid Orders (${rangeLabel})`, value: String(kpiStats.paidOrders), sub: `of ${kpiStats.totalOrders} total`, icon: TrendingUp, accent: "bg-emerald-100 text-emerald-600" },
    { label: `Avg Order Value (${rangeLabel})`, value: kpiStats.paidOrders ? fmt(kpiStats.avgOrderValue) : "₹0", sub: "per paid order", icon: Package, accent: "bg-purple-100 text-purple-600" },
    { label: "Today", value: fmt(kpiStats.todayRevenue), sub: `${kpiStats.todayOrders} orders today`, icon: Calendar, accent: "bg-orange-100 text-orange-600" },
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
            {(["today", "yesterday", "7d", "30d", "90d", "all"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r === "today" ? "Today" : r === "yesterday" ? "Yesterday" : r === "7d" ? "7D" : r === "30d" ? "30D" : r === "90d" ? "90D" : "All"}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* Conversion Funnel */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-1">Conversion Funnel — Last {rangeLabel}</h3>
        <p className="text-xs text-gray-400 mb-4">Track where visitors drop off in the purchase journey</p>
        {funnelData.length > 0 && funnelData[0].count > 0 ? (
          <div className="space-y-3">
            {funnelData.map((stage, i) => {
              const maxCount = funnelData[0].count;
              const pct = maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0;
              const prevCount = i > 0 ? funnelData[i - 1].count : stage.count;
              const dropPct = prevCount > 0 && i > 0 ? Math.round(((prevCount - stage.count) / prevCount) * 100) : 0;
              return (
                <div key={stage.stage}>
                  {i > 0 && dropPct > 0 && (
                    <div className="flex items-center gap-2 ml-4 mb-1 text-xs text-red-500">
                      <ArrowDown size={12} />
                      <span>{dropPct}% drop-off ({(prevCount - stage.count).toLocaleString("en-IN")} lost)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-40 shrink-0">{stage.stage}</span>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full rounded-lg transition-all duration-500 flex items-center px-3"
                        style={{ width: `${Math.max(5, pct)}%`, backgroundColor: stage.color }}
                      >
                        <span className="text-xs font-bold text-white whitespace-nowrap">
                          {stage.count.toLocaleString("en-IN")} ({pct}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">Not enough data to show funnel</p>
        )}
      </div>


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
                <linearGradient id="totalVisGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
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
              <Area type="monotone" dataKey="total_visitors" name="Total Visitors" stroke="#3b82f6" strokeWidth={2} fill="url(#totalVisGrad)" />
              <Area type="monotone" dataKey="peak_visitors" name="Peak Concurrent" stroke="#f59e0b" strokeWidth={2} fill="url(#visGrad)" />
              <Area type="monotone" dataKey="total_orders" name="Orders" stroke="#8b5cf6" strokeWidth={2} fill="url(#ordSnapGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Visitor Details Table */}
      {dailyStatsData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-1">Daily Visitor Details</h3>
          <p className="text-xs text-gray-400 mb-4">Historic daily breakdown — total visitors, peak concurrent, orders & revenue</p>
          <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-left text-gray-500 text-xs">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4 text-right">Total Visitors</th>
                  <th className="pb-2 pr-4 text-right">Peak Concurrent</th>
                  <th className="pb-2 pr-4 text-right">Orders</th>
                  <th className="pb-2 pr-4 text-right">Revenue</th>
                  <th className="pb-2 text-right">Avg Order</th>
                </tr>
              </thead>
              <tbody>
                {[...dailyStatsData].reverse().map((d: any, i: number) => {
                  const prev = [...dailyStatsData].reverse()[i + 1];
                  const visitorChange = prev ? d.total_visitors - (prev.total_visitors || 0) : 0;
                  return (
                    <tr key={d.stat_date} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2 pr-4 text-gray-700">
                        {new Date(d.stat_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })}
                      </td>
                      <td className="py-2 pr-4 text-right font-medium">
                        {(d.total_visitors || 0).toLocaleString("en-IN")}
                        {visitorChange !== 0 && (
                          <span className={`ml-1 text-xs ${visitorChange > 0 ? "text-green-500" : "text-red-500"}`}>
                            {visitorChange > 0 ? "↑" : "↓"}{Math.abs(visitorChange)}
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-600">{d.peak_visitors || 0}</td>
                      <td className="py-2 pr-4 text-right text-gray-600">{d.total_orders || 0}</td>
                      <td className="py-2 pr-4 text-right text-gray-600">₹{(d.total_revenue || 0).toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right text-gray-600">₹{(d.avg_order_value || 0).toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Visitors by Page */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-1">Visitors by Page — {rangeLabel}</h3>
        <p className="text-xs text-gray-400 mb-4">Top pages by total views and unique visitors</p>
        {pageViewsData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No page view data yet — data starts collecting now</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, pageViewsData.length * 32)}>
            <BarChart data={pageViewsData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="page" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} width={160} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="views" name="Page Views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="unique_visitors" name="Unique Visitors" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
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
