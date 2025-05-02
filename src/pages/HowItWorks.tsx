
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ArrowRight } from 'lucide-react';

const HowItWorks: React.FC = () => {
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
            Como funciona o JurisQuick
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-juris-text text-opacity-90">
            Conectamos você a advogados especializados em apenas três passos simples, sem burocracia e com atendimento personalizado.
          </p>
        </motion.div>
        
        {/* Processo em 3 passos */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-custom relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-juris-accent flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-medium mb-3 text-white mt-4">Responda algumas perguntas</h3>
              <p className="text-juris-text text-opacity-80">
                Através do nosso questionário rápido e intuitivo, identificamos qual é o seu problema jurídico específico.
              </p>
            </div>
            
            <div className="card-custom relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-juris-accent flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-medium mb-3 text-white mt-4">Geramos uma mensagem personalizada</h3>
              <p className="text-juris-text text-opacity-80">
                Com base nas suas respostas, criamos uma mensagem detalhada com o resumo do seu caso.
              </p>
            </div>
            
            <div className="card-custom relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-juris-accent flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-medium mb-3 text-white mt-4">Conecte-se com um especialista</h3>
              <p className="text-juris-text text-opacity-80">
                Encaminhamos sua mensagem diretamente para um advogado especializado na sua área de necessidade.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Benefícios */}
        <motion.div
          className="mb-16 card-custom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">
            Por que escolher o JurisQuick?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-juris-accent">
                <Check size={20} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Rapidez e Eficiência</h4>
                <p className="text-juris-text text-opacity-80">
                  Nosso processo é otimizado para poupar seu tempo. Em minutos você já estará em contato com um profissional qualificado.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-juris-accent">
                <Check size={20} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Especialização</h4>
                <p className="text-juris-text text-opacity-80">
                  Contamos com uma rede de advogados especialistas em diversas áreas do direito, garantindo o atendimento adequado ao seu caso.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-juris-accent">
                <Check size={20} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Sem Compromisso</h4>
                <p className="text-juris-text text-opacity-80">
                  O contato inicial é gratuito e sem compromisso. Você decide se quer prosseguir com o advogado após a primeira conversa.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* FAQ - Perguntas Frequentes */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white text-center">
            Perguntas Frequentes
          </h2>
          
          <Accordion type="single" collapsible className="card-custom">
            <AccordionItem value="item-1" className="border-white/10">
              <AccordionTrigger className="text-white hover:no-underline">
                Quanto custa utilizar o JurisQuick?
              </AccordionTrigger>
              <AccordionContent className="text-juris-text">
                O JurisQuick é gratuito para conectar você ao advogado. Os honorários advocatícios são negociados diretamente com o profissional após o contato inicial.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:no-underline">
                Como são selecionados os advogados?
              </AccordionTrigger>
              <AccordionContent className="text-juris-text">
                Todos os advogados em nossa plataforma passam por um rigoroso processo de verificação de credenciais, experiência e especialização. Garantimos que todos são registrados na OAB e possuem experiência comprovada em sua área de atuação.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-white/10">
              <AccordionTrigger className="text-white hover:no-underline">
                Em quanto tempo recebo retorno do advogado?
              </AccordionTrigger>
              <AccordionContent className="text-juris-text">
                Nossos parceiros jurídicos se comprometem a responder em até 24 horas úteis. Em casos urgentes, procuramos oferecer retorno em até 2 horas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-white/10">
              <AccordionTrigger className="text-white hover:no-underline">
                E se eu não gostar do advogado indicado?
              </AccordionTrigger>
              <AccordionContent className="text-juris-text">
                Você pode solicitar uma nova indicação a qualquer momento. Nossa prioridade é garantir que você se sinta confortável e confiante com o profissional escolhido.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        
        {/* CTA para começar */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-2xl font-medium mb-4 text-white">
            Pronto para começar?
          </h2>
          <p className="text-juris-text text-opacity-80 mb-8 max-w-2xl mx-auto">
            Responda ao nosso questionário e em poucos minutos você estará em contato com um advogado especializado no seu caso.
          </p>
          
          <a 
            href="/" 
            className="btn-primary inline-flex items-center"
          >
            Começar agora
            <ArrowRight size={18} className="ml-2" />
          </a>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
