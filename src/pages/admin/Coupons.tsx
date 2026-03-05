// src/pages/admin/Coupons.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minimum_order_amount: number;
  maximum_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  code: "", type: "percentage", value: "",
  minimum_order_amount: "", maximum_discount_amount: "",
  usage_limit: "", expires_at: "", is_active: true,
};

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

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setForm((f) => ({ ...f, code }));
  };

  const saveCoupon = async () => {
    if (!form.code.trim()) { toast.error("Code is required"); return; }
    if (!form.value || isNaN(Number(form.value))) { toast.error("Valid discount value required"); return; }

    setSaving(true);
    const { error } = await supabase.from("coupons").insert({
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: Number(form.value),
      minimum_order_amount: form.minimum_order_amount ? Number(form.minimum_order_amount) : 0,
      maximum_discount_amount: form.maximum_discount_amount ? Number(form.maximum_discount_amount) : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    });

    if (error) {
      toast.error(error.code === "23505" ? "Coupon code already exists" : "Failed to create coupon");
    } else {
      toast.success("Coupon created!");
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchCoupons();
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    await supabase.from("coupons").update({ is_active: !is_active }).eq("id", id);
    fetchCoupons();
  };

  const deleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await supabase.from("coupons").delete().eq("id", id);
    toast.success("Coupon deleted");
    fetchCoupons();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Coupons</h2>
          <p className="text-sm text-gray-400">{coupons.length} coupons</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-white">New Coupon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-300">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="SAVE20"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button onClick={generateCode}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg">
                  Generate
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-300">Discount Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount (₹)</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-300">
                {form.type === "percentage" ? "Discount %" : form.type === "fixed_amount" ? "Discount Amount (₹)" : "Value"}
              </label>
              <input type="number" value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                placeholder={form.type === "percentage" ? "20" : "200"}
                disabled={form.type === "free_shipping"}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-300">Min Order Amount (₹)</label>
              <input type="number" value={form.minimum_order_amount}
                onChange={(e) => setForm((f) => ({ ...f, minimum_order_amount: e.target.value }))}
                placeholder="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {form.type === "percentage" && (
              <div className="space-y-1.5">
                <label className="text-sm text-gray-300">Max Discount Cap (₹)</label>
                <input type="number" value={form.maximum_discount_amount}
                  onChange={(e) => setForm((f) => ({ ...f, maximum_discount_amount: e.target.value }))}
                  placeholder="500"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm text-gray-300">Usage Limit (total)</label>
              <input type="number" value={form.usage_limit}
                onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value }))}
                placeholder="Unlimited"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-300">Expiry Date</label>
              <input type="datetime-local" value={form.expires_at}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={saveCoupon} disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg">
              {saving ? "Creating..." : "Create Coupon"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium px-5 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Coupons table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-400">No coupons yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Code</th>
                <th className="text-left px-5 py-3 font-medium">Discount</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Usage</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Expires</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-mono font-semibold text-white">{coupon.code}</span>
                    {coupon.minimum_order_amount > 0 && (
                      <p className="text-xs text-gray-500">Min ₹{coupon.minimum_order_amount}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-white">
                    {coupon.type === "percentage" && `${coupon.value}%`}
                    {coupon.type === "fixed_amount" && `₹${coupon.value}`}
                    {coupon.type === "free_shipping" && "Free Shipping"}
                    {coupon.maximum_discount_amount && (
                      <p className="text-xs text-gray-500">Max ₹{coupon.maximum_discount_amount}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-400">
                    {coupon.used_count} / {coupon.usage_limit ?? "∞"}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-400 text-xs">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at) < new Date()
                        ? <span className="text-red-400">Expired</span>
                        : new Date(coupon.expires_at).toLocaleDateString("en-IN")
                      : "Never"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(coupon.id, coupon.is_active)}
                      className={`text-xs px-2 py-0.5 rounded-full border cursor-pointer ${
                        coupon.is_active
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      }`}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => deleteCoupon(coupon.id, coupon.code)}
                      className="p-2 rounded-lg hover:bg-red-900/40 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
