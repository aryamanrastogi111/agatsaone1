// Untyped Supabase client for tables not yet in the generated schema
// (e.g. shop tables: products, orders, coupons, etc.)
import { supabase } from "./client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;
