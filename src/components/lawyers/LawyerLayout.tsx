
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import LawyerSidebar from "./LawyerSidebar";
import LawyerHeader from "./LawyerHeader";
import { useToast } from "@/hooks/use-toast";

const LawyerLayout: React.FC = () => {
  const { isAuthenticated, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Lista de emails administrativos
  const adminEmails = ['admin@jurisquick.com'];
  const isAdmin = adminEmails.includes(user?.email || '');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      // Redirecionar admins tentando acessar páginas que não deveriam
      if (isAdmin) {
        const forbiddenPaths = ['/admin/planos', '/admin/perfil', '/admin/leads'];
        if (forbiddenPaths.some(path => location.pathname.startsWith(path))) {
          toast({
            title: "Acesso restrito",
            description: "Esta página não está disponível para administradores.",
            variant: "destructive"
          });
          navigate("/admin/dashboard");
        }
      } else if (location.pathname === '/admin/aprovacoes') {
        // Não-admins tentando acessar página de aprovações
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar essa página.",
          variant: "destructive"
        });
        navigate("/admin/dashboard");
      }
    }
  }, [isAuthenticated, navigate, location.pathname, user, toast, isAdmin]);

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
