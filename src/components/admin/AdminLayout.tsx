
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a short delay to ensure authentication state is fully loaded
    const checkAuthTimer = setTimeout(() => {
      console.log("Admin auth check - Auth state:", { isAuthenticated, isAdmin, user });
      
      if (!isAuthenticated && user === null) {
        console.log("User not authenticated, redirecting to login");
        toast({
          title: "Faça login",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "default"
        });
        navigate("/login");
        return;
      }

      if (!isAdmin) {
        // Notificar o usuário e redirecionar para o dashboard de advogados
        console.log("User is not admin, redirecting to lawyer dashboard");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive"
        });
        navigate("/advogado/dashboard");
      }
      
      setIsLoading(false);
    }, 500); // Short delay to ensure auth state is loaded

    return () => clearTimeout(checkAuthTimer);
  }, [isAuthenticated, navigate, isAdmin, toast, user]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block ${isMobile && sidebarOpen ? 'fixed z-50 h-[calc(100vh-64px)]' : 'sticky top-0 h-[calc(100vh-64px)]'}`}>
          <AdminSidebar closeSidebar={() => isMobile && setSidebarOpen(false)} />
        </div>
        <main className={`flex-1 p-4 md:p-6 overflow-x-hidden transition-all duration-200 ${sidebarOpen && isMobile ? 'opacity-30' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;