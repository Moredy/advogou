
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Copy, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
}

const ResultMessage: React.FC<ResultMessageProps> = ({
  message,
  areaExpert,
  contactInfo,
  isActive,
  onRestart
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [lawyerFound, setLawyerFound] = useState(false);
  const [lawyerId, setLawyerId] = useState<string | null>(null);

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

  const findLawyer = async () => {
    if (lawyerFound) return; // Evitar múltiplas chamadas se já encontrou um advogado

    setIsLoading(true);
    try {
      // Obter um advogado aleatório da área de atuação
      const { data: lawyers, error: lawyersError } = await supabase
        .from('lawyers')
        .select('id')
        .eq('specialty', areaExpert.toLowerCase())
        .eq('subscription_active', true)
        .limit(1);

      if (lawyersError) {
        console.error('Erro ao buscar advogados:', lawyersError);
        throw lawyersError;
      }

      let selectedLawyerId: string;

      if (!lawyers || lawyers.length === 0) {
        console.log('Nenhum advogado encontrado para a área:', areaExpert);
        // Não encontrou advogado especialista, tenta encontrar qualquer advogado ativo
        const { data: anyLawyers, error: anyLawyersError } = await supabase
          .from('lawyers')
          .select('id')
          .eq('subscription_active', true)
          .limit(1);
          
        if (anyLawyersError) {
          console.error('Erro ao buscar qualquer advogado:', anyLawyersError);
          throw anyLawyersError;
        }
        
        if (!anyLawyers || anyLawyers.length === 0) {
          console.error('Nenhum advogado disponível no sistema');
          throw new Error('Nenhum advogado disponível no sistema');
        }
        
        console.log('Usando advogado genérico:', anyLawyers[0].id);
        // Usar qualquer advogado ativo
        selectedLawyerId = anyLawyers[0].id;
      } else {
        console.log('Usando advogado especialista:', lawyers[0].id);
        // Usar advogado especialista
        selectedLawyerId = lawyers[0].id;
      }

      // Criar o lead
      await createLead(selectedLawyerId);
      
      // Atualizar o estado para mostrar que o advogado foi encontrado
      setLawyerFound(true);
      setLawyerId(selectedLawyerId);
      
      toast({
        title: "Advogado encontrado!",
        description: "Um advogado já foi notificado sobre sua solicitação.",
      });
    } catch (error) {
      console.error('Erro ao processar lead:', error);
      toast({
        title: "Erro",
        description: "Não foi possível encontrar um advogado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    // Abrir o WhatsApp diretamente sem buscar advogado
    window.open(whatsappUrl, '_blank');
  };

  const createLead = async (lawyerId: string) => {
    try {
      // Usar o nome e telefone fornecidos pelo usuário
      const clientName = contactInfo.name;
      const clientPhone = contactInfo.phone;
      const clientEmail = `cliente_${new Date().getTime()}@example.com`;
      
      console.log('Criando lead para advogado:', lawyerId, 'com dados:', {
        lawyer_id: lawyerId,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        case_area: areaExpert.toLowerCase(),
        description: message
      });
      
      const { data, error } = await supabase
        .from('leads')
        .insert({
          lawyer_id: lawyerId,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          case_area: areaExpert.toLowerCase(),
          description: message,
          status: 'pending'
        })
        .select();
      
      if (error) {
        console.error('Erro ao criar lead:', error);
        throw error;
      }
      
      console.log('Lead criado com sucesso:', data);
    } catch (error) {
      console.error('Erro na função createLead:', error);
      throw error;
    }
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
        {!lawyerFound ? (
          <Button 
            className="w-full btn-primary relative"
            onClick={findLawyer}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Procurando advogado...
              </>
            ) : (
              "Encontrar advogado"
            )}
          </Button>
        ) : (
          <>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 mb-4">
              <p className="text-sm">
                <strong>Advogado encontrado!</strong> Um profissional já foi notificado sobre sua solicitação e entrará em contato em breve.
              </p>
            </div>
            
            <Button 
              className="w-full btn-primary relative"
              onClick={handleWhatsAppClick}
            >
              Enviar mensagem via WhatsApp
            </Button>
          </>
        )}
        
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
