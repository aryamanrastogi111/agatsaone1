import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Solutions from "./pages/Solutions";
import Trust from "./pages/Trust";
import About from "./pages/About";
import Support from "./pages/Support";
import DeviceFinder from "./pages/DeviceFinder";
import Compare from "./pages/Compare";
import ZluProduct from "./pages/products/ZluProduct";
import CoreBalanceProduct from "./pages/products/CoreBalanceProduct";
import EasyTouchRhythmProduct from "./pages/products/EasyTouchRhythmProduct";
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
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/device-finder" element={<DeviceFinder />} />
          <Route path="/device-finder/compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
