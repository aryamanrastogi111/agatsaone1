// src/pages/admin/Coupons.tsx
import { useEffect, useState } from "react";
import { db as supabase } from "@/integrations/supabase/db";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string; code: string; type: string; value: number;
  minimum_order_amount: number; maximum_discount_amount: number | null;
  usage_limit: number | null; used_count: number;
  expires_at: string | null; is_active: boolean; created_at: string;
}

const EMPTY_FORM = { code: "", type: "percentage", value: "", minimum_order_amount: "", maximum_discount_amount: "", usage_limit: "", expires_at: "", is_active: true };

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons((data ?? []) as Coupon[]);
    setLoading(false);
  };
  useEffect(() => { fetchCoupons(); }, []);

  const generateCode = () => setForm(f => ({ ...f, code: Math.random().toString(36).substring(2, 8).toUpperCase() }));

  const saveCoupon = async () => {
    if (!form.code.trim()) { toast.error("Code is required"); return; }
    if (!form.value || isNaN(Number(form.value))) { toast.error("Valid discount value required"); return; }
    setSaving(true);
    const { error } = await supabase.from("coupons").insert({
      code: form.code.toUpperCase().trim(), type: form.type, value: Number(form.value),
      minimum_order_amount: form.minimum_order_amount ? Number(form.minimum_order_amount) : 0,
      maximum_discount_amount: form.maximum_discount_amount ? Number(form.maximum_discount_amount) : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      expires_at: form.expires_at || null, is_active: form.is_active,
    });
    if (error) { toast.error(error.code === "23505" ? "Code already exists" : "Failed to create"); }
    else { toast.success("Coupon created!"); setForm(EMPTY_FORM); setShowForm(false); fetchCoupons(); }
    setSaving(false);
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("coupons").update({ is_active: !is_active }).eq("id", id);
    fetchCoupons();
  };

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await supabase.from("coupons").delete().eq("id", id);
    toast.success("Deleted"); fetchCoupons();
  };

  const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Coupons</h2>
          <p className="text-sm text-gray-500">{coupons.length} discount codes</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="font-semibold text-gray-900">New Coupon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 font-medium">Coupon Code</label>
              <div className="flex gap-2">
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <button onClick={generateCode} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-lg font-medium transition-colors">Generate</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 font-medium">Discount Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount (₹)</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 font-medium">{form.type === "percentage" ? "Discount %" : "Discount (₹)"}</label>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder={form.type === "percentage" ? "20" : "200"} disabled={form.type === "free_shipping"} className={inputCls + " disabled:opacity-40"} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 font-medium">Min Order (₹)</label>
              <input type="number" value={form.minimum_order_amount} onChange={e => setForm(f => ({ ...f, minimum_order_amount: e.target.value }))} placeholder="0" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 font-medium">Usage Limit</label>
              <input type="number" value={form.usage_limit} onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))} placeholder="Unlimited" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 font-medium">Expiry Date</label>
              <input type="datetime-local" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={saveCoupon} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">{saving ? "Creating..." : "Create Coupon"}</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16"><Tag className="mx-auto text-gray-300 mb-3" size={40} /><p className="text-gray-500">No coupons yet</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 bg-gray-50 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Code</th>
                <th className="text-left px-5 py-3 font-medium">Discount</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Usage</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Expires</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3"><span className="font-mono font-bold text-gray-900">{coupon.code}</span>{coupon.minimum_order_amount > 0 && <p className="text-xs text-gray-400">Min ₹{coupon.minimum_order_amount}</p>}</td>
                  <td className="px-5 py-3 text-gray-900 font-medium">
                    {coupon.type === "percentage" && `${coupon.value}%`}
                    {coupon.type === "fixed_amount" && `₹${coupon.value}`}
                    {coupon.type === "free_shipping" && "Free Shipping"}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-500">{coupon.used_count} / {coupon.usage_limit ?? "∞"}</td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-500 text-xs">
                    {coupon.expires_at ? new Date(coupon.expires_at) < new Date() ? <span className="text-red-500">Expired</span> : new Date(coupon.expires_at).toLocaleDateString("en-IN") : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleActive(coupon.id, coupon.is_active)}
                      className={`text-xs px-2 py-0.5 rounded-full border cursor-pointer font-medium ${coupon.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {coupon.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => deleteCoupon(coupon.id, coupon.code)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
