
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useToast } from "@/hooks/use-toast";

const AdminLayout: React.FC = () => {
  const { isAuthenticated, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else if (location.pathname === '/admin/aprovacoes') {
      // Check if user is admin to access approvals page
      if (user?.email !== 'admin@jurisquick.com') {
        // Notificar o usuário e redirecionar
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar essa página.",
          variant: "destructive"
        });
        navigate("/admin/dashboard");
      }
    }
  }, [isAuthenticated, navigate, location.pathname, user, toast]);

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
