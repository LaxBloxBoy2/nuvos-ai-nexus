
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/deals/Pipeline";
import Calculator from "./pages/valuation/Calculator";
import AiSummaries from "./pages/insights/AiSummaries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - In a real app, these would be protected with authentication */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          
          {/* Deal Management */}
          <Route path="/deals/pipeline" element={<AppLayout><Pipeline /></AppLayout>} />
          
          {/* Valuation Routes */}
          <Route path="/valuation/calculator" element={<AppLayout><Calculator /></AppLayout>} />
          
          {/* Insights Routes */}
          <Route path="/insights/ai-summaries" element={<AppLayout><AiSummaries /></AppLayout>} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
