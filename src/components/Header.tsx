
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="py-6 w-full">
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-poppins font-bold text-2xl text-white tracking-tight">
              Juris<span className="text-juris-accent">Quick</span>
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
            
            {/* Mobile menu */}
            <div className="block md:hidden">
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-transparent border-none">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-juris-dark">
                  <DrawerHeader>
                    <DrawerTitle className="text-white">Menu</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col space-y-4 px-4 py-4">
                    <Link 
                      to="/" 
                      onClick={() => setIsOpen(false)}
                      className="text-juris-text hover:text-white transition-colors px-2 py-2"
                    >
                      Início
                    </Link>
                    <Link 
                      to="/como-funciona" 
                      onClick={() => setIsOpen(false)}
                      className="text-juris-text hover:text-white transition-colors px-2 py-2"
                    >
                      Como Funciona
                    </Link>
                    <Link 
                      to="/contato" 
                      onClick={() => setIsOpen(false)}
                      className="text-juris-text hover:text-white transition-colors px-2 py-2"
                    >
                      Contato
                    </Link>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full text-juris-text hover:text-white hover:bg-transparent border border-white/20"
                      >
                        Fechar
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            
            {/* Lawyer login button */}
            <Link to="/login">
              <Button 
                variant="ghost" 
                className="text-juris-text hover:text-white hover:bg-transparent border border-white/20"
              >
                Sou Advogado
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
