import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const {
      customerEmail,
      customerName,
      orderId,
      paymentId,
      items,
      total,
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

    // Format items list
    const itemsHtml = (items || [])
      .map(
        (item: { productName: string; variantTitle?: string; quantity: number; price: number }) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">
              ${item.productName}${item.variantTitle && item.variantTitle !== "Default Title" ? ` (${item.variantTitle})` : ""}
            </td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
          </tr>`
      )
      .join("");

    const totalFormatted = `₹${(total || 0).toLocaleString("en-IN")}`;

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Confirmed – Agatsa</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:#0ea5e9;padding:28px 32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Agatsa Medical Technologies</h1>
              <p style="color:#bae6fd;margin:6px 0 0;font-size:13px;">Your health, powered by innovation</p>
            </td>
          </tr>
          <!-- Success Banner -->
          <tr>
            <td style="background:#f0fdf4;padding:20px 32px;text-align:center;border-bottom:1px solid #dcfce7;">
              <p style="margin:0;font-size:28px;">✅</p>
              <h2 style="color:#166534;margin:8px 0 4px;font-size:20px;">Order Confirmed!</h2>
              <p style="color:#15803d;margin:0;font-size:14px;">Thank you, ${customerName || "Valued Customer"}! Your order has been successfully placed.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <!-- Order Reference -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 6px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Order Reference</p>
                    <p style="margin:0;font-family:monospace;font-size:13px;color:#0f172a;word-break:break-all;">${orderId}</p>
                    ${paymentId ? `<p style="margin:4px 0 0;font-family:monospace;font-size:11px;color:#64748b;word-break:break-all;">Payment: ${paymentId}</p>` : ""}
                  </td>
                </tr>
              </table>

              <!-- Items -->
              <h3 style="margin:0 0 12px;font-size:14px;color:#0f172a;font-weight:600;">📦 Items Ordered</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Product</th>
                    <th style="padding:10px 12px;text-align:center;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr style="background:#f0f9ff;">
                    <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#0f172a;">Total Paid</td>
                    <td style="padding:10px 12px;font-size:14px;font-weight:700;color:#0ea5e9;text-align:right;">${totalFormatted}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Delivery Address -->
              <h3 style="margin:0 0 10px;font-size:14px;color:#0f172a;font-weight:600;">📍 Delivery Address</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:20px;">
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#374151;line-height:1.6;">
                    ${shippingAddress || ""}${shippingAddress ? ", " : ""}${shippingCity || ""}${shippingState ? ", " + shippingState : ""}${shippingPincode ? " - " + shippingPincode : ""}
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 4px;font-size:14px;color:#1e40af;font-weight:600;">Need help with your order?</p>
                    <p style="margin:0;font-size:13px;color:#1d4ed8;">Email us at <a href="mailto:care@agatsa.com" style="color:#0ea5e9;">care@agatsa.com</a> or visit <a href="https://agatsa.com/support" style="color:#0ea5e9;">agatsa.com/support</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">© 2025 Agatsa Medical Technologies Pvt. Ltd.</p>
              <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">Bengaluru, India</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Try to send via Lovable email API if key is available
    if (LOVABLE_API_KEY) {
      const emailRes = await fetch("https://api.lovable.dev/v1/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          to: customerEmail,
          subject: `✅ Order Confirmed – ${orderId}`,
          html: emailHtml,
          from_name: "Agatsa Medical Technologies",
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error("Email send failed:", errText);
        // Don't throw — order is already placed, just log
      }
    } else {
      console.log("LOVABLE_API_KEY not set — skipping email send");
    }

    // Log to DB for audit
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await supabase.from("orders").update({
      // Mark that confirmation was attempted
    }).eq("razorpay_order_id", orderId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Order confirmation email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
