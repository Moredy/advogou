
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CreditCard, User, MessageSquare, LogOut, Shield } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

const LawyerSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAdminAuth();

  // Verificar se o usuário é um administrador
  const isAdmin = user?.email === 'admin@jurisquick.com';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Lista base de itens do menu
  const baseMenuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Planos", path: "/admin/planos", icon: <CreditCard size={20} /> },
    { name: "Meu Perfil", path: "/admin/perfil", icon: <User size={20} /> },
    { name: "Leads Recebidos", path: "/admin/leads", icon: <MessageSquare size={20} /> },
  ];
  
  // Adicionar item de validação de advogados apenas se for admin
  const menuItems = isAdmin 
    ? [...baseMenuItems, { name: "Validar Advogados", path: "/admin/aprovacoes", icon: <Shield size={20} /> }]
    : baseMenuItems;

  return (
    <div className="w-64 min-h-screen bg-juris-dark text-white">
      <div className="p-4">
        <Link to="/" className="flex items-center mb-6">
          <span className="font-poppins font-bold text-xl tracking-tight">
            Juris<span className="text-juris-accent">Quick</span>
          </span>
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                isActive(item.path)
                  ? "bg-juris-accent text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default LawyerSidebar;
