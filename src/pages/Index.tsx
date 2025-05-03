
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OnboardingForm from '@/components/OnboardingForm';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-juris-dark to-black">
      <Header />
      
      <main className="flex-grow container-custom py-8 md:py-16">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-white">
            Conectamos você ao advogado ideal
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-juris-text text-opacity-90">
            Você precisa de ajuda com uma questão jurídica? Responda algumas perguntas rápidas e vamos registrar sua solicitação para um advogado especializado, com uma mensagem personalizada pronta para ser enviada.
          </p>
        </motion.div>
        
        <div className="relative">
          <div 
            className="absolute inset-0 bg-juris-accent rounded-full filter blur-[100px] opacity-30"
            aria-hidden="true"
          />
          <OnboardingForm />
        </div>
        
        <motion.div 
          className="mt-16 md:mt-24 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">
            Por que usar o JurisQuick?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-custom">
              <h3 className="text-xl font-medium mb-3 text-white">Valores Tabelados</h3>
              <p className="text-juris-text text-opacity-80">
                Todos os honorários seguem a tabela da OAB, garantindo que nenhum advogado cobrará valores abusivos.
              </p>
            </div>
            
            <div className="card-custom">
              <h3 className="text-xl font-medium mb-3 text-white">Especialistas Qualificados</h3>
              <p className="text-juris-text text-opacity-80">
                Conectamos você apenas com advogados especializados em sua área de necessidade.
              </p>
            </div>
            
            <div className="card-custom">
              <h3 className="text-xl font-medium mb-3 text-white">Atendimento Humanizado</h3>
              <p className="text-juris-text text-opacity-80">
                Toda comunicação é direta e personalizada para o seu caso específico.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
