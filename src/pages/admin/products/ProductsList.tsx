// src/pages/admin/products/ProductsList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  price: number;
  product_variants: { id: string; inventory_quantity: number }[];
  product_images: { url: string; position: number }[];
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-green-500/20 text-green-400 border-green-500/30",
  draft:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProducts = async () => {
    let query = supabase
      .from("products")
      .select("*, product_variants(id, inventory_quantity), product_images(url, position)")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;
    if (error) toast.error("Failed to load products");
    else setProducts((data ?? []) as Product[]);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search, statusFilter]);

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete product");
    else { toast.success("Product deleted"); fetchProducts(); }
    setDeleting(null);
  };

  const totalInventory = (variants: { inventory_quantity: number }[]) =>
    variants.reduce((sum, v) => sum + v.inventory_quantity, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Products</h2>
          <p className="text-sm text-gray-400">{products.length} products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-400 font-medium">No products found</p>
            <Link to="/admin/products/new" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">
              Add your first product
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Inventory</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((product) => {
                const image = product.product_images?.sort((a, b) => a.position - b.position)[0];
                const stock = totalInventory(product.product_variants ?? []);
                const isLowStock = stock <= 5 && stock > 0;
                const isOutOfStock = stock === 0;
                return (
                  <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img src={image.url} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-800 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center">
                            <Package size={16} className="text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.product_variants?.length ?? 0} variant(s)</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[product.status] ?? ""}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        {(isLowStock || isOutOfStock) && (
                          <AlertTriangle size={13} className={isOutOfStock ? "text-red-400" : "text-yellow-400"} />
                        )}
                        <span className={
                          isOutOfStock ? "text-red-400" : isLowStock ? "text-yellow-400" : "text-white"
                        }>
                          {stock} in stock
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white font-medium">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                          title="View on store"
                        >
                          <Eye size={15} />
                        </a>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id, product.name)}
                          disabled={deleting === product.id}
                          className="p-2 rounded-lg hover:bg-red-900/40 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
