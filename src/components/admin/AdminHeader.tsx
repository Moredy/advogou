
import React from "react";
import { Bell } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminHeader: React.FC = () => {
  const { lawyer } = useAdminAuth();

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-medium">Painel do Advogado</h1>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-juris-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              3
            </span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-juris-accent text-white flex items-center justify-center font-medium">
              {lawyer?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-medium">{lawyer?.name || "Advogado"}</p>
              <p className="text-xs text-gray-500">{lawyer?.specialty || "Área não definida"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
