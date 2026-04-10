import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, ShoppingCart, CreditCard,
  Smartphone, Monitor, Globe, Clock, RefreshCw,
  TrendingUp, Package, Eye, Zap, MapPin, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ─── Types ───────────────────────────────────────────────────
interface Visitor {
  session_id: string;
  current_page: string;
  device: "mobile" | "desktop";
  referrer: string;
  started_at: string;
}

interface TodayOrder {
  id: string;
  razorpay_order_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  amount: number;
  status: string;
  created_at: string;
}

interface DailyStat {
  stat_date: string;
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  peak_visitors: number;
  pending_payments: number;
}

// ─── Helpers ─────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/devices": "Devices",
  "/devices/sanketlife-ecg": "SanketLife ECG",
  "/devices/easytouch-wellness": "EasyTouch Wellness",
  "/devices/easytouch-plus": "EasyTouch Plus",
  "/devices/easytouch-rhythm": "EasyTouch Rhythm",
  "/devices/rhythm-band": "Rhythm Band",
  "/devices/smart-scale": "Smart Scale",
  "/devices/core-balance": "Core Balance",
  "/devices/zlu": "ZLU",
  "/programmes": "Programmes",
  "/pricing": "Pricing",
  "/checkout": "Checkout",
  "/about": "About",
  "/blog": "Blog",
  "/support": "Support",
  "/app": "App Download",
  "/for-doctors": "For Doctors",
  "/for-hospitals": "For Hospitals",
  "/for-corporates": "For Corporates",
  "/compare": "Compare",
  "/contact": "Contact",
};

function pageLabel(path: string) {
  return PAGE_LABELS[path] ?? path;
}

function StatusDot({ color }: { color: string }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${color} animate-pulse`} />
  );
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Mini Chart Card ─────────────────────────────────────────
function TrendChartCard({ title, dataKey, data, color, prefix = "" }: {
  title: string; dataKey: string; data: DailyStat[]; color: string; prefix?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={14} className="text-gray-400" />
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <span className="text-xs text-gray-400 ml-auto">Last {data.length} days</span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="stat_date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(d: string) => {
                const date = new Date(d + "T00:00:00");
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={40} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={(val: number) => [`${prefix}${val.toLocaleString("en-IN")}`, title]}
              labelFormatter={(d: string) => {
                const date = new Date(d + "T00:00:00");
                return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Live Visitors Panel ─────────────────────────────────────
function LiveVisitorsPanel({ visitors }: { visitors: Visitor[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <StatusDot color="bg-green-500" />
          <h3 className="font-semibold text-gray-900">Live on Site</h3>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {visitors.length}
          </span>
        </div>
        <span className="text-xs text-gray-400">Auto-updates via presence</span>
      </div>

      {visitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <Eye size={28} className="mb-2 opacity-40" />
          <p className="text-sm">No active visitors right now</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {visitors.map((v) => (
            <li key={v.session_id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                {v.device === "mobile"
                  ? <Smartphone size={13} className="text-green-600" />
                  : <Monitor size={13} className="text-green-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {pageLabel(v.current_page)}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {v.referrer === "direct" ? "Direct" : v.referrer === "internal" ? "Internal link" : v.referrer}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  v.current_page === "/checkout"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-500"
                }`}>
                  {v.current_page === "/checkout" ? "Checking out" : v.device}
                </span>
                <p className="text-xs text-gray-400">{timeAgo(v.started_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Page Breakdown Panel ────────────────────────────────────
function PageBreakdownPanel({ visitors }: { visitors: Visitor[] }) {
  const pageCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    const label = pageLabel(v.current_page);
    pageCounts[label] = (pageCounts[label] || 0) + 1;
  });
  const sorted = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <MapPin size={15} className="text-blue-600" />
        <h3 className="font-semibold text-gray-900">Visitors by Page</h3>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <Globe size={24} className="mb-2 opacity-30" />
          <p className="text-sm">No visitors to break down</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {sorted.map(([page, count]) => (
            <li key={page} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-gray-800">{page}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (count / visitors.length) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-600 w-6 text-right">{count}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Pending Checkout Panel ──────────────────────────────────
function PendingCheckoutPanel({ orders }: { orders: TodayOrder[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <StatusDot color="bg-yellow-400" />
        <CreditCard size={15} className="text-yellow-600" />
        <h3 className="font-semibold text-gray-900">Pending Payment</h3>
        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <CreditCard size={24} className="mb-2 opacity-30" />
          <p className="text-sm">No pending checkouts</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
          {orders.map((o) => (
            <li key={o.id} className="px-5 py-3 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {o.customer_name ?? o.customer_email ?? "Anonymous"}
                </p>
                <p className="text-xs text-gray-400 font-mono">{o.razorpay_order_id}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">₹{o.amount.toLocaleString("en-IN")}</p>
                <p className="text-xs text-gray-400">{timeAgo(o.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Time range selector ─────────────────────────────────────
type TimeRange = "7d" | "30d" | "90d";

// ─── Main Page ───────────────────────────────────────────────
export default function LiveActivity() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [pendingOrders, setPendingOrders] = useState<TodayOrder[]>([]);
  const [recentOrders, setRecentOrders] = useState<TodayOrder[]>([]);
  const [todayStats, setTodayStats] = useState({ orders: 0, revenue: 0, avgOrder: 0 });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<DailyStat[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const STATUS_COLORS: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-cyan-100 text-cyan-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700",
    created: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-600",
  };

  // ── Presence: live visitors ──
  useEffect(() => {
    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: `admin_${Date.now()}` } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = channel.presenceState() as Record<string, any[]>;
        const list: Visitor[] = Object.values(state)
          .flat()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => {
            const sid = p.session_id ?? "";
            return !sid.startsWith("admin") && sid.startsWith("v_");
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => ({
            session_id: p.session_id ?? p.presence_ref,
            current_page: p.current_page ?? "/",
            device: p.device ?? "desktop",
            referrer: p.referrer ?? "direct",
            started_at: p.started_at ?? new Date().toISOString(),
          }));
        setVisitors(list);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── DB data: orders ──
  const fetchData = useCallback(async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const [ordersRes, recentRes] = await Promise.all([
      db.from("orders")
        .select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
        .eq("status", "created")
        .gte("created_at", twoHoursAgo)
        .order("created_at", { ascending: false }),
      db.from("orders")
        .select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
        .in("status", ["paid", "confirmed", "processing", "shipped", "delivered"])
        .gte("created_at", todayStart.toISOString())
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    setPendingOrders(ordersRes.data ?? []);
    setRecentOrders(recentRes.data ?? []);

    const paid: TodayOrder[] = recentRes.data ?? [];
    const revenue = paid.reduce((s: number, o: TodayOrder) => s + o.amount, 0);
    setTodayStats({
      orders: paid.length,
      revenue,
      avgOrder: paid.length ? Math.round(revenue / paid.length) : 0,
    });

    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  // ── Historical data ──
  const fetchHistory = useCallback(async () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await db
      .from("daily_stats")
      .select("stat_date, total_orders, total_revenue, avg_order_value, peak_visitors, pending_payments")
      .gte("stat_date", since.toISOString().split("T")[0])
      .order("stat_date", { ascending: true });

    setHistoricalData(data ?? []);
  }, [timeRange]);

  useEffect(() => {
    fetchData();
    fetchHistory();
    const interval = setInterval(fetchData, 30_000);

    const channel = supabase
      .channel("live-activity-db")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { fetchData(); })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchData, fetchHistory]);

  // Update peak visitors in daily_stats (client-side update)
  useEffect(() => {
    if (visitors.length === 0) return;
    const checkoutCount = visitors.filter(v => v.current_page === "/checkout").length;
    const today = new Date().toISOString().split("T")[0];

    db.from("daily_stats")
      .upsert({
        stat_date: today,
        peak_visitors: visitors.length,
        peak_checkout_visitors: checkoutCount,
      }, { onConflict: "stat_date", ignoreDuplicates: false })
      .then(() => {});
    // We only update peak if current > stored, handled by trigger or accepted as latest
  }, [visitors]);

  const checkoutVisitors = visitors.filter((v) => v.current_page === "/checkout");
  const deviceVisitors = visitors.filter((v) => v.current_page.startsWith("/devices/"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" />
            Live Activity
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Real-time store pulse · auto-updates via presence
          </p>
        </div>
        <button
          onClick={() => { fetchData(); fetchHistory(); }}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={13} /> Refresh
          <span className="text-gray-400 text-xs ml-1">
            {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Live Visitors" value={visitors.length} sub="on site right now" color="bg-green-50 text-green-600" />
        <StatCard icon={Eye} label="Browsing Devices" value={deviceVisitors.length} sub="viewing product pages" color="bg-blue-50 text-blue-600" />
        <StatCard icon={ShoppingCart} label="On Checkout" value={checkoutVisitors.length} sub="filling checkout form" color="bg-purple-50 text-purple-600" />
        <StatCard icon={TrendingUp} label="Orders Today" value={loading ? "—" : todayStats.orders} sub={`₹${todayStats.revenue.toLocaleString("en-IN")} revenue`} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={CreditCard} label="Pending Payment" value={loading ? "—" : pendingOrders.length} sub="awaiting Razorpay" color="bg-yellow-50 text-yellow-600" />
      </div>

      {/* Historical Trends */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-500" />
            Historical Trends
          </h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["7d", "30d", "90d"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === r
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {historicalData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400">
            <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No historical data yet. Stats are captured daily at 11 PM IST.</p>
            <button
              onClick={async () => {
                const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/snapshot-daily-stats`;
                await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                  },
                });
                fetchHistory();
              }}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Take snapshot now →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendChartCard title="Orders" dataKey="total_orders" data={historicalData} color="#10b981" />
            <TrendChartCard title="Revenue" dataKey="total_revenue" data={historicalData} color="#3b82f6" prefix="₹" />
            <TrendChartCard title="Avg Order Value" dataKey="avg_order_value" data={historicalData} color="#8b5cf6" prefix="₹" />
            <TrendChartCard title="Peak Visitors" dataKey="peak_visitors" data={historicalData} color="#f59e0b" />
          </div>
        )}
      </div>

      {/* Live Visitors + Page Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveVisitorsPanel visitors={visitors} />
        <PageBreakdownPanel visitors={visitors} />
      </div>

      {/* Pending Payments */}
      <PendingCheckoutPanel orders={pendingOrders} />

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Package size={15} className="text-green-600" />
          <h3 className="font-semibold text-gray-900">Today's Purchases</h3>
          <span className="text-xs text-gray-400 ml-auto">Last 20</span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Package size={28} className="mb-2 opacity-30" />
            <p className="text-sm">No paid orders today yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs">
                <th className="text-left px-5 py-2.5 font-medium">Customer</th>
                <th className="text-left px-5 py-2.5 font-medium hidden md:table-cell">Order ID</th>
                <th className="text-left px-5 py-2.5 font-medium">Status</th>
                <th className="text-right px-5 py-2.5 font-medium">Amount</th>
                <th className="text-right px-5 py-2.5 font-medium hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{o.customer_name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{o.customer_email ?? ""}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="font-mono text-xs text-gray-400">{o.razorpay_order_id ?? o.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">
                    ₹{o.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-right hidden sm:table-cell">
                    <span className="flex items-center justify-end gap-1 text-xs text-gray-400">
                      <Clock size={11} /> {timeAgo(o.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
