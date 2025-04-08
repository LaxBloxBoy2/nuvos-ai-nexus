
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/deals/Pipeline";
import Calculator from "./pages/valuation/Calculator";
import AiSummaries from "./pages/insights/AiSummaries";
import NotFound from "./pages/NotFound";

// Create a new QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Deal Management */}
              <Route path="/deals/pipeline" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Pipeline />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Valuation Routes */}
              <Route path="/valuation/calculator" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Calculator />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirect for incorrect valuation/development route to calculator */}
              <Route path="/valuation/development" element={
                <Navigate to="/valuation/calculator" replace />
              } />
              
              {/* Insights Routes */}
              <Route path="/insights/ai-summaries" element={
                <ProtectedRoute>
                  <AppLayout>
                    <AiSummaries />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
