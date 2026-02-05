import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Support from "./pages/Support";
import DeviceFinder from "./pages/DeviceFinder";
import Compare from "./pages/Compare";
import ZluProduct from "./pages/products/ZluProduct";
import CoreBalanceProduct from "./pages/products/CoreBalanceProduct";
import EasyTouchRhythmProduct from "./pages/products/EasyTouchRhythmProduct";
import SanketLifeProduct from "./pages/products/SanketLifeProduct";
import NotFound from "./pages/NotFound";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
 
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/zlu" element={<ZluProduct />} />
          <Route path="/products/corebalance" element={<CoreBalanceProduct />} />
          <Route path="/products/easytouch-rhythm" element={<EasyTouchRhythmProduct />} />
          <Route path="/products/sanketlife" element={<SanketLifeProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/device-finder" element={<DeviceFinder />} />
          <Route path="/device-finder/compare" element={<Compare />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
           {/* SDK Portal Routes */}
           <Route path="/sdk" element={<SDKLanding />} />
           <Route path="/sdk/auth" element={<SDKAuth />} />
           <Route path="/sdk/dashboard" element={<SDKDashboard />} />
           <Route path="/sdk/devices" element={<SDKDevices />} />
           <Route path="/sdk/downloads" element={<SDKDownloads />} />
           <Route path="/sdk/credits" element={<SDKCredits />} />
           <Route path="/sdk/docs" element={<SDKDocs />} />
           <Route path="/sdk/support" element={<SDKSupport />} />
           <Route path="/sdk/admin" element={<SDKAdmin />} />
          {/* Redirects for old routes */}
          <Route path="/solutions" element={<Navigate to="/support#solutions" replace />} />
          <Route path="/trust" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
