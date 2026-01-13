import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
