import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck, Search, CheckCircle2, Clock, Package, MapPin,
  Download, Edit2, Check, X, ChevronDown, Send, ExternalLink
} from "lucide-react";

interface ShipOrder {
  id: string;
  razorpay_order_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  amount: number;
  status: string;
  items: any;
  paid_at: string | null;
  created_at: string;
  tracking_number: string | null;
  courier_partner: string | null;
  estimated_delivery: string | null;
  shipped_at: string | null;
  delivery_method: string | null;
}

const COURIERS = ["Shiprocket", "Delhivery", "BlueDart", "DTDC", "Ekart", "Xpressbees", "India Post", "Other"];

const DELIVERY_METHODS = ["Standard Shipping", "Express Shipping", "Free Shipping", "COD"];

const STATUS_COLORS: Record<string, string> = {
  paid:       "bg-blue-100 text-blue-700 border border-blue-200",
  confirmed:  "bg-purple-100 text-purple-700 border border-purple-200",
  processing: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  shipped:    "bg-cyan-100 text-cyan-700 border border-cyan-200",
  delivered:  "bg-green-100 text-green-700 border border-green-200",
  cancelled:  "bg-red-100 text-red-700 border border-red-200",
  created:    "bg-gray-100 text-gray-600 border border-gray-200",
};

const FULFILLMENT_LABEL: Record<string, string> = {
  paid: "Unfulfilled",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Fulfilled",
  delivered: "Delivered",
  cancelled: "Cancelled",
  created: "Pending",
};

function getTrackingUrl(courier: string | null, trackingNum: string | null): string | null {
  if (!courier || !trackingNum) return null;
  const c = courier.toLowerCase();
  if (c.includes("delhivery")) return `https://www.delhivery.com/track/package/${trackingNum}`;
  if (c.includes("bluedart")) return `https://www.bluedart.com/tracking?trackFor=0&trackNo=${trackingNum}`;
  if (c.includes("dtdc")) return `https://www.dtdc.in/tracking.asp?Ttype=2&TNo=${trackingNum}`;
  if (c.includes("ekart")) return `https://ekartlogistics.com/shipmenttrack/${trackingNum}`;
  if (c.includes("india post")) return `https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx`;
  return null;
}

export default function Shipping() {
  const [orders, setOrders] = useState<ShipOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    tracking_number: string;
    courier_partner: string;
    delivery_method: string;
    estimated_delivery: string;
  }>({ tracking_number: "", courier_partner: "", delivery_method: "", estimated_delivery: "" });
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .in("status", ["paid", "confirmed", "processing", "shipped", "delivered"])
      .order("created_at", { ascending: false });
    setOrders((data ?? []) as ShipOrder[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const extra: any = { status };
    if (status === "shipped") extra.shipped_at = new Date().toISOString();
    await supabase.from("orders").update(extra).eq("id", id);
    await fetchOrders();
    setUpdatingId(null);
  };

  const startEdit = (order: ShipOrder) => {
    setEditingId(order.id);
    setEditData({
      tracking_number: order.tracking_number ?? "",
      courier_partner: order.courier_partner ?? "",
      delivery_method: order.delivery_method ?? "",
      estimated_delivery: order.estimated_delivery ?? "",
    });
  };

  const saveEdit = async (id: string) => {
    setUpdatingId(id);
    await supabase.from("orders").update({
      tracking_number: editData.tracking_number || null,
      courier_partner: editData.courier_partner || null,
      delivery_method: editData.delivery_method || null,
      estimated_delivery: editData.estimated_delivery || null,
    }).eq("id", id);
    setEditingId(null);
    await fetchOrders();
    setUpdatingId(null);
    showToast("Shipment details saved");
  };

  const sendShippingNotification = async (order: ShipOrder) => {
    if (!order.customer_email) {
      showToast("No customer email on record", "error");
      return;
    }
    setNotifyingId(order.id);
    try {
      const { data, error } = await supabase.functions.invoke("send-shipping-notification", {
        body: {
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderId: order.razorpay_order_id ?? order.id,
          trackingNumber: order.tracking_number,
          courierPartner: order.courier_partner,
          estimatedDelivery: order.estimated_delivery,
          items: order.items,
          shippingAddress: order.shipping_address,
          shippingCity: order.shipping_city,
          shippingState: order.shipping_state,
          shippingPincode: order.shipping_pincode,
        },
      });
      if (error) throw error;
      showToast(`Shipping notification sent to ${order.customer_email}`);
    } catch (e: any) {
      showToast(e.message || "Failed to send notification", "error");
    }
    setNotifyingId(null);
  };

  const exportCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Phone", "Status", "Fulfillment", "Amount", "Items", "Address", "City", "State", "Pincode", "Courier", "Tracking No.", "Delivery Method", "Estimated Delivery", "Shipped At", "Order Date"];
    const rows = filtered.map(o => [
      o.razorpay_order_id ?? o.id,
      o.customer_name ?? "",
      o.customer_email ?? "",
      o.customer_phone ?? "",
      o.status,
      FULFILLMENT_LABEL[o.status] ?? o.status,
      `₹${o.amount}`,
      Array.isArray(o.items) ? o.items.map((i: any) => `${i.productName ?? i.name} x${i.quantity}`).join("; ") : "",
      o.shipping_address ?? "",
      o.shipping_city ?? "",
      o.shipping_state ?? "",
      o.shipping_pincode ?? "",
      o.courier_partner ?? "",
      o.tracking_number ?? "",
      o.delivery_method ?? "",
      o.estimated_delivery ?? "",
      o.shipped_at ? new Date(o.shipped_at).toLocaleString("en-IN") : "",
      new Date(o.created_at).toLocaleString("en-IN"),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shipments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported");
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch =
      (o.customer_name ?? "").toLowerCase().includes(q) ||
      (o.customer_email ?? "").toLowerCase().includes(q) ||
      (o.razorpay_order_id ?? "").toLowerCase().includes(q) ||
      (o.shipping_city ?? "").toLowerCase().includes(q) ||
      (o.tracking_number ?? "").toLowerCase().includes(q) ||
      (o.courier_partner ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const shipped = orders.filter(o => o.status === "shipped").length;
  const delivered = orders.filter(o => o.status === "delivered").length;
  const pending = orders.filter(o => ["paid", "confirmed", "processing"].includes(o.status)).length;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <Check size={15} /> : <X size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Shipping & Fulfillment</h2>
          <p className="text-sm text-gray-500">Manage order dispatch, tracking, and delivery</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
            <Clock size={20} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Awaiting Dispatch</p>
            <p className="text-2xl font-bold text-gray-900">{pending}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
            <Truck size={20} className="text-cyan-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">In Transit</p>
            <p className="text-2xl font-bold text-gray-900">{shipped}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">{delivered}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer, order ID, city, courier, or tracking…"
            className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500">
          <option value="all">All Statuses</option>
          <option value="paid">Paid (New)</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1.2fr_1.2fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
          <span>Order / Customer</span>
          <span>Address</span>
          <span>Payment</span>
          <span>Fulfillment</span>
          <span>Courier / Tracking</span>
          <span>Delivery</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Truck size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">No orders to show</p>
            <p className="text-gray-400 text-sm mt-1">Adjust your search or filter</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(o => {
              const isEditing = editingId === o.id;
              const trackUrl = getTrackingUrl(o.courier_partner, o.tracking_number);

              return (
                <div key={o.id} className="p-5 hover:bg-gray-50/70 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1.2fr_1.2fr_1fr_auto] gap-4 items-start">

                    {/* Order / Customer */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                          #{o.razorpay_order_id?.slice(-8) ?? o.id.slice(0, 8)}
                        </span>
                        <span className="text-xs font-bold text-gray-900">₹{o.amount?.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="font-semibold text-sm text-gray-900 mt-1.5">{o.customer_name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{o.customer_email ?? "—"}</p>
                      <p className="text-xs text-gray-500">{o.customer_phone ?? "—"}</p>
                      {o.items && Array.isArray(o.items) && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Package size={11} />
                          {o.items.map((i: any) => `${i.productName ?? i.name} ×${i.quantity}`).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="min-w-0">
                      {o.shipping_address ? (
                        <div className="flex items-start gap-1.5 text-xs text-gray-600">
                          <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-800">{o.shipping_address}</p>
                            <p>{[o.shipping_city, o.shipping_state].filter(Boolean).join(", ")}</p>
                            <p>{o.shipping_pincode}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>

                    {/* Payment Status */}
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                        Paid
                      </span>
                    </div>

                    {/* Fulfillment Status + Actions */}
                    <div className="space-y-2">
                      <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {FULFILLMENT_LABEL[o.status] ?? o.status}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {o.status === "paid" && (
                          <button onClick={() => updateStatus(o.id, "confirmed")} disabled={updatingId === o.id}
                            className="text-xs px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                            Confirm
                          </button>
                        )}
                        {o.status === "confirmed" && (
                          <button onClick={() => updateStatus(o.id, "processing")} disabled={updatingId === o.id}
                            className="text-xs px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50">
                            Processing
                          </button>
                        )}
                        {(o.status === "processing" || o.status === "confirmed") && (
                          <button onClick={() => updateStatus(o.id, "shipped")} disabled={updatingId === o.id}
                            className="text-xs px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium disabled:opacity-50">
                            Mark Shipped
                          </button>
                        )}
                        {o.status === "shipped" && (
                          <button onClick={() => updateStatus(o.id, "delivered")} disabled={updatingId === o.id}
                            className="text-xs px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50">
                            Delivered
                          </button>
                        )}
                      </div>
                      {o.shipped_at && (
                        <p className="text-xs text-gray-400">
                          Shipped: {new Date(o.shipped_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      )}
                    </div>

                    {/* Courier / Tracking */}
                    <div className="min-w-0">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <select value={editData.courier_partner} onChange={e => setEditData(p => ({ ...p, courier_partner: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500">
                            <option value="">Select courier</option>
                            {COURIERS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input value={editData.tracking_number} onChange={e => setEditData(p => ({ ...p, tracking_number: e.target.value }))}
                            placeholder="Tracking / AWB number"
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500" />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {o.courier_partner ? (
                            <span className="inline-block text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                              {o.courier_partner}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">No courier</span>
                          )}
                          {o.tracking_number ? (
                            <div className="flex items-center gap-1">
                              <p className="font-mono text-xs text-gray-700">{o.tracking_number}</p>
                              {trackUrl && (
                                <a href={trackUrl} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700">
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No tracking</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delivery Method + Estimated Delivery */}
                    <div className="min-w-0">
                      {isEditing ? (
                        <div className="space-y-1.5">
                          <select value={editData.delivery_method} onChange={e => setEditData(p => ({ ...p, delivery_method: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500">
                            <option value="">Select method</option>
                            {DELIVERY_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <input type="date" value={editData.estimated_delivery} onChange={e => setEditData(p => ({ ...p, estimated_delivery: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500" />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {o.delivery_method ? (
                            <p className="text-xs font-medium text-gray-700">{o.delivery_method}</p>
                          ) : (
                            <span className="text-xs text-gray-400">No method</span>
                          )}
                          {o.estimated_delivery ? (
                            <p className="text-xs text-gray-500">
                              Est: {new Date(o.estimated_delivery + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(o.id)} disabled={updatingId === o.id}
                            className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50">
                            <Check size={12} /> Save
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                            <X size={12} /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(o)}
                            className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium border border-gray-200">
                            <Edit2 size={12} /> Edit
                          </button>
                          {(o.status === "shipped" || o.status === "delivered") && (
                            <button onClick={() => sendShippingNotification(o)} disabled={notifyingId === o.id}
                              className="flex items-center justify-center gap-1 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50">
                              <Send size={12} /> {notifyingId === o.id ? "Sending…" : "Notify"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer info */}
      <p className="text-xs text-gray-400 text-center">
        Showing {filtered.length} of {orders.length} orders · Click <strong>Edit</strong> to add tracking number, courier, and delivery details
      </p>
    </div>
  );
}
