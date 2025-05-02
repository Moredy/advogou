
import React from 'react';
import { Link } from 'react-router-dom';

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
          
          {/* Add navigation links if needed */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-juris-text hover:text-white transition-colors">
              Início
            </Link>
            <Link to="/como-funciona" className="text-juris-text hover:text-white transition-colors">
              Como Funciona
            </Link>
            <Link to="/" className="text-juris-text hover:text-white transition-colors">
              Contato
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
