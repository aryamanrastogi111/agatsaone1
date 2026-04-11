import { useEffect, useState, useCallback } from "react";
import { db } from "@/integrations/supabase/db";
import { Heart, Users, Download, Clock, RefreshCw, ArrowUpRight, Search } from "lucide-react";
import { format } from "date-fns";

interface HeritageVisit {
  id: string;
  email: string | null;
  session_id: string | null;
  landed_at: string;
  clicked_store: string | null;
  clicked_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device: string | null;
  city: string | null;
}

const STORE_LABELS: Record<string, string> = {
  app_store: "App Store",
  play_store: "Play Store",
};

export default function AdminHeritage() {
  const [visits, setVisits] = useState<HeritageVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await db
      .from("heritage_visits")
      .select("*")
      .order("landed_at", { ascending: false })
      .limit(500);
    setVisits(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = search
    ? visits.filter(
        (v) =>
          (v.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (v.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (v.utm_source ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : visits;

  const totalVisits = visits.length;
  const uniqueEmails = new Set(visits.filter((v) => v.email).map((v) => v.email)).size;
  const downloaded = visits.filter((v) => v.clicked_store).length;
  const conversionRate = totalVisits > 0 ? ((downloaded / totalVisits) * 100).toFixed(1) : "0";
  const notClicked = visits.filter((v) => v.email && !v.clicked_store);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart size={20} className="text-red-500" /> Heritage Campaign
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track SanketLife legacy users visiting the heritage page
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Visits"
          value={totalVisits}
          sub={`${uniqueEmails} unique emails`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Download}
          label="Download Clicks"
          value={downloaded}
          sub={`${conversionRate}% conversion`}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={Clock}
          label="Visited, No Download"
          value={notClicked.length}
          sub="Potential resend targets"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          icon={ArrowUpRight}
          label="App Store / Play Store"
          value={`${visits.filter((v) => v.clicked_store === "app_store").length} / ${visits.filter((v) => v.clicked_store === "play_store").length}`}
          sub="Download split"
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by email, city, or source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Visited</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Store</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Device</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No visits recorded yet
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">
                        {v.email || <span className="text-gray-400 italic">No email</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {format(new Date(v.landed_at), "d MMM, h:mm a")}
                    </td>
                    <td className="px-4 py-3">
                      {v.clicked_store ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          ✅ Downloaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                          👀 Viewed only
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {v.clicked_store ? STORE_LABELS[v.clicked_store] || v.clicked_store : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{v.device || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{v.utm_source || "direct"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export hint */}
      {notClicked.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          <strong>{notClicked.length} users</strong> visited the page but didn't click download.
          You can resend the email to these addresses:{" "}
          <button
            onClick={() => {
              const emails = notClicked.map((v) => v.email).filter(Boolean).join(", ");
              navigator.clipboard.writeText(emails);
            }}
            className="underline font-medium hover:text-yellow-900"
          >
            Copy emails to clipboard
          </button>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
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
