
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useToast } from "@/hooks/use-toast";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, user } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Lista de emails administrativos
  const adminEmails = ['admin@jurisquick.com'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }

    // Verificar se o usuário é um administrador
    const isAdmin = adminEmails.includes(user?.email || '');
    
    if (!isAdmin) {
      // Notificar o usuário e redirecionar para o dashboard de advogados
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar o painel administrativo.",
        variant: "destructive"
      });
      navigate("/advogado/dashboard");
    }
  }, [isAuthenticated, navigate, user, toast]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
