// src/pages/admin/products/ProductForm.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Upload, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

const sb = supabase as any;

interface Variant {
  id?: string;
  name: string; price: string; compare_at_price: string; sku: string;
  inventory_quantity: string; inventory_policy: "deny" | "continue";
  option1_name: string; option1_value: string;
  option2_name: string; option2_value: string;
}
interface ProductImage { id?: string; url: string; alt_text: string; position: number; }

const DEFAULT_VARIANT: Variant = {
  name: "Default", price: "", compare_at_price: "", sku: "",
  inventory_quantity: "0", inventory_policy: "deny",
  option1_name: "", option1_value: "", option2_name: "", option2_value: "",
};

const inputCls = "w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500";
const labelCls = "text-sm font-medium text-gray-600 block mb-1";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [productType, setProductType] = useState("");
  const [tags, setTags] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [variants, setVariants] = useState<Variant[]>([{ ...DEFAULT_VARIANT }]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data } = await sb.from("products").select("*, product_variants(*), product_images(*)").eq("id", id).single();
      if (!data) { toast.error("Product not found"); navigate("/admin/products"); return; }
      setName(data.name); setSlug(data.slug);
      setDescription(data.description ?? ""); setShortDescription(data.short_description ?? "");
      setPrice(String(data.price)); setCompareAtPrice(String(data.compare_at_price ?? ""));
      setStatus(data.status); setProductType(data.product_type ?? "");
      setTags((data.tags ?? []).join(", "));
      setSeoTitle(data.seo_title ?? ""); setSeoDescription(data.seo_description ?? "");
      setImages((data.product_images ?? []).sort((a: any, b: any) => a.position - b.position));
      setVariants((data.product_variants ?? []).map((v: any) => ({
        id: v.id, name: v.name, price: String(v.price),
        compare_at_price: String(v.compare_at_price ?? ""), sku: v.sku ?? "",
        inventory_quantity: String(v.inventory_quantity), inventory_policy: v.inventory_policy,
        option1_name: v.option1_name ?? "", option1_value: v.option1_value ?? "",
        option2_name: v.option2_name ?? "", option2_value: v.option2_value ?? "",
      })));
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!isEdit) setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }, [name]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = sb.storage.from("product-images").getPublicUrl(path);
    setImages(prev => [...prev, { url: publicUrl, alt_text: name, position: prev.length }]);
    setUploading(false);
  };

  const addImageByUrl = () => {
    if (!imageUrl.trim()) return;
    setImages(prev => [...prev, { url: imageUrl.trim(), alt_text: name, position: prev.length }]);
    setImageUrl("");
  };

  const addVariant = () => setVariants(prev => [...prev, { ...DEFAULT_VARIANT }]);
  const removeVariant = (idx: number) => setVariants(prev => prev.filter((_, i) => i !== idx));
  const updateVariant = (idx: number, field: keyof Variant, value: string) =>
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!price || isNaN(Number(price))) { toast.error("Valid price is required"); return; }
    if (variants.some(v => !v.price || isNaN(Number(v.price)))) { toast.error("All variants need a valid price"); return; }
    setSaving(true);
    try {
      const productData = {
        name: name.trim(), slug: slug.trim(),
        description: description.trim() || null,
        short_description: shortDescription.trim() || null,
        price: Number(price), compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        status, product_type: productType || null,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        seo_title: seoTitle || null, seo_description: seoDescription || null, vendor: "Agatsa",
      };
      let productId = id;
      if (isEdit) {
        const { error } = await sb.from("products").update(productData).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await sb.from("products").insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }
      for (const v of variants) {
        const variantData = {
          product_id: productId, name: v.name, price: Number(v.price),
          compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
          sku: v.sku || null, inventory_quantity: Number(v.inventory_quantity),
          inventory_policy: v.inventory_policy,
          option1_name: v.option1_name || null, option1_value: v.option1_value || null,
          option2_name: v.option2_name || null, option2_value: v.option2_value || null,
        };
        if (v.id) { await sb.from("product_variants").update(variantData).eq("id", v.id); }
        else { await sb.from("product_variants").insert(variantData); }
      }
      if (isEdit) {
        const keptIds = variants.filter(v => v.id).map(v => v.id);
        if (keptIds.length > 0) await sb.from("product_variants").delete().eq("product_id", productId).not("id", "in", `(${keptIds.join(",")})`);
      }
      await sb.from("product_images").delete().eq("product_id", productId);
      if (images.length > 0) await sb.from("product_images").insert(images.map((img, i) => ({ ...img, product_id: productId, position: i })));
      toast.success(isEdit ? "Product updated!" : "Product created!");
      navigate("/admin/products");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/products")} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Product" : "Add Product"}</h2>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors shadow-sm">
          <Save size={15} /> {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">Basic Information</h3>
            <Field label="Product Name">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sanket Life" className={inputCls} />
            </Field>
            <Field label="URL Slug" hint="Auto-generated. Must be unique.">
              <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="sanket-life" className={inputCls} />
            </Field>
            <Field label="Short Description">
              <textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)}
                placeholder="One-line summary shown on product cards" rows={2} className={inputCls + " resize-none"} />
            </Field>
            <Field label="Full Description">
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Full product description..." rows={6} className={inputCls + " resize-none"} />
            </Field>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">Images</h3>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img.url} alt={img.alt_text} className="w-24 h-24 object-cover rounded-lg bg-gray-100 border border-gray-200" />
                  <button onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={11} className="text-white" />
                  </button>
                  {idx === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-blue-600 text-white px-1.5 rounded">Cover</span>}
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 text-gray-400 hover:text-blue-500 transition-colors bg-gray-50">
                {uploading ? <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /> :
                  <><Upload size={18} /><span className="text-xs mt-1">Upload</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
            </div>
            <div className="flex gap-2">
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Or paste image URL..." className={inputCls} />
              <button onClick={addImageByUrl} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg shrink-0 font-medium">Add</button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Variants & Pricing</h3>
              <button onClick={addVariant} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                <Plus size={13} /> Add Variant
              </button>
            </div>
            {variants.map((variant, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Variant {idx + 1}</span>
                  {variants.length > 1 && (
                    <button onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Name", field: "name", ph: "Default / Black" },
                    { label: "SKU", field: "sku", ph: "AGT-001" },
                    { label: "Price (₹)", field: "price", ph: "4999", type: "number" },
                    { label: "Compare At (₹)", field: "compare_at_price", ph: "6999", type: "number" },
                    { label: "Inventory", field: "inventory_quantity", ph: "100", type: "number" },
                    { label: "Option 1 Name", field: "option1_name", ph: "Color" },
                    { label: "Option 1 Value", field: "option1_value", ph: "Black" },
                    { label: "Option 2 Name", field: "option2_name", ph: "Size" },
                    { label: "Option 2 Value", field: "option2_value", ph: "M" },
                  ].map(f => (
                    <Field key={f.field} label={f.label}>
                      <input type={f.type ?? "text"} value={(variant as any)[f.field]}
                        onChange={e => updateVariant(idx, f.field as keyof Variant, e.target.value)}
                        placeholder={f.ph} className={inputCls} />
                    </Field>
                  ))}
                  <Field label="When out of stock">
                    <select value={variant.inventory_policy}
                      onChange={e => updateVariant(idx, "inventory_policy", e.target.value as "deny" | "continue")}
                      className={inputCls}>
                      <option value="deny">Stop selling</option>
                      <option value="continue">Continue selling</option>
                    </select>
                  </Field>
                </div>
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">SEO</h3>
            <Field label="Meta Title" hint="Leave blank to use product name">
              <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Sanket Life ECG Monitor | Agatsa" className={inputCls} />
            </Field>
            <Field label="Meta Description">
              <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)}
                placeholder="160 char description for search engines..." rows={3} className={inputCls + " resize-none"} />
            </Field>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">Status</h3>
            <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
              <option value="draft">Draft (hidden)</option>
              <option value="active">Active (visible)</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">Base Price</h3>
            <Field label="Price (₹)">
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="4999" className={inputCls} />
            </Field>
            <Field label="Compare At (₹)" hint="Shown as strikethrough">
              <input type="number" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} placeholder="6999" className={inputCls} />
            </Field>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-gray-900">Organization</h3>
            <Field label="Product Type">
              <input value={productType} onChange={e => setProductType(e.target.value)} placeholder="ECG Monitor" className={inputCls} />
            </Field>
            <Field label="Tags" hint="Comma separated">
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="ecg, health, monitor" className={inputCls} />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
