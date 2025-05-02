
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ArrowRight, Scale, Briefcase, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
            Conectamos pessoas com necessidades jurídicas a advogados especializados de forma rápida, eficiente e sem burocracia.
          </p>
        </motion.div>
        
        {/* Para clientes */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white text-center">
            Para quem busca um advogado
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-custom relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-juris-accent flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-medium mb-3 text-white mt-4">Descreva sua necessidade</h3>
              <p className="text-juris-text text-opacity-80">
                Através do nosso questionário rápido e intuitivo, você nos conta qual é seu problema jurídico de forma simples e objetiva.
              </p>
            </div>
            
            <div className="card-custom relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-juris-accent flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-medium mb-3 text-white mt-4">Receba propostas personalizadas</h3>
              <p className="text-juris-text text-opacity-80">
                Advogados qualificados e verificados analisam seu caso e enviam propostas de atendimento com valores transparentes.
              </p>
            </div>
            
            <div className="card-custom relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-juris-accent flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-medium mb-3 text-white mt-4">Escolha o melhor profissional</h3>
              <p className="text-juris-text text-opacity-80">
                Compare as propostas, avalie o perfil dos advogados e escolha o que melhor atende às suas necessidades.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/">
              <Button className="bg-juris-accent hover:bg-juris-accent/90 text-white inline-flex items-center">
                Buscar um advogado agora
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Para advogados */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white text-center">
            Para advogados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-custom">
              <div className="p-3 mb-4 rounded-full bg-juris-accent/20 w-12 h-12 flex items-center justify-center">
                <Briefcase size={24} className="text-juris-accent" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Novos clientes qualificados</h3>
              <p className="text-juris-text text-opacity-80">
                Receba leads de clientes com demandas específicas na sua área de especialização, sem perder tempo com consultas irrelevantes.
              </p>
            </div>
            
            <div className="card-custom">
              <div className="p-3 mb-4 rounded-full bg-juris-accent/20 w-12 h-12 flex items-center justify-center">
                <Clock size={24} className="text-juris-accent" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Gestão eficiente de tempo</h3>
              <p className="text-juris-text text-opacity-80">
                Economize tempo com nossa plataforma que faz a triagem inicial e envia casos já qualificados para sua análise e proposta.
              </p>
            </div>
            
            <div className="card-custom">
              <div className="p-3 mb-4 rounded-full bg-juris-accent/20 w-12 h-12 flex items-center justify-center">
                <Scale size={24} className="text-juris-accent" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Expanda sua prática</h3>
              <p className="text-juris-text text-opacity-80">
                Aumente sua visibilidade e expanda sua carteira de clientes com uma presença digital profissional e eficaz.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/admin">
              <Button className="bg-white hover:bg-gray-100 text-juris-dark inline-flex items-center">
                Sou advogado
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
        
        {/* Benefícios */}
        <motion.div
          className="mb-16 card-custom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">
            A plataforma jurídica do futuro
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-juris-accent">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Advogados verificados</h4>
                <p className="text-juris-text text-opacity-80">
                  Todos os advogados em nossa plataforma passam por um rigoroso processo de verificação, garantindo que você terá acesso apenas a profissionais qualificados e registrados na OAB.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-juris-accent">
                <Check size={24} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Transparência total</h4>
                <p className="text-juris-text text-opacity-80">
                  Receba propostas claras com valores transparentes. Sem surpresas ou taxas ocultas. Você sabe exatamente quanto custará seu atendimento jurídico.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="mt-1 mr-4 text-juris-accent">
                <Check size={24} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Atendimento personalizado</h4>
                <p className="text-juris-text text-opacity-80">
                  Cada caso é único. Por isso, conectamos você a advogados especializados exatamente na área em que você precisa, garantindo um atendimento personalizado e eficiente.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* FAQ - Perguntas Frequentes */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
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
                O JurisQuick é gratuito para quem busca um advogado. Os honorários advocatícios são definidos diretamente pelos profissionais em suas propostas, com total transparência.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-white/10">
              <AccordionTrigger className="text-white hover:no-underline">
                Como são selecionados os advogados?
              </AccordionTrigger>
              <AccordionContent className="text-juris-text">
                Todos os advogados passam por verificação de registro na OAB e análise de credenciais. Mantemos um padrão de qualidade com avaliações constantes e monitoramento de satisfação dos clientes.
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
                E se eu não gostar das propostas recebidas?
              </AccordionTrigger>
              <AccordionContent className="text-juris-text">
                Você não tem nenhuma obrigação de aceitar as propostas. Se preferir, pode solicitar novas propostas ou refinar sua busca para encontrar o advogado ideal para seu caso.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        
        {/* CTA para começar */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-2xl font-medium mb-4 text-white">
            Pronto para começar?
          </h2>
          <p className="text-juris-text text-opacity-80 mb-8 max-w-2xl mx-auto">
            Resolva sua questão jurídica com o apoio de um profissional qualificado e especializado no seu caso.
          </p>
          
          <Link to="/" className="btn-primary inline-flex items-center">
            Encontrar um advogado
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
