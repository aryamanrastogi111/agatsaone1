// src/pages/admin/Inventory.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Package, AlertTriangle, Search } from "lucide-react";
import { format } from "date-fns";

interface InventoryItem { id: string; product_name: string; variant_name: string; sku: string; inventory_quantity: number; low_stock_threshold: number; }
interface InventoryLog { id: string; product_name: string; variant_name: string; sku: string; adjustment: number; reason: string; notes: string; before_quantity: number; after_quantity: number; created_at: string; }
interface AdjustForm { open: boolean; productName: string; variantName: string; sku: string; productId: string; variantId: string; currentQty: number; adjustment: number; reason: string; notes: string; }

const REASON_OPTIONS = ["manual_adjustment","stock_received","damaged_goods","returned_stock","inventory_count","transfer_in","transfer_out","write_off"];
const REASON_LABELS: Record<string,string> = { manual_adjustment:"Manual Adjustment", stock_received:"Stock Received", damaged_goods:"Damaged Goods", returned_stock:"Returned Stock", inventory_count:"Inventory Count", transfer_in:"Transfer In", transfer_out:"Transfer Out", write_off:"Write Off" };

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"stock"|"logs">("stock");
  const [form, setForm] = useState<AdjustForm>({ open:false, productName:"", variantName:"", sku:"", productId:"", variantId:"", currentQty:0, adjustment:0, reason:"manual_adjustment", notes:"" });

  const fetchData = async () => {
    const [stockRes, logsRes] = await Promise.all([
      supabase.from("product_variants").select("id, sku, inventory_quantity, low_stock_threshold, products(name)").order("inventory_quantity", { ascending: true }),
      supabase.from("inventory_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (stockRes.data) setItems(stockRes.data.map((v:any) => ({ id:v.id, sku:v.sku, product_name:v.products?.name??"Unknown", variant_name:"", inventory_quantity:v.inventory_quantity??0, low_stock_threshold:v.low_stock_threshold??5 })));
    if (logsRes.data) setLogs(logsRes.data as InventoryLog[]);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const submitAdjust = async () => {
    const newQty = form.currentQty + form.adjustment;
    await Promise.all([
      supabase.from("product_variants").update({ inventory_quantity: newQty }).eq("id", form.variantId),
      supabase.from("inventory_logs").insert({ product_id:form.productId, variant_id:form.variantId, product_name:form.productName, variant_name:form.variantName, sku:form.sku, adjustment:form.adjustment, reason:form.reason, notes:form.notes, before_quantity:form.currentQty, after_quantity:newQty }),
    ]);
    setForm(f => ({ ...f, open: false }));
    fetchData();
  };

  const filtered = items.filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()) || (i.sku ?? "").toLowerCase().includes(search.toLowerCase()));
  const inputCls = "w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="space-y-6">
      <div><h2 className="text-xl font-bold text-gray-900">Inventory</h2><p className="text-sm text-gray-500">Stock levels and adjustment history</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><p className="text-sm text-gray-500">Total Units</p><p className="text-2xl font-bold text-gray-900 mt-1">{items.reduce((s,i)=>s+i.inventory_quantity,0).toLocaleString()}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-yellow-500"/><p className="text-sm text-gray-500">Low Stock</p></div><p className="text-2xl font-bold text-yellow-600 mt-1">{items.filter(i=>i.inventory_quantity>0&&i.inventory_quantity<=i.low_stock_threshold).length}</p></div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"><div className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/><p className="text-sm text-gray-500">Out of Stock</p></div><p className="text-2xl font-bold text-red-600 mt-1">{items.filter(i=>i.inventory_quantity===0).length}</p></div>
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit border border-gray-200">
        {(["stock","logs"] as const).map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab===t?"bg-white text-gray-900 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>{t==="stock"?"Stock Levels":"Adjustment Logs"}</button>)}
      </div>
      {tab === "stock" && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100"><div className="relative max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products or SKU…" className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"/></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50"><th className="text-left px-5 py-3 font-medium">Product</th><th className="text-left px-5 py-3 font-medium">SKU</th><th className="text-right px-5 py-3 font-medium">In Stock</th><th className="text-right px-5 py-3 font-medium">Status</th><th className="text-right px-5 py-3 font-medium">Action</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading&&<tr><td colSpan={5} className="text-center py-12 text-gray-400">Loading…</td></tr>}
              {!loading&&filtered.length===0&&<tr><td colSpan={5} className="text-center py-12 text-gray-400">No inventory data found</td></tr>}
              {filtered.map(item=>{const isOut=item.inventory_quantity===0;const isLow=!isOut&&item.inventory_quantity<=item.low_stock_threshold;return(
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5"><p className="font-medium text-gray-900">{item.product_name}</p></td>
                  <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{item.sku??"—"}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-gray-900">{item.inventory_quantity}</td>
                  <td className="px-5 py-3.5 text-right"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isOut?"bg-red-100 text-red-700":isLow?"bg-yellow-100 text-yellow-700":"bg-green-100 text-green-700"}`}>{isOut?"Out of Stock":isLow?"Low Stock":"In Stock"}</span></td>
                  <td className="px-5 py-3.5 text-right"><button onClick={()=>setForm({open:true,productName:item.product_name,variantName:item.variant_name,sku:item.sku,productId:item.id,variantId:item.id,currentQty:item.inventory_quantity,adjustment:0,reason:"manual_adjustment",notes:""})} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium">Adjust</button></td>
                </tr>);})}
            </tbody>
          </table></div>
        </div>
      )}
      {tab === "logs" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm"><table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider bg-gray-50"><th className="text-left px-5 py-3 font-medium">Product</th><th className="text-left px-5 py-3 font-medium">Reason</th><th className="text-right px-5 py-3 font-medium">Before</th><th className="text-right px-5 py-3 font-medium">Adjustment</th><th className="text-right px-5 py-3 font-medium">After</th><th className="text-left px-5 py-3 font-medium">Date</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length===0&&<tr><td colSpan={6} className="text-center py-12 text-gray-400">No adjustment logs yet</td></tr>}
            {logs.map(log=>(
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5"><p className="font-medium text-gray-900">{log.product_name??"—"}</p><p className="text-xs text-gray-400 font-mono">{log.sku??""}</p></td>
                <td className="px-5 py-3.5"><span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{REASON_LABELS[log.reason]??log.reason}</span></td>
                <td className="px-5 py-3.5 text-right text-gray-500">{log.before_quantity}</td>
                <td className="px-5 py-3.5 text-right font-bold"><span className={log.adjustment>=0?"text-green-600":"text-red-600"}>{log.adjustment>=0?"+":""}{log.adjustment}</span></td>
                <td className="px-5 py-3.5 text-right font-bold text-gray-900">{log.after_quantity}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{format(new Date(log.created_at),"MMM d, yyyy HH:mm")}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
      {form.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Adjust Stock</h3>
            <div><p className="text-sm text-gray-500">Product</p><p className="text-gray-900 font-medium">{form.productName}</p><p className="text-xs text-gray-400 font-mono">{form.sku}</p></div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex-1"><p className="text-xs text-gray-400">Current</p><p className="text-xl font-bold text-gray-900">{form.currentQty}</p></div>
              <div className="text-gray-400 text-xl">→</div>
              <div className="flex-1"><p className="text-xs text-gray-400">New Qty</p><p className={`text-xl font-bold ${(form.currentQty+form.adjustment)<0?"text-red-600":"text-green-600"}`}>{form.currentQty+form.adjustment}</p></div>
            </div>
            <div><label className="text-xs text-gray-500 block mb-1 font-medium">Adjustment (+ or -)</label><input type="number" value={form.adjustment} onChange={e=>setForm(f=>({...f,adjustment:parseInt(e.target.value)||0}))} className={inputCls}/></div>
            <div><label className="text-xs text-gray-500 block mb-1 font-medium">Reason</label><select value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} className={inputCls}>{REASON_OPTIONS.map(r=><option key={r} value={r}>{REASON_LABELS[r]}</option>)}</select></div>
            <div><label className="text-xs text-gray-500 block mb-1 font-medium">Notes</label><textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} className={inputCls+" resize-none"}/></div>
            <div className="flex gap-3 pt-2">
              <button onClick={()=>setForm(f=>({...f,open:false}))} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={submitAdjust} disabled={(form.currentQty+form.adjustment)<0} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
