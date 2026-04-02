import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { downloadDeliverySlip, type DeliverySlipData } from "@/lib/deliverySlipPdf";
import { Search, Truck, FileText } from "lucide-react";
import { toast } from "sonner";

interface DeliverySlipOrder {
  id: string;
  razorpay_order_id: string | null;
  amount: number;
  status: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  items: Array<{
    productName?: string;
    name?: string;
    variantTitle?: string;
    quantity?: number;
    price?: number;
  }> | null;
}

const STATUS_COLORS: Record<string, string> = {
  created: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-cyan-100 text-cyan-700 border-cyan-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function DeliverySlips() {
  const [orders, setOrders] = useState<DeliverySlipOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, razorpay_order_id, amount, status, created_at, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_state, shipping_pincode, items")
        .in("status", ["created", "paid", "confirmed", "processing", "shipped", "delivered"])
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load orders for delivery slips");
      } else {
        setOrders((data ?? []) as unknown as DeliverySlipOrder[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) =>
      [
        order.razorpay_order_id,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        order.shipping_city,
        order.shipping_pincode,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [orders, search]);

  const handleDownload = async (order: DeliverySlipOrder) => {
    try {
      setDownloadingId(order.id);
      const slipData: DeliverySlipData = {
        orderId: order.razorpay_order_id ?? order.id,
        orderDate: new Date(order.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        customerName: order.customer_name ?? "",
        customerPhone: order.customer_phone ?? undefined,
        shippingAddress: order.shipping_address ?? "",
        shippingCity: order.shipping_city ?? "",
        shippingState: order.shipping_state ?? "",
        shippingPincode: order.shipping_pincode ?? "",
        items: (Array.isArray(order.items) ? order.items : []).map((item) => ({
          productName: item.productName ?? item.name ?? "Product",
          variantTitle: item.variantTitle ?? undefined,
          quantity: item.quantity ?? 1,
          price: item.price ?? 0,
        })),
        total: order.amount ?? 0,
      };

      await downloadDeliverySlip(slipData);
      toast.success("Delivery slip downloaded");
    } catch (error: any) {
      toast.error(error?.message || "Failed to download delivery slip");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Truck size={18} className="text-orange-600" /> Delivery Slips
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Download shipping slips for paid and fulfillable orders from one place.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order, customer, email or pincode…"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <Truck size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No delivery slip orders found</p>
            <p className="mt-1 text-xs text-gray-400">Try a different search or wait for new orders</p>
          </div>
        ) : (
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                <th className="px-5 py-3 text-left font-medium">Order</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Address</th>
                <th className="px-5 py-3 text-left font-medium">Items</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs font-semibold text-gray-900">
                      {order.razorpay_order_id ?? order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">₹{order.amount?.toLocaleString("en-IN")}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{order.customer_name ?? "—"}</p>
                    <p className="text-xs text-gray-500">{order.customer_email ?? ""}</p>
                    {order.customer_phone && <p className="text-xs text-gray-400">{order.customer_phone}</p>}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    <p>{order.shipping_address ?? "—"}</p>
                    <p>{[order.shipping_city, order.shipping_state, order.shipping_pincode].filter(Boolean).join(", ")}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {(Array.isArray(order.items) ? order.items : [])
                      .map((item) => `${item.productName ?? item.name ?? "Product"} ×${item.quantity ?? 1}`)
                      .join(", ") || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDownload(order)}
                      disabled={downloadingId === order.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700 transition-colors hover:bg-orange-100 disabled:opacity-60"
                    >
                      <FileText size={13} />
                      {downloadingId === order.id ? "Generating…" : "Download Slip"}
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
