
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import LawyerSidebar from "./LawyerSidebar";
import LawyerHeader from "./LawyerHeader";
import { useToast } from "@/hooks/use-toast";

const LawyerLayout: React.FC = () => {
  const { isAuthenticated, user, lawyer } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Lista de emails administrativos
  const adminEmails = ['admin@jurisquick.com'];
  const isAdmin = adminEmails.includes(user?.email || '');
  const isApproved = lawyer?.status === "approved";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
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
  }, [isAuthenticated, navigate, location.pathname, user, toast, isAdmin, lawyer, isApproved]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LawyerHeader />
      <div className="flex">
        <LawyerSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;
