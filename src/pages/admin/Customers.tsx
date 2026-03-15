// src/pages/admin/Customers.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Users, Mail, Phone, ShoppingCart, TrendingUp } from "lucide-react";

interface Customer {
  email: string;
  name: string;
  phone: string;
  order_count: number;
  total_spent: number;
  last_order: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      // Pull all paid orders and aggregate by customer_email
      const { data: orders } = await supabase
        .from("orders")
        .select("customer_email, customer_name, customer_phone, amount, status, created_at")
        .order("created_at", { ascending: false });

      if (!orders) { setLoading(false); return; }

      const map: Record<string, Customer> = {};
      for (const o of orders) {
        const email = o.customer_email ?? "unknown";
        if (!map[email]) {
          map[email] = {
            email,
            name: o.customer_name ?? "—",
            phone: o.customer_phone ?? "—",
            order_count: 0,
            total_spent: 0,
            last_order: o.created_at,
          };
        }
        map[email].order_count += 1;
        if (o.status === "paid") map[email].total_spent += o.amount ?? 0;
        if (o.created_at > map[email].last_order) map[email].last_order = o.created_at;
      }

      setCustomers(Object.values(map).sort((a, b) => b.total_spent - a.total_spent));
      setLoading(false);
    })();
  }, []);

  const filtered = customers.filter(
    c => !search ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-500">All customers who have placed orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <Users size={22} className="text-blue-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Total Customers</p><p className="text-2xl font-bold text-gray-900">{customers.length}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <ShoppingCart size={22} className="text-purple-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-900">{customers.reduce((s, c) => s + c.order_count, 0)}</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <TrendingUp size={22} className="text-green-500 shrink-0" />
          <div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString("en-IN")}</p></div>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 bg-gray-50 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Phone</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Orders</th>
                <th className="text-left px-5 py-3 font-medium">Total Spent</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                        {(c.name !== "—" ? c.name : c.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name !== "—" ? c.name : "—"}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={11} />{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-gray-500 text-xs">
                    <span className="flex items-center gap-1"><Phone size={11} />{c.phone}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell font-semibold text-gray-700">{c.order_count}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">
                    {c.total_spent > 0 ? `₹${c.total_spent.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-gray-400 text-xs">
                    {new Date(c.last_order).toLocaleDateString("en-IN")}
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
