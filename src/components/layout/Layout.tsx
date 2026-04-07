import { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RepublicDayAnnouncementBar, FloatingCouponPill } from "@/components/sale";
import { FloatingCartButton } from "@/components/shop/FloatingCartButton";
import { CartDrawer } from "@/components/shop/CartDrawer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <RepublicDayAnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCouponPill />
      <FloatingCartButton onClick={() => setCartOpen(true)} />
      <CartDrawer externalOpen={cartOpen} onExternalClose={() => setCartOpen(false)} hideTrigger />
    </div>
  );
}
