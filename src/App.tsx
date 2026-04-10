import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useDevicePricingFetch, PricingProvider } from "@/hooks/useDevicePricing";

// New Agatsa One pages
import Home from "./pages/Home";
import DevicesPage from "./pages/Devices";
import ProgrammesPage from "./pages/Programmes";
import PricingPage from "./pages/Pricing";
import About from "./pages/About";
import ForDoctors from "./pages/ForDoctors";
import ForHospitals from "./pages/ForHospitals";
import ForCorporates from "./pages/ForCorporates";
import AppDownload from "./pages/AppDownload";
import SanketLifeECGProduct from "./pages/products/SanketLifeECGProduct";
import EasyTouchWellnessProduct from "./pages/products/EasyTouchWellnessProduct";
import RhythmBandProduct from "./pages/products/RhythmBandProduct";
import SmartScaleProduct from "./pages/products/SmartScaleProduct";
import DeviceActivation from "./pages/DeviceActivation";
import ReferralPage from "./pages/Referral";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import DataDeletion from "./pages/DataDeletion";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Partner from "./pages/Partner";
import Demo from "./pages/Demo";
import CookiePolicy from "./pages/CookiePolicy";
import CheckoutPage from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// SDK Portal Pages
import SDKLanding from "./pages/sdk/SDKLanding";
import SDKAuth from "./pages/sdk/SDKAuth";
import SDKDashboard from "./pages/sdk/SDKDashboard";
import SDKDevices from "./pages/sdk/SDKDevices";
import SDKDownloads from "./pages/sdk/SDKDownloads";
import SDKCredits from "./pages/sdk/SDKCredits";
import SDKDocs from "./pages/sdk/SDKDocs";
import SDKSupport from "./pages/sdk/SDKSupport";
import SDKAdmin from "./pages/sdk/SDKAdmin";

// Admin Panel
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsList from "./pages/admin/products/ProductsList";
import ProductForm from "./pages/admin/products/ProductForm";
import OrdersList from "./pages/admin/orders/OrdersList";
import OrderDetail from "./pages/admin/orders/OrderDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminCustomers from "./pages/admin/Customers";
import AdminCoupons from "./pages/admin/Coupons";
import AdminReviews from "./pages/admin/Reviews";
import AdminInventory from "./pages/admin/Inventory";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import AdminShipping from "./pages/admin/Shipping";
import AdminDeliverySlips from "./pages/admin/DeliverySlips";
import AdminReturns from "./pages/admin/Returns";
import AdminLeads from "./pages/admin/Leads";
import AdminTickets from "./pages/admin/Tickets";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminTeam from "./pages/admin/Team";
import AdminSettings from "./pages/admin/Settings";
import AdminIntegrations from "./pages/admin/Integrations";
import AdminActivityLogs from "./pages/admin/ActivityLogs";
import AdminLiveActivity from "./pages/admin/LiveActivity";
import AdminEmailPreview from "./pages/admin/EmailPreview";
import AdminPixels from "./pages/admin/Pixels";

const queryClient = new QueryClient();

function VisitorTracker() {
  useVisitorTracking();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <VisitorTracker />
        <Routes>
          {/* Public marketing pages */}
          <Route path="/" element={<Home />} />
<Route path="/devices" element={<DevicesPage />} />
          <Route path="/devices/sanketlife-ecg" element={<SanketLifeECGProduct />} />
          <Route path="/devices/easytouch-wellness" element={<EasyTouchWellnessProduct />} />
          <Route path="/devices/rhythm-band" element={<RhythmBandProduct />} />
          <Route path="/devices/smart-scale" element={<SmartScaleProduct />} />
          <Route path="/programmes" element={<ProgrammesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/for-doctors" element={<ForDoctors />} />
          <Route path="/for-hospitals" element={<ForHospitals />} />
          <Route path="/for-corporates" element={<ForCorporates />} />
          <Route path="/app" element={<AppDownload />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          <Route path="/d/:code" element={<DeviceActivation />} />
          <Route path="/r/:code" element={<ReferralPage />} />

          {/* Redirects */}
          <Route path="/download" element={<Navigate to="/app" replace />} />
          <Route path="/ecg" element={<Navigate to="/devices/sanketlife-ecg" replace />} />
          <Route path="/band" element={<Navigate to="/devices/rhythm-band" replace />} />

          {/* SDK Portal */}
          <Route path="/sdk" element={<SDKLanding />} />
          <Route path="/sdk/auth" element={<SDKAuth />} />
          <Route path="/sdk/dashboard" element={<SDKDashboard />} />
          <Route path="/sdk/devices" element={<SDKDevices />} />
          <Route path="/sdk/downloads" element={<SDKDownloads />} />
          <Route path="/sdk/credits" element={<SDKCredits />} />
          <Route path="/sdk/docs" element={<SDKDocs />} />
          <Route path="/sdk/support" element={<SDKSupport />} />
          <Route path="/sdk/admin" element={<SDKAdmin />} />

          {/* Admin Panel */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="subscriptions" element={<AdminSubscriptions />} />
            <Route path="shipping" element={<AdminShipping />} />
            <Route path="delivery-slips" element={<AdminDeliverySlips />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="integrations" element={<AdminIntegrations />} />
            <Route path="activity-logs" element={<AdminActivityLogs />} />
            <Route path="live" element={<AdminLiveActivity />} />
            <Route path="email-preview" element={<AdminEmailPreview />} />
            <Route path="pixels" element={<AdminPixels />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
