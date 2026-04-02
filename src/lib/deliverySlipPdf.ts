import { supabase } from "@/integrations/supabase/client";

export interface DeliverySlipItem {
  productName: string;
  variantTitle?: string;
  quantity: number;
  price: number;
}

export interface DeliverySlipData {
  orderId: string;
  orderDate: string;
  paymentMethod?: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: DeliverySlipItem[];
  total: number;
  weight?: string;
}

async function fetchDeliverySlipPdf(data: DeliverySlipData): Promise<Uint8Array> {
  const { data: bytes, error } = await supabase.functions.invoke("generate-delivery-slip", {
    body: data,
  });

  if (error) throw new Error(error.message ?? "Delivery slip generation failed");

  const ab: ArrayBuffer = bytes instanceof ArrayBuffer ? bytes : await (bytes as Blob).arrayBuffer();
  return new Uint8Array(ab);
}

function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob(
    [bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer],
    { type: "application/pdf" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function generateDeliverySlipPdf(data: DeliverySlipData): Promise<Uint8Array> {
  return fetchDeliverySlipPdf(data);
}

export async function downloadDeliverySlip(data: DeliverySlipData, filename?: string): Promise<void> {
  const bytes = await fetchDeliverySlipPdf(data);
  triggerDownload(bytes, filename ?? `delivery-slip-${data.orderId}.pdf`);
}
