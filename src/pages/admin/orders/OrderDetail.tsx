// src/pages/admin/orders/OrderDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db as supabase } from "@/integrations/supabase/db";
import { ArrowLeft, Package, Truck, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed:  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped:    "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  delivered:  "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/20 text-red-400 border-red-500/30",
  refunded:   "bg-gray-500/20 text-gray-400 border-gray-500/30",
  paid:       "bg-green-500/20 text-green-400 border-green-500/30",
  failed:     "bg-red-500/20 text-red-400 border-red-500/30",
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
      .select("*, order_items(*), fulfillments(*), payments(*)")
      .eq("id", id)
      .single();
    if (error || !data) { toast.error("Order not found"); navigate("/admin/orders"); return; }
    setOrder(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Failed to update status"); }
    else {
      toast.success(`Order marked as ${newStatus}`);
      // Send email for shipped/delivered/cancelled
      if (["shipped", "delivered", "cancelled"].includes(newStatus)) {
        await supabase.functions.invoke("send-order-email", {
          body: { order_id: id, type: `order_${newStatus}` }
        });
      }
      fetchOrder();
    }
    setUpdatingStatus(false);
  };

  const addFulfillment = async () => {
    if (!trackingNumber.trim()) { toast.error("Tracking number is required"); return; }
    const { error } = await supabase.from("fulfillments").insert({
      order_id: id,
      status: "shipped",
      tracking_number: trackingNumber,
      tracking_url: trackingUrl || null,
      carrier: carrier || null,
    });
    if (error) { toast.error("Failed to add fulfillment"); return; }
    await supabase.from("orders").update({ status: "shipped", fulfillment_status: "fulfilled" }).eq("id", id);
    await supabase.functions.invoke("send-order-email", { body: { order_id: id, type: "order_shipped" } });
    toast.success("Fulfillment added & customer notified");
    setShowFulfillForm(false);
    setTrackingNumber(""); setTrackingUrl(""); setCarrier("");
    fetchOrder();
  };

  const cancelOrder = async () => {
    const reason = prompt("Cancellation reason (optional):");
    if (reason === null) return;
    const { error } = await supabase.from("orders").update({
      status: "cancelled",
      cancel_reason: reason || null,
      cancelled_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error("Failed to cancel"); return; }
    await supabase.functions.invoke("send-order-email", { body: { order_id: id, type: "order_cancelled" } });
    toast.success("Order cancelled & customer notified");
    fetchOrder();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const payment = order.payments?.[0];

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/admin/orders")}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{order.order_number}</h2>
          <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] ?? ""}`}>
            {order.status}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.payment_status] ?? ""}`}>
            {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.product_name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-800 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center">
                      <Package size={18} className="text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.product_name}</p>
                    {item.variant_name && <p className="text-xs text-gray-400">{item.variant_name}</p>}
                    {item.sku && <p className="text-xs text-gray-500">SKU: {item.sku}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">₹{item.price?.toLocaleString("en-IN")} × {item.quantity}</p>
                    <p className="text-sm font-semibold text-white">₹{item.total?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="px-5 py-4 border-t border-gray-800 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span><span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
                  <span>-₹{order.discount_amount?.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-400">
                <span>Shipping</span><span>₹{order.shipping_amount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-gray-700 pt-2">
                <span>Total</span><span>₹{order.total?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          {payment && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-3">Payment</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Razorpay Order ID</span>
                  <span className="text-white font-mono text-xs">{payment.razorpay_order_id ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID</span>
                  <span className="text-white font-mono text-xs">{payment.razorpay_payment_id ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Method</span>
                  <span className="text-white">{payment.method ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[payment.status] ?? ""}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Fulfillments */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Truck size={16} /> Fulfillment
              </h3>
              {order.status !== "cancelled" && order.status !== "refunded" && (
                <button
                  onClick={() => setShowFulfillForm(!showFulfillForm)}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg"
                >
                  {showFulfillForm ? "Cancel" : "Add Tracking"}
                </button>
              )}
            </div>

            {showFulfillForm && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4 space-y-3">
                <input type="text" placeholder="Tracking Number *"
                  value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="Carrier (e.g. Delhivery, BlueDart)"
                  value={carrier} onChange={(e) => setCarrier(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <input type="text" placeholder="Tracking URL (optional)"
                  value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                <button onClick={addFulfillment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium">
                  Save & Notify Customer
                </button>
              </div>
            )}

            {order.fulfillments?.length === 0 ? (
              <p className="text-sm text-gray-500">No fulfillments yet</p>
            ) : (
              order.fulfillments?.map((f: any) => (
                <div key={f.id} className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Carrier</span>
                    <span className="text-white">{f.carrier ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tracking #</span>
                    <span className="text-white font-mono">{f.tracking_number}</span>
                  </div>
                  {f.tracking_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Track</span>
                      <a href={f.tracking_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">
                        View →
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Actions</h3>
            <div className="space-y-2">
              {order.status === "pending" && (
                <button onClick={() => updateStatus("confirmed")} disabled={updatingStatus}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50">
                  Confirm Order
                </button>
              )}
              {order.status === "confirmed" && (
                <button onClick={() => updateStatus("processing")} disabled={updatingStatus}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50">
                  Mark Processing
                </button>
              )}
              {order.status === "shipped" && (
                <button onClick={() => updateStatus("delivered")} disabled={updatingStatus}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50">
                  Mark Delivered
                </button>
              )}
              {!["cancelled", "refunded", "delivered"].includes(order.status) && (
                <button onClick={cancelOrder}
                  className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm py-2 rounded-lg font-medium border border-red-900/50">
                  <X size={14} /> Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Customer</h3>
            <div className="space-y-1 text-sm">
              <p className="text-white">{order.email}</p>
              {order.phone && <p className="text-gray-400">{order.phone}</p>}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Ship To</h3>
            <address className="text-sm text-gray-300 not-italic space-y-0.5">
              <p className="font-medium text-white">{order.shipping_first_name} {order.shipping_last_name}</p>
              {order.shipping_company && <p>{order.shipping_company}</p>}
              <p>{order.shipping_address1}</p>
              {order.shipping_address2 && <p>{order.shipping_address2}</p>}
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p>{order.shipping_country}</p>
              {order.shipping_phone && <p className="text-gray-400 mt-1">{order.shipping_phone}</p>}
            </address>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">Notes</h3>
              <p className="text-sm text-gray-400">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
