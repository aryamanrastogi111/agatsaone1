import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildInvoicePdf } from "../_shared/invoice-pdf.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json();
    const isAdmin = body.isAdmin === true;

    const pdfBytes = await buildInvoicePdf({
      orderId:         body.orderId         ?? "DRAFT",
      paymentId:       body.paymentId,
      orderDate:       body.orderDate       ?? new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      customerName:    body.customerName    ?? "",
      customerEmail:   body.customerEmail   ?? "",
      customerPhone:   body.customerPhone,
      shippingAddress: body.shippingAddress ?? "",
      shippingCity:    body.shippingCity    ?? "",
      shippingState:   body.shippingState   ?? "",
      shippingPincode: body.shippingPincode ?? "",
      items:           body.items           ?? [],
      subtotal:        body.subtotal        ?? 0,
      discountAmount:  body.discountAmount,
      couponCode:      body.couponCode,
      total:           body.total           ?? 0,
      isAdmin,
    });

    const filename = isAdmin
      ? `operations-invoice-${body.orderId ?? "draft"}.pdf`
      : `invoice-${body.orderId ?? "draft"}.pdf`;

    return new Response(pdfBytes, {
      headers: {
        ...cors,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error("generate-invoice error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
