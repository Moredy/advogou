
import React from "react";
import { Bell, Menu } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LawyerHeaderProps {
  toggleSidebar: () => void;
}

const LawyerHeader: React.FC<LawyerHeaderProps> = ({ toggleSidebar }) => {
  const { lawyer } = useAdminAuth();
  const isMobile = useIsMobile();
  
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
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        )}
        <span className="font-semibold">Área do Advogado</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
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
