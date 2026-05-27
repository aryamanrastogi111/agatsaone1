// src/pages/admin/Settings.tsx
import { useState } from "react";
import { Building, Bell, Tag, Globe, ChevronRight, Check } from "lucide-react";

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
    email: "info@agatsa.com",
    phone: "+91 98765 43210",
    address: "Bengaluru, Karnataka, India",
    gst: "29XXXXX1234Z1ZX",
    website: "https://agatsaone.com",
  });
  const [saved, setSaved] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Company configuration and admin preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="w-full lg:w-56 shrink-0">
          <nav className="bg-white border border-gray-200 rounded-xl p-2 space-y-1 shadow-sm">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${section === s.id ? "bg-blue-50 text-blue-700 border border-blue-100 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                <s.icon size={16} className="shrink-0" />
                <span>{s.label}</span>
                <ChevronRight size={12} className="ml-auto opacity-50" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {section === "company" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-gray-900">Company Details</h3>
              {[
                { label: "Company Name", key: "name" },
                { label: "Support Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Address", key: "address" },
                { label: "GST Number", key: "gst" },
                { label: "Website", key: "website" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 block mb-1 font-medium">{f.label}</label>
                  <input value={(company as any)[f.key]} onChange={e => setCompany(c => ({ ...c, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              ))}
              <button onClick={save}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors
                  ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                {saved ? <><Check size={14} /> Saved</> : "Save Changes"}
              </button>
            </div>
          )}

          {section === "categories" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-gray-900">Product Categories</h3>
              <p className="text-sm text-gray-500">Default categories for product organization</p>
              <div className="space-y-2">
                {categories.map(c => (
                  <div key={c} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-900">{c}</span>
                    <button onClick={() => setCategories(cats => cats.filter(cat => cat !== c))}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  placeholder="New category name…"
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm" />
                <button onClick={() => { if (newCategory.trim()) { setCategories(c => [...c, newCategory.trim()]); setNewCategory(""); } }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Add</button>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
              {[
                { label: "New order received", key: "new_order", default: true },
                { label: "Low stock alert", key: "low_stock", default: true },
                { label: "Return request created", key: "new_return", default: true },
                { label: "New support ticket", key: "new_ticket", default: false },
                { label: "Subscription renewal due", key: "renewal", default: false },
                { label: "Lead follow-up due", key: "followup", default: false },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-900">{n.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={n.default} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {section === "integrations_placeholder" && (
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-gray-900">External Connections</h3>
              <p className="text-sm text-gray-500">Manage API and platform integrations</p>
              {[
                { label: "Razorpay", status: "Connected", statusColor: "bg-green-100 text-green-700", desc: "Payment gateway for order processing" },
                { label: "Shiprocket", status: "Not connected", statusColor: "bg-gray-100 text-gray-500", desc: "Courier aggregator for shipping" },
                { label: "Twilio / WhatsApp", status: "Not connected", statusColor: "bg-gray-100 text-gray-500", desc: "Customer communication & OTP" },
                { label: "Mailchimp", status: "Not connected", statusColor: "bg-gray-100 text-gray-500", desc: "Email marketing automation" },
                { label: "Google Analytics", status: "Not connected", statusColor: "bg-gray-100 text-gray-500", desc: "Website traffic analytics" },
              ].map(i => (
                <div key={i.label} className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{i.label}</p>
                    <p className="text-xs text-gray-400">{i.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${i.statusColor}`}>{i.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
