// src/pages/admin/Integrations.tsx
import { ExternalLink, CheckCircle, Clock, AlertCircle, RefreshCw, Plug } from "lucide-react";
import { format } from "date-fns";

const SHOPIFY_SYNC = {
  status: "connected",
  lastSync: new Date(Date.now() - 1000 * 60 * 14), // 14 min ago
  productsSynced: 5,
  ordersSynced: 0,
  plan: "Paused (Development)",
  storeUrl: "agatsa-technologies.myshopify.com",
};

interface IntegrationCard {
  name: string;
  description: string;
  status: "connected" | "disconnected" | "placeholder";
  details?: Record<string, string | number>;
  badge?: string;
}

const INTEGRATIONS: IntegrationCard[] = [
  {
    name: "Shopify",
    description: "Primary commerce platform — products, orders, checkout, payments",
    status: "connected",
    badge: "Live",
    details: {
      "Store URL": SHOPIFY_SYNC.storeUrl,
      "Products Synced": SHOPIFY_SYNC.productsSynced,
      "Last Sync": format(SHOPIFY_SYNC.lastSync, "MMM d, HH:mm"),
      "Plan": SHOPIFY_SYNC.plan,
    },
  },
  {
    name: "Razorpay",
    description: "Payment gateway for future native checkout migration",
    status: "placeholder",
    badge: "Future",
  },
  {
    name: "Shiprocket",
    description: "Courier API — auto AWB generation, tracking, RTO management",
    status: "placeholder",
    badge: "Future",
  },
  {
    name: "WhatsApp Business API",
    description: "Order notifications, customer communication, OTP delivery",
    status: "placeholder",
    badge: "Future",
  },
  {
    name: "MongoDB Atlas",
    description: "Device data storage for ECG recordings and health metrics",
    status: "connected",
    badge: "Internal",
    details: {
      "Usage": "ECG & health data",
      "Status": "Active",
    },
  },
  {
    name: "Delhivery / BlueDart",
    description: "Direct courier partner integrations for last-mile delivery",
    status: "placeholder",
    badge: "Future",
  },
];

const STATUS_CONFIG = {
  connected: { color: "bg-green-500/20 text-green-400", icon: CheckCircle, label: "Connected" },
  disconnected: { color: "bg-red-500/20 text-red-400", icon: AlertCircle, label: "Disconnected" },
  placeholder: { color: "bg-gray-500/20 text-gray-400", icon: Clock, label: "Planned" },
};

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">External Commerce Integrations</h2>
        <p className="text-sm text-gray-400">
          Manage and monitor all external platform connections. Shopify runs the live store while this panel manages internal operations.
        </p>
      </div>

      {/* Architecture note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
        <Plug size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-300">Migration-Ready Architecture</p>
          <p className="text-xs text-blue-400/80 mt-0.5">
            This admin panel is built with a clean separation of concerns. Products, orders, customers, and subscriptions all have independent database models.
            When ready, Shopify can be removed and replaced with native commerce flows without rebuilding the admin interface.
          </p>
        </div>
      </div>

      {/* Shopify status banner */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#96bf48]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#96bf48] font-bold text-sm">S</span>
            </div>
            <div>
              <p className="font-semibold text-white">Shopify Store</p>
              <p className="text-xs text-gray-400">{SHOPIFY_SYNC.storeUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Last Sync</p>
              <p className="text-sm text-white">{format(SHOPIFY_SYNC.lastSync, "HH:mm, MMM d")}</p>
            </div>
            <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-medium">● Connected</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-800">
          {[
            { label: "Products Synced", val: SHOPIFY_SYNC.productsSynced },
            { label: "Orders Synced", val: SHOPIFY_SYNC.ordersSynced },
            { label: "Sync Plan", val: SHOPIFY_SYNC.plan },
            { label: "Direction", val: "Shopify → Read only" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-sm text-white mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400">
            ⚠️ Shopify is handling live commerce (checkout, payments). Do not modify Shopify flows from this panel.
            This admin panel coexists with Shopify and manages internal operations independently.
          </p>
        </div>
      </div>

      {/* All integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map(integration => {
          const cfg = STATUS_CONFIG[integration.status];
          return (
            <div key={integration.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{integration.name}</p>
                    {integration.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        integration.badge === "Live" ? "bg-green-500/20 text-green-400" :
                        integration.badge === "Internal" ? "bg-blue-500/20 text-blue-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}>{integration.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{integration.description}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ml-3 ${cfg.color}`}>
                  <cfg.icon size={10} />
                  {cfg.label}
                </span>
              </div>
              {integration.details && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
                  {Object.entries(integration.details).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-gray-500">{k}</p>
                      <p className="text-xs text-gray-300">{String(v)}</p>
                    </div>
                  ))}
                </div>
              )}
              {integration.status === "placeholder" && (
                <div className="pt-2 border-t border-gray-800">
                  <p className="text-xs text-gray-600">Integration available when backend migration is ready</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Migration roadmap */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Shopify Migration Roadmap</h3>
        <div className="space-y-3">
          {[
            { phase: "Phase 1", label: "Internal admin panel (products, orders, customers)", status: "done" },
            { phase: "Phase 2", label: "All backend tables and RLS policies in place", status: "done" },
            { phase: "Phase 3", label: "Native checkout with Razorpay integration", status: "upcoming" },
            { phase: "Phase 4", label: "Migrate live orders to native backend", status: "upcoming" },
            { phase: "Phase 5", label: "Decommission Shopify", status: "future" },
          ].map(step => (
            <div key={step.phase} className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs
                ${step.status === "done" ? "bg-green-500/20 text-green-400" :
                  step.status === "upcoming" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-gray-500/20 text-gray-600"}`}>
                {step.status === "done" ? "✓" : "·"}
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 font-medium">{step.phase} — </span>
                <span className={`text-sm ${step.status === "done" ? "text-white" : step.status === "upcoming" ? "text-yellow-300" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0
                ${step.status === "done" ? "bg-green-500/10 text-green-500" :
                  step.status === "upcoming" ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-gray-500/10 text-gray-500"}`}>
                {step.status === "done" ? "Complete" : step.status === "upcoming" ? "Next" : "Future"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
