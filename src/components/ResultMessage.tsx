
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Copy, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isActive) return null;

  const phoneNumber = "5511999999999"; // Substitua pelo número do WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência",
    });
  };

  const handleWhatsAppClick = async () => {
    setIsLoading(true);
    try {
      // Obter um advogado aleatório da área de atuação
      const { data: lawyers, error: lawyersError } = await supabase
        .from('lawyers')
        .select('id')
        .eq('specialty', areaExpert.toLowerCase())
        .eq('subscription_active', true)
        .limit(1);

      if (lawyersError) throw lawyersError;

      if (!lawyers || lawyers.length === 0) {
        console.log('Nenhum advogado encontrado para a área:', areaExpert);
        // Não encontrou advogado especialista, tenta encontrar qualquer advogado ativo
        const { data: anyLawyers, error: anyLawyersError } = await supabase
          .from('lawyers')
          .select('id')
          .eq('subscription_active', true)
          .limit(1);
          
        if (anyLawyersError) throw anyLawyersError;
        
        if (!anyLawyers || anyLawyers.length === 0) {
          throw new Error('Nenhum advogado disponível no sistema');
        }
        
        // Usar qualquer advogado ativo
        await createLead(anyLawyers[0].id);
      } else {
        // Usar advogado especialista
        await createLead(lawyers[0].id);
      }

      // Abrir o WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Erro ao processar lead:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar seu pedido. Tente novamente.",
        variant: "destructive"
      });
      
      // Ainda abrir o WhatsApp mesmo com erro
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  const createLead = async (lawyerId: string) => {
    // Gerar um nome e email fictício para o lead (na prática, você coletaria isso do usuário)
    const clientName = `Cliente ${new Date().getTime()}`;
    const clientEmail = `cliente_${new Date().getTime()}@example.com`;
    
    const { error } = await supabase
      .from('leads')
      .insert({
        lawyer_id: lawyerId,
        client_name: clientName,
        client_email: clientEmail,
        case_area: areaExpert.toLowerCase(),
        description: message,
        status: 'pending'
      });
    
    if (error) throw error;
    
    console.log('Lead criado com sucesso para o advogado:', lawyerId);
    toast({
      title: "Sucesso!",
      description: "Seu contato foi encaminhado para um advogado especialista.",
    });
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
          className="w-full btn-primary relative"
          onClick={handleWhatsAppClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            "Enviar mensagem via WhatsApp"
          )}
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
