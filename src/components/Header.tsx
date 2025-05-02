
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
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
            {/* Navigation links */}
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
            
            {/* Lawyer login button - updated to be more subtle */}
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
