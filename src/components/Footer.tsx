
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 mt-12 border-t border-white border-opacity-10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-juris-text text-opacity-70 text-sm">
              © {year} Advogou. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/termos-de-uso" className="text-juris-text text-opacity-70 hover:text-opacity-100 text-sm">
              Termos de Uso
            </Link>
            <Link to="/politica-de-privacidade" className="text-juris-text text-opacity-70 hover:text-opacity-100 text-sm">
              Política de Privacidade
            </Link>
            <Link to="/sobre" className="text-juris-text text-opacity-70 hover:text-opacity-100 text-sm">
              Sobre
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
