import { useCallback, useEffect, useState } from "react";
import { 
  RefreshCw, TrendingUp, DollarSign, MousePointerClick, 
  Eye, ShoppingCart, Target, AlertCircle, Sparkles, 
  Calendar, ShieldCheck, Activity, BarChart2,
  type LucideIcon 
} from "lucide-react";

interface Campaign {
  accountId?: string;
  id: string;
  name: string;
  status?: string;
  objective?: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm?: number;
  frequency?: number;
  metaPurchases: number;
  siteSessions: number;
  siteOrders?: number;
  siteRevenue?: number;
  siteRoas?: number;
}

interface AccountSummary {
  accountId: string;
  spend: number; 
  impressions: number; 
  clicks: number;
  ctr: number; 
  cpc: number; 
  cpm?: number;
  frequency?: number;
  metaPurchases: number;
}

interface DailyRow {
  date: string; 
  spend: number; 
  impressions: number; 
  clicks: number;
  ctr?: number;
  cpm?: number;
  metaPurchases: number; 
  orders: number; 
  revenue: number; 
  roas: number;
}

interface DeliveryHealth {
  status: "good" | "warning" | "critical";
  alerts: string[];
  today: { spend: number; impressions: number; clicks: number; reach: number; ctr: number; cpm: number; frequency: number };
  last7Average: { spend: number; impressions: number; clicks: number; ctr: number; cpm: number };
  spendChangePct: number;
  impressionChangePct: number;
  activeCampaigns: number;
  issueCampaigns: Array<{ accountId: string; id: string; name: string; effectiveStatus: string; status: string }>;
  topAds: Array<{ accountId: string; campaignName: string; adName: string; spend: number; impressions: number; clicks: number; ctr: number; cpm: number; frequency: number; metaPurchases: number; metaInitiateCheckout: number }>;
}

interface MetaData {
  generatedAt: string;
  accountIds?: string[];
  account: {
    spend: number; 
    impressions: number; 
    clicks: number; 
    reach: number;
    ctr: number; 
    cpc: number; 
    cpm?: number;
    frequency?: number;
    metaPurchases: number; 
    metaInitiateCheckout: number;
  };
  accounts?: AccountSummary[];
  deliveryHealth?: DeliveryHealth;
  site: { 
    fbSessions: number; 
    paidOrders: number; 
    revenueToday: number; 
    roas: number; 
    attributedPaidOrders?: number; 
    unattributedPaidOrders?: number; 
    unattributedRevenue?: number 
  };
  campaigns: Campaign[];
  recentFbSessions: Array<{ 
    session_id: string; 
    started_at: string; 
    utm_campaign: string | null; 
    utm_content: string | null; 
    exit_page: string | null 
  }>;
  historic30d?: {
    daily: DailyRow[];
    campaigns: Campaign[];
    totals: { 
      spend: number; 
      revenue: number; 
      orders: number; 
      metaPurchases: number 
    };
  };
}

interface AiAnalysis {
  overallHealth: "good" | "warning" | "critical";
  headline: string;
  keyMetrics: Array<{ label: string; value: string; trend: "up" | "down" | "flat"; insight: string }>;
  bestDays: Array<{ date: string; revenue: number; spend: number; roas: number; why: string }>;
  worstDays: Array<{ date: string; revenue: number; spend: number; roas: number; why: string }>;
  topCampaigns: Array<{ name: string; spend: number; revenue_est: number; verdict: string; reason: string }>;
  recommendations: Array<{ priority: string; action: string; expectedImpact: string; timeframe: string }>;
  alerts: string[];
}

export default function MetaAdsCard() {
  const [data, setData] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"today" | "history">("today");
  const [ai, setAi] = useState<AiAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-insights`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const runAi = useCallback(async () => {
    if (!data?.historic30d) return;
    setAiLoading(true); setAiError(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/meta-ads-analysis`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          metrics: {
            today: { account: data.account, site: data.site, campaigns: data.campaigns },
            historic30d: data.historic30d,
            accounts: data.accounts,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setAi(json.analysis);
    } catch (e) {
      setAiError((e as Error).message);
    } finally {
      setAiLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchInsights();
    const t = setInterval(fetchInsights, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [fetchInsights]);

  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const daily = data?.historic30d?.daily ?? [];
  const totals = data?.historic30d?.totals;
  const histRoas = totals && totals.spend > 0 ? totals.revenue / totals.spend : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">f</div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Facebook / Meta Ads</h2>
            <p className="text-xs text-gray-500">
              Live spend, delivery health, and performance (IST)
              {data?.accountIds && data.accountIds.length > 0 && ` · ${data.accountIds.length} ad account${data.accountIds.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
            <button onClick={() => setTab("today")}
              className={`px-3 py-1.5 ${tab === "today" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>Today</button>
            <button onClick={() => setTab("history")}
              className={`px-3 py-1.5 ${tab === "history" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>Last 30 days</button>
          </div>
          <button onClick={fetchInsights} disabled={loading}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-white transition">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border-b border-amber-100">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Couldn't load Meta insights</p>
            <p className="text-xs mt-0.5 text-amber-700">{error}</p>
          </div>
        </div>
      )}

      {!data && !error && (
        <div className="p-10 text-center text-sm text-gray-400">Loading Meta insights…</div>
      )}

      {data && tab === "today" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 p-5 pb-2">
            <KPI icon={DollarSign} label="Spend" value={inr(data.account.spend)} color="bg-rose-50 text-rose-600" />
            <KPI icon={Target} label="ROAS" value={data.site.roas > 0 ? `${data.site.roas.toFixed(2)}x` : "—"} color="bg-emerald-50 text-emerald-600" sub={`${inr(data.site.revenueToday)} rev`} />
            <KPI icon={Eye} label="Impressions" value={data.account.impressions.toLocaleString("en-IN")} color="bg-blue-50 text-blue-600" />
            <KPI icon={BarChart2} label="CPM" value={data.account.cpm ? inr(data.account.cpm) : "—"} color="bg-indigo-50 text-indigo-600" />
            <KPI icon={MousePointerClick} label="Clicks" value={data.account.clicks.toLocaleString("en-IN")} color="bg-indigo-50 text-indigo-600" sub={`${data.account.ctr.toFixed(2)}% CTR`} />
            <KPI icon={Activity} label="Frequency" value={data.account.frequency ? data.account.frequency.toFixed(2) : "—"} color="bg-amber-50 text-amber-600" />
            <KPI icon={ShoppingCart} label="Initiate Checkout" value={data.account.metaInitiateCheckout.toLocaleString("en-IN")} color="bg-orange-50 text-orange-600" sub="Meta reported" />
            <KPI icon={ShoppingCart} label="Purchases" value={data.account.metaPurchases.toLocaleString("en-IN")} color="bg-green-50 text-green-600" sub={`${data.site.paidOrders} on site`} />
          </div>

          <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-3 gap-5 pt-3">
             <div className="lg:col-span-2 space-y-5">
               <DeliveryHealthPanel data={data} />
               <RoasChart daily={daily} todayRoas={data.site.roas} todayRevenue={data.site.revenueToday} todaySpend={data.account.spend} />
             </div>
             
             <div className="space-y-5">
                <div className="border border-gray-100 rounded-lg overflow-hidden bg-white">
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">
                    Active Campaigns ({data.campaigns.filter(c => c.status === 'ACTIVE').length})
                  </div>
                  <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-50">
                    {data.campaigns.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">No active campaigns today</div>
                    ) : (
                      data.campaigns.slice().sort((a, b) => b.spend - a.spend).map((c) => (
                        <div key={`${c.accountId || ""}-${c.id}`} className="px-4 py-3 hover:bg-gray-50/50 transition">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-[13px] text-gray-900 truncate pr-2 max-w-[180px]" title={c.name}>{c.name}</div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                              {c.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-500">
                            <span>{inr(c.spend)} spend</span>
                            <span className={c.siteRoas && c.siteRoas >= 1 ? "text-emerald-600 font-bold" : "text-gray-400"}>
                              {c.siteRoas && c.siteRoas > 0 ? `${c.siteRoas.toFixed(2)}x ROAS` : "No conversion"}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] text-gray-400">
                            <div>CPM: {c.cpm ? inr(c.cpm) : "—"}</div>
                            <div>CTR: {c.ctr.toFixed(2)}%</div>
                            <div>Freq: {c.frequency?.toFixed(2) || "—"}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">
                    Recent FB visitors ({data.site.fbSessions} today)
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                    {data.recentFbSessions.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">No FB sessions yet</div>
                    ) : (
                      data.recentFbSessions.map((s) => (
                        <div key={s.session_id} className="px-3 py-2 text-xs">
                          <div className="font-medium text-gray-800 truncate">{s.utm_campaign || "(no campaign)"}</div>
                          <div className="flex justify-between text-gray-400 mt-0.5">
                            <span className="truncate">{s.exit_page || "/"}</span>
                            <span>{new Date(s.started_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
             </div>
          </div>
        </>
      )}

      {data && tab === "history" && (
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI icon={DollarSign} label="30d Spend" value={inr(totals?.spend || 0)} color="bg-rose-50 text-rose-600" />
            <KPI icon={TrendingUp} label="30d Revenue" value={inr(totals?.revenue || 0)} color="bg-emerald-50 text-emerald-600" />
            <KPI icon={Target} label="30d ROAS" value={histRoas > 0 ? `${histRoas.toFixed(2)}x` : "—"} color="bg-indigo-50 text-indigo-600" />
            <KPI icon={ShoppingCart} label="30d Orders" value={String(totals?.orders || 0)} color="bg-green-50 text-green-600" sub={`${totals?.metaPurchases || 0} Meta purch.`} />
          </div>

          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                <Sparkles size={14} className="text-purple-600" /> AI Performance Analysis
              </div>
              <button onClick={runAi} disabled={aiLoading || !data.historic30d}
                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50">
                {aiLoading ? "Thinking..." : "Regenerate AI Analysis"}
              </button>
            </div>
            {aiError && <div className="p-4 text-xs text-rose-600 bg-rose-50 border-b border-rose-100">{aiError}</div>}
            {ai && (
              <div className="p-5 space-y-6">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                         ai.overallHealth === 'good' ? 'bg-emerald-100 text-emerald-700' : 
                         ai.overallHealth === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                       }`}>{ai.overallHealth}</span>
                       <h3 className="font-bold text-gray-900">{ai.headline}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {ai.keyMetrics.map((m, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                           <div className="flex justify-between items-start mb-1">
                             <span className="text-xs text-gray-500">{m.label}</span>
                             <span className={m.trend === 'up' ? 'text-emerald-600' : m.trend === 'down' ? 'text-rose-600' : 'text-gray-400'}>
                               {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}
                             </span>
                           </div>
                           <div className="font-bold text-gray-900">{m.value}</div>
                           <p className="text-[10px] text-gray-500 mt-1">{m.insight}</p>
                        </div>
                      ))}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-600"/> Recommendations</h4>
                      <div className="space-y-2">
                        {ai.recommendations.map((r, i) => (
                          <div key={i} className="bg-white border border-gray-100 rounded-lg p-3 text-xs">
                             <div className="flex justify-between mb-1">
                               <span className="font-bold text-gray-900">{r.action}</span>
                               <span className={`text-[9px] uppercase font-bold ${r.priority === 'high' ? 'text-rose-600' : 'text-amber-600'}`}>{r.priority}</span>
                             </div>
                             <p className="text-gray-600">{r.expectedImpact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Health Alerts</h4>
                      <div className="space-y-2">
                        {ai.alerts.map((a, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-100">
                             <AlertCircle size={14} className="shrink-0 mt-0.5" />
                             <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DeliveryHealthPanel({ data }: { data: MetaData }) {
  const cpm = data.account.cpm || 0;
  const ctr = data.account.ctr || 0;
  const freq = data.account.frequency || 0;
  
  // Basic threshold logic
  const isCpmHigh = cpm > 800; // Example INR threshold
  const isCtrLow = ctr < 0.8;
  const isFreqHigh = freq > 1.8;

  const alerts = [];
  if (isCpmHigh) alerts.push({ label: "High CPM", text: "Auction is expensive today. Monitor ROAS closely.", level: "warning" });
  if (isCtrLow) alerts.push({ label: "Low CTR", text: "Creative fatigue or poor audience match suspected.", level: "critical" });
  if (isFreqHigh) alerts.push({ label: "High Frequency", text: "Users are seeing ads multiple times. Audience saturation.", level: "warning" });

  return (
    <div className="bg-indigo-900 text-white rounded-lg p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
        <Activity size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="text-indigo-300" size={20} />
          <h3 className="font-bold text-lg uppercase tracking-tight">Delivery Health</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="text-[10px] text-indigo-200 uppercase font-bold mb-1">CPM Health</div>
            <div className="text-xl font-bold">{cpm > 0 ? `₹${Math.round(cpm)}` : '—'}</div>
            <div className={`text-[10px] mt-1 ${isCpmHigh ? 'text-rose-300' : 'text-emerald-300'}`}>
              {isCpmHigh ? '● High' : '● Healthy'}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="text-[10px] text-indigo-200 uppercase font-bold mb-1">CTR Health</div>
            <div className="text-xl font-bold">{ctr.toFixed(2)}%</div>
            <div className={`text-[10px] mt-1 ${isCtrLow ? 'text-rose-300' : 'text-emerald-300'}`}>
              {isCtrLow ? '● Low Engagement' : '● Healthy'}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
            <div className="text-[10px] text-indigo-200 uppercase font-bold mb-1">Daily Frequency</div>
            <div className="text-xl font-bold">{freq.toFixed(2)}x</div>
            <div className={`text-[10px] mt-1 ${isFreqHigh ? 'text-rose-300' : 'text-emerald-300'}`}>
              {isFreqHigh ? '● High Saturation' : '● Healthy'}
            </div>
          </div>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 rounded text-[11px] ${a.level === 'critical' ? 'bg-rose-500/20 border border-rose-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                <AlertCircle size={14} className="shrink-0" />
                <div>
                  <span className="font-bold">{a.label}: </span>
                  <span className="opacity-90">{a.text}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[11px] bg-emerald-500/20 border border-emerald-500/30 p-2 rounded">
            <ShieldCheck size={14} className="text-emerald-300" />
            <span>Delivery metrics are within healthy thresholds for today.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, sub, color }: { icon: LucideIcon; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3">
      <div className={`w-7 h-7 rounded-md ${color} flex items-center justify-center mb-2`}>
        <Icon size={14} />
      </div>
      <div className="text-lg font-bold text-gray-900 leading-tight">{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function RoasChart({ daily, todayRoas, todayRevenue, todaySpend }: {
  daily: DailyRow[];
  todayRoas?: number;
  todayRevenue?: number;
  todaySpend?: number;
}) {
  const series = daily.slice().sort((a, b) => a.date.localeCompare(b.date));
  const todayKey = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  const hasToday = series.some(d => d.date === todayKey);
  const points = hasToday ? series : [...series, {
    date: todayKey, spend: todaySpend || 0, impressions: 0, clicks: 0,
    metaPurchases: 0, orders: 0, revenue: todayRevenue || 0, roas: todayRoas || 0,
  }];

  const active = points.filter(p => p.spend > 0);
  const avgRoas = active.length > 0
    ? active.reduce((s, p) => s + p.roas, 0) / active.length
    : 0;

  const W = 800, H = 200, PAD_L = 36, PAD_R = 12, PAD_T = 16, PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const maxRoas = Math.max(2, ...points.map(p => p.roas), avgRoas) * 1.15;
  const n = points.length;
  const x = (i: number) => PAD_L + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => PAD_T + innerH - (v / maxRoas) * innerH;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.roas).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${x(n - 1).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} L ${x(0).toFixed(1)} ${(PAD_T + innerH).toFixed(1)} Z`;
  const yTicks = [0, maxRoas / 2, maxRoas];
  const labelEvery = Math.max(1, Math.ceil(n / 8));

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700 flex items-center justify-between">
        <span className="flex items-center gap-1.5"><TrendingUp size={13} /> ROAS Trend (Last 30 days)</span>
      </div>
      <div className="p-3 bg-white">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[180px]" preserveAspectRatio="none">
          {yTicks.map((t, i) => (
            <g key={i}>
              <line x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} stroke="#f1f5f9" strokeWidth={1} />
              <text x={PAD_L - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#94a3b8">{t.toFixed(1)}x</text>
            </g>
          ))}
          {avgRoas > 0 && (
            <line x1={PAD_L} x2={W - PAD_R} y1={y(avgRoas)} y2={y(avgRoas)} stroke="#10b981" strokeWidth={1} strokeDasharray="5 4" />
          )}
          <defs>
            <linearGradient id="roasFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#roasFill)" />
          <path d={linePath} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => {
            const isToday = p.date === todayKey;
            const cx = x(i), cy = y(p.roas);
            return (
              <g key={p.date}>
                <circle cx={cx} cy={cy} r={isToday ? 5 : 2.5}
                  fill={isToday ? "#f59e0b" : "#6366f1"}
                  stroke={isToday ? "#fff" : "none"} strokeWidth={isToday ? 2 : 0}>
                  <title>{p.date} · ROAS {p.roas.toFixed(2)}x</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
