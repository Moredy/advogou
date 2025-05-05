
import React from "react";
import LegalLayout from "@/components/LegalLayout";

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Política de Privacidade">
      <div className="prose max-w-none">
        <p className="mb-6">
          A Advogou valoriza a privacidade dos seus usuários e se compromete a proteger as informações pessoais compartilhadas em nossa plataforma.
          Esta política de privacidade explica como coletamos, usamos e protegemos seus dados.
        </p>

        <h2 className="text-xl font-semibold mb-4 text-black">1. Informações Coletadas</h2>
        <p className="mb-4">
          Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone e informações sobre sua questão jurídica.
          Para advogados, coletamos também dados profissionais como OAB, áreas de atuação e experiência.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">2. Uso das Informações</h2>
        <p className="mb-4">
          Utilizamos suas informações para:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Conectar usuários com advogados adequados às suas necessidades</li>
          <li>Melhorar nossos serviços e experiência do usuário</li>
          <li>Comunicar-nos com você sobre nossos serviços</li>
          <li>Cumprir obrigações legais</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">3. Compartilhamento de Informações</h2>
        <p className="mb-4">
          Compartilhamos informações de usuários apenas com os advogados selecionados para atender sua necessidade específica.
          Não vendemos ou alugamos suas informações pessoais a terceiros para fins de marketing.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">4. Armazenamento e Segurança</h2>
        <p className="mb-4">
          Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais.
          No entanto, nenhum método de transmissão pela internet é completamente seguro, e não podemos garantir a segurança absoluta dos dados.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">5. Seus Direitos</h2>
        <p className="mb-4">
          Você tem direito a acessar, corrigir, atualizar e solicitar a exclusão de seus dados pessoais.
          Para exercer esses direitos, entre em contato conosco através dos canais informados nesta política.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">6. Cookies e Tecnologias Semelhantes</h2>
        <p className="mb-4">
          Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em nossa plataforma,
          analisar tendências e administrar o site.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">7. Alterações na Política de Privacidade</h2>
        <p className="mb-4">
          Podemos atualizar esta política periodicamente. A versão mais recente estará sempre disponível em nossa plataforma.
        </p>

        <h2 className="text-xl font-semibold mb-4 mt-6 text-black">8. Contato</h2>
        <p className="mb-4">
          Se você tiver dúvidas sobre esta política ou sobre como tratamos seus dados pessoais,
          entre em contato conosco pelo e-mail: privacidade@advogou.com.br
        </p>

        <p className="mt-8 text-sm text-gray-600">
          Última atualização: Maio de 2025
        </p>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;