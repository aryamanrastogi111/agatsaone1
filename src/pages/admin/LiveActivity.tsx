import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, ShoppingCart, CreditCard,
  Smartphone, Monitor, Globe, Clock, RefreshCw,
  TrendingUp, Package, Eye, Zap, MapPin, BarChart3,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle,
  Brain, ArrowRight, Lightbulb, TrendingDown,
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

interface PastSuggestionReview {
  suggestion: string;
  outcome: "improved" | "worsened" | "unchanged" | "too_early";
  evidence: string;
  nextStep: string;
}

interface ComparedToLast {
  revenueChange: string;
  orderChange: string;
  overallDirection: "improving" | "declining" | "stable" | "first_analysis";
}

interface AIAnalysis {
  overallHealth: "good" | "warning" | "critical";
  headline: string;
  keyMetrics: Array<{ label: string; value: string; trend: "up" | "down" | "flat"; insight: string }>;
  dropoutAnalysis: {
    funnelStages: Array<{ stage: string; count: number; dropRate: string }>;
    biggestDropoff: string;
    possibleReasons: string[];
  };
  pastSuggestionReview?: PastSuggestionReview[];
  recommendations: Array<{ priority: "high" | "medium" | "low"; action: string; expectedImpact: string; reasoning: string; timeframe?: string }>;
  alerts: string[];
  comparedToLast?: ComparedToLast;
}

interface PastAnalysisEntry {
  id: string;
  created_at: string;
  headline: string;
  overall_health: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface AIResponse { analysis: AIAnalysis; rawData: any; generatedAt: string; pastAnalyses?: PastAnalysisEntry[] }

// ─── Helpers ─────────────────────────────────────────────────
function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Home", "/devices": "Devices",
  "/devices/sanketlife-ecg": "SanketLife ECG", "/devices/easytouch-wellness": "EasyTouch Wellness",
  "/devices/easytouch-plus": "EasyTouch Plus", "/devices/easytouch-rhythm": "EasyTouch Rhythm",
  "/devices/rhythm-band": "Rhythm Band", "/devices/smart-scale": "Smart Scale",
  "/devices/core-balance": "Core Balance", "/devices/zlu": "ZLU",
  "/programmes": "Programmes", "/pricing": "Pricing", "/checkout": "Checkout",
  "/about": "About", "/blog": "Blog", "/support": "Support", "/app": "App Download",
  "/for-doctors": "For Doctors", "/for-hospitals": "For Hospitals",
  "/for-corporates": "For Corporates", "/compare": "Compare", "/contact": "Contact",
};

function pageLabel(path: string) { return PAGE_LABELS[path] ?? path; }

function StatusDot({ color }: { color: string }) {
  return <span className={`inline-block w-2 h-2 rounded-full ${color} animate-pulse`} />;
}

// ─── AI Insights Card ────────────────────────────────────────
function AIInsightsCard({ data, loading, onRefresh }: {
  data: AIResponse | null; loading: boolean; onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const healthColor = data?.analysis.overallHealth === "good"
    ? "border-green-300 bg-green-50" : data?.analysis.overallHealth === "critical"
    ? "border-red-300 bg-red-50" : "border-yellow-300 bg-yellow-50";

  const healthIcon = data?.analysis.overallHealth === "good"
    ? <CheckCircle size={18} className="text-green-600" />
    : data?.analysis.overallHealth === "critical"
    ? <XCircle size={18} className="text-red-600" />
    : <AlertTriangle size={18} className="text-yellow-600" />;

  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className={`border-2 rounded-xl shadow-sm overflow-hidden transition-colors ${data ? healthColor : "border-gray-200 bg-white"}`}>
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-black/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              AI Sales Analysis
              {data && healthIcon}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? "Analyzing your sales data..." : data
                ? data.analysis.headline
                : "Click refresh to generate AI analysis"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <span className="text-xs text-gray-400">
              {new Date(data.generatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRefresh(); }}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-purple-600" : "text-gray-500"} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && data && (
        <div className="px-5 pb-5 space-y-5 border-t border-black/10">
          {/* Alerts */}
          {data.analysis.alerts.length > 0 && (
            <div className="mt-4 space-y-2">
              {data.analysis.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700">{alert}</p>
                </div>
              ))}
            </div>
          )}

          {/* Key Metrics */}
          {data.analysis.keyMetrics.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Key Metrics</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {data.analysis.keyMetrics.map((m, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{m.label}</span>
                      {m.trend === "up" ? <TrendingUp size={12} className="text-green-500" /> :
                       m.trend === "down" ? <TrendingDown size={12} className="text-red-500" /> :
                       <ArrowRight size={12} className="text-gray-400" />}
                    </div>
                    <p className="text-lg font-bold text-gray-900">{m.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Funnel / Dropout Analysis */}
          {data.analysis.dropoutAnalysis.funnelStages.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Conversion Funnel & Dropout</h4>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  {data.analysis.dropoutAnalysis.funnelStages.map((stage, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">{stage.stage}</span>
                          <span className="text-xs font-bold text-gray-900">{stage.count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                            style={{
                              width: `${Math.max(5, (stage.count / (data.analysis.dropoutAnalysis.funnelStages[0]?.count || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                        {stage.dropRate !== "0%" && stage.dropRate !== "N/A" && (
                          <span className="text-xs text-red-500 mt-0.5 block">↓ {stage.dropRate} drop</span>
                        )}
                      </div>
                      {i < data.analysis.dropoutAnalysis.funnelStages.length - 1 && (
                        <ArrowRight size={14} className="text-gray-300 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-red-600">Biggest drop-off:</span> {data.analysis.dropoutAnalysis.biggestDropoff}
                  </p>
                  {data.analysis.dropoutAnalysis.possibleReasons.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {data.analysis.dropoutAnalysis.possibleReasons.map((r, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                          <span className="text-yellow-500 mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {data.analysis.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lightbulb size={13} /> Recommendations
              </h4>
              <div className="space-y-2">
                {data.analysis.recommendations.map((rec, i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold border shrink-0 mt-0.5 ${priorityColors[rec.priority] ?? ""}`}>
                        {rec.priority}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{rec.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{rec.reasoning}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-green-600 font-medium">Expected: {rec.expectedImpact}</p>
                          {rec.timeframe && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                              {rec.timeframe === "immediate" ? "⚡ Now" : rec.timeframe === "this_week" ? "📅 This week" : "📆 This month"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compared to Last Analysis */}
          {data.analysis.comparedToLast && data.analysis.comparedToLast.overallDirection !== "first_analysis" && (
            <div className={`rounded-lg p-3 border ${
              data.analysis.comparedToLast.overallDirection === "improving" ? "bg-green-50 border-green-200" :
              data.analysis.comparedToLast.overallDirection === "declining" ? "bg-red-50 border-red-200" :
              "bg-gray-50 border-gray-200"
            }`}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-gray-600">
                📊 Since Last Analysis
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Revenue:</span> <span className="font-medium">{data.analysis.comparedToLast.revenueChange}</span></div>
                <div><span className="text-gray-500">Orders:</span> <span className="font-medium">{data.analysis.comparedToLast.orderChange}</span></div>
              </div>
              <p className={`text-xs font-bold mt-1.5 ${
                data.analysis.comparedToLast.overallDirection === "improving" ? "text-green-700" :
                data.analysis.comparedToLast.overallDirection === "declining" ? "text-red-700" : "text-gray-600"
              }`}>
                Overall: {data.analysis.comparedToLast.overallDirection === "improving" ? "📈 Improving" :
                  data.analysis.comparedToLast.overallDirection === "declining" ? "📉 Declining" : "➡️ Stable"}
              </p>
            </div>
          )}

          {/* Past Suggestion Review */}
          {data.analysis.pastSuggestionReview && data.analysis.pastSuggestionReview.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                🔄 Past Suggestion Outcomes
              </h4>
              <div className="space-y-2">
                {data.analysis.pastSuggestionReview.map((review, i) => {
                  const outcomeStyles: Record<string, string> = {
                    improved: "bg-green-100 text-green-700 border-green-200",
                    worsened: "bg-red-100 text-red-700 border-red-200",
                    unchanged: "bg-gray-100 text-gray-600 border-gray-200",
                    too_early: "bg-blue-100 text-blue-600 border-blue-200",
                  };
                  const outcomeEmoji: Record<string, string> = {
                    improved: "✅", worsened: "❌", unchanged: "➖", too_early: "⏳",
                  };
                  return (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-start gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold border shrink-0 ${outcomeStyles[review.outcome] ?? ""}`}>
                          {outcomeEmoji[review.outcome] ?? ""} {review.outcome}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">{review.suggestion}</p>
                          <p className="text-xs text-gray-500 mt-1">📊 {review.evidence}</p>
                          <p className="text-xs text-blue-600 font-medium mt-1">→ {review.nextStep}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analysis History */}
          {data.pastAnalyses && data.pastAnalyses.length > 0 && (
            <details className="group">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1">
                <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                Analysis History ({data.pastAnalyses.length} past analyses)
              </summary>
              <div className="mt-2 space-y-1.5">
                {data.pastAnalyses.map((pa) => {
                  const healthDot = pa.overall_health === "good" ? "bg-green-500" : pa.overall_health === "critical" ? "bg-red-500" : "bg-yellow-500";
                  return (
                    <div key={pa.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${healthDot}`} />
                      <span className="text-xs text-gray-500 shrink-0">
                        {new Date(pa.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" "}
                        {new Date(pa.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-xs text-gray-700 truncate flex-1">{pa.headline}</span>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* Raw data summary */}
          {data.rawData && (
            <details className="group">
              <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1">
                <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                View raw data used for analysis
              </summary>
              <pre className="mt-2 bg-gray-900 text-green-400 text-xs rounded-lg p-3 overflow-x-auto max-h-48 overflow-y-auto">
                {JSON.stringify(data.rawData, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Loading state */}
      {expanded && loading && !data && (
        <div className="px-5 pb-5 border-t border-black/10">
          <div className="mt-4 flex items-center justify-center py-8 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">AI is analyzing your sales data...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon size={20} /></div>
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
            <XAxis dataKey="stat_date" tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(d: string) => { const date = new Date(d + "T00:00:00"); return `${date.getDate()}/${date.getMonth() + 1}`; }} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} width={40} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={(val: number) => [`${prefix}${val.toLocaleString("en-IN")}`, title]}
              labelFormatter={(d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} />
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
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{visitors.length}</span>
        </div>
        <span className="text-xs text-gray-400">Auto-updates via presence</span>
      </div>
      {visitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <Eye size={28} className="mb-2 opacity-40" /><p className="text-sm">No active visitors right now</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {visitors.map((v) => (
            <li key={v.session_id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                {v.device === "mobile" ? <Smartphone size={13} className="text-green-600" /> : <Monitor size={13} className="text-green-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{pageLabel(v.current_page)}</p>
                <p className="text-xs text-gray-400 truncate">
                  {v.referrer === "direct" ? "Direct" : v.referrer === "internal" ? "Internal link" : v.referrer}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${v.current_page === "/checkout" ? "bg-purple-100 text-purple-700" : "text-gray-500"}`}>
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
  visitors.forEach((v) => { const l = pageLabel(v.current_page); pageCounts[l] = (pageCounts[l] || 0) + 1; });
  const sorted = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
        <MapPin size={15} className="text-blue-600" /><h3 className="font-semibold text-gray-900">Visitors by Page</h3>
      </div>
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <Globe size={24} className="mb-2 opacity-30" /><p className="text-sm">No visitors to break down</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {sorted.map(([page, count]) => (
            <li key={page} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-gray-800">{page}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (count / visitors.length) * 100)}%` }} />
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
        <StatusDot color="bg-yellow-400" /><CreditCard size={15} className="text-yellow-600" />
        <h3 className="font-semibold text-gray-900">Pending Payment</h3>
        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">{orders.length}</span>
      </div>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <CreditCard size={24} className="mb-2 opacity-30" /><p className="text-sm">No pending checkouts</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
          {orders.map((o) => (
            <li key={o.id} className="px-5 py-3 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{o.customer_name ?? o.customer_email ?? "Anonymous"}</p>
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

type TimeRange = "7d" | "30d" | "90d";

// ─── Main Page ───────────────────────────────────────────────
export default function LiveActivity() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [pendingOrders, setPendingOrders] = useState<TodayOrder[]>([]);
  const [recentOrders, setRecentOrders] = useState<TodayOrder[]>([]);
  const [todayStats, setTodayStats] = useState({ orders: 0, revenue: 0, avgOrder: 0, totalVisitors: 0 });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState<DailyStat[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [lostCheckouts, setLostCheckouts] = useState<TodayOrder[]>([]);
  const [lostExpanded, setLostExpanded] = useState(false);

  // AI Analysis state
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── Load last cached AI analysis on mount ──
  useEffect(() => {
    (async () => {
      try {
        const { data } = await db.from("ai_analysis_history")
          .select("id, created_at, headline, overall_health, analysis_data, metrics_snapshot, suggestion_outcomes")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (data) {
          setAiData({
            analysis: data.analysis_data as AIAnalysis,
            rawData: data.metrics_snapshot,
            generatedAt: data.created_at,
            pastAnalyses: [],
          });
        }
      } catch {
        // No cached analysis yet — that's fine
      }
    })();
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    paid: "bg-green-100 text-green-700", delivered: "bg-green-100 text-green-700",
    shipped: "bg-cyan-100 text-cyan-700", confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700", created: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700", refunded: "bg-gray-100 text-gray-600",
  };

  // ── AI Analysis fetch ──
  const fetchAIAnalysis = useCallback(async () => {
    setAiLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sales-analysis`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("AI analysis error:", err);
        return;
      }
      const data = await res.json();
      setAiData(data);
    } catch (e) {
      console.error("AI analysis failed:", e);
    } finally {
      setAiLoading(false);
    }
  }, []);

  // ── Presence: live visitors ──
  useEffect(() => {
    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: `admin_${Date.now()}` } },
    });
    channel.on("presence", { event: "sync" }, () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = channel.presenceState() as Record<string, any[]>;
      const list: Visitor[] = Object.values(state).flat()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((p: any) => { const sid = p.session_id ?? ""; return !sid.startsWith("admin") && sid.startsWith("v_"); })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => ({
          session_id: p.session_id ?? p.presence_ref, current_page: p.current_page ?? "/",
          device: p.device ?? "desktop", referrer: p.referrer ?? "direct",
          started_at: p.started_at ?? new Date().toISOString(),
        }));
      setVisitors(list);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── DB data: orders ──
  const fetchData = useCallback(async () => {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const today = new Date().toISOString().split("T")[0];
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [ordersRes, recentRes, lostRes, todayVisRes] = await Promise.all([
      // Pending: created in last 10 min (still actively paying)
      db.from("orders").select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
        .eq("status", "created").gte("created_at", tenMinAgo).order("created_at", { ascending: false }),
      db.from("orders").select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
        .in("status", ["paid", "confirmed", "processing", "shipped", "delivered"])
        .gte("created_at", todayStart.toISOString()).order("created_at", { ascending: false }).limit(20),
      // Lost: created > 10 min ago within last 7 days
      db.from("orders").select("id, razorpay_order_id, customer_name, customer_email, amount, status, created_at")
        .eq("status", "created")
        .gte("created_at", last7d)
        .lt("created_at", tenMinAgo)
        .order("created_at", { ascending: false }),
      db.from("daily_stats").select("total_visitors").eq("stat_date", today).maybeSingle(),
    ]);
    setPendingOrders(ordersRes.data ?? []);
    setRecentOrders(recentRes.data ?? []);
    setLostCheckouts(lostRes.data ?? []);
    const paid: TodayOrder[] = recentRes.data ?? [];
    const revenue = paid.reduce((s: number, o: TodayOrder) => s + o.amount, 0);
    const tv = todayVisRes.data?.total_visitors ?? 0;
    setTodayStats({ orders: paid.length, revenue, avgOrder: paid.length ? Math.round(revenue / paid.length) : 0, totalVisitors: tv });
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  // ── Historical data ──
  const fetchHistory = useCallback(async () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const since = new Date(); since.setDate(since.getDate() - days);
    const { data } = await db.from("daily_stats")
      .select("stat_date, total_orders, total_revenue, avg_order_value, peak_visitors, pending_payments, total_visitors")
      .gte("stat_date", since.toISOString().split("T")[0]).order("stat_date", { ascending: true });
    setHistoricalData(data ?? []);
  }, [timeRange]);

  useEffect(() => {
    fetchData(); fetchHistory();
    const interval = setInterval(fetchData, 30_000);
    const channel = supabase.channel("live-activity-db")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { fetchData(); }).subscribe();
    return () => { clearInterval(interval); supabase.removeChannel(channel); };
  }, [fetchData, fetchHistory]);

  // Update peak visitors
  useEffect(() => {
    if (visitors.length === 0) return;
    const checkoutCount = visitors.filter(v => v.current_page === "/checkout").length;
    const today = new Date().toISOString().split("T")[0];
    db.from("daily_stats").upsert({ stat_date: today, peak_visitors: visitors.length, peak_checkout_visitors: checkoutCount }, { onConflict: "stat_date", ignoreDuplicates: false }).then(() => {});
  }, [visitors]);

  const checkoutVisitors = visitors.filter((v) => v.current_page === "/checkout");
  const deviceVisitors = visitors.filter((v) => v.current_page.startsWith("/devices/"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" /> Live Activity
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Real-time store pulse · AI-powered insights</p>
        </div>
        <button onClick={() => { fetchData(); fetchHistory(); }}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
          <RefreshCw size={13} /> Refresh
          <span className="text-gray-400 text-xs ml-1">
            {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </button>
      </div>

      {/* AI Insights — Top of page */}
      <AIInsightsCard data={aiData} loading={aiLoading} onRefresh={fetchAIAnalysis} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Live Visitors" value={visitors.length} sub="on site right now" color="bg-green-50 text-green-600" />
        <StatCard icon={Globe} label="Today's Visitors" value={loading ? "—" : todayStats.totalVisitors} sub="unique visitors today" color="bg-blue-50 text-blue-600" />
        <StatCard icon={Eye} label="Browsing Devices" value={deviceVisitors.length} sub="viewing product pages" color="bg-blue-50 text-blue-600" />
        <StatCard icon={ShoppingCart} label="On Checkout" value={checkoutVisitors.length} sub="filling checkout form" color="bg-purple-50 text-purple-600" />
        <StatCard icon={TrendingUp} label="Orders Today" value={loading ? "—" : todayStats.orders} sub={`₹${todayStats.revenue.toLocaleString("en-IN")} revenue`} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={CreditCard} label="Pending Payment" value={loading ? "—" : pendingOrders.length} sub="awaiting Razorpay" color="bg-yellow-50 text-yellow-600" />
      </div>

      {/* Historical Trends */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><TrendingUp size={18} className="text-blue-500" /> Historical Trends</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["7d", "30d", "90d"] as TimeRange[]).map((r) => (
              <button key={r} onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
        {historicalData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-400">
            <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No historical data yet. Stats are captured daily at 11 PM IST.</p>
            <button onClick={async () => {
              const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/snapshot-daily-stats`;
              await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } });
              fetchHistory();
            }} className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium">Take snapshot now →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendChartCard title="Total Visitors" dataKey="total_visitors" data={historicalData} color="#3b82f6" />
            <TrendChartCard title="Orders" dataKey="total_orders" data={historicalData} color="#10b981" />
            <TrendChartCard title="Revenue" dataKey="total_revenue" data={historicalData} color="#8b5cf6" prefix="₹" />
            <TrendChartCard title="Peak Concurrent" dataKey="peak_visitors" data={historicalData} color="#f59e0b" />
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

      {/* Lost Checkouts */}
      <div className="bg-white border-2 border-red-200 rounded-xl shadow-sm overflow-hidden">
        <button
          onClick={() => setLostExpanded(!lostExpanded)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-red-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                Lost Checkouts
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{lostCheckouts.length}</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {lostCheckouts.length > 0
                  ? `₹${lostCheckouts.reduce((s, o) => s + o.amount, 0).toLocaleString("en-IN")} potential revenue lost in last 24h`
                  : "No lost checkouts in the last 24 hours"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Last 24h</span>
            {lostExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </button>

        {lostExpanded && (
          <div className="border-t border-red-100">
            {lostCheckouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <CheckCircle size={24} className="mb-2 text-green-400" />
                <p className="text-sm">No lost checkouts — great job!</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-red-50 border-b border-red-100 text-gray-500 text-xs">
                      <th className="text-left px-5 py-2.5 font-medium">Customer</th>
                      <th className="text-left px-5 py-2.5 font-medium hidden md:table-cell">Order ID</th>
                      <th className="text-right px-5 py-2.5 font-medium">Amount Lost</th>
                      <th className="text-right px-5 py-2.5 font-medium">Abandoned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50">
                    {lostCheckouts.map((o) => (
                      <tr key={o.id} className="hover:bg-red-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-800">{o.customer_name ?? o.customer_email ?? "Anonymous"}</p>
                          <p className="text-xs text-gray-400">{o.customer_email ?? ""}</p>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="font-mono text-xs text-gray-400">{o.razorpay_order_id ?? o.id.slice(0, 8)}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-red-600">₹{o.amount.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="flex items-center justify-end gap-1 text-xs text-gray-400"><Clock size={11} /> {timeAgo(o.created_at)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Package size={15} className="text-green-600" /><h3 className="font-semibold text-gray-900">Today's Purchases</h3>
          <span className="text-xs text-gray-400 ml-auto">Last 20</span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Package size={28} className="mb-2 opacity-30" /><p className="text-sm">No paid orders today yet</p>
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">₹{o.amount.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-right hidden sm:table-cell">
                    <span className="flex items-center justify-end gap-1 text-xs text-gray-400"><Clock size={11} /> {timeAgo(o.created_at)}</span>
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
