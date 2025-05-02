
import { Toaster } from "@/components/ui/toaster";
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
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Convert App to a proper React functional component
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
              <Route path="/admin" element={<AdminLogin />} />
              
              {/* Rotas de Administrador usando AdminLayout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="aprovacoes" element={<AdminApprovals />} />
              </Route>
              
              {/* Rotas de Advogado usando LawyerLayout */}
              <Route path="/admin" element={<LawyerLayout />}>
                <Route path="planos" element={<LawyerPlans />} />
                <Route path="perfil" element={<LawyerProfile />} />
                <Route path="leads" element={<LawyerLeads />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
