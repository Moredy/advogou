
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Shield, LogOut } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  closeSidebar?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Menu items for admins
  const adminMenuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Validar Advogados", path: "/admin/aprovacoes", icon: <Shield size={20} /> },
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
          <span className="font-poppins font-bold text-xl tracking-tight">
            Juris<span className="text-juris-accent">Quick</span>
          </span>
        </Link>

        <nav className="space-y-1">
          {adminMenuItems.map((item) => (
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

export default AdminSidebar;
