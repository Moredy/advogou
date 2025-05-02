
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Copy } from 'lucide-react';

interface ResultMessageProps {
  message: string;
  areaExpert: string;
  isActive: boolean;
  onRestart: () => void;
}

const ResultMessage: React.FC<ResultMessageProps> = ({
  message,
  areaExpert,
  isActive,
  onRestart
}) => {
  if (!isActive) return null;

  const phoneNumber = "5511999999999"; // Substitua pelo número do WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    alert("Mensagem copiada para a área de transferência!");
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-medium mb-2">Seu contato está pronto!</h3>
        <p className="text-juris-text text-opacity-80">
          Conectamos você com um especialista em {areaExpert}
        </p>
      </div>

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
        <Button 
          className="w-full btn-primary"
          onClick={() => window.open(whatsappUrl, '_blank')}
        >
          Enviar mensagem via WhatsApp
        </Button>
        
        <Button 
          variant="outline"
          className="w-full border border-white border-opacity-10 hover:bg-white hover:bg-opacity-5"
          onClick={onRestart}
        >
          Recomeçar
        </Button>
      </div>
    </div>
  );
};

export default ResultMessage;
