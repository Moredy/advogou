
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CreditCard, User, MessageSquare, LogOut } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";
import logo from '@/assets/logo-transparent-svg.svg';
interface LawyerSidebarProps {
  closeSidebar?: () => void;
}

const LawyerSidebar: React.FC<LawyerSidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const { logout, user } = useAdminAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Menu items for regular lawyers (dashboard, plans, profile, leads)
  const lawyerMenuItems = [
    { name: "Dashboard", path: "/advogado/dashboard", icon: <Home size={20} /> },
    { name: "Planos", path: "/advogado/planos", icon: <CreditCard size={20} /> },
    { name: "Meu Perfil", path: "/advogado/perfil", icon: <User size={20} /> },
    { name: "Leads Recebidos", path: "/advogado/leads", icon: <MessageSquare size={20} /> },
  ];

  const handleNavigation = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    if (closeSidebar) {
      closeSidebar();
    }
    logout();
  };

  return (
    <div className="w-64 h-full bg-juris-dark text-white">
      <div className="p-4">
        <Link to="/" className="flex items-center mb-6" onClick={handleNavigation}>

            <img src={logo} alt="Advogou Logo" className="h-[70px]" />

        </Link>

        <nav className="space-y-1">
          {lawyerMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavigation}
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
            onClick={handleLogout}
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
