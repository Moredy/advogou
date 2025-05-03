
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!isAdmin) {
      // Notificar o usuário e redirecionar para o dashboard de advogados
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive"
      });
      navigate("/advogado/dashboard");
    }
  }, [isAuthenticated, navigate, isAdmin, toast]);

  useEffect(() => {
    // Fechar sidebar automaticamente em dispositivos móveis
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
