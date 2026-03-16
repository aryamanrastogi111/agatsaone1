import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Zap, CheckCircle, XCircle, Eye, EyeOff, Save, RefreshCw,
  AlertTriangle, Info,
} from "lucide-react";
import { toast } from "sonner";

// ─── Platform metadata ────────────────────────────────────────────────────────
interface FieldDef { key: string; label: string; placeholder: string; secret?: boolean; help?: string }
interface PlatformDef {
  platform: string;
  label: string;
  description: string;
  docsUrl: string;
  color: string;
  logo: string;
  fields: FieldDef[];
  serverSide?: boolean;
}

const PLATFORMS: PlatformDef[] = [
  {
    platform: "gtm",
    label: "Google Tag Manager",
    description: "Inject all your tags, triggers, and variables through a single GTM container. Recommended as the primary tracking layer.",
    docsUrl: "https://support.google.com/tagmanager/answer/6103696",
    color: "bg-blue-50 border-blue-200",
    logo: "🏷️",
    fields: [
      { key: "container_id", label: "Container ID", placeholder: "GTM-XXXXXXX", help: "Found in GTM dashboard → Admin → Container ID" },
    ],
  },
  {
    platform: "ga4",
    label: "Google Analytics 4",
    description: "Track page views, events, and conversions natively via GA4 measurement protocol. Skip if you're using GA4 inside GTM.",
    docsUrl: "https://support.google.com/analytics/answer/9304153",
    color: "bg-orange-50 border-orange-200",
    logo: "📊",
    fields: [
      { key: "measurement_id", label: "Measurement ID", placeholder: "G-XXXXXXXXXX", help: "Found in GA4 → Admin → Data Streams → Web stream" },
    ],
  },
  {
    platform: "meta_pixel",
    label: "Meta (Facebook) Pixel",
    description: "Fire browser-side pixel events for Facebook & Instagram ads — PageView, ViewContent, AddToCart, Purchase.",
    docsUrl: "https://www.facebook.com/business/help/952192354843755",
    color: "bg-indigo-50 border-indigo-200",
    logo: "📘",
    fields: [
      { key: "pixel_id", label: "Pixel ID", placeholder: "1234567890123456", help: "Found in Meta Events Manager → your Pixel → Settings" },
    ],
  },
  {
    platform: "meta_capi",
    label: "Meta Conversions API (CAPI)",
    description: "Server-side event sending for Meta ads. Bypasses ad-blockers and iOS 14+ restrictions. Runs from the backend only.",
    docsUrl: "https://developers.facebook.com/docs/marketing-api/conversions-api",
    color: "bg-violet-50 border-violet-200",
    logo: "🔗",
    serverSide: true,
    fields: [
      { key: "pixel_id", label: "Pixel ID", placeholder: "1234567890123456", help: "Same Pixel ID as Meta Pixel above" },
      { key: "access_token", label: "CAPI Access Token", placeholder: "EAAxxxx...", secret: true, help: "Found in Meta Events Manager → your Pixel → Settings → Conversions API → Generate token" },
    ],
  },
  {
    platform: "tiktok",
    label: "TikTok Pixel",
    description: "Track page views and conversion events for TikTok Ads campaigns.",
    docsUrl: "https://ads.tiktok.com/help/article/tiktok-pixel",
    color: "bg-gray-50 border-gray-200",
    logo: "🎵",
    fields: [
      { key: "pixel_id", label: "Pixel ID", placeholder: "CXXXXXXXXXXXXXXXXXX", help: "Found in TikTok Ads Manager → Assets → Events → Web Events" },
    ],
  },
  {
    platform: "pinterest",
    label: "Pinterest Tag",
    description: "Measure Pinterest ad performance and retarget visitors.",
    docsUrl: "https://help.pinterest.com/en/business/article/install-the-pinterest-tag",
    color: "bg-red-50 border-red-200",
    logo: "📌",
    fields: [
      { key: "tag_id", label: "Tag ID", placeholder: "1234567890123", help: "Found in Pinterest Ads → Conversions → Pinterest Tag" },
    ],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface PixelRow {
  platform: string;
  is_enabled: boolean;
  config: Record<string, string>;
  updated_at: string;
}

// ─── SecretInput ──────────────────────────────────────────────────────────────
function SecretInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pr-9 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm font-mono"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ─── PlatformCard ─────────────────────────────────────────────────────────────
function PlatformCard({
  def,
  row,
  onToggle,
  onSave,
  saving,
}: {
  def: PlatformDef;
  row: PixelRow;
  onToggle: () => void;
  onSave: (config: Record<string, string>) => void;
  saving: boolean;
}) {
  const [localConfig, setLocalConfig] = useState<Record<string, string>>(row.config || {});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setLocalConfig(row.config || {});
    setDirty(false);
  }, [row.config]);

  const set = (key: string, val: string) => {
    setLocalConfig((c) => ({ ...c, [key]: val }));
    setDirty(true);
  };

  const allFilled = def.fields.every((f) => (localConfig[f.key] || "").trim().length > 0);

  return (
    <div className={`border rounded-xl p-5 space-y-4 ${def.color} transition-shadow hover:shadow-sm`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{def.logo}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-gray-900 text-sm">{def.label}</p>
              {def.serverSide && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">Server-side</span>
              )}
              {row.is_enabled && allFilled && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle size={10} /> Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 max-w-sm">{def.description}</p>
          </div>
        </div>
        {/* Toggle */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={row.is_enabled}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {def.fields.map((field) => (
          <div key={field.key}>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              {field.label}
              {field.help && (
                <span className="ml-1 text-gray-400 font-normal">— {field.help}</span>
              )}
            </label>
            {field.secret ? (
              <SecretInput
                value={localConfig[field.key] || ""}
                onChange={(v) => set(field.key, v)}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type="text"
                value={localConfig[field.key] || ""}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 text-sm font-mono"
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <a
          href={def.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          <Info size={11} /> Setup guide
        </a>
        <button
          onClick={() => onSave(localConfig)}
          disabled={!dirty || saving}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-colors"
        >
          {saving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Pixels() {
  const [rows, setRows] = useState<Record<string, PixelRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tracking_pixels" as any)
      .select("platform, is_enabled, config, updated_at");
    if (data) {
      const map: Record<string, PixelRow> = {};
      (data as PixelRow[]).forEach((r) => (map[r.platform] = r));
      setRows(map);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (platform: string) => {
    const current = rows[platform];
    if (!current) return;
    const next = !current.is_enabled;
    setRows((r) => ({ ...r, [platform]: { ...current, is_enabled: next } }));
    const { error } = await supabase
      .from("tracking_pixels" as any)
      .update({ is_enabled: next })
      .eq("platform", platform);
    if (error) {
      toast.error("Failed to update status");
      setRows((r) => ({ ...r, [platform]: current })); // revert
    } else {
      toast.success(`${platform} ${next ? "enabled" : "disabled"}`);
    }
  };

  const save = async (platform: string, config: Record<string, string>) => {
    setSaving(platform);
    const { error } = await supabase
      .from("tracking_pixels" as any)
      .update({ config })
      .eq("platform", platform);
    if (error) {
      toast.error("Failed to save config");
    } else {
      setRows((r) => ({ ...r, [platform]: { ...r[platform], config } }));
      toast.success("Configuration saved — reload the site to activate");
    }
    setSaving(null);
  };

  const enabledCount = Object.values(rows).filter((r) => r.is_enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={20} className="text-blue-600" />
            Pixels & Tracking
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Configure ad pixels and analytics tags. Changes are injected into the site automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {enabledCount > 0 && (
            <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1.5">
              <CheckCircle size={12} />
              {enabledCount} active
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Important: Pixel IDs are visible in browser source code</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Pixel IDs (GTM, GA4, Meta, TikTok, Pinterest) are safe to store here — they are designed to be public.
            The Meta CAPI Access Token is sensitive — never share it publicly. It is stored securely and only used server-side.
          </p>
        </div>
      </div>

      {/* GTM priority note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          <strong>Recommended setup:</strong> Enable <strong>Google Tag Manager</strong> and manage GA4, Meta Pixel, and other tags <em>inside</em> GTM for cleaner control.
          Only enable GA4 / Meta Pixel directly here if you're not using GTM.
        </p>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLATFORMS.map((def) => {
            const row = rows[def.platform] ?? {
              platform: def.platform,
              is_enabled: false,
              config: Object.fromEntries(def.fields.map((f) => [f.key, ""])),
              updated_at: "",
            };
            return (
              <PlatformCard
                key={def.platform}
                def={def}
                row={row}
                onToggle={() => toggle(def.platform)}
                onSave={(cfg) => save(def.platform, cfg)}
                saving={saving === def.platform}
              />
            );
          })}
        </div>
      )}

      {/* Note about CAPI */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-xs text-gray-500">
          <strong className="text-gray-700">Meta Conversions API:</strong> After saving your CAPI credentials, server-side events (Purchase, AddToCart) will automatically be forwarded to Meta on every successful order.
          This supplements the browser pixel and improves attribution accuracy under iOS 14+ restrictions.
        </p>
      </div>
    </div>
  );
}
