
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Phone, UserCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ContactInfo {
  name: string;
  phone: string;
}

interface ResultMessageProps {
  message: string;
  areaExpert: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  onRestart: () => void;
  lawyerId: string | null;
  noLawyersAvailable: boolean;
}

const ResultMessage: React.FC<ResultMessageProps> = ({
  message,
  areaExpert,
  contactInfo,
  isActive,
  onRestart,
  lawyerId,
  noLawyersAvailable
}) => {
  const { toast } = useToast();

  if (!isActive) return null;

  // Usar o telefone fornecido pelo usuário ou um número padrão como fallback
  const phoneNumber = contactInfo.phone.replace(/\D/g, '') || "5511999999999";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência",
    });
  };

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium mb-2">Sua solicitação foi registrada!</h3>
        <p className="text-juris-text text-opacity-80">
          {noLawyersAvailable 
            ? "Nosso time entrará em contato assim que possível" 
            : `Conectamos você com um especialista em ${areaExpert}`}
        </p>
      </div>

      {!noLawyersAvailable ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 mb-6">
          <p className="text-sm">
            <strong>Advogado notificado!</strong> Um profissional já foi notificado sobre sua solicitação e entrará em contato em breve.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 mb-6">
          <p className="text-sm flex items-center">
            <UserCheck size={16} className="mr-2" />
            <strong>Solicitação recebida!</strong> Um administrador analisará seu caso e encontrará o melhor advogado para sua necessidade.
          </p>
        </div>
      )}

      <Card className="card-custom mb-6">
        <CardContent className="pt-6">
          <p className="whitespace-pre-line text-juris-text mb-4">{message}</p>
          <div className="flex items-center justify-end">
            <button 
              onClick={copyToClipboard}
              className="text-juris-accent flex items-center text-sm"
            >
              <Copy size={16} className="mr-1" />
              Copiar texto
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!noLawyersAvailable && (
          <>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 mb-6">
              <p className="text-sm">
                <strong>Caso urgente?</strong> Você mesmo pode entrar em contato diretamente com o advogado via WhatsApp para agilizar o atendimento.
              </p>
            </div>
            
            <Button 
              className="w-full flex items-center justify-center gap-2 btn-primary"
              onClick={handleWhatsAppClick}
            >
              <Phone size={18} />
              <span className="whitespace-nowrap">Entrar em contato via WhatsApp</span>
            </Button>
          </>
        )}
        
        <Button 
          variant="outline"
          className="w-full border border-white border-opacity-10 hover:bg-white hover:bg-opacity-5"
          onClick={onRestart}
        >
          Iniciar nova consulta
        </Button>
      </div>
    </div>
  );
};

export default ResultMessage;
