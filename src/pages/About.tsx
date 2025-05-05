

import React from "react";
import LegalLayout from "@/components/LegalLayout";

const About: React.FC = () => {
  return (
    <LegalLayout title="Sobre a Advogou">
      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mb-4 text-black">Nossa Missão</h2>
        <p className="mb-6">
          A Advogou nasceu com o propósito de democratizar o acesso à justiça, conectando pessoas com necessidades jurídicas 
          a advogados especializados de forma simples, rápida e eficiente.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">Quem Somos</h2>
        <p className="mb-6">
          Somos uma plataforma brasileira fundada por profissionais com experiência nos setores jurídico e tecnológico. 
          Nossa equipe é composta por desenvolvedores, designers, especialistas em experiência do usuário e profissionais do direito,
          todos comprometidos em criar uma ponte entre advogados qualificados e cidadãos que necessitam de orientação jurídica.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">Como Funcionamos</h2>
        <p className="mb-6">
          Nossa plataforma utiliza tecnologia avançada para entender as necessidades jurídicas dos usuários e conectá-los aos advogados 
          mais adequados para seus casos. Os usuários respondem a algumas perguntas simples sobre sua situação, e nossa plataforma 
          identifica e conecta esses usuários a advogados especializados na área relevante.
        </p>
        <p className="mb-6">
          Para os advogados, oferecemos uma forma eficiente de adquirir novos clientes, permitindo que se concentrem no que fazem de melhor: 
          praticar o direito e ajudar as pessoas.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">Nossos Valores</h2>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>Acessibilidade:</strong> Acreditamos que todos merecem acesso a serviços jurídicos de qualidade.</li>
          <li><strong>Transparência:</strong> Mantemos comunicações claras e honestas com todos os nossos usuários.</li>
          <li><strong>Qualidade:</strong> Priorizamos a qualidade dos serviços e das conexões que facilitamos.</li>
          <li><strong>Inovação:</strong> Estamos constantemente buscando maneiras de melhorar nossa plataforma e os serviços que oferecemos.</li>
          <li><strong>Confiança:</strong> Construímos relações baseadas na confiança e no respeito mútuo.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">Nossa Visão</h2>
        <p className="mb-6">
          Vislumbramos um futuro onde qualquer pessoa, independentemente de sua localização ou condição socioeconômica, 
          possa acessar facilmente orientação jurídica qualificada quando necessário. Queremos ser reconhecidos como 
          a principal plataforma de conexão entre advogados e clientes no Brasil, revolucionando a forma como os serviços 
          jurídicos são acessados e prestados.
        </p>

        <p className="mt-8 text-gray-600">
          Se você tem dúvidas ou sugestões, não hesite em entrar em contato conosco através da nossa página de contato.
        </p>
      </div>
    </LegalLayout>
  );
};

export default About;