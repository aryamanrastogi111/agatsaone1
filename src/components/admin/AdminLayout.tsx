// src/components/admin/AdminLayout.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Truck, Star,
  LogOut, Menu, X, ChevronRight, Bell, Settings, BarChart2,
  Boxes, RefreshCw, RotateCcw, UserCheck, LifeBuoy, Activity,
  Puzzle, Shield, ChevronDown, ChevronUp, Mail, Zap, Radio, FileText, Heart,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNewOrderSound } from "@/hooks/useNewOrderSound";
import { Volume2, VolumeX } from "lucide-react";

type NavItem = { label: string; icon: any; href: string; badgeKey?: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Dashboard",       icon: LayoutDashboard, href: "/admin" },
      { label: "Orders",          icon: ShoppingCart,    href: "/admin/orders" },
      { label: "Shipping",        icon: Truck,           href: "/admin/shipping" },
      { label: "Delivery Slips",  icon: FileText,        href: "/admin/delivery-slips" },
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
      { label: "Leads",         icon: UserCheck,  href: "/admin/leads" },
      { label: "Heritage",      icon: Heart,      href: "/admin/heritage" },
      { label: "Tickets",       icon: LifeBuoy,   href: "/admin/tickets" },
      { label: "Partnerships",  icon: Handshake,  href: "/admin/partnerships", badgeKey: "partnerships" },
      { label: "Reviews",       icon: Star,       href: "/admin/reviews" },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Live Activity", icon: Radio,    href: "/admin/live" },
      { label: "Analytics",     icon: BarChart2, href: "/admin/analytics" },
      { label: "Activity Logs", icon: Activity,  href: "/admin/activity-logs" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Team & Access",   icon: Shield,  href: "/admin/team" },
      { label: "Email Previews",  icon: Mail,    href: "/admin/email-preview" },
      { label: "Pixels & Tracking", icon: Zap,  href: "/admin/pixels" },
      { label: "Settings",        icon: Settings, href: "/admin/settings" },
      { label: "Integrations",    icon: Puzzle,  href: "/admin/integrations" },
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
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("admin-order-sound") !== "off";
  });

  useNewOrderSound(adminChecked && soundOn);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      localStorage.setItem("admin-order-sound", next ? "on" : "off");
      return next;
    });
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin/login"); return; }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      if (!role) { navigate("/admin/login"); return; }
      setAdminChecked(true);
    })();
  }, [navigate]);

  // Poll new partnership enquiries for sidebar badge
  useEffect(() => {
    if (!adminChecked) return;
    let cancelled = false;
    const fetchBadges = async () => {
      const { count } = await supabase
        .from("partnership_enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      if (!cancelled) setBadges((b) => ({ ...b, partnerships: count || 0 }));
    };
    fetchBadges();
    const interval = setInterval(fetchBadges, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [adminChecked, location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const toggleGroup = (label: string) => {
    setCollapsed(c => ({ ...c, [label]: !c[label] }));
  };

  if (!adminChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentItem = ALL_ITEMS.find(n => isActive(n.href, location.pathname));

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shrink-0 shadow-sm",
        sidebarOpen ? "w-56" : "w-16"
      )}>
        {/* Logo / Toggle */}
        <div className="flex items-center h-14 px-3 border-b border-gray-200 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 mr-2 shrink-0 text-gray-500 hover:text-gray-800 transition-colors">
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          {sidebarOpen && (
            <span className="font-bold text-gray-900 text-sm tracking-tight truncate">Agatsa Admin</span>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV_GROUPS.map(group => {
            const isGroupOpen = !collapsed[group.label];

            return (
              <div key={group.label} className="mb-1">
                {sidebarOpen && (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                  >
                    <span>{group.label}</span>
                    {isGroupOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </button>
                )}
                {!sidebarOpen && <div className="h-px bg-gray-200 mx-2 my-1.5" />}
                {(isGroupOpen || !sidebarOpen) && (
                  <div className="space-y-0.5 px-2">
                    {group.items.map(item => {
                      const active = isActive(item.href, location.pathname);
                      const badgeCount = item.badgeKey ? badges[item.badgeKey] || 0 : 0;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          title={!sidebarOpen ? `${item.label}${badgeCount ? ` (${badgeCount})` : ""}` : undefined}
                          className={cn(
                            "relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors",
                            active
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <span className="relative shrink-0">
                            <item.icon size={16} />
                            {!sidebarOpen && badgeCount > 0 && (
                              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                            )}
                          </span>
                          {sidebarOpen && <span className="truncate">{item.label}</span>}
                          {sidebarOpen && badgeCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full bg-red-500 text-white">
                              {badgeCount > 99 ? "99+" : badgeCount}
                            </span>
                          )}
                          {sidebarOpen && active && badgeCount === 0 && <ChevronRight size={12} className="ml-auto shrink-0 text-blue-500" />}
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
        <div className="p-2 border-t border-gray-200 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
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
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <h1 className="text-sm font-semibold text-gray-700">
            {currentItem?.label ?? "Admin Panel"}
          </h1>
          <div className="flex items-center gap-3">
            {/* Order sound slider toggle */}
            <div className="flex items-center gap-2 pr-1">
              {soundOn ? (
                <Volume2 size={14} className="text-blue-600" />
              ) : (
                <VolumeX size={14} className="text-gray-400" />
              )}
              <button
                role="switch"
                aria-checked={soundOn}
                onClick={toggleSound}
                title={soundOn ? "Order sound: ON" : "Order sound: OFF"}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  soundOn ? "bg-blue-600" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                    soundOn ? "translate-x-4" : "translate-x-0.5"
                  )}
                />
              </button>
              <span className="text-xs text-gray-500 hidden sm:inline">Sound</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
              <Bell size={16} />
            </button>
            <Link to="/" target="_blank" className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium">
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
