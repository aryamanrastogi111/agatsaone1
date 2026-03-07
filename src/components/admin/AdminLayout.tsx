// src/components/admin/AdminLayout.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Truck, Star,
  LogOut, Menu, X, ChevronRight, Bell, Settings, BarChart2,
  Boxes, RefreshCw, RotateCcw, UserCheck, LifeBuoy, Activity,
  Puzzle, Shield, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: any;
  href: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Dashboard",  icon: LayoutDashboard, href: "/admin" },
      { label: "Orders",     icon: ShoppingCart,    href: "/admin/orders" },
      { label: "Shipping",   icon: Truck,           href: "/admin/shipping" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products",   icon: Package, href: "/admin/products" },
      { label: "Inventory",  icon: Boxes,   href: "/admin/inventory" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Customers",      icon: Users,      href: "/admin/customers" },
      { label: "Subscriptions",  icon: RefreshCw,  href: "/admin/subscriptions" },
      { label: "Coupons",        icon: Tag,        href: "/admin/coupons" },
      { label: "Returns",        icon: RotateCcw,  href: "/admin/returns" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Leads",    icon: UserCheck, href: "/admin/leads" },
      { label: "Tickets",  icon: LifeBuoy,  href: "/admin/tickets" },
      { label: "Reviews",  icon: Star,      href: "/admin/reviews" },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Analytics",     icon: BarChart2, href: "/admin/analytics" },
      { label: "Activity Logs", icon: Activity,  href: "/admin/activity-logs" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Team & Access",  icon: Shield,  href: "/admin/team" },
      { label: "Settings",       icon: Settings, href: "/admin/settings" },
      { label: "Integrations",   icon: Puzzle,  href: "/admin/integrations" },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap(g => g.items);

function isActive(href: string, pathname: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminChecked, setAdminChecked] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

  const toggleGroup = (label: string) => {
    setCollapsed(c => ({ ...c, [label]: !c[label] }));
  };

  if (!adminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentItem = ALL_ITEMS.find(n => isActive(n.href, location.pathname));

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 shrink-0",
        sidebarOpen ? "w-56" : "w-16"
      )}>
        {/* Logo / Toggle */}
        <div className="flex items-center h-14 px-3 border-b border-gray-800 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-800 mr-2 shrink-0 text-gray-400 hover:text-white transition-colors">
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          {sidebarOpen && (
            <span className="font-bold text-white text-sm tracking-tight truncate">Agatsa Admin</span>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_GROUPS.map(group => {
            const isGroupOpen = !collapsed[group.label];
            const hasActive = group.items.some(i => isActive(i.href, location.pathname));

            return (
              <div key={group.label} className="mb-1">
                {sidebarOpen && (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors"
                  >
                    <span>{group.label}</span>
                    {isGroupOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </button>
                )}
                {!sidebarOpen && <div className="h-px bg-gray-800 mx-2 my-1.5" />}
                {(isGroupOpen || !sidebarOpen) && (
                  <div className="space-y-0.5 px-2">
                    {group.items.map(item => {
                      const active = isActive(item.href, location.pathname);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          title={!sidebarOpen ? item.label : undefined}
                          className={cn(
                            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors",
                            active
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          )}
                        >
                          <item.icon size={16} className="shrink-0" />
                          {sidebarOpen && <span className="truncate">{item.label}</span>}
                          {sidebarOpen && active && <ChevronRight size={12} className="ml-auto shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={16} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-sm font-medium text-gray-300">
            {currentItem?.label ?? "Admin Panel"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <Bell size={16} />
            </button>
            <Link to="/" target="_blank" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View Store →
            </Link>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
