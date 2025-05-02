
import { Toaster } from "@/components/ui/toaster";
// Remove the Sonner import as it might be causing conflicts
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import LawyerDashboard from "./pages/lawyers/LawyerDashboard";
import LawyerPlans from "./pages/lawyers/LawyerPlans";
import LawyerProfile from "./pages/lawyers/LawyerProfile";
import LawyerLeads from "./pages/lawyers/LawyerLeads";
import AdminApprovals from "./pages/admin/AdminApprovals";
import LawyerLayout from "./components/lawyers/LawyerLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/como-funciona" element={<HowItWorks />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<LawyerLayout />}>
              <Route path="dashboard" element={<LawyerDashboard />} />
              <Route path="planos" element={<LawyerPlans />} />
              <Route path="perfil" element={<LawyerProfile />} />
              <Route path="leads" element={<LawyerLeads />} />
              <Route path="aprovacoes" element={<AdminApprovals />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
