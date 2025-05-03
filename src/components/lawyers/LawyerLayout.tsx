
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import LawyerSidebar from "./LawyerSidebar";
import LawyerHeader from "./LawyerHeader";
import { useToast } from "@/hooks/use-toast";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const LawyerLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, lawyer } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const isApproved = lawyer?.status === "approved";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (isAdmin) {
      // Redirect admins to the admin dashboard
      toast({
        title: "Redirecionando",
        description: "Você está sendo redirecionado para o painel de administrador.",
        variant: "default"
      });
      navigate("/admin/dashboard");
    } else {
      // Verificações para advogados não-admin
      if (!isApproved && location.pathname === '/advogado/leads') {
        // Advogados não aprovados tentando acessar a página de leads
        toast({
          title: "Acesso restrito",
          description: "Você precisa ter sua conta aprovada para acessar os leads.",
          variant: "destructive"
        });
        navigate("/advogado/dashboard");
      }
    }
  }, [isAuthenticated, navigate, location.pathname, toast, isAdmin, lawyer, isApproved]);

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
    <div className="min-h-screen bg-gray-50">
      <LawyerHeader toggleSidebar={toggleSidebar} />
      <div className="flex relative">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block ${isMobile && sidebarOpen ? 'absolute z-50 h-[calc(100vh-64px)]' : ''}`}>
          <LawyerSidebar closeSidebar={() => isMobile && setSidebarOpen(false)} />
        </div>
        <main className={`flex-1 p-4 md:p-6 transition-all duration-200 ${sidebarOpen && isMobile ? 'opacity-30' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;
