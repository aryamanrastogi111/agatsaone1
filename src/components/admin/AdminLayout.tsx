// src/components/admin/AdminLayout.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Truck, Star, LogOut, Menu, X, ChevronRight, BarChart2,
  Bell, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",  icon: LayoutDashboard, href: "/admin" },
  { label: "Products",   icon: Package,         href: "/admin/products" },
  { label: "Orders",     icon: ShoppingCart,    href: "/admin/orders" },
  { label: "Customers",  icon: Users,           href: "/admin/customers" },
  { label: "Coupons",    icon: Tag,             href: "/admin/coupons" },
  { label: "Shipping",   icon: Truck,           href: "/admin/shipping" },
  { label: "Reviews",    icon: Star,            href: "/admin/reviews" },
  { label: "Analytics",  icon: BarChart2,       href: "/admin/analytics" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/sdk/auth"); return; }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      if (!role) { navigate("/"); return; }
      setAdminChecked(true);
    })();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/sdk/auth");
  };

  if (!adminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300",
        sidebarOpen ? "w-56" : "w-16"
      )}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-800 mr-2">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          {sidebarOpen && <span className="font-bold text-white text-lg tracking-tight">Agatsa Admin</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-800 space-y-1">
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <Settings size={18} />
            {sidebarOpen && <span>Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-900/40 hover:text-red-400"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-sm text-gray-400">
            {NAV_ITEMS.find((n) =>
              n.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(n.href)
            )?.label ?? "Admin"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
              <Bell size={18} />
            </button>
            <Link to="/" target="_blank" className="text-xs text-blue-400 hover:text-blue-300">
              View Store →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
