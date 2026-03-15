// src/pages/admin/Integrations.tsx
import { CheckCircle, Clock, AlertCircle, Plug } from "lucide-react";
import { format } from "date-fns";

const SHOPIFY_SYNC = {
  lastSync: new Date(Date.now() - 1000 * 60 * 14),
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
    description: "Native payment gateway for checkout",
    status: "connected",
    badge: "Active",
    details: { "Usage": "Order payments", "Status": "Live" },
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
    details: { "Usage": "ECG & health data", "Status": "Active" },
  },
  {
    name: "Delhivery / BlueDart",
    description: "Direct courier partner integrations for last-mile delivery",
    status: "placeholder",
    badge: "Future",
  },
];

const STATUS_CONFIG = {
  connected: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Connected" },
  disconnected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Disconnected" },
  placeholder: { color: "bg-gray-100 text-gray-500", icon: Clock, label: "Planned" },
};

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Integrations</h2>
        <p className="text-sm text-gray-500">
          Manage and monitor all external platform connections.
        </p>
      </div>

      {/* Architecture note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Plug size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Migration-Ready Architecture</p>
          <p className="text-xs text-blue-600 mt-0.5">
            This admin panel is built with a clean separation of concerns. Products, orders, customers, and subscriptions all have independent database models.
            Shopify can be removed and replaced with native commerce flows without rebuilding the admin interface.
          </p>
        </div>
      </div>

      {/* Shopify status banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-700 font-bold text-sm">S</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Shopify Store</p>
              <p className="text-xs text-gray-400">{SHOPIFY_SYNC.storeUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Last Sync</p>
              <p className="text-sm text-gray-700">{format(SHOPIFY_SYNC.lastSync, "HH:mm, MMM d")}</p>
            </div>
            <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">● Connected</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          {[
            { label: "Products Synced", val: SHOPIFY_SYNC.productsSynced },
            { label: "Orders Synced", val: SHOPIFY_SYNC.ordersSynced },
            { label: "Sync Plan", val: SHOPIFY_SYNC.plan },
            { label: "Direction", val: "Shopify → Read only" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-sm text-gray-700 font-medium mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            ⚠️ Shopify is handling live commerce (checkout, payments). Do not modify Shopify flows from this panel.
          </p>
        </div>
      </div>

      {/* All integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map(integration => {
          const cfg = STATUS_CONFIG[integration.status];
          return (
            <div key={integration.name} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{integration.name}</p>
                    {integration.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        integration.badge === "Live" || integration.badge === "Active" ? "bg-green-100 text-green-700" :
                        integration.badge === "Internal" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-500"
                      }`}>{integration.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{integration.description}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ml-3 font-medium ${cfg.color}`}>
                  <cfg.icon size={10} />
                  {cfg.label}
                </span>
              </div>
              {integration.details && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  {Object.entries(integration.details).map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-gray-400">{k}</p>
                      <p className="text-xs text-gray-700 font-medium">{String(v)}</p>
                    </div>
                  ))}
                </div>
              )}
              {integration.status === "placeholder" && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Integration available when backend migration is ready</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Migration roadmap */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Shopify Migration Roadmap</h3>
        <div className="space-y-3">
          {[
            { phase: "Phase 1", label: "Internal admin panel (products, orders, customers)", status: "done" },
            { phase: "Phase 2", label: "All backend tables and RLS policies in place", status: "done" },
            { phase: "Phase 3", label: "Native checkout with Razorpay integration", status: "done" },
            { phase: "Phase 4", label: "Migrate live orders to native backend", status: "upcoming" },
            { phase: "Phase 5", label: "Decommission Shopify", status: "future" },
          ].map(step => (
            <div key={step.phase} className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                ${step.status === "done" ? "bg-green-100 text-green-600" :
                  step.status === "upcoming" ? "bg-yellow-100 text-yellow-600" :
                  "bg-gray-100 text-gray-400"}`}>
                {step.status === "done" ? "✓" : "·"}
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-400 font-medium">{step.phase} — </span>
                <span className={`text-sm ${step.status === "done" ? "text-gray-900" : step.status === "upcoming" ? "text-yellow-700" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0
                ${step.status === "done" ? "bg-green-100 text-green-700" :
                  step.status === "upcoming" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-400"}`}>
                {step.status === "done" ? "Complete" : step.status === "upcoming" ? "Next" : "Future"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
