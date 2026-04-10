// src/pages/admin/Inventory.tsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertTriangle, Search, Download, Upload, Save, ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { invalidateInventoryCache } from "@/hooks/useInventory";

const sb = supabase as any;

interface VariantRow {
  id: string;
  sku: string | null;
  inventory_quantity: number;
  low_stock_threshold: number;
  product_id: string;
  product_name: string;
  product_image: string | null;
  variant_name: string | null;
  // local editable qty
  pendingQty: number;
  dirty: boolean;
}

const REASON_OPTIONS = [
  { value: "manual_adjustment", label: "Manual Adjustment" },
  { value: "stock_received", label: "Stock Received" },
  { value: "damaged_goods", label: "Damaged Goods" },
  { value: "returned_stock", label: "Returned Stock" },
  { value: "inventory_count", label: "Inventory Count" },
];

// Quick Restock Modal state
interface RestockState {
  open: boolean;
  variantId: string;
  productName: string;
  currentQty: number;
  addQty: string;
  reason: string;
  notes: string;
}

export default function Inventory() {
  const [rows, setRows] = useState<VariantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"stock" | "logs">("stock");
  const [restock, setRestock] = useState<RestockState>({
    open: false, variantId: "", productName: "", currentQty: 0, addQty: "", reason: "stock_received", notes: "",
  });

  const openRestock = (row: VariantRow) => setRestock({
    open: true, variantId: row.id, productName: row.product_name, currentQty: row.pendingQty, addQty: "", reason: "stock_received", notes: "",
  });

  const submitRestock = async () => {
    const qty = parseInt(restock.addQty);
    if (!qty || qty <= 0) { toast.error("Enter a valid quantity"); return; }
    setSaving(true);
    const newQty = restock.currentQty + qty;
    const row = rows.find(r => r.id === restock.variantId);
    await Promise.all([
      sb.from("product_variants").update({ inventory_quantity: newQty }).eq("id", restock.variantId),
      sb.from("inventory_logs").insert({
        variant_id: restock.variantId,
        product_id: row?.product_id || null,
        product_name: restock.productName,
        variant_name: row?.variant_name,
        sku: row?.sku,
        adjustment: qty,
        before_quantity: restock.currentQty,
        after_quantity: newQty,
        reason: restock.reason,
        notes: restock.notes || null,
      }),
    ]);
    invalidateInventoryCache();
    toast.success(`Added ${qty} units to ${restock.productName}`);
    setRestock(r => ({ ...r, open: false }));
    await fetchData();
    setSaving(false);
  };

  // Logs
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchData = async () => {
    const { data } = await sb
      .from("product_variants")
      .select("id, sku, inventory_quantity, low_stock_threshold, variant_name, products(id, name, product_images(url, position))")
      .order("created_at", { ascending: true });

    if (data) {
      setRows(
        data.map((v: any) => {
          const images: any[] = v.products?.product_images ?? [];
          const sorted = [...images].sort((a, b) => a.position - b.position);
          return {
            id: v.id,
            sku: v.sku,
            inventory_quantity: v.inventory_quantity ?? 0,
            low_stock_threshold: v.low_stock_threshold ?? 5,
            product_id: v.products?.id ?? "",
            product_name: v.products?.name ?? "Unknown",
            product_image: sorted[0]?.url ?? null,
            variant_name: v.variant_name ?? null,
            pendingQty: v.inventory_quantity ?? 0,
            dirty: false,
          };
        })
      );
    }
    setLoading(false);
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    const { data } = await sb
      .from("inventory_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data) setLogs(data);
    setLogsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tab === "logs") fetchLogs();
  }, [tab]);

  const updateQty = (id: string, newQty: number) => {
    if (newQty < 0) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, pendingQty: newQty, dirty: r.inventory_quantity !== newQty }
          : r
      )
    );
  };

  const dirtyRows = rows.filter((r) => r.dirty);

  const saveChanges = async () => {
    if (dirtyRows.length === 0) return;
    setSaving(true);
    try {
      const promises = dirtyRows.flatMap((row) => {
        const adjustment = row.pendingQty - row.inventory_quantity;
        return [
          sb.from("product_variants").update({ inventory_quantity: row.pendingQty }).eq("id", row.id),
          sb.from("inventory_logs").insert({
            variant_id: row.id,
            product_id: row.product_id || null,
            product_name: row.product_name,
            variant_name: row.variant_name,
            sku: row.sku,
            adjustment,
            before_quantity: row.inventory_quantity,
            after_quantity: row.pendingQty,
            reason: "inventory_count",
          }),
        ];
      });
      await Promise.all(promises);
      invalidateInventoryCache();
      toast.success(`Saved ${dirtyRows.length} change(s)`);
      await fetchData();
    } catch {
      toast.error("Failed to save changes");
    }
    setSaving(false);
  };

  // Bulk update selected rows
  const bulkSetQty = (qty: number) => {
    setRows((prev) =>
      prev.map((r) =>
        selected.has(r.id)
          ? { ...r, pendingQty: qty, dirty: r.inventory_quantity !== qty }
          : r
      )
    );
  };

  const exportCSV = () => {
    const header = "Product,Variant,SKU,Available,Low Stock Threshold";
    const csv = rows
      .map((r) => `"${r.product_name}","${r.variant_name ?? ""}","${r.sku ?? ""}",${r.pendingQty},${r.low_stock_threshold}`)
      .join("\n");
    const blob = new Blob([header + "\n" + csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").slice(1);
      let updated = 0;
      setRows((prev) => {
        const next = [...prev];
        lines.forEach((line) => {
          const parts = line.split(",");
          const sku = parts[2]?.replace(/"/g, "").trim();
          const qty = parseInt(parts[3]);
          if (!sku || isNaN(qty)) return;
          const idx = next.findIndex((r) => r.sku === sku);
          if (idx !== -1) {
            next[idx] = { ...next[idx], pendingQty: qty, dirty: next[idx].inventory_quantity !== qty };
            updated++;
          }
        });
        return next;
      });
      toast.success(`Imported: ${updated} row(s) updated. Review and Save.`);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((r) => r.id)));
  };

  const filtered = rows.filter((r) => {
    const matchSearch =
      r.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.sku ?? "").toLowerCase().includes(search.toLowerCase());
    const isOut = r.pendingQty === 0;
    const isLow = !isOut && r.pendingQty <= r.low_stock_threshold;
    if (filter === "out") return matchSearch && isOut;
    if (filter === "low") return matchSearch && isLow;
    return matchSearch;
  });

  const totalUnits = rows.reduce((s, r) => s + r.pendingQty, 0);
  const lowCount = rows.filter((r) => r.pendingQty > 0 && r.pendingQty <= r.low_stock_threshold).length;
  const outCount = rows.filter((r) => r.pendingQty === 0).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500">{rows.length} variants across all products</p>
        </div>
        <div className="flex items-center gap-2">
          {dirtyRows.length > 0 && (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Save size={14} />
              {saving ? "Saving…" : `Save ${dirtyRows.length} change${dirtyRows.length > 1 ? "s" : ""}`}
            </button>
          )}
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            <Upload size={14} /> Import
          </button>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={importCSV} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setFilter("all")} className={`text-left bg-white border rounded-xl p-4 shadow-sm transition-colors ${filter === "all" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-300"}`}>
          <p className="text-xs text-gray-500">Total Units</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalUnits.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">{rows.length} variants</p>
        </button>
        <button onClick={() => setFilter(filter === "low" ? "all" : "low")} className={`text-left bg-white border rounded-xl p-4 shadow-sm transition-colors ${filter === "low" ? "border-yellow-500 ring-1 ring-yellow-500" : "border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertTriangle size={13} className="text-yellow-500" />
            <p className="text-xs text-gray-500">Low Stock</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{lowCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">variants below threshold</p>
        </button>
        <button onClick={() => setFilter(filter === "out" ? "all" : "out")} className={`text-left bg-white border rounded-xl p-4 shadow-sm transition-colors ${filter === "out" ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 hover:border-gray-300"}`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <AlertTriangle size={13} className="text-red-500" />
            <p className="text-xs text-gray-500">Out of Stock</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{outCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">variants unavailable</p>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit border border-gray-200">
        {(["stock", "logs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "stock" ? "Stock Levels" : "Adjustment Logs"}
          </button>
        ))}
      </div>

      {tab === "stock" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or SKU…"
                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selected.size} selected</span>
                <button onClick={() => bulkSetQty(0)} className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium">Set to 0</button>
                <button onClick={() => { const qty = parseInt(prompt("Set quantity to:") ?? ""); if (!isNaN(qty)) bulkSetQty(qty); }} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium">Set qty…</button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">SKU</th>
                  <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Committed</th>
                  <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Threshold</th>
                  <th className="text-center px-4 py-3 font-medium">Available</th>
                  <th className="text-right px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading inventory…
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      <Package className="mx-auto mb-2 text-gray-300" size={32} />
                      No inventory data found
                    </td>
                  </tr>
                )}
                {filtered.map((row) => {
                  const isOut = row.pendingQty === 0;
                  const isLow = !isOut && row.pendingQty <= row.low_stock_threshold;
                  return (
                    <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${row.dirty ? "bg-blue-50/40" : ""}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleSelect(row.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {row.product_image ? (
                            <img src={row.product_image} alt={row.product_name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                              <Package size={14} className="text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{row.product_name}</p>
                            {row.variant_name && <p className="text-xs text-gray-400">{row.variant_name}</p>}
                            {row.dirty && <p className="text-xs text-blue-500 font-medium">Unsaved</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs font-mono text-gray-400">{row.sku ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="text-gray-500 text-sm">0</span>
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="text-gray-500 text-sm">{row.low_stock_threshold}</span>
                      </td>
                      <td className="px-4 py-3">
                        {/* Inline quantity editor */}
                        <div className="flex items-center justify-center gap-0">
                          <button
                            onClick={() => updateQty(row.id, row.pendingQty - 1)}
                            className="w-7 h-8 flex items-center justify-center border border-r-0 border-gray-300 rounded-l-lg hover:bg-gray-100 text-gray-500 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            value={row.pendingQty}
                            onChange={(e) => updateQty(row.id, parseInt(e.target.value) || 0)}
                            className="w-14 h-8 border border-gray-300 text-center text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                            min={0}
                          />
                          <button
                            onClick={() => updateQty(row.id, row.pendingQty + 1)}
                            className="w-7 h-8 flex items-center justify-center border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-100 text-gray-500 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOut ? "bg-red-100 text-red-700" : isLow ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                            {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                          </span>
                          <button
                            onClick={() => openRestock(row)}
                            className="text-xs px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors border border-green-200"
                            title="Quick Restock"
                          >
                            + Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer with save bar */}
          {dirtyRows.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3 bg-blue-50 flex items-center justify-between">
              <p className="text-sm text-blue-700 font-medium">{dirtyRows.length} unsaved change(s)</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setRows((prev) => prev.map((r) => ({ ...r, pendingQty: r.inventory_quantity, dirty: false })))}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "logs" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium">Product</th>
                  <th className="text-left px-5 py-3 font-medium">Reason</th>
                  <th className="text-right px-5 py-3 font-medium">Before</th>
                  <th className="text-right px-5 py-3 font-medium">Adjustment</th>
                  <th className="text-right px-5 py-3 font-medium">After</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logsLoading && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading logs…</td></tr>
                )}
                {!logsLoading && logs.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No adjustment logs yet</td></tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{log.product_name ?? "—"}</p>
                      {log.sku && <p className="text-xs text-gray-400 font-mono">{log.sku}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {log.reason?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-gray-500">{log.before_quantity}</td>
                    <td className="px-5 py-3.5 text-right font-bold">
                      <span className={log.adjustment >= 0 ? "text-green-600" : "text-red-600"}>
                        {log.adjustment >= 0 ? "+" : ""}{log.adjustment}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">{log.after_quantity}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      {restock.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setRestock(r => ({ ...r, open: false }))}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Quick Restock</h3>
              <p className="text-sm text-gray-500">{restock.productName} · Current stock: <span className="font-semibold">{restock.currentQty}</span></p>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Add Quantity</label>
              <input
                type="number"
                value={restock.addQty}
                onChange={e => setRestock(r => ({ ...r, addQty: e.target.value }))}
                placeholder="e.g. 50"
                min={1}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500"
                autoFocus
              />
              {restock.addQty && parseInt(restock.addQty) > 0 && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  New stock will be: {restock.currentQty + parseInt(restock.addQty)}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Reason</label>
              <select
                value={restock.reason}
                onChange={e => setRestock(r => ({ ...r, reason: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 bg-white"
              >
                {REASON_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1 font-medium">Notes (optional)</label>
              <input
                value={restock.notes}
                onChange={e => setRestock(r => ({ ...r, notes: e.target.value }))}
                placeholder="e.g. Batch #1234 from warehouse"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setRestock(r => ({ ...r, open: false }))}
                className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitRestock}
                disabled={saving || !restock.addQty || parseInt(restock.addQty) <= 0}
                className="flex-1 px-4 py-2.5 text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium"
              >
                {saving ? "Adding…" : "Add Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
