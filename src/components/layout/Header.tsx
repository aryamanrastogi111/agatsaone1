import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Scale, Activity, Home, Heart, ShoppingCart, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import agatsaLogo from "@/assets/agatsa-logo.png";
import { CartDrawer } from "@/components/shop/CartDrawer";

const navItems = [
  { label: "Products", href: "/products" },
  { label: "For Doctors", href: "/doctors" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
   // { label: "SDK Integration", href: "/sdk" }, // Hidden for now
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <img src={agatsaLogo} alt="Agatsa" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-xl text-foreground">Agatsa</span>
          </motion.div>
        </Link>

        {/* Product Quick Links - First */}
        <div className="hidden md:flex items-center gap-1">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5">
              <Link to="/">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
            </Button>
          </motion.div>
          <div className="w-px h-4 bg-border" />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 gap-1.5">
              <Link to="/products/zlu">
                <Moon className="h-3.5 w-3.5" />
                Zlu
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1.5">
              <Link to="/products/corebalance">
                <Scale className="h-3.5 w-3.5" />
                CoreBalance
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1.5">
              <Link to="/products/easytouch-rhythm">
                <Activity className="h-3.5 w-3.5" />
                Rhythm
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1.5">
              <Link to="/products/sanketlife">
                <Heart className="h-3.5 w-3.5" />
                SanketLife
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Desktop Navigation - Second */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors relative py-1 link-underline whitespace-nowrap",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.label}
            </Link>
          ))}
          <CartDrawer />
        </nav>


        {/* Mobile Menu Button + Cart */}
        <div className="md:hidden flex items-center gap-2">
          <CartDrawer />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-foreground" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {/* Home Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0 }}
              >
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg transition-colors",
                    location.pathname === "/"
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </motion.div>
              
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block text-sm font-medium py-3 px-4 rounded-lg transition-colors",
                      location.pathname === item.href
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {/* Product Quick Links in Mobile */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground px-4 pt-2">Quick Access</p>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Link
                    to="/products/zlu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg text-cyan-600 hover:bg-cyan-50 transition-colors"
                  >
                    <Moon className="h-4 w-4" />
                    Zlu – Sleep Aid
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/products/corebalance"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Scale className="h-4 w-4" />
                    CoreBalance BMI
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Link
                    to="/products/easytouch-rhythm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Activity className="h-4 w-4" />
                    EasyTouch Rhythm
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/products/sanketlife"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    SanketLife ECG
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                </motion.div>
              </div>
                {/* SDK Integration link hidden for now
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="pt-2 border-t border-border mt-2"
                >
                  <Link
                    to="/sdk"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    <Code2 className="h-4 w-4" />
                    SDK Integration
                  </Link>
                </motion.div>
                */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <Button asChild className="w-full">
                  <Link to="/device-finder" onClick={() => setMobileMenuOpen(false)}>
                    Find Your Device
                  </Link>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
