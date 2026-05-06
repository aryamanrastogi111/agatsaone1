import { Header } from "./Header";
import { Footer } from "./Footer";
import { RepublicDayAnnouncementBar, FloatingCouponPill, TodayOnlyOfferBar, TodayOnlyOfferPopup } from "@/components/sale";
import { StickyCartBar } from "@/components/shop/StickyCartBar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TodayOnlyOfferBar />
      <RepublicDayAnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCartBar />
      <FloatingCouponPill />
      <TodayOnlyOfferPopup />
    </div>
  );
}
