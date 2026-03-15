import { useState } from "react";
import { Mail, Users, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Sample data ────────────────────────────────────────────────────────────────
const SAMPLE = {
  customerName: "Priya Sharma",
  customerEmail: "priya@example.com",
  orderId: "order_PxK9mQzL3nRt7WbA",
  paymentId: "pay_QwE8vYnK2pXsD1cB",
  items: [
    { productName: "SanketLife 2.0", variantTitle: "Standard Kit", quantity: 1, price: 14999 },
    { productName: "EasyTouch Plus", variantTitle: "Default Title", quantity: 2, price: 4999 },
  ],
  total: 24997,
  shippingAddress: "42, MG Road, Indiranagar",
  shippingCity: "Bengaluru",
  shippingState: "Karnataka",
  shippingPincode: "560038",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getDeliveryWindow() {
  const now = new Date();
  const addBusinessDays = (date: Date, days: number) => {
    const d = new Date(date);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) added++;
    }
    return d;
  };
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return { from: fmt(addBusinessDays(now, 5)), to: fmt(addBusinessDays(now, 7)) };
}

function buildCustomerHtml(data: typeof SAMPLE) {
  const delivery = getDeliveryWindow();
  const totalFormatted = `₹${data.total.toLocaleString("en-IN")}`;
  const fullAddress = [data.shippingAddress, data.shippingCity, data.shippingState, data.shippingPincode]
    .filter(Boolean).join(", ");
  const itemsHtml = data.items
    .map(item => `<tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#374151;">
        <strong>${item.productName}</strong>${item.variantTitle !== "Default Title" ? `<br/><span style="font-size:12px;color:#64748b;">${item.variantTitle}</span>` : ""}
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:14px;color:#374151;">${item.quantity}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:right;font-size:14px;color:#374151;font-weight:600;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Order Confirmed – Agatsa</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);padding:32px 40px;text-align:center;">
          <img src="https://agatsaone1.lovable.app/agatsa-favicon.png" alt="Agatsa" width="40" height="40" style="display:block;margin:0 auto 12px;border-radius:8px;"/>
          <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">Agatsa Medical Technologies</h1>
          <p style="color:#bae6fd;margin:6px 0 0;font-size:13px;letter-spacing:0.3px;">YOUR HEART, OUR PRIORITY</p>
        </td></tr>
        <tr><td style="background:#f0fdf4;padding:28px 40px 20px;text-align:center;border-bottom:2px solid #dcfce7;">
          <div style="display:inline-block;background:#22c55e;width:52px;height:52px;border-radius:50%;text-align:center;line-height:52px;font-size:26px;margin-bottom:12px;">✓</div>
          <h2 style="color:#15803d;margin:0 0 6px;font-size:24px;font-weight:700;">Order Confirmed!</h2>
          <p style="color:#166534;margin:0;font-size:15px;">Thank you, <strong>${data.customerName}</strong>! Your order is on its way.</p>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:28px;border:1px solid #bfdbfe;">
            <tr><td style="padding:18px 20px;">
              <p style="margin:0 0 4px;font-size:12px;color:#1e40af;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;">🚚 Estimated Delivery</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1e3a8a;">${delivery.from} – ${delivery.to}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#3b82f6;">5–7 business days after dispatch</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;margin-bottom:24px;border:1px solid #e2e8f0;">
            <tr><td style="padding:16px 18px;">
              <p style="margin:0 0 6px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.7px;font-weight:700;">Order Reference</p>
              <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;">${data.orderId}</p>
              <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:11px;color:#64748b;">Payment ID: ${data.paymentId}</p>
            </td></tr>
          </table>
          <h3 style="margin:0 0 12px;font-size:15px;color:#0f172a;font-weight:700;">📦 Items Ordered</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
            <thead><tr style="background:#f8fafc;">
              <th style="padding:10px 14px;text-align:left;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Product</th>
              <th style="padding:10px 14px;text-align:center;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Qty</th>
              <th style="padding:10px 14px;text-align:right;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Amount</th>
            </tr></thead>
            <tbody>${itemsHtml}
              <tr style="background:#f0f9ff;">
                <td colspan="2" style="padding:12px 14px;font-size:15px;font-weight:700;color:#0f172a;">Total Paid</td>
                <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#0ea5e9;text-align:right;">${totalFormatted}</td>
              </tr>
            </tbody>
          </table>
          <h3 style="margin:0 0 10px;font-size:15px;color:#0f172a;font-weight:700;">📍 Delivery Address</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;margin-bottom:24px;border:1px solid #e2e8f0;">
            <tr><td style="padding:16px 18px;font-size:14px;color:#374151;line-height:1.7;">${fullAddress}</td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;margin-bottom:24px;">
            <tr><td style="padding:16px 18px;">
              <p style="margin:0 0 8px;font-size:14px;color:#92400e;font-weight:700;">⏭️ What happens next?</p>
              <ul style="margin:0;padding-left:18px;font-size:13px;color:#78350f;line-height:1.8;">
                <li>Our team will verify and pack your order within 1–2 business days.</li>
                <li>You'll receive a shipping confirmation with tracking details once dispatched.</li>
                <li>Estimated delivery: <strong>${delivery.from} – ${delivery.to}</strong></li>
              </ul>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
            <tr><td style="padding:16px 18px;">
              <p style="margin:0 0 4px;font-size:14px;color:#1e40af;font-weight:700;">Need help with your order?</p>
              <p style="margin:0;font-size:13px;color:#1d4ed8;">Email us at <a href="mailto:care@agatsa.com" style="color:#0ea5e9;text-decoration:none;font-weight:600;">care@agatsa.com</a></p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;">© 2025 Agatsa Medical Technologies Pvt. Ltd.</p>
          <p style="margin:0;font-size:11px;color:#cbd5e1;">Bengaluru, India · agatsa.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildTeamHtml(data: typeof SAMPLE) {
  const delivery = getDeliveryWindow();
  const totalFormatted = `₹${data.total.toLocaleString("en-IN")}`;
  const fullAddress = [data.shippingAddress, data.shippingCity, data.shippingState, data.shippingPincode]
    .filter(Boolean).join(", ");
  const itemsHtml = data.items
    .map(item => `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#374151;">${item.productName}${item.variantTitle !== "Default Title" ? ` (${item.variantTitle})` : ""}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;font-weight:600;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>New Order – ${data.orderId}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);">
        <tr><td style="background:#0f172a;padding:20px 32px;text-align:center;">
          <h1 style="color:#f8fafc;margin:0;font-size:18px;font-weight:700;">🛎️ New Order Alert</h1>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Agatsa Internal Notification</p>
        </td></tr>
        <tr><td style="background:#fef3c7;padding:14px 32px;border-bottom:2px solid #fde68a;">
          <p style="margin:0;font-size:14px;color:#92400e;font-weight:700;text-align:center;">🎉 A new order has been placed — please process for fulfillment</p>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.7px;color:#64748b;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">👤 Customer Details</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;width:120px;font-weight:600;">Name</td>
              <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:700;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Email</td>
              <td style="padding:6px 0;font-size:14px;color:#0ea5e9;">${data.customerEmail}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Delivery To</td>
              <td style="padding:6px 0;font-size:14px;color:#0f172a;">${fullAddress}</td>
            </tr>
          </table>
          <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.7px;color:#64748b;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">📦 Order Details</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;width:120px;font-weight:600;">Order ID</td>
              <td style="padding:6px 0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;">${data.orderId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Payment ID</td>
              <td style="padding:6px 0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;">${data.paymentId}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Order Total</td>
              <td style="padding:6px 0;font-size:15px;color:#16a34a;font-weight:700;">${totalFormatted}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Exp. Delivery</td>
              <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${delivery.from} – ${delivery.to}</td>
            </tr>
          </table>
          <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.7px;color:#64748b;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🛒 Items to Fulfill</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
            <thead><tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Product</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Qty</th>
              <th style="padding:8px 12px;text-align:right;font-size:11px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Amount</th>
            </tr></thead>
            <tbody>${itemsHtml}
              <tr style="background:#f0fdf4;">
                <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#0f172a;">TOTAL</td>
                <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#16a34a;text-align:right;">${totalFormatted}</td>
              </tr>
            </tbody>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="https://agatsaone1.lovable.app/admin/orders" style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:700;">View Order in Admin Panel →</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">Agatsa Medical Technologies · Internal Use Only · Sent to info@agatsa.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Component ──────────────────────────────────────────────────────────────────
type Tab = "customer" | "team";
type SendStatus = "idle" | "sending" | "success" | "error";

export default function EmailPreview() {
  const [active, setActive] = useState<Tab>("customer");
  const [testEmail, setTestEmail] = useState("");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");

  const html = active === "customer"
    ? buildCustomerHtml(SAMPLE)
    : buildTeamHtml(SAMPLE);

  const sendTestEmail = async () => {
    const target = testEmail.trim();
    if (!target) { toast.error("Enter an email address first"); return; }
    setSendStatus("sending");
    try {
      const { error } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          customerEmail: active === "customer" ? target : SAMPLE.customerEmail,
          customerName: SAMPLE.customerName,
          orderId: SAMPLE.orderId,
          paymentId: SAMPLE.paymentId,
          items: SAMPLE.items,
          total: SAMPLE.total,
          shippingAddress: SAMPLE.shippingAddress,
          shippingCity: SAMPLE.shippingCity,
          shippingState: SAMPLE.shippingState,
          shippingPincode: SAMPLE.shippingPincode,
          // Override team recipient for testing
          _testTeamEmail: active === "team" ? target : undefined,
        },
      });
      if (error) throw error;
      setSendStatus("success");
      toast.success(`Test email sent to ${target}`);
      setTimeout(() => setSendStatus("idle"), 4000);
    } catch (err: any) {
      setSendStatus("error");
      toast.error(err?.message || "Failed to send test email");
      setTimeout(() => setSendStatus("idle"), 4000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Email Previews</h1>
        <p className="text-sm text-gray-500 mt-0.5">Live preview of order confirmation emails sent via the system.</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActive("customer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            active === "customer"
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Mail size={15} />
          Customer Confirmation
        </button>
        <button
          onClick={() => setActive("team")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            active === "team"
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Users size={15} />
          Team Notification
          <span className="text-xs opacity-70 ml-1">→ info@agatsa.com</span>
        </button>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
        <span className="font-medium text-amber-700">Preview mode</span>
        <span className="text-amber-600">— using sample order data. Actual emails use real order details.</span>
      </div>

      {/* Email iframe */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Mock email header */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400 uppercase tracking-wide">From</span>
            <span className="text-gray-700 font-medium">
              {active === "customer" ? "Agatsa Medical Technologies" : "Agatsa Orders"}{" "}
              <span className="text-gray-400">&lt;orders@notify.agatsa.in&gt;</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400 uppercase tracking-wide">To</span>
            <span className="text-gray-700">
              {active === "customer" ? SAMPLE.customerEmail : "info@agatsa.com"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400 uppercase tracking-wide">Subject</span>
            <span className="text-gray-700 font-medium">
              {active === "customer"
                ? `✅ Order Confirmed – ${SAMPLE.orderId} | Agatsa`
                : `🛎️ New Order: ${SAMPLE.customerName} – ₹${SAMPLE.total.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        {/* Rendered email */}
        <iframe
          srcDoc={html}
          title={`${active} email preview`}
          className="w-full border-0"
          style={{ height: "700px" }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
