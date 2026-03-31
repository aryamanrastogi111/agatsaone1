import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildDeliverySlipPdf } from "../_shared/delivery-slip-pdf.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const body = await req.json();

    const pdfBytes = await buildDeliverySlipPdf({
      orderId:         body.orderId         ?? "DRAFT",
      orderDate:       body.orderDate       ?? new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      paymentMethod:   body.paymentMethod,
      customerName:    body.customerName    ?? "",
      customerPhone:   body.customerPhone,
      shippingAddress: body.shippingAddress ?? "",
      shippingCity:    body.shippingCity    ?? "",
      shippingState:   body.shippingState   ?? "",
      shippingPincode: body.shippingPincode ?? "",
      items:           body.items           ?? [],
      total:           body.total           ?? 0,
      weight:          body.weight,
    });

    return new Response(pdfBytes, {
      headers: {
        ...cors,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="delivery-slip-${body.orderId ?? "draft"}.pdf"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (err) {
    console.error("generate-delivery-slip error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
