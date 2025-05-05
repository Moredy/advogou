
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/como-funciona" element={<HowItWorks />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/termos-de-uso" element={<TermsOfUse />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/sobre" element={<About />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="aprovacoes" element={<AdminApprovals />} />
              </Route>
              
              {/* Lawyer routes */}
              <Route path="/advogado" element={<LawyerLayout />}>
                <Route path="dashboard" element={<LawyerDashboard />} />
                <Route path="planos" element={<LawyerPlans />} />
                <Route path="perfil" element={<LawyerProfile />} />
                <Route path="leads" element={<LawyerLeads />} />
              </Route>

              {/* Redirect /advogado to /advogado/dashboard */}
              <Route path="/advogado" element={<Navigate replace to="/advogado/dashboard" />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
