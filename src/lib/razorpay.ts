import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  productId: string;
  productName: string;
  variantTitle: string;
  price: number; // in INR
  quantity: number;
  imageUrl?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    backdropclose?: boolean;
    escape?: boolean;
  };
}

interface RazorpayInstance {
  open: () => void;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Dynamically load the Razorpay script
export async function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createRazorpayOrder(
  items: CartItem[],
  customerName?: string,
  customerEmail?: string,
  customerPhone?: string,
  shippingAddress?: string,
  shippingCity?: string,
  shippingState?: string,
  shippingPincode?: string
): Promise<RazorpayOrderResponse> {
  const amountInPaise = Math.round(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
  );

  const { data, error } = await supabase.functions.invoke("razorpay-create-order", {
    body: {
      items,
      customerName,
      customerEmail,
      customerPhone,
      amountInPaise,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
    },
  });

  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);

  return data as RazorpayOrderResponse;
}

export async function verifyRazorpayPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  customerEmail?: string
): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("razorpay-verify-payment", {
    body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerEmail },
  });

  if (error) throw new Error(error.message);
  return data?.success === true;
}

export function openRazorpayCheckout(
  orderData: RazorpayOrderResponse,
  items: CartItem[],
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onDismiss?: () => void
) {
  const itemNames = items.map((i) => `${i.productName} x${i.quantity}`).join(", ");

  const options: RazorpayOptions = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Agatsa Medical Technologies",
    description: itemNames,
    order_id: orderData.orderId,
    handler: onSuccess,
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    theme: { color: "#0ea5e9" },
    modal: {
      ondismiss: onDismiss,
      backdropclose: false,
      escape: false,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
