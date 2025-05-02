
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CreditCard, User, MessageSquare, LogOut } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Planos", path: "/admin/planos", icon: <CreditCard size={20} /> },
    { name: "Meu Perfil", path: "/admin/perfil", icon: <User size={20} /> },
    { name: "Leads Recebidos", path: "/admin/leads", icon: <MessageSquare size={20} /> },
  ];

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

export default AdminSidebar;
