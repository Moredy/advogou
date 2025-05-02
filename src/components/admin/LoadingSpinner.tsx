
import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juris-accent mx-auto mb-4"></div>
        <p className="text-juris-text">Carregando...</p>
      </div>
    </div>
  );
};
