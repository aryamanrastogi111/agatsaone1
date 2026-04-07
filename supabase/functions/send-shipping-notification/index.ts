import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const {
      customerEmail,
      customerName,
      orderId,
      trackingNumber,
      courierPartner,
      estimatedDelivery,
      items,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
    } = await req.json();

    if (!customerEmail || !orderId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullAddress = [shippingAddress, shippingCity, shippingState, shippingPincode]
      .filter(Boolean)
      .join(", ");

    const estimatedDeliveryFormatted = estimatedDelivery
      ? new Date(estimatedDelivery + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "5–7 business days from dispatch";

    const trackingUrl = (() => {
      if (!courierPartner || !trackingNumber) return null;
      const c = courierPartner.toLowerCase();
      if (c.includes("delhivery")) return `https://www.delhivery.com/track/package/${trackingNumber}`;
      if (c.includes("bluedart")) return `https://www.bluedart.com/tracking?trackFor=0&trackNo=${trackingNumber}`;
      if (c.includes("dtdc")) return `https://www.dtdc.in/tracking.asp?Ttype=2&TNo=${trackingNumber}`;
      if (c.includes("ekart")) return `https://ekartlogistics.com/shipmenttrack/${trackingNumber}`;
      return null;
    })();

    const itemsHtml = (items || [])
      .map((item: { productName?: string; name?: string; quantity: number }) =>
        `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#374151;">
            <strong>${item.productName ?? item.name ?? "Product"}</strong>
          </td>
          <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:14px;color:#374151;">${item.quantity}</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your Order Has Shipped – Agatsa</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">Agatsa Software Pvt Ltd</h1>
              <p style="color:#bae6fd;margin:6px 0 0;font-size:13px;letter-spacing:0.3px;">FUTURE IS NEAR</p>
            </td>
          </tr>

          <!-- Shipped Banner -->
          <tr>
            <td style="background:#f0f9ff;padding:28px 40px 20px;text-align:center;border-bottom:2px solid #bae6fd;">
              <div style="display:inline-block;background:#0ea5e9;width:52px;height:52px;border-radius:50%;text-align:center;line-height:52px;font-size:26px;margin-bottom:12px;">🚚</div>
              <h2 style="color:#0369a1;margin:0 0 6px;font-size:24px;font-weight:700;">Your Order is on the Way!</h2>
              <p style="color:#0284c7;margin:0;font-size:15px;">Hi <strong>${customerName || "Valued Customer"}</strong>, your order has been dispatched.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <!-- Tracking Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:12px;margin-bottom:28px;border:1px solid #bfdbfe;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:12px;color:#1e40af;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;">📦 Shipment Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${courierPartner ? `<tr>
                        <td style="font-size:13px;color:#64748b;padding:4px 0;width:130px;font-weight:600;">Courier Partner</td>
                        <td style="font-size:14px;color:#1e3a8a;font-weight:700;">${courierPartner}</td>
                      </tr>` : ""}
                      ${trackingNumber ? `<tr>
                        <td style="font-size:13px;color:#64748b;padding:4px 0;font-weight:600;">Tracking Number</td>
                        <td style="font-family:'Courier New',monospace;font-size:14px;color:#1e3a8a;font-weight:700;">${trackingNumber}</td>
                      </tr>` : ""}
                      <tr>
                        <td style="font-size:13px;color:#64748b;padding:4px 0;font-weight:600;">Est. Delivery</td>
                        <td style="font-size:14px;color:#1e3a8a;font-weight:700;">${estimatedDeliveryFormatted}</td>
                      </tr>
                    </table>
                    ${trackingUrl ? `<div style="margin-top:14px;">
                      <a href="${trackingUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;">Track My Order →</a>
                    </div>` : ""}
                  </td>
                </tr>
              </table>

              <!-- Order Reference -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;margin-bottom:24px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#64748b;text-transform:uppercase;font-weight:700;">Order Reference</p>
                    <p style="margin:0;font-family:'Courier New',monospace;font-size:13px;color:#0f172a;">${orderId}</p>
                  </td>
                </tr>
              </table>

              <!-- Items -->
              ${items && items.length > 0 ? `
              <h3 style="margin:0 0 12px;font-size:15px;color:#0f172a;font-weight:700;">📋 Items in Your Order</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 14px;text-align:left;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Product</th>
                    <th style="padding:10px 14px;text-align:center;font-size:12px;color:#64748b;font-weight:700;border-bottom:1px solid #e2e8f0;">Qty</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>` : ""}

              <!-- Address -->
              <h3 style="margin:0 0 10px;font-size:15px;color:#0f172a;font-weight:700;">📍 Delivery Address</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;margin-bottom:24px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:14px 18px;font-size:14px;color:#374151;line-height:1.7;">${fullAddress || "—"}</td>
                </tr>
              </table>

              <!-- Support -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0 0 4px;font-size:14px;color:#1e40af;font-weight:700;">Questions about your delivery?</p>
                    <p style="margin:0;font-size:13px;color:#1d4ed8;">
                      Email us at <a href="mailto:info@agatsa.com" style="color:#0ea5e9;font-weight:600;text-decoration:none;">info@agatsa.com</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;">© 2025 Agatsa Software Pvt Ltd</p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">Bengaluru, India · <a href="https://agatsa.com" style="color:#94a3b8;text-decoration:none;">agatsa.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const stripHtml = (h: string) => h.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Agatsa Software Pvt Ltd <orders@agatsa.in>",
        to: [customerEmail],
        subject: `🚚 Your Order Has Shipped – ${orderId} | Agatsa`,
        html,
        text: stripHtml(html),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ success: false, error: data?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Shipping notification sent:", data.id);
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Shipping notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
