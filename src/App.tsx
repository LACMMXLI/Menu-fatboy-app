import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import PromotionsPage from "./pages/Promotions";
import FeedbackSelectPage from "./pages/FeedbackSelect";
import FeedbackPage from "./pages/Feedback";
import { Layout } from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminReviews from "./pages/admin/AdminReviews";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import OrderManagement from "./pages/admin/OrderManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Feedback Routes */}
          <Route path="/feedback" element={<FeedbackSelectPage />} />
          <Route path="/feedback/:branch" element={<FeedbackPage />} />

          {/* Client Routes */}
          <Route element={<Layout />}>
            <Route path="/menu" element={<Index />} />
            <Route path="/promotions" element={<PromotionsPage />} /> {/* Nueva ruta */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminCategories />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="pedidos/:branchName" element={<OrderManagement />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;