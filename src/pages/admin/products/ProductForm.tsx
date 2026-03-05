// src/pages/admin/products/ProductForm.tsx
// Used for both Create and Edit product
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Upload, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

interface Variant {
  id?: string;
  name: string;
  price: string;
  compare_at_price: string;
  sku: string;
  inventory_quantity: string;
  inventory_policy: "deny" | "continue";
  option1_name: string;
  option1_value: string;
  option2_name: string;
  option2_value: string;
}

interface ProductImage {
  id?: string;
  url: string;
  alt_text: string;
  position: number;
}

const DEFAULT_VARIANT: Variant = {
  name: "Default", price: "", compare_at_price: "",
  sku: "", inventory_quantity: "0", inventory_policy: "deny",
  option1_name: "", option1_value: "", option2_name: "", option2_value: "",
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none ${className}`}
    />
  );
}

function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
}

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // Form state
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
      const { data } = await supabase
        .from("products")
        .select("*, product_variants(*), product_images(*)")
        .eq("id", id)
        .single();
      if (!data) { toast.error("Product not found"); navigate("/admin/products"); return; }

      setName(data.name);
      setSlug(data.slug);
      setDescription(data.description ?? "");
      setShortDescription(data.short_description ?? "");
      setPrice(String(data.price));
      setCompareAtPrice(String(data.compare_at_price ?? ""));
      setStatus(data.status);
      setProductType(data.product_type ?? "");
      setTags((data.tags ?? []).join(", "));
      setSeoTitle(data.seo_title ?? "");
      setSeoDescription(data.seo_description ?? "");
      setImages((data.product_images ?? []).sort((a: any, b: any) => a.position - b.position));
      setVariants(
        (data.product_variants ?? []).map((v: any) => ({
          id: v.id,
          name: v.name,
          price: String(v.price),
          compare_at_price: String(v.compare_at_price ?? ""),
          sku: v.sku ?? "",
          inventory_quantity: String(v.inventory_quantity),
          inventory_policy: v.inventory_policy,
          option1_name: v.option1_name ?? "",
          option1_value: v.option1_value ?? "",
          option2_name: v.option2_name ?? "",
          option2_value: v.option2_value ?? "",
        }))
      );
      setLoading(false);
    })();
  }, [id]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [name]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    setImages((prev) => [...prev, { url: publicUrl, alt_text: name, position: prev.length }]);
    setUploading(false);
  };

  const addImageByUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, { url: imageUrl.trim(), alt_text: name, position: prev.length }]);
    setImageUrl("");
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const addVariant = () => setVariants((prev) => [...prev, { ...DEFAULT_VARIANT }]);
  const removeVariant = (idx: number) => setVariants((prev) => prev.filter((_, i) => i !== idx));
  const updateVariant = (idx: number, field: keyof Variant, value: string) => {
    setVariants((prev) => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!price || isNaN(Number(price))) { toast.error("Valid price is required"); return; }
    if (variants.some((v) => !v.price || isNaN(Number(v.price)))) {
      toast.error("All variants need a valid price"); return;
    }

    setSaving(true);
    try {
      const productData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        short_description: shortDescription.trim() || null,
        price: Number(price),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        status,
        product_type: productType || null,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        vendor: "Agatsa",
      };

      let productId = id;

      if (isEdit) {
        const { error } = await supabase.from("products").update(productData).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(productData).select().single();
        if (error) throw error;
        productId = data.id;
      }

      // Upsert variants
      for (const v of variants) {
        const variantData = {
          product_id: productId,
          name: v.name,
          price: Number(v.price),
          compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
          sku: v.sku || null,
          inventory_quantity: Number(v.inventory_quantity),
          inventory_policy: v.inventory_policy,
          option1_name: v.option1_name || null,
          option1_value: v.option1_value || null,
          option2_name: v.option2_name || null,
          option2_value: v.option2_value || null,
        };
        if (v.id) {
          await supabase.from("product_variants").update(variantData).eq("id", v.id);
        } else {
          await supabase.from("product_variants").insert(variantData);
        }
      }

      // Delete removed variants (edit mode)
      if (isEdit) {
        const keptIds = variants.filter((v) => v.id).map((v) => v.id);
        if (keptIds.length > 0) {
          await supabase.from("product_variants")
            .delete()
            .eq("product_id", productId)
            .not("id", "in", `(${keptIds.join(",")})`);
        }
      }

      // Upsert images
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (images.length > 0) {
        await supabase.from("product_images").insert(
          images.map((img, i) => ({ ...img, product_id: productId, position: i }))
        );
      }

      toast.success(isEdit ? "Product updated!" : "Product created!");
      navigate("/admin/products");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{isEdit ? "Edit Product" : "Add Product"}</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          <Save size={15} /> {saving ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Basic Information</h3>
            <Field label="Product Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sanket Life" />
            </Field>
            <Field label="URL Slug" hint="Auto-generated. Must be unique.">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="sanket-life" />
            </Field>
            <Field label="Short Description">
              <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One-line summary shown on product cards" rows={2} />
            </Field>
            <Field label="Full Description">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Full product description..." rows={6} />
            </Field>
          </div>

          {/* Images */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Images</h3>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img.url} alt={img.alt_text} className="w-24 h-24 object-cover rounded-lg bg-gray-800" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={11} className="text-white" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-blue-600 text-white px-1.5 rounded">Cover</span>
                  )}
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 text-gray-500 hover:text-blue-400 transition-colors">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload size={18} />
                    <span className="text-xs mt-1">Upload</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
            </div>
            <div className="flex gap-2">
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL..." />
              <button onClick={addImageByUrl}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg shrink-0">
                Add
              </button>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Variants & Pricing</h3>
              <button onClick={addVariant}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400 px-3 py-1.5 rounded-lg">
                <Plus size={13} /> Add Variant
              </button>
            </div>
            {variants.map((variant, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Variant {idx + 1}</span>
                  {variants.length > 1 && (
                    <button onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Name">
                    <Input value={variant.name} onChange={(e) => updateVariant(idx, "name", e.target.value)} placeholder="Default / Black / 128GB" />
                  </Field>
                  <Field label="SKU">
                    <Input value={variant.sku} onChange={(e) => updateVariant(idx, "sku", e.target.value)} placeholder="AGT-001" />
                  </Field>
                  <Field label="Price (₹)">
                    <Input type="number" value={variant.price} onChange={(e) => updateVariant(idx, "price", e.target.value)} placeholder="4999" />
                  </Field>
                  <Field label="Compare At Price (₹)">
                    <Input type="number" value={variant.compare_at_price} onChange={(e) => updateVariant(idx, "compare_at_price", e.target.value)} placeholder="6999" />
                  </Field>
                  <Field label="Inventory">
                    <Input type="number" value={variant.inventory_quantity} onChange={(e) => updateVariant(idx, "inventory_quantity", e.target.value)} placeholder="100" />
                  </Field>
                  <Field label="When out of stock">
                    <Select value={variant.inventory_policy} onChange={(e) => updateVariant(idx, "inventory_policy", e.target.value as "deny" | "continue")}>
                      <option value="deny">Stop selling</option>
                      <option value="continue">Continue selling</option>
                    </Select>
                  </Field>
                  <Field label="Option 1 (e.g. Color)">
                    <Input value={variant.option1_name} onChange={(e) => updateVariant(idx, "option1_name", e.target.value)} placeholder="Color" />
                  </Field>
                  <Field label="Option 1 Value">
                    <Input value={variant.option1_value} onChange={(e) => updateVariant(idx, "option1_value", e.target.value)} placeholder="Black" />
                  </Field>
                  <Field label="Option 2 (e.g. Size)">
                    <Input value={variant.option2_name} onChange={(e) => updateVariant(idx, "option2_name", e.target.value)} placeholder="Size" />
                  </Field>
                  <Field label="Option 2 Value">
                    <Input value={variant.option2_value} onChange={(e) => updateVariant(idx, "option2_value", e.target.value)} placeholder="M" />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">SEO</h3>
            <Field label="Meta Title" hint="Leave blank to use product name">
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Sanket Life ECG Monitor | Agatsa" />
            </Field>
            <Field label="Meta Description">
              <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="160 char description for search engines..." rows={3} />
            </Field>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Status</h3>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="draft">Draft (hidden)</option>
              <option value="active">Active (visible)</option>
              <option value="archived">Archived</option>
            </Select>
          </div>

          {/* Pricing (base) */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Base Price</h3>
            <Field label="Price (₹)">
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4999" />
            </Field>
            <Field label="Compare At Price (₹)" hint="Original price, shown as strikethrough">
              <Input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="6999" />
            </Field>
          </div>

          {/* Organization */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Organization</h3>
            <Field label="Product Type">
              <Input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="ECG Monitor" />
            </Field>
            <Field label="Tags" hint="Comma separated">
              <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ecg, health, monitor" />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
