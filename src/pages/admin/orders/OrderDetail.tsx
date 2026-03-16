// src/pages/admin/orders/OrderDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Truck, X, MapPin, User, Phone, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadAdminInvoice, type InvoiceData } from "@/lib/invoicePdf";

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed:  "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped:    "bg-cyan-100 text-cyan-700 border-cyan-200",
  delivered:  "bg-green-100 text-green-700 border-green-200",
  cancelled:  "bg-red-100 text-red-700 border-red-200",
  refunded:   "bg-gray-100 text-gray-600 border-gray-200",
  paid:       "bg-green-100 text-green-700 border-green-200",
  failed:     "bg-red-100 text-red-700 border-red-200",
  created:    "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fulfillment form
  const [showFulfillForm, setShowFulfillForm] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [carrier, setCarrier] = useState("");

  const fetchOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id!)
      .single();
    if (error || !data) {
      toast.error("Order not found");
      navigate("/admin/orders");
      return;
    }
    setOrder(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id!);
    if (error) toast.error("Failed to update status");
    else {
      toast.success(`Order marked as ${newStatus}`);
      fetchOrder();
    }
    setUpdatingStatus(false);
  };

  const addFulfillment = async () => {
    if (!trackingNumber.trim()) { toast.error("Tracking number is required"); return; }
    const { error } = await supabase.from("orders").update({
      status: "shipped",
    }).eq("id", id!);
    if (error) { toast.error("Failed to update order"); return; }
    toast.success(`Fulfillment added — Tracking: ${trackingNumber}`);
    setShowFulfillForm(false);
    setTrackingNumber(""); setTrackingUrl(""); setCarrier("");
    fetchOrder();
  };

  const cancelOrder = async () => {
    const reason = prompt("Cancellation reason (optional):");
    if (reason === null) return;
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", id!);
    if (error) { toast.error("Failed to cancel"); return; }
    toast.success("Order cancelled");
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/orders")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {order.razorpay_order_id ?? order.id.slice(0, 8)}
          </h2>
          <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString("en-IN")}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
          {order.status}
        </span>
        {order.razorpay_payment_id && (
          <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-green-100 text-green-700 border-green-200">
            paid
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                      <Package size={18} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.productName ?? item.name ?? "—"}</p>
                      {item.variantTitle && item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-gray-400">{item.variantTitle}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">₹{item.price?.toLocaleString("en-IN")} × {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-6 text-sm text-gray-400 text-center">No item details available</div>
              )}
            </div>
            {/* Total */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{order.amount?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Razorpay Order ID</span>
                <span className="text-gray-900 font-mono text-xs">{order.razorpay_order_id ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID</span>
                <span className="text-gray-900 font-mono text-xs">{order.razorpay_payment_id ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="text-gray-900 font-semibold">₹{order.amount?.toLocaleString("en-IN")}</span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid At</span>
                  <span className="text-gray-900">{new Date(order.paid_at).toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Truck size={16} /> Fulfillment
              </h3>
              {order.status !== "cancelled" && order.status !== "refunded" && order.status !== "delivered" && (
                <button
                  onClick={() => setShowFulfillForm(!showFulfillForm)}
                  className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg font-medium"
                >
                  {showFulfillForm ? "Cancel" : "Add Tracking"}
                </button>
              )}
            </div>

            {showFulfillForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-3">
                <input type="text" placeholder="Tracking Number *"
                  value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="Carrier (e.g. Delhivery, BlueDart)"
                  value={carrier} onChange={e => setCarrier(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="Tracking URL (optional)"
                  value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
                <button onClick={addFulfillment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium transition-colors">
                  Save & Mark Shipped
                </button>
              </div>
            )}

            <p className="text-sm text-gray-400">
              {order.status === "shipped" ? "Order has been shipped." :
               order.status === "delivered" ? "Order delivered." :
               "No fulfillment added yet. Use 'Add Tracking' to mark as shipped."}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              {(order.status === "created" || order.status === "paid") && (
                <button onClick={() => updateStatus("confirmed")} disabled={updatingStatus}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50 transition-colors">
                  Confirm Order
                </button>
              )}
              {order.status === "confirmed" && (
                <button onClick={() => updateStatus("processing")} disabled={updatingStatus}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50 transition-colors">
                  Mark Processing
                </button>
              )}
              {(order.status === "processing" || order.status === "confirmed") && (
                <button onClick={() => setShowFulfillForm(true)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm py-2 rounded-lg font-medium transition-colors">
                  Mark Shipped
                </button>
              )}
              {order.status === "shipped" && (
                <button onClick={() => updateStatus("delivered")} disabled={updatingStatus}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50 transition-colors">
                  Mark Delivered
                </button>
              )}
              {!["cancelled", "refunded", "delivered"].includes(order.status) && (
                <button onClick={cancelOrder}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm py-2 rounded-lg font-medium border border-red-200 transition-colors">
                  <X size={14} /> Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User size={15} /> Customer
            </h3>
            <div className="space-y-2 text-sm">
              {order.customer_name && (
                <p className="font-medium text-gray-900">{order.customer_name}</p>
              )}
              {order.customer_email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={13} className="shrink-0" />
                  <span className="break-all">{order.customer_email}</span>
                </div>
              )}
              {order.customer_phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={13} className="shrink-0" />
                  <span>{order.customer_phone}</span>
                </div>
              )}
              {!order.customer_name && !order.customer_email && !order.customer_phone && (
                <p className="text-gray-400">No customer info</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={15} /> Delivery Address
            </h3>
            <address className="text-sm text-gray-700 not-italic space-y-1">
              {order.shipping_address ? (
                <>
                  <p>{order.shipping_address}</p>
                  <p>{[order.shipping_city, order.shipping_state].filter(Boolean).join(", ")}</p>
                  {order.shipping_pincode && <p>PIN: {order.shipping_pincode}</p>}
                </>
              ) : (
                <p className="text-gray-400">No address provided</p>
              )}
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
