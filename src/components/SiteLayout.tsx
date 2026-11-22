import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyCartBar } from "@/components/shop/StickyCartBar";
import { TodayOnlyOfferBar, TodayOnlyOfferPopup } from "@/components/sale";

interface SiteLayoutProps {
  children: React.ReactNode;
  theme?: "default" | "luxe";
}

export function SiteLayout({ children, theme = "default" }: SiteLayoutProps) {
  return (
    <div className={`flex min-h-screen flex-col ${theme === "luxe" ? "luxe-theme" : ""}`}>
      <TodayOnlyOfferBar />
      <Nav />
      <main className="flex-1 pt-[60px] md:pt-[68px]">{children}</main>
      <SiteFooter />
      <StickyCartBar />
      <TodayOnlyOfferPopup />
    </div>
  );
}
