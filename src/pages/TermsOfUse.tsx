
import React from "react";
import LegalLayout from "@/components/LegalLayout";

const TermsOfUse: React.FC = () => {
  return (
    <LegalLayout title="Termos de Uso">
      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mb-4 text-black">1. Aceitação dos Termos</h2>
        <p className="mb-4">
          Ao acessar e utilizar a plataforma Advogou, você concorda com estes Termos de Uso na íntegra. 
          Se você não concordar com qualquer parte destes termos, solicitamos que não utilize nossos serviços.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">2. Descrição dos Serviços</h2>
        <p className="mb-4">
          A Advogou é uma plataforma que conecta pessoas com necessidades jurídicas a advogados qualificados. 
          Nossa plataforma serve como intermediária, facilitando o contato inicial entre clientes potenciais e profissionais jurídicos.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">3. Cadastro e Conta</h2>
        <p className="mb-4">
          Para utilizar certos recursos da plataforma, advogados precisam criar uma conta. 
          Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas com sua conta.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">4. Responsabilidades do Usuário</h2>
        <p className="mb-4">
          Os usuários concordam em fornecer informações precisas e completas ao utilizar nossa plataforma. 
          A Advogou não se responsabiliza pela veracidade das informações fornecidas pelos usuários ou advogados.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">5. Responsabilidades dos Advogados</h2>
        <p className="mb-4">
          Os advogados que se cadastram na plataforma são responsáveis por manter suas informações atualizadas, 
          responder aos contatos em tempo hábil e pela qualidade dos serviços prestados diretamente aos clientes.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">6. Limitações de Responsabilidade</h2>
        <p className="mb-4">
          A Advogou não é um escritório de advocacia e não presta serviços jurídicos. 
          Não nos responsabilizamos pelos serviços jurídicos prestados pelos advogados cadastrados em nossa plataforma.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">7. Alterações nos Termos</h2>
        <p className="mb-4">
          Reservamo-nos o direito de modificar estes termos a qualquer momento. 
          As alterações entram em vigor imediatamente após sua publicação na plataforma.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">8. Legislação Aplicável</h2>
        <p className="mb-4">
          Estes termos são regidos pelas leis brasileiras. Qualquer disputa relacionada a estes termos será 
          submetida à jurisdição dos tribunais brasileiros.
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Última atualização: Maio de 2025
        </p>
      </div>
    </LegalLayout>
  );
};

export default TermsOfUse;