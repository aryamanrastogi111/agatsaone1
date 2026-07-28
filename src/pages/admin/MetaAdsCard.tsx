import { useCallback, useEffect, useState } from "react";
import { RefreshCw, TrendingUp, DollarSign, MousePointerClick, Eye, ShoppingCart, Target, AlertCircle, Sparkles, Calendar, type LucideIcon } from "lucide-react";

interface Campaign {
  accountId?: string;
  id: string;
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  metaPurchases: number;
  siteSessions: number;
  siteOrders?: number;
  siteRevenue?: number;
  siteRoas?: number;

}

interface AccountSummary {
  accountId: string;
  spend: number; impressions: number; clicks: number;
  ctr: number; cpc: number; metaPurchases: number;
}

interface DailyRow {
  date: string; spend: number; impressions: number; clicks: number;
  metaPurchases: number; orders: number; revenue: number; roas: number;
}

interface MetaData {
  generatedAt: string;
  accountIds?: string[];
  account: {
    spend: number; impressions: number; clicks: number; reach: number;
    ctr: number; cpc: number; metaPurchases: number; metaInitiateCheckout: number;
  };
  accounts?: AccountSummary[];
  site: { fbSessions: number; paidOrders: number; revenueToday: number; roas: number; attributedPaidOrders?: number; unattributedPaidOrders?: number; unattributedRevenue?: number };
  campaigns: Campaign[];
  recentFbSessions: Array<{ session_id: string; started_at: string; utm_campaign: string | null; utm_content: string | null; exit_page: string | null }>;
  historic30d?: {
    daily: DailyRow[];
    campaigns: Campaign[];
    totals: { spend: number; revenue: number; orders: number; metaPurchases: number };
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
  const bestDays = [...daily].filter(d => d.spend > 0 || d.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const bestRoasDays = [...daily].filter(d => d.spend > 100)
    .sort((a, b) => b.roas - a.roas).slice(0, 5);
  const totals = data?.historic30d?.totals;
  const histRoas = totals && totals.spend > 0 ? totals.revenue / totals.spend : 0;

  const healthColor = (h?: string) =>
    h === "good" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : h === "critical" ? "bg-rose-50 border-rose-200 text-rose-800"
    : "bg-amber-50 border-amber-200 text-amber-800";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">f</div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Facebook / Meta Ads</h2>
            <p className="text-xs text-gray-500">
              Live spend, ROAS, and campaign performance (IST)
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 p-5">
            <KPI icon={DollarSign} label="Spend" value={inr(data.account.spend)} color="bg-rose-50 text-rose-600" />
            <KPI icon={Target} label="ROAS" value={data.site.roas > 0 ? `${data.site.roas.toFixed(2)}x` : "—"} color="bg-emerald-50 text-emerald-600" sub={`${inr(data.site.revenueToday)} rev`} />
            <KPI icon={Eye} label="Impressions" value={data.account.impressions.toLocaleString("en-IN")} color="bg-blue-50 text-blue-600" />
            <KPI icon={MousePointerClick} label="Clicks" value={data.account.clicks.toLocaleString("en-IN")} color="bg-indigo-50 text-indigo-600" sub={`${data.account.ctr.toFixed(2)}% CTR`} />
            <KPI icon={TrendingUp} label="CPC" value={data.account.cpc > 0 ? inr(data.account.cpc) : "—"} color="bg-purple-50 text-purple-600" />
            <KPI icon={ShoppingCart} label="Initiate Checkout" value={data.account.metaInitiateCheckout.toLocaleString("en-IN")} color="bg-orange-50 text-orange-600" sub="Meta reported" />
            <KPI icon={ShoppingCart} label="Purchases" value={data.account.metaPurchases.toLocaleString("en-IN")} color="bg-green-50 text-green-600" sub={`${data.site.paidOrders} paid on site`} />
          </div>

          {typeof data.site.unattributedPaidOrders === "number" && data.site.paidOrders > 0 && (
            <div className="mx-5 mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold">Attribution today:</span>
              <span>{data.site.attributedPaidOrders ?? 0} of {data.site.paidOrders} paid orders matched to a Meta campaign</span>
              {data.site.unattributedPaidOrders > 0 && (
                <span className="text-amber-800">· {data.site.unattributedPaidOrders} unattributed ({inr(data.site.unattributedRevenue || 0)})</span>
              )}
              <span className="text-amber-700/80">— unattributed orders had no FB UTM/fbclid in their session; 30-day localStorage window is now enabled for future clicks.</span>
            </div>
          )}


          {data.accounts && data.accounts.length > 1 && (
            <div className="px-5 pb-3">
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">Per ad account</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100">
                        <th className="text-left px-3 py-2 font-medium">Account</th>
                        <th className="text-right px-3 py-2 font-medium">Spend</th>
                        <th className="text-right px-3 py-2 font-medium">Impr.</th>
                        <th className="text-right px-3 py-2 font-medium">Clicks</th>
                        <th className="text-right px-3 py-2 font-medium">CTR</th>
                        <th className="text-right px-3 py-2 font-medium">CPC</th>
                        <th className="text-right px-3 py-2 font-medium">Purch.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.accounts.map((a) => (
                        <tr key={a.accountId} className="border-b border-gray-50">
                          <td className="px-3 py-2 font-mono text-gray-700">{a.accountId}</td>
                          <td className="px-3 py-2 text-right">{inr(a.spend)}</td>
                          <td className="px-3 py-2 text-right">{a.impressions.toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2 text-right">{a.clicks.toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2 text-right">{a.ctr.toFixed(2)}%</td>
                          <td className="px-3 py-2 text-right">{a.cpc > 0 ? inr(a.cpc) : "—"}</td>
                          <td className="px-3 py-2 text-right">{a.metaPurchases}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="px-5 pb-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">Campaigns (today)</div>
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-white sticky top-0">
                    <tr className="text-gray-500 border-b border-gray-100">
                      <th className="text-left px-3 py-2 font-medium">Campaign</th>
                      <th className="text-right px-3 py-2 font-medium">Spend</th>
                      <th className="text-right px-3 py-2 font-medium">Clicks</th>
                      <th className="text-right px-3 py-2 font-medium">CTR</th>
                      <th className="text-right px-3 py-2 font-medium">Purch.</th>
                      <th className="text-right px-3 py-2 font-medium">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.length === 0 ? (
                      <tr><td colSpan={6} className="text-center text-gray-400 py-6">No active campaigns today</td></tr>
                    ) : (
                      data.campaigns.slice().sort((a, b) => b.spend - a.spend).map((c) => (
                        <tr key={`${c.accountId || ""}-${c.id}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-[220px]">
                            {c.name}
                            {c.accountId && data.accounts && data.accounts.length > 1 && (
                              <div className="text-[10px] text-gray-400 font-mono truncate">{c.accountId}</div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">{inr(c.spend)}</td>
                          <td className="px-3 py-2 text-right">{c.clicks}</td>
                          <td className="px-3 py-2 text-right">{c.ctr.toFixed(2)}%</td>
                          <td className="px-3 py-2 text-right">{c.metaPurchases}</td>
                          <td className="px-3 py-2 text-right text-blue-600 font-medium">{c.siteSessions}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">
                Recent FB visitors ({data.site.fbSessions} today)
              </div>
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                {data.recentFbSessions.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400">No FB-attributed sessions yet today</div>
                ) : (
                  data.recentFbSessions.map((s) => (
                    <div key={s.session_id} className="px-3 py-2 text-xs">
                      <div className="font-medium text-gray-800 truncate">{s.utm_campaign || "(no campaign)"}</div>
                      {s.utm_content && <div className="text-gray-500 truncate">Ad: {s.utm_content}</div>}
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
        </>
      )}

      {data && tab === "history" && (
        <div className="p-5 space-y-5">
          {/* 30d totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI icon={DollarSign} label="30d Spend" value={inr(totals?.spend || 0)} color="bg-rose-50 text-rose-600" />
            <KPI icon={TrendingUp} label="30d Revenue" value={inr(totals?.revenue || 0)} color="bg-emerald-50 text-emerald-600" />
            <KPI icon={Target} label="30d ROAS" value={histRoas > 0 ? `${histRoas.toFixed(2)}x` : "—"} color="bg-indigo-50 text-indigo-600" />
            <KPI icon={ShoppingCart} label="30d Orders" value={String(totals?.orders || 0)} color="bg-green-50 text-green-600" sub={`${totals?.metaPurchases || 0} Meta purch.`} />
          </div>

          {/* AI Analysis */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                <Sparkles size={14} className="text-purple-600" /> AI Facebook Analysis
              </div>
              <button onClick={runAi} disabled={aiLoading || !data.historic30d}
                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-50">
                {aiLoading ? "Analyzing…" : ai ? "Re-analyze" : "Run analysis"}
              </button>
            </div>
            {aiError && <div className="p-3 text-xs text-rose-700 bg-rose-50">{aiError}</div>}
            {!ai && !aiLoading && !aiError && (
              <div className="p-6 text-center text-xs text-gray-400">Click "Run analysis" to get AI insights on spend vs revenue, best/worst days, and campaign verdicts.</div>
            )}
            {ai && (
              <div className="p-4 space-y-4">
                <div className={`border rounded-lg p-3 text-sm ${healthColor(ai.overallHealth)}`}>
                  <div className="text-[10px] uppercase font-semibold opacity-70">{ai.overallHealth}</div>
                  <div className="font-medium">{ai.headline}</div>
                </div>

                {ai.alerts?.length > 0 && (
                  <div className="space-y-1">
                    {ai.alerts.map((a, i) => (
                      <div key={i} className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2 flex items-start gap-2">
                        <AlertCircle size={13} className="mt-0.5 shrink-0" /> {a}
                      </div>
                    ))}
                  </div>
                )}

                {ai.keyMetrics?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ai.keyMetrics.map((m, i) => (
                      <div key={i} className="border border-gray-100 rounded-md p-2.5">
                        <div className="text-[10px] uppercase text-gray-500">{m.label}</div>
                        <div className="text-sm font-bold text-gray-900">{m.value}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{m.insight}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ai.bestDays?.length > 0 && (
                    <div className="border border-emerald-100 rounded-lg overflow-hidden">
                      <div className="px-3 py-2 bg-emerald-50 text-xs font-semibold text-emerald-800">Best days</div>
                      <div className="divide-y divide-gray-50">
                        {ai.bestDays.map((d, i) => (
                          <div key={i} className="px-3 py-2 text-xs">
                            <div className="flex justify-between font-medium text-gray-800">
                              <span>{d.date}</span>
                              <span>{inr(d.revenue)} · {d.roas.toFixed(2)}x</span>
                            </div>
                            <div className="text-gray-500 mt-0.5">{d.why}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {ai.worstDays?.length > 0 && (
                    <div className="border border-rose-100 rounded-lg overflow-hidden">
                      <div className="px-3 py-2 bg-rose-50 text-xs font-semibold text-rose-800">Worst days</div>
                      <div className="divide-y divide-gray-50">
                        {ai.worstDays.map((d, i) => (
                          <div key={i} className="px-3 py-2 text-xs">
                            <div className="flex justify-between font-medium text-gray-800">
                              <span>{d.date}</span>
                              <span>{inr(d.revenue)} · {d.roas.toFixed(2)}x</span>
                            </div>
                            <div className="text-gray-500 mt-0.5">{d.why}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {ai.topCampaigns?.length > 0 && (
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-700">Campaign verdicts</div>
                    <table className="w-full text-xs">
                      <tbody>
                        {ai.topCampaigns.map((c, i) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-[280px]">{c.name}</td>
                            <td className="px-3 py-2 text-right text-gray-600">{inr(c.spend)}</td>
                            <td className="px-3 py-2 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                c.verdict === "scale" ? "bg-emerald-100 text-emerald-800"
                                : c.verdict === "cut" ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                              }`}>{c.verdict}</span>
                            </td>
                            <td className="px-3 py-2 text-gray-500 max-w-[300px]">{c.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {ai.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-700">Recommendations</div>
                    {ai.recommendations.map((r, i) => (
                      <div key={i} className="border border-gray-100 rounded-md p-3 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            r.priority === "high" ? "bg-rose-100 text-rose-800"
                            : r.priority === "medium" ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                          }`}>{r.priority}</span>
                          <span className="text-[10px] text-gray-500">{r.timeframe}</span>
                        </div>
                        <div className="font-medium text-gray-900">{r.action}</div>
                        <div className="text-gray-500 mt-0.5">{r.expectedImpact}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Daily table */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Calendar size={13} /> Daily performance (last 30 days)
            </div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-white sticky top-0">
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left px-3 py-2 font-medium">Date</th>
                    <th className="text-right px-3 py-2 font-medium">Spend</th>
                    <th className="text-right px-3 py-2 font-medium">Impr.</th>
                    <th className="text-right px-3 py-2 font-medium">Clicks</th>
                    <th className="text-right px-3 py-2 font-medium">Meta Purch.</th>
                    <th className="text-right px-3 py-2 font-medium">Orders</th>
                    <th className="text-right px-3 py-2 font-medium">Revenue</th>
                    <th className="text-right px-3 py-2 font-medium">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {daily.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-gray-400 py-6">No data</td></tr>
                  ) : (
                    daily.slice().reverse().map((d) => (
                      <tr key={d.date} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-3 py-2 font-medium text-gray-800">{d.date}</td>
                        <td className="px-3 py-2 text-right">{inr(d.spend)}</td>
                        <td className="px-3 py-2 text-right">{d.impressions.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2 text-right">{d.clicks}</td>
                        <td className="px-3 py-2 text-right">{d.metaPurchases}</td>
                        <td className="px-3 py-2 text-right">{d.orders}</td>
                        <td className="px-3 py-2 text-right">{inr(d.revenue)}</td>
                        <td className={`px-3 py-2 text-right font-medium ${
                          d.roas >= 2 ? "text-emerald-700"
                          : d.roas >= 1 ? "text-amber-700"
                          : d.spend > 0 ? "text-rose-700" : "text-gray-400"
                        }`}>{d.spend > 0 ? `${d.roas.toFixed(2)}x` : "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 30d campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">Top revenue days</div>
              <table className="w-full text-xs">
                <tbody>
                  {bestDays.map((d) => (
                    <tr key={d.date} className="border-b border-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-800">{d.date}</td>
                      <td className="px-3 py-2 text-right">{inr(d.revenue)}</td>
                      <td className="px-3 py-2 text-right text-gray-500">{d.orders} orders</td>
                      <td className="px-3 py-2 text-right text-emerald-700 font-medium">{d.spend > 0 ? `${d.roas.toFixed(2)}x` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">Best ROAS days (spend &gt; ₹100)</div>
              <table className="w-full text-xs">
                <tbody>
                  {bestRoasDays.map((d) => (
                    <tr key={d.date} className="border-b border-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-800">{d.date}</td>
                      <td className="px-3 py-2 text-right">{inr(d.spend)} spend</td>
                      <td className="px-3 py-2 text-right">{inr(d.revenue)}</td>
                      <td className="px-3 py-2 text-right text-emerald-700 font-medium">{d.roas.toFixed(2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">Campaigns (last 30 days)</div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-white sticky top-0">
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="text-left px-3 py-2 font-medium">Campaign</th>
                    <th className="text-right px-3 py-2 font-medium">Spend</th>
                    <th className="text-right px-3 py-2 font-medium">Clicks</th>
                    <th className="text-right px-3 py-2 font-medium">CTR</th>
                    <th className="text-right px-3 py-2 font-medium">CPC</th>
                    <th className="text-right px-3 py-2 font-medium">Meta Purch.</th>
                    <th className="text-right px-3 py-2 font-medium">Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.historic30d?.campaigns ?? []).map((c) => (
                    <tr key={`${c.accountId || ""}-${c.id}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-[260px]">
                        {c.name}
                        {c.accountId && data.accounts && data.accounts.length > 1 && (
                          <div className="text-[10px] text-gray-400 font-mono truncate">{c.accountId}</div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">{inr(c.spend)}</td>
                      <td className="px-3 py-2 text-right">{c.clicks}</td>
                      <td className="px-3 py-2 text-right">{c.ctr.toFixed(2)}%</td>
                      <td className="px-3 py-2 text-right">{c.cpc > 0 ? inr(c.cpc) : "—"}</td>
                      <td className="px-3 py-2 text-right">{c.metaPurchases}</td>
                      <td className="px-3 py-2 text-right text-blue-600 font-medium">{c.siteSessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
