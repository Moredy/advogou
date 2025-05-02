
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useToast } from "@/hooks/use-toast";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
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
