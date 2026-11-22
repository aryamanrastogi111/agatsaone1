import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ShoppingCart, User, Stethoscope, Handshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import agatsaLogo from "@/assets/agatsa-logo.webp";
import { useCart } from "@/hooks/useCart";

interface NavChild {
  label: string;
  href: string;
  desc?: string;
}

interface NavGroup {
  label: string;
  href?: string;
  children?: NavChild[];
}

const navLinks: NavGroup[] = [
  {
    label: "Devices",
    children: [
      { label: "All Devices", href: "/devices", desc: "Compare the full range" },
      { label: "SanketLife 2.0", href: "/devices/sanketlife-ecg", desc: "Personal 12-lead ECG" },
      { label: "SanketLife Pro+", href: "/demo", desc: "Professional ECG · enquiry only" },
      { label: "EasyTouch Wellness", href: "/devices/easytouch-wellness", desc: "Metabolic wellness, no pricks" },
      { label: "Rhythm Band", href: "/rhythm", desc: "Everyday metabolic wearable" },
      { label: "Zlu", href: "/devices/zlu", desc: "Natural sleep support" },
      { label: "Bundles & Kits", href: "/complete-health-kit", desc: "Save with combinations" },
    ],
  },
  { label: "NERA AI", href: "/nera-ai" },
  {
    label: "Healthcare",
    children: [
      { label: "Doctors & Clinics", href: "/for-doctors", desc: "Remote patient monitoring" },
      { label: "Hospitals & Telehealth", href: "/for-hospitals", desc: "Deploy at scale" },
      { label: "Corporates", href: "/for-corporates", desc: "Workforce health programmes" },
      { label: "Clinical Evidence", href: "/publications", desc: "Studies and validation" },
    ],
  },
  {
    label: "Science",
    children: [
      { label: "Research & Publications", href: "/publications", desc: "Peer-reviewed studies" },
      { label: "Media & Recognition", href: "/media-recognition", desc: "Press and awards" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Partner with Us", href: "/partner-with-us", desc: "Distributors & OEM" },
      { label: "SDK & API", href: "/partners", desc: "Build with Agatsa devices" },
      { label: "Journal", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Support",
    children: [
      { label: "Help Center", href: "/support" },
      { label: "Device Activation", href: "/d/activate" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const audienceShortcuts = [
  { icon: User, label: "Myself", desc: "Devices for home", href: "/devices" },
  { icon: Stethoscope, label: "Healthcare", desc: "Clinics & hospitals", href: "/for-doctors" },
  { icon: Handshake, label: "Partnership", desc: "Distribute or build", href: "/partner-with-us" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const location = useLocation();
  const totalItems = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Hide on scroll down, return on scroll up (mobile strategy)
      setHidden(y > 140 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
    setMobileGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        hidden && !mobileOpen ? "-top-[90px]" : "top-0"
      } ${
        scrolled || mobileOpen
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="section-shell">
        <div className="flex items-center justify-between h-[60px] md:h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={agatsaLogo} alt="Agatsa Logo" className="h-7 w-auto" />
            <span className="text-xl font-display font-bold text-foreground">Agatsa One</span>
            <span className="text-xl text-primary font-bold">●</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(link.label)}
                  onMouseLeave={() => setDropdownOpen(null)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-card rounded-2xl border border-border shadow-lg p-2"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                          >
                            <span className="block text-sm font-medium text-foreground">{child.label}</span>
                            {child.desc && (
                              <span className="block text-xs text-muted-foreground mt-0.5">{child.desc}</span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href!}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/checkout"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              to="/devices"
              className="hidden lg:inline-flex bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Shop Devices
            </Link>
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

    </nav>

      {/* Mobile full-height sheet — sibling overlay, below the header bar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 pt-[60px] bg-background overflow-y-auto"
          >
            <div className="px-4 py-6 pb-24">
              {/* I'm here for… */}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground px-1 mb-3">
                I'm here for…
              </p>
              <div className="grid grid-cols-3 gap-2 mb-8">
                {audienceShortcuts.map((a) => (
                  <Link
                    key={a.label}
                    to={a.href}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center hover:border-primary/40 transition-colors"
                  >
                    <a.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{a.label}</span>
                    <span className="text-[11px] text-muted-foreground leading-tight">{a.desc}</span>
                  </Link>
                ))}
              </div>

              {/* Grouped links */}
              <div className="space-y-1">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="border-b border-border/60">
                      <button
                        className="w-full flex items-center justify-between px-1 py-3.5 text-base font-semibold text-foreground"
                        onClick={() => setMobileGroup(mobileGroup === link.label ? null : link.label)}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            mobileGroup === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileGroup === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-3 pl-1">
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  to={child.href}
                                  className="block px-3 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href!}
                      className="block px-1 py-3.5 text-base font-semibold text-foreground border-b border-border/60"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              <Link
                to="/devices"
                className="block mt-6 bg-foreground text-background rounded-full px-5 py-3.5 text-sm font-semibold text-center"
              >
                Shop Devices
              </Link>
              <Link
                to="/app"
                className="block mt-3 border border-border text-foreground rounded-full px-5 py-3.5 text-sm font-semibold text-center"
              >
                Download App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
