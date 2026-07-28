import { useCallback, useEffect, useState } from "react";
import { RefreshCw, TrendingUp, DollarSign, MousePointerClick, Eye, ShoppingCart, Target, AlertCircle, type LucideIcon } from "lucide-react";

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
}

interface AccountSummary {
  accountId: string;
  spend: number; impressions: number; clicks: number;
  ctr: number; cpc: number; metaPurchases: number;
}

interface MetaData {
  generatedAt: string;
  accountIds?: string[];
  account: {
    spend: number; impressions: number; clicks: number; reach: number;
    ctr: number; cpc: number; metaPurchases: number; metaInitiateCheckout: number;
  };
  accounts?: AccountSummary[];
  site: { fbSessions: number; paidOrders: number; revenueToday: number; roas: number };
  campaigns: Campaign[];
  recentFbSessions: Array<{ session_id: string; started_at: string; utm_campaign: string | null; utm_content: string | null; exit_page: string | null }>;
}

export default function MetaAdsCard() {
  const [data, setData] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchInsights();
    const t = setInterval(fetchInsights, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(t);
  }, [fetchInsights]);

  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">f</div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Facebook / Meta Ads — Today</h2>
            <p className="text-xs text-gray-500">
              Live spend, ROAS, and campaign performance (IST)
              {data?.accountIds && data.accountIds.length > 0 && ` · ${data.accountIds.length} ad account${data.accountIds.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <button onClick={fetchInsights} disabled={loading}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-white transition">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
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

      {data && (
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

          {data.accounts && data.accounts.length > 1 && (
            <div className="px-5 pb-3">
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">
                  Per ad account
                </div>
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
            {/* Campaigns table */}
            <div className="lg:col-span-2 border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-700">Campaigns</div>
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
                      data.campaigns.map((c) => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-3 py-2 font-medium text-gray-800 truncate max-w-[200px]">{c.name}</td>
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

            {/* Recent FB sessions */}
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
