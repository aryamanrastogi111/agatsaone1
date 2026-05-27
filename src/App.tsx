import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useDevicePricingFetch, PricingProvider } from "@/hooks/useDevicePricing";
import { isMyEasyTouchHost } from "@/hooks/useIsMyEasyTouch";

// Only the home page is eagerly loaded for instant first paint
import Home from "./pages/Home";

// All other pages are lazy-loaded
const DevicesPage = lazy(() => import("./pages/Devices"));
const ProgrammesPage = lazy(() => import("./pages/Programmes"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const ForDoctors = lazy(() => import("./pages/ForDoctors"));
const ForHospitals = lazy(() => import("./pages/ForHospitals"));
const ForCorporates = lazy(() => import("./pages/ForCorporates"));
const AppDownload = lazy(() => import("./pages/AppDownload"));
const SanketLifeECGProduct = lazy(() => import("./pages/products/SanketLifeECGProduct"));
const EasyTouchWellnessProduct = lazy(() => import("./pages/products/EasyTouchWellnessProduct"));
const RhythmBandProduct = lazy(() => import("./pages/products/RhythmBandProduct"));
const SmartScaleProduct = lazy(() => import("./pages/products/SmartScaleProduct"));
const DeviceActivation = lazy(() => import("./pages/DeviceActivation"));
const ReferralPage = lazy(() => import("./pages/Referral"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const DataDeletion = lazy(() => import("./pages/DataDeletion"));
const Support = lazy(() => import("./pages/Support"));
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const Press = lazy(() => import("./pages/Press"));
const Partner = lazy(() => import("./pages/Partner"));
const PartnerWithUs = lazy(() => import("./pages/PartnerWithUs"));
const Demo = lazy(() => import("./pages/Demo"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const Heritage = lazy(() => import("./pages/Heritage"));
const LoseBelly = lazy(() => import("./pages/LoseBelly"));
const LoseBellyFeatures = lazy(() => import("./pages/LoseBellyFeatures"));
const LoseBellyWelcome = lazy(() => import("./pages/LoseBellyWelcome"));
const HeartGuard = lazy(() => import("./pages/HeartGuard"));
const WakeUpLike25 = lazy(() => import("./pages/WakeUpLike25"));
const NotFound = lazy(() => import("./pages/NotFound"));

// SDK Portal
const SDKLanding = lazy(() => import("./pages/sdk/SDKLanding"));
const SDKAuth = lazy(() => import("./pages/sdk/SDKAuth"));
const SDKDashboard = lazy(() => import("./pages/sdk/SDKDashboard"));
const SDKDevices = lazy(() => import("./pages/sdk/SDKDevices"));
const SDKDownloads = lazy(() => import("./pages/sdk/SDKDownloads"));
const SDKCredits = lazy(() => import("./pages/sdk/SDKCredits"));
const SDKDocs = lazy(() => import("./pages/sdk/SDKDocs"));
const SDKSupport = lazy(() => import("./pages/sdk/SDKSupport"));
const SDKAdmin = lazy(() => import("./pages/sdk/SDKAdmin"));

// Admin Panel
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProductsList = lazy(() => import("./pages/admin/products/ProductsList"));
const ProductForm = lazy(() => import("./pages/admin/products/ProductForm"));
const OrdersList = lazy(() => import("./pages/admin/orders/OrdersList"));
const OrderDetail = lazy(() => import("./pages/admin/orders/OrderDetail"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminInventory = lazy(() => import("./pages/admin/Inventory"));
const AdminSubscriptions = lazy(() => import("./pages/admin/Subscriptions"));
const AdminShipping = lazy(() => import("./pages/admin/Shipping"));
const AdminDeliverySlips = lazy(() => import("./pages/admin/DeliverySlips"));
const AdminReturns = lazy(() => import("./pages/admin/Returns"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminHeritage = lazy(() => import("./pages/admin/Heritage"));
const AdminTickets = lazy(() => import("./pages/admin/Tickets"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminTeam = lazy(() => import("./pages/admin/Team"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminIntegrations = lazy(() => import("./pages/admin/Integrations"));
const AdminActivityLogs = lazy(() => import("./pages/admin/ActivityLogs"));
const AdminLiveActivity = lazy(() => import("./pages/admin/LiveActivity"));
const AdminEmailPreview = lazy(() => import("./pages/admin/EmailPreview"));
const AdminPixels = lazy(() => import("./pages/admin/Pixels"));

const queryClient = new QueryClient();

function VisitorTracker() {
  useVisitorTracking();
  return null;
}

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppWithPricing() {
  const pricing = useDevicePricingFetch();
  return (
    <PricingProvider value={pricing}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <VisitorTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public marketing pages */}
              <Route path="/" element={<Home />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/devices/sanketlife-ecg" element={<SanketLifeECGProduct />} />
              <Route path="/devices/easytouch-wellness" element={<EasyTouchWellnessProduct />} />
              <Route path="/devices/rhythm-band" element={<RhythmBandProduct />} />
              <Route path="/devices/smart-scale" element={<SmartScaleProduct />} />
              <Route path="/programmes" element={<ProgrammesPage />} />
              <Route path="/pricing" element={isMyEasyTouchHost() ? <Navigate to="/" replace /> : <PricingPage />} />
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
              <Route path="/partner-with-us" element={<PartnerWithUs />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/d/:code" element={<DeviceActivation />} />
              <Route path="/r/:code" element={<ReferralPage />} />
              <Route path="/heritage" element={<Heritage />} />
              <Route path="/lose-belly" element={<LoseBelly />} />
              <Route path="/lose-belly/features" element={<LoseBellyFeatures />} />
              <Route path="/lose-belly-90" element={<Navigate to="/lose-belly" replace />} />
              <Route path="/loseyourbelly" element={<Navigate to="/lose-belly" replace />} />
              <Route path="/lose-belly/welcome" element={<LoseBellyWelcome />} />
              <Route path="/heartguard" element={<HeartGuard />} />
              <Route path="/wake-up-like-25" element={<WakeUpLike25 />} />

              {/* Redirects */}
              <Route path="/download" element={<Navigate to="/app" replace />} />
              <Route path="/ecg" element={<Navigate to="/devices/sanketlife-ecg" replace />} />
              <Route path="/band" element={<Navigate to="/devices/rhythm-band" replace />} />
              <Route path="/pages/easytouch-plus-your-health-in-a-single-touch" element={<Navigate to="/devices/easytouch-wellness" replace />} />

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
                <Route path="heritage" element={<AdminHeritage />} />
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </PricingProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppWithPricing />
  </QueryClientProvider>
);

export default App;
