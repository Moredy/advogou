
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import LawyerSidebar from "./LawyerSidebar";
import LawyerHeader from "./LawyerHeader";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

const LawyerLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, lawyer, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isLoading, setIsLoading] = useState(true);

  const isApproved = lawyer?.status === "approved";

  useEffect(() => {
    // Add a short delay to ensure authentication state is fully loaded
    const checkAuthTimer = setTimeout(() => {
      console.log("Auth check - Auth state:", { isAuthenticated, isAdmin, lawyer });
      
      if (!isAuthenticated && user === null) {
        console.log("User not authenticated, redirecting to login");
        toast({
          title: "Faça login",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "default"
        });
        navigate("/login");
      } else if (isAdmin) {
        // Redirect admins to the admin dashboard
        console.log("User is admin, redirecting to admin dashboard");
        toast({
          title: "Redirecionando",
          description: "Você está sendo redirecionado para o painel de administrador.",
          variant: "default"
        });
        navigate("/admin/dashboard");
      } else if (!isApproved && location.pathname === '/advogado/leads') {
        // Advogados não aprovados tentando acessar a página de leads
        console.log("User not approved, redirecting from leads page");
        toast({
          title: "Acesso restrito",
          description: "Você precisa ter sua conta aprovada para acessar os leads.",
          variant: "destructive"
        });
        navigate("/advogado/dashboard");
      }
      
      setIsLoading(false);
    }, 500); // Short delay to ensure auth state is loaded

    return () => clearTimeout(checkAuthTimer);
  }, [isAuthenticated, navigate, location.pathname, toast, isAdmin, lawyer, isApproved, user]);

  useEffect(() => {
    // Fechar sidebar automaticamente em dispositivos móveis
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-juris-accent mb-2" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LawyerHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block ${isMobile && sidebarOpen ? 'fixed z-50 h-[calc(100vh-64px)]' : 'sticky top-0 h-[calc(100vh-64px)]'}`}>
          <LawyerSidebar closeSidebar={() => isMobile && setSidebarOpen(false)} />
        </div>
        <main className={`flex-1 p-4 md:p-6 overflow-x-hidden transition-all duration-200 ${sidebarOpen && isMobile ? 'opacity-30' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;