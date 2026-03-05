// ============================================================
// AGATSA SHOP API
// Drop-in replacement for Shopify — uses Supabase directly
// Add this file to your repo at: src/lib/shop.ts
// ============================================================

import { supabase } from "@/integrations/supabase/client";

// ─── Types ───────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  status: string;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  inventory_quantity: number;
  inventory_policy: "deny" | "continue";
  option1_name: string | null;
  option1_value: string | null;
  option2_name: string | null;
  option2_value: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  position: number;
}

export interface CartItem {
  variant_id: string;
  quantity: number;
  product_name: string;
  variant_name: string;
  price: number;
  image_url?: string;
  sku?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  phone?: string;
}

export interface CheckoutPayload {
  items: CartItem[];
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  coupon_code?: string;
  shipping_rate_id?: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
  fulfillments: Fulfillment[];
}

export interface OrderItem {
  id: string;
  product_name: string;
  variant_name: string | null;
  sku: string | null;
  price: number;
  quantity: number;
  total: number;
  image_url: string | null;
}

export interface Fulfillment {
  id: string;
  status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  created_at: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
}

// ─── Products ────────────────────────────────────────────────

export async function getProducts(options?: {
  collection?: string;
  limit?: number;
  offset?: number;
}) {
  const db = supabase as any;
  let query = db
    .from("products")
    .select(`*, product_variants(*), product_images(*)`)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit ?? 20) - 1);

  if (options?.collection) {
    const { data: collection } = await db
      .from("collections")
      .select("id")
      .eq("slug", options.collection)
      .single();
    if (collection) {
      const { data: productIds } = await db
        .from("collection_products")
        .select("product_id")
        .eq("collection_id", collection.id);
      if (productIds) {
        query = query.in("id", productIds.map((p: any) => p.product_id));
      }
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`*, product_variants(*), product_images(*)`)
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error) return null;
  return data as Product;
}

// ─── Shipping Rates ──────────────────────────────────────────

export async function getShippingRates(orderSubtotal: number): Promise<ShippingRate[]> {
  const { data, error } = await supabase
    .from("shipping_rates")
    .select("*")
    .or(`max_order_amount.is.null,max_order_amount.gte.${orderSubtotal}`)
    .order("price", { ascending: true });
  if (error) throw error;

  // Filter free shipping threshold
  return (data ?? []).filter((rate: any) =>
    !rate.min_order_amount || orderSubtotal >= rate.min_order_amount
  );
}

// ─── Coupon Validation ───────────────────────────────────────

export async function validateCoupon(code: string, subtotal: number) {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !data) return { valid: false, error: "Invalid coupon code" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, error: "Coupon has expired" };
  if (data.usage_limit && data.used_count >= data.usage_limit) return { valid: false, error: "Coupon usage limit reached" };
  if (data.minimum_order_amount && subtotal < data.minimum_order_amount) {
    return { valid: false, error: `Minimum order ₹${data.minimum_order_amount} required` };
  }

  let discount = 0;
  if (data.type === "percentage") {
    discount = (subtotal * data.value) / 100;
    if (data.maximum_discount_amount) discount = Math.min(discount, data.maximum_discount_amount);
  } else if (data.type === "fixed_amount") {
    discount = Math.min(data.value, subtotal);
  }

  return { valid: true, discount, coupon: data };
}

// ─── Checkout ────────────────────────────────────────────────

export async function createCheckout(payload: CheckoutPayload) {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await supabase.functions.invoke("create-razorpay-order", {
    body: payload,
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {},
  });

  if (response.error) throw new Error(response.error.message);
  return response.data as {
    order_id: string;
    order_number: string;
    razorpay_order_id: string;
    razorpay_key_id: string;
    amount: number;
    currency: string;
  };
}

export async function verifyPayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}) {
  const response = await supabase.functions.invoke("verify-razorpay-payment", {
    body: params,
  });
  if (response.error) throw new Error(response.error.message);
  return response.data as { success: boolean; order_number: string; order_id: string };
}

// ─── Open Razorpay Checkout ───────────────────────────────────

export function openRazorpayCheckout(options: {
  razorpay_key_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  order_id: string;
  order_number: string;
  customer: { name: string; email: string; phone?: string };
  onSuccess: (result: { success: boolean; order_number: string; order_id: string }) => void;
  onFailure: (error: string) => void;
}) {
  const rzp = new (window as any).Razorpay({
    key: options.razorpay_key_id,
    amount: options.amount,
    currency: options.currency,
    name: "Agatsa",
    description: `Order ${options.order_number}`,
    order_id: options.razorpay_order_id,
    prefill: {
      name: options.customer.name,
      email: options.customer.email,
      contact: options.customer.phone ?? "",
    },
    theme: { color: "#1a1a2e" },
    handler: async (response: any) => {
      try {
        const result = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order_id: options.order_id,
        });
        options.onSuccess(result);
      } catch (err: any) {
        options.onFailure(err.message);
      }
    },
    modal: {
      ondismiss: () => options.onFailure("Payment cancelled"),
    },
  });
  rzp.open();
}

// ─── Orders ──────────────────────────────────────────────────

export async function getMyOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), fulfillments(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), fulfillments(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Order;
}

// ─── Reviews ─────────────────────────────────────────────────

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitReview(review: {
  product_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  body?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be logged in to submit a review");

  const { data, error } = await supabase.from("reviews").insert({
    ...review,
    user_id: user.id,
    status: "pending",
  }).select().single();

  if (error) throw error;
  return data;
}

// ─── Addresses ───────────────────────────────────────────────

export async function getMyAddresses() {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveAddress(address: Omit<ShippingAddress, "phone"> & {
  phone?: string; is_default?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Must be logged in");

  if (address.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { data, error } = await supabase.from("addresses").insert({
    ...address,
    user_id: user.id,
  }).select().single();

  if (error) throw error;
  return data;
}
