import { useState } from "react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingCartButton } from "@/components/shop/FloatingCartButton";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { StickyCartBar } from "@/components/shop/StickyCartBar";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1 pt-[60px] md:pt-[68px]">{children}</main>
      <SiteFooter />
      <StickyCartBar />
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <CartDrawer externalOpen={cartOpen} onExternalClose={() => setCartOpen(false)} hideTrigger />
    </div>
  );
}
