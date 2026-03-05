// src/pages/admin/Customers.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/supabase/db";
import { Search, Users } from "lucide-react";

interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  company_name: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      // Fetch profiles joined with order aggregates
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!profiles) { setLoading(false); return; }

      // For each user, get order count + total spent
      const enriched = await Promise.all(
        profiles.map(async (p) => {
          const { data: orders } = await db
            .from("orders")
            .select("total")
            .eq("user_id", p.id)
            .eq("payment_status", "paid");

          return {
            id: p.id,
            email: p.email ?? "",
            full_name: p.full_name ?? "",
            phone: p.phone ?? "",
            company_name: p.company_name ?? "",
            created_at: p.created_at,
            order_count: orders?.length ?? 0,
            total_spent: orders?.reduce((s: number, o: any) => s + (o.total ?? 0), 0) ?? 0,
          };
        })
      );

      setCustomers(enriched);
      setLoading(false);
    })();
  }, []);

  const filtered = customers.filter((c) =>
    !search ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Customers</h2>
          <p className="text-sm text-gray-400">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-400">No customers found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Orders</th>
                <th className="text-left px-5 py-3 font-medium">Total Spent</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-white">{c.full_name || "—"}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-gray-400 text-xs">{c.phone || "—"}</td>
                  <td className="px-5 py-3 hidden md:table-cell text-white">{c.order_count}</td>
                  <td className="px-5 py-3 font-semibold text-white">
                    {c.total_spent > 0 ? `₹${c.total_spent.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
