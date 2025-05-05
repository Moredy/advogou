
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col min-h-screen bg-juris-dark">
      <Header />
      <div className="container-custom flex-1 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg text-black">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalLayout;