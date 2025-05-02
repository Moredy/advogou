
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
        </div>
      </div>
    </header>
  );
};

export default Header;
