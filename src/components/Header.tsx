
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Reset menu state when location changes
  useEffect(() => {
    // Make sure menu is closed when changing pages
    setIsOpen(false);
    
    // Ensure body scroll is enabled when navigating
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }, [location]);

  // Effect to manage body scroll when sheet state changes
  useEffect(() => {
    if (!isOpen) {
      // Ensure body scroll is re-enabled when sheet closes
      setTimeout(() => {
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');
      }, 300);
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="py-6 w-full">
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-poppins font-bold text-2xl text-white tracking-tight">
              <img src="src/assets/logo-transparent-svg.svg" alt="Advogou Logo" className="h-[70px]" />
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {/* Navigation links - desktop */}
            <nav className="hidden md:flex space-x-6 mr-4">
              <Link to="/" className="text-juris-text hover:text-white transition-colors">
                Início
              </Link>
              <Link to="/como-funciona" className="text-juris-text hover:text-white transition-colors">
                Como Funciona
              </Link>
              <Link to="/contato" className="text-juris-text hover:text-white transition-colors">
                Contato
              </Link>
            </nav>
            
            {/* Lawyer login button - visible only on desktop */}
            <div className="hidden md:block">
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-juris-text hover:text-white hover:bg-transparent border border-white/20"
                >
                  Sou Advogado
                </Button>
              </Link>
            </div>
            
            {/* Mobile menu using Sheet instead of Dialog */}
            <div className="block md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-transparent border-none">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-juris-dark border-none p-0 w-[275px]">
                  <SheetHeader className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-white">Menu</SheetTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-transparent" 
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </SheetHeader>
                  <div className="flex flex-col space-y-1 p-6">
                    <Link 
                      to="/" 
                      onClick={handleLinkClick}
                      className="text-juris-text hover:text-white transition-colors px-4 py-3 rounded-md hover:bg-white/5"
                    >
                      Início
                    </Link>
                    <Link 
                      to="/como-funciona" 
                      onClick={handleLinkClick}
                      className="text-juris-text hover:text-white transition-colors px-4 py-3 rounded-md hover:bg-white/5"
                    >
                      Como Funciona
                    </Link>
                    <Link 
                      to="/contato" 
                      onClick={handleLinkClick}
                      className="text-juris-text hover:text-white transition-colors px-4 py-3 rounded-md hover:bg-white/5"
                    >
                      Contato
                    </Link>
                    <Link 
                      to="/login" 
                      onClick={handleLinkClick}
                      className="text-juris-text hover:text-white transition-colors px-4 py-3 rounded-md hover:bg-white/5"
                    >
                      Sou Advogado
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;