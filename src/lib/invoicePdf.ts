// Invoice PDF — generated server-side via the generate-invoice edge function.
// This guarantees identical output for both email attachments and admin downloads.

import { supabase } from "@/integrations/supabase/client";

export interface InvoiceItem {
  productName: string;
  variantTitle?: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderId: string;
  paymentId?: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  total: number;
}

async function fetchInvoicePdf(data: InvoiceData, isAdmin: boolean): Promise<Uint8Array> {
  const { data: bytes, error } = await supabase.functions.invoke("generate-invoice", {
    body: { ...data, isAdmin },
  });
  if (error) throw new Error(error.message ?? "Invoice generation failed");
  // supabase.functions.invoke returns ArrayBuffer for binary responses
  const ab: ArrayBuffer = bytes instanceof ArrayBuffer ? bytes : await (bytes as Blob).arrayBuffer();
  return new Uint8Array(ab);
}

function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function generateCustomerInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  return fetchInvoicePdf(data, false);
}

export async function downloadCustomerInvoice(data: InvoiceData): Promise<void> {
  const bytes = await fetchInvoicePdf(data, false);
  triggerDownload(bytes, `invoice-${data.orderId}.pdf`);
}

export async function downloadAdminInvoice(data: InvoiceData): Promise<void> {
  const bytes = await fetchInvoicePdf(data, true);
  triggerDownload(bytes, `operations-invoice-${data.orderId}.pdf`);
}
