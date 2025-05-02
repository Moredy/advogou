
import React from "react";
import { Bell } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LawyerHeader: React.FC = () => {
  const { lawyer } = useAdminAuth();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-2 font-semibold">
        Área do Advogado
      </div>
      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{lawyer?.name ? getInitials(lawyer.name) : "JQ"}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">{lawyer?.name || "Advogado"}</p>
            <p className="text-xs text-gray-500">{lawyer?.email || "Carregando..."}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LawyerHeader;
