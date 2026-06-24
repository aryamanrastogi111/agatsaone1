import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildInvoicePdf } from "../_shared/invoice-pdf.ts";
import { buildDeliverySlipPdf } from "../_shared/delivery-slip-pdf.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getDeliveryWindow(): { from: string; to: string } {
  const now = new Date();
  const addBusinessDays = (date: Date, days: number) => {
    let d = new Date(date);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) added++;
    }
    return d;
  };
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return {
    from: fmt(addBusinessDays(now, 5)),
    to: fmt(addBusinessDays(now, 7)),
  };
}

function formatINR(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// buildInvoicePdf is now imported from ../_shared/invoice-pdf.ts

async function sendViaResend(params: {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  resendApiKey: string;
  attachments?: { filename: string; content: string; content_type: string }[];
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const body: Record<string, unknown> = {
    from: params.from,
    to: [params.to],
    subject: params.subject,
    html: params.html,
    text: params.text,
  };
  if (params.attachments?.length) {
    body.attachments = params.attachments;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${params.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: data?.message || JSON.stringify(data) };
  }
  return { success: true, id: data.id };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY secret is not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      customerEmail,
      customerName,
      customerPhone,
      orderId,
      paymentId,
      items,
      total,
      discountAmount,
      couponCode,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      _testTeamEmail,
    } = await req.json();

    const teamRecipients = _testTeamEmail
      ? [_testTeamEmail]
      : ["info@agatsa.com", "munfungaming@gmail.com", "rahul.amu2@gmail.com", "agr.neha@gmail.com"];
    const customerFrom = "Agatsa Software <orders@agatsa.in>";
    const teamFrom = "Agatsa Orders <orders@agatsa.in>";

    if (!customerEmail || !orderId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const delivery = getDeliveryWindow();
    const totalFormatted = `Rs. ${(total || 0).toLocaleString("en-IN")}`;
    const fullAddress = [shippingAddress, shippingCity, shippingState, shippingPincode]
      .filter(Boolean)
      .join(", ");

    const orderDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });

    // ── Build invoice PDF ───────────────────────────────────────────────────────
    let invoicePdfBase64 = "";
    try {
      const subtotal = (items || []).reduce(
        (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
        0
      );
      const pdfBytes = await buildInvoicePdf({
        orderId,
        paymentId,
        orderDate,
        customerName: customerName || "",
        customerEmail,
        customerPhone,
        shippingAddress: shippingAddress || "",
        shippingCity: shippingCity || "",
        shippingState: shippingState || "",
        shippingPincode: shippingPincode || "",
        items: items || [],
        subtotal,
        discountAmount,
        couponCode,
        total: total || 0,
      });
      // Convert to base64
      let binary = "";
      for (let i = 0; i < pdfBytes.length; i++) {
        binary += String.fromCharCode(pdfBytes[i]);
      }
      invoicePdfBase64 = btoa(binary);
    } catch (pdfErr) {
      console.error("PDF generation failed (non-fatal):", pdfErr);
    }

    // ── Build delivery slip PDF (for team email only) ──────────────────────────
    let deliverySlipBase64 = "";
    try {
      const slipBytes = await buildDeliverySlipPdf({
        orderId,
        orderDate,
        paymentMethod: paymentId ? "PREPAID" : "PREPAID",
        customerName: customerName || "",
        customerPhone,
        shippingAddress: shippingAddress || "",
        shippingCity: shippingCity || "",
        shippingState: shippingState || "",
        shippingPincode: shippingPincode || "",
        items: items || [],
        total: total || 0,
      });
      let binary = "";
      for (let i = 0; i < slipBytes.length; i++) {
        binary += String.fromCharCode(slipBytes[i]);
      }
      deliverySlipBase64 = btoa(binary);
    } catch (slipErr) {
      console.error("Delivery slip generation failed (non-fatal):", slipErr);
    }

    // Map productId / SKU → free Nera AI trial copy for the confirmation email.
    const neraTrialFor = (raw: string): string | null => {
      const k = (raw || "").toLowerCase();
      if (k.includes("ecg") || k.includes("sanketlife")) return "Includes 14-day Nera AI Premium trial — activates on pairing";
      if (k.includes("wellness") || k.includes("easytouch") && !k.includes("rhythm") || k.includes("multivital")) return "Includes 7-day Nera AI trial — activates on pairing";
      if (k.includes("rhythm") || k.includes("band")) return "Includes 7-day Nera AI Premium trial — activates on pairing";
      if (k.includes("scale") || k.includes("corebalance")) return "Includes 7-day Nera AI trial — activates on pairing";
      return null;
    };

    const itemsHtml = (items || [])
      .map(
        (item: { productName: string; variantTitle?: string; quantity: number; price: number; sku?: string; productId?: string }) => {
          const trial = neraTrialFor(item.sku || item.productId || item.productName || "");
          return `<tr>
            <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#374151;">
              <strong>${item.productName}</strong>${item.variantTitle && item.variantTitle !== "Default Title" ? `<br/><span style="font-size:12px;color:#64748b;">${item.variantTitle}</span>` : ""}${trial ? `<br/><span style="font-size:12px;color:#7c3aed;font-weight:600;">🎁 ${trial}</span>` : ""}
            </td>
            <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:14px;color:#374151;">${item.quantity}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:right;font-size:14px;color:#374151;font-weight:600;">Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}</td>
          </tr>`;
        }
      )
      .join("");


    // ─── CUSTOMER EMAIL HTML ───────────────────────────────────────────────────
    const customerEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Confirmed – Agatsa</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Agatsa Software Pvt Ltd</h1>
              <p style="color:#bae6fd;margin:6px 0 0;font-size:13px;letter-spacing:0.3px;">FUTURE IS NEAR</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f0fdf4;padding:28px 40px 20px;text-align:center;border-bottom:2px solid #dcfce7;">
              <div style="display:inline-block;background:#22c55e;width:52px;height:52px;border-radius:50%;text-align:center;line-height:52px;font-size:26px;margin-bottom:12px;">&#10003;</div>
              <h2 style="color:#15803d;margin:0 0 6px;font-size:24px;font-weight:700;">Order Confirmed!</h2>
              <p style="color:#166534;margin:0;font-size:15px;">Thank you, <strong>${customerName || "Valued Customer"}</strong>! Your order is on its way.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:28px;border:1px solid #bfdbfe;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="vertical-align:middle;">
                          <p style="margin:0 0 4px;font-size:12px;color:#1e40af;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;">Estimated Delivery</p>
                          <p style="margin:0;font-size:18px;font-weight:700;color:#1e3a8a;">${delivery.from} - ${delivery.to}</p>
                          <p style="margin:4px 0 0;font-size:12px;color:#3b82f6;">5-7 business days after dispatch</p>
                        </td>
                        <td style="text-align:right;vertical-align:middle;">
                          <div style="background:#1d4ed8;color:#ffffff;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;">IN TRANSIT</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;margin-bottom:24px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.7px;font-weight:700;">Order Reference</p>
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;word-break:break-all;">${orderId}</p>
                    ${paymentId ? `<p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:11px;color:#64748b;word-break:break-all;">Payment ID: ${paymentId}</p>` : ""}
                  </td>
                </tr>
              </table>
              <h3 style="margin:0 0 12px;font-size:15px;color:#0f172a;font-weight:700;">Items Ordered</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 14px;text-align:left;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
                    <th style="padding:10px 14px;text-align:center;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th style="padding:10px 14px;text-align:right;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="background:#f0f9ff;">
                    <td colspan="2" style="padding:12px 14px;font-size:15px;font-weight:700;color:#0f172a;">Total Paid</td>
                    <td style="padding:12px 14px;font-size:16px;font-weight:700;color:#0ea5e9;text-align:right;">${totalFormatted}</td>
                  </tr>
                </tbody>
              </table>
              <h3 style="margin:0 0 10px;font-size:15px;color:#0f172a;font-weight:700;">Delivery Address</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;margin-bottom:24px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:16px 18px;font-size:14px;color:#374151;line-height:1.7;">
                    ${fullAddress || "Address not provided"}
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:14px;color:#111827;font-weight:700;">What happens next?</p>
                    <ul style="margin:0;padding-left:18px;font-size:13px;color:#374151;line-height:1.8;">
                      <li>Our team will verify and pack your order within 1-2 business days.</li>
                      <li>You will receive a shipping confirmation with tracking details once dispatched.</li>
                      <li>Estimated delivery: <strong>${delivery.from} - ${delivery.to}</strong></li>
                    </ul>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px;font-size:14px;color:#6b21a8;font-weight:700;">🎁 Your free Nera AI trial</p>
                    <p style="margin:0;font-size:13px;color:#581c87;line-height:1.6;">
                      Each device in your order comes with a free Nera AI trial — <strong>14 days of Nera AI Premium</strong> with SanketLife ECG, and <strong>7 days</strong> with EasyTouch Wellness, Rhythm Band and Smart Scale. Your trial activates the moment you pair the device in <strong>Agatsa One</strong>.
                    </p>
                  </td>
                </tr>
              </table>
              ${invoicePdfBase64 ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;font-size:13px;color:#166534;">
                    Your invoice is attached to this email as a PDF. Please keep it for your records.
                  </td>
                </tr>
              </table>` : ""}
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px;font-size:14px;color:#1e40af;font-weight:700;">Need help with your order?</p>
                    <p style="margin:0;font-size:13px;color:#1d4ed8;">
                      Email us at <a href="mailto:info@agatsa.com" style="color:#0ea5e9;text-decoration:none;font-weight:600;">info@agatsa.com</a>
                      &nbsp;|&nbsp;
                      <a href="https://agatsa.com/support" style="color:#0ea5e9;text-decoration:none;">agatsa.com/support</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;">2025 Agatsa Software Pvt. Ltd.</p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">Bengaluru, India · <a href="https://agatsa.com" style="color:#94a3b8;text-decoration:none;">agatsa.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // ─── TEAM NOTIFICATION EMAIL HTML ─────────────────────────────────────────
    const itemsTextList = (items || [])
      .map(
        (item: { productName: string; variantTitle?: string; quantity: number; price: number }) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#374151;">${item.productName}${item.variantTitle && item.variantTitle !== "Default Title" ? ` (${item.variantTitle})` : ""}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;font-size:13px;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;font-weight:600;">Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}</td>
          </tr>`
      )
      .join("");

    const teamEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Order Received – ${orderId}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.07);">
          <tr>
            <td style="background:#0f172a;padding:20px 32px;text-align:center;">
              <h1 style="color:#f8fafc;margin:0;font-size:18px;font-weight:700;">New Order Alert</h1>
              <p style="color:#94a3b8;margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.8px;">Agatsa Internal Notification</p>
            </td>
          </tr>
          <tr>
            <td style="background:#fef3c7;padding:14px 32px;border-bottom:2px solid #fde68a;">
              <p style="margin:0;font-size:14px;color:#92400e;font-weight:700;text-align:center;">
                A new order has been placed — please process for fulfillment
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.7px;color:#64748b;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Customer Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;width:120px;font-weight:600;">Name</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:700;">${customerName || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#0ea5e9;"><a href="mailto:${customerEmail}" style="color:#0ea5e9;text-decoration:none;">${customerEmail}</a></td>
                </tr>
                ${customerPhone ? `<tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Phone</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;">${customerPhone}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Delivery To</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;">${fullAddress || "—"}</td>
                </tr>
              </table>
              <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.7px;color:#64748b;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;width:120px;font-weight:600;">Order ID</td>
                  <td style="padding:6px 0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;">${orderId}</td>
                </tr>
                ${paymentId ? `<tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Payment ID</td>
                  <td style="padding:6px 0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;">${paymentId}</td>
                </tr>` : ""}
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Order Total</td>
                  <td style="padding:6px 0;font-size:15px;color:#16a34a;font-weight:700;">${totalFormatted}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#64748b;font-weight:600;">Exp. Delivery</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${delivery.from} - ${delivery.to}</td>
                </tr>
              </table>
              <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:0.7px;color:#64748b;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Items to Fulfill</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Product</th>
                    <th style="padding:8px 12px;text-align:center;font-size:11px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Qty</th>
                    <th style="padding:8px 12px;text-align:right;font-size:11px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsTextList}
                  <tr style="background:#f0fdf4;">
                    <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#0f172a;">TOTAL</td>
                    <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#16a34a;text-align:right;">${totalFormatted}</td>
                  </tr>
                </tbody>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://agatsaone1.lovable.app/admin/orders" style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.3px;">View Order in Admin Panel</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">Agatsa Software · Internal Use Only</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // ─── SEND CUSTOMER EMAIL WITH PDF ATTACHMENT ──────────────────────────────
    const customerAttachments = invoicePdfBase64
      ? [{
          filename: `invoice-${orderId}.pdf`,
          content: invoicePdfBase64,
          content_type: "application/pdf",
        }]
      : [];

    const isPlaceholderEmail = /@noemail\.agatsa\.com$/i.test(customerEmail);
    const customerResult = isPlaceholderEmail
      ? { success: false, error: "Skipped: placeholder email (no real address on order)", id: null as string | null }
      : await sendViaResend({
          to: customerEmail,
          from: customerFrom,
          subject: `Order Confirmed – ${orderId} | Agatsa`,
          html: customerEmailHtml,
          text: stripHtml(customerEmailHtml),
          resendApiKey: RESEND_API_KEY,
          attachments: customerAttachments,
        });

    console.log("Customer email result:", JSON.stringify(customerResult));

    await supabase.from("email_send_log").insert({
      message_id: crypto.randomUUID(),
      template_name: "order_confirmation",
      recipient_email: customerEmail,
      status: customerResult.success ? "sent" : "failed",
      error_message: customerResult.error || null,
      metadata: { resend_id: customerResult.id, has_invoice: !!invoicePdfBase64 },
    });

    // ─── SEND TEAM EMAIL TO ALL RECIPIENTS VIA RESEND ────────────────────────
    const teamAttachments: { filename: string; content: string; content_type: string }[] = [];
    if (deliverySlipBase64) {
      teamAttachments.push({
        filename: `delivery-slip-${orderId}.pdf`,
        content: deliverySlipBase64,
        content_type: "application/pdf",
      });
    }

    const teamResults = await Promise.all(
      teamRecipients.map((recipient) =>
        sendViaResend({
          to: recipient,
          from: teamFrom,
          subject: `New Order: ${customerName || customerEmail} – ${totalFormatted}`,
          html: teamEmailHtml,
          text: stripHtml(teamEmailHtml),
          resendApiKey: RESEND_API_KEY,
          attachments: teamAttachments,
        })
      )
    );

    console.log("Team email results:", JSON.stringify(teamResults));

    await supabase.from("email_send_log").insert(
      teamRecipients.map((recipient, i) => ({
        message_id: crypto.randomUUID(),
        template_name: "order_team_notification",
        recipient_email: recipient,
        status: teamResults[i].success ? "sent" : "failed",
        error_message: teamResults[i].error || null,
        metadata: { resend_id: teamResults[i].id },
      }))
    );

    const teamResult = teamResults[0];

    // Update order status
    await supabase.from("orders").update({ status: "confirmed" }).eq("razorpay_order_id", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        customer: customerResult,
        team: teamResult,
        invoiceAttached: !!invoicePdfBase64,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Order confirmation email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
