// src/pages/admin/Settings.tsx
import { useState } from "react";
import { Building, Bell, Tag, Globe, Puzzle, ChevronRight } from "lucide-react";

const SECTIONS = [
  { id: "company", icon: Building, label: "Company Details" },
  { id: "categories", icon: Tag, label: "Product Categories" },
  { id: "notifications", icon: Bell, label: "Notification Preferences" },
  { id: "integrations_placeholder", icon: Globe, label: "External Connections" },
];

const DEFAULT_CATEGORIES = [
  "ECG Monitors", "Smart Scales & Composition", "Wearable Fitness", "Clinical Diagnostics",
  "Device Accessories", "Subscription Plans", "Bundles",
];

export default function Settings() {
  const [section, setSection] = useState("company");
  const [company, setCompany] = useState({
    name: "Agatsa Technologies Pvt. Ltd.",
    email: "support@agatsa.com",
    phone: "+91 98765 43210",
    address: "Bengaluru, Karnataka, India",
    gst: "29XXXXX1234Z1ZX",
    website: "https://agatsaone.com",
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-gray-400">Company configuration and admin preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="w-full lg:w-56 shrink-0">
          <nav className="bg-gray-900 border border-gray-800 rounded-xl p-2 space-y-1">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${section === s.id ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
                <s.icon size={16} className="shrink-0" />
                <span>{s.label}</span>
                <ChevronRight size={12} className="ml-auto" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
          {section === "company" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-white">Company Details</h3>
              {[
                { label: "Company Name", key: "name" },
                { label: "Support Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Address", key: "address" },
                { label: "GST Number", key: "gst" },
                { label: "Website", key: "website" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 block mb-1">{f.label}</label>
                  <input value={(company as any)[f.key]} onChange={e => setCompany(c => ({ ...c, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500" />
                </div>
              ))}
              <button onClick={save}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors
                  ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
                {saved ? "✓ Saved" : "Save Changes"}
              </button>
            </div>
          )}

          {section === "categories" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-white">Product Categories</h3>
              <p className="text-sm text-gray-400">Default categories for product organization</p>
              <div className="space-y-2">
                {DEFAULT_CATEGORIES.map(c => (
                  <div key={c} className="flex items-center justify-between px-4 py-2.5 bg-gray-800 rounded-lg">
                    <span className="text-sm text-white">{c}</span>
                    <button className="text-xs text-gray-500 hover:text-red-400 transition-colors">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input placeholder="New category name…"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm" />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm">Add</button>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-white">Notification Preferences</h3>
              {[
                { label: "New order received", key: "new_order", default: true },
                { label: "Low stock alert", key: "low_stock", default: true },
                { label: "Return request created", key: "new_return", default: true },
                { label: "New support ticket", key: "new_ticket", default: false },
                { label: "Subscription renewal due", key: "renewal", default: false },
                { label: "Lead follow-up due", key: "followup", default: false },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg">
                  <span className="text-sm text-white">{n.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={n.default} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {section === "integrations_placeholder" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-white">External Connections</h3>
              <p className="text-sm text-gray-400">Placeholder section for future API and platform integrations</p>
              {[
                { label: "Razorpay", status: "Not connected", desc: "Payment gateway for order processing" },
                { label: "Shiprocket", status: "Not connected", desc: "Courier aggregator for shipping" },
                { label: "Twilio / WhatsApp", status: "Not connected", desc: "Customer communication & OTP" },
                { label: "Mailchimp", status: "Not connected", desc: "Email marketing automation" },
                { label: "Google Analytics", status: "Not connected", desc: "Website traffic analytics" },
              ].map(i => (
                <div key={i.label} className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">{i.label}</p>
                    <p className="text-xs text-gray-400">{i.desc}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full">{i.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
