import React, { useState } from 'react';
import { motion } from "framer-motion";
import QuestionStep, { Option } from './QuestionStep';
import ResultMessage from './ResultMessage';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ContactInfo {
  name: string;
  phone: string;
}

// Lista de emails administrativos - para evitar que leads sejam direcionados a administradores
const adminEmails = ['admin@jurisquick.com'];

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [technicalArea, setTechnicalArea] = useState(''); 
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lawyerId, setLawyerId] = useState<string | null>(null);
  const [noLawyersAvailable, setNoLawyersAvailable] = useState(false);
  const { toast } = useToast();
  
  const contactForm = useForm<ContactInfo>({
    defaultValues: {
      name: '',
      phone: ''
    }
  });
  
  // Definição dos passos com perguntas mais acessíveis
  const steps = [
    {
      id: 'situacao',
      question: 'Qual é a sua situação atual?',
      options: [
        { id: 'orientacao', label: 'Preciso apenas de orientação jurídica', value: 'orientacao' },
        { id: 'processo', label: 'Quero entrar com um processo', value: 'processo' },
        { id: 'citado', label: 'Fui citado em um processo', value: 'citado' }
      ]
    },
    {
      id: 'problema',
      question: 'Qual problema você está enfrentando?',
      options: [
        { id: 'trabalho', label: 'Problema no trabalho', value: 'trabalho', technicalArea: 'trabalhista' },
        { id: 'divida', label: 'Dívidas ou cobranças indevidas', value: 'divida', technicalArea: 'consumidor' },
        { id: 'familia', label: 'Questões familiares (divórcio, guarda de filhos)', value: 'familia', technicalArea: 'familia' },
        { id: 'imovel', label: 'Problemas com imóvel (aluguel, compra)', value: 'imovel', technicalArea: 'imobiliario' },
        { id: 'acidente', label: 'Acidente ou dano sofrido', value: 'acidente', technicalArea: 'civil' }
      ]
    },
    {
      id: 'detalhe',
      question: 'Pode nos dar mais detalhes?',
      getDynamicOptions: (selections: Record<string, string>) => {
        switch(selections.problema) {
          case 'trabalho':
            return [
              { id: 'demissao', label: 'Fui demitido injustamente', value: 'demissao' },
              { id: 'salario', label: 'Não recebi salário ou benefícios', value: 'salario' },
              { id: 'assedio', label: 'Sofri assédio no trabalho', value: 'assedio' },
              { id: 'outro_trab', label: 'Outro problema trabalhista', value: 'outro_trab' }
            ];
          case 'divida':
            return [
              { id: 'cobranca', label: 'Cobrança de dívida que não fiz', value: 'cobranca' },
              { id: 'nome_sujo', label: 'Meu nome está no SPC/Serasa injustamente', value: 'nome_sujo' },
              { id: 'produto', label: 'Comprei um produto com defeito', value: 'produto' },
              { id: 'outro_cons', label: 'Outro problema de consumo', value: 'outro_cons' }
            ];
          case 'familia':
            return [
              { id: 'divorcio', label: 'Preciso de divórcio', value: 'divorcio' },
              { id: 'pensao', label: 'Questões de pensão alimentícia', value: 'pensao' },
              { id: 'guarda', label: 'Disputa pela guarda dos filhos', value: 'guarda' },
              { id: 'outro_fam', label: 'Outra questão familiar', value: 'outro_fam' }
            ];
          case 'imovel':
            return [
              { id: 'aluguel', label: 'Problemas com contrato de aluguel', value: 'aluguel' },
              { id: 'condominio', label: 'Conflitos de condomínio', value: 'condominio' },
              { id: 'compra', label: 'Problemas na compra/venda de imóvel', value: 'compra' },
              { id: 'outro_imob', label: 'Outro problema imobiliário', value: 'outro_imob' }
            ];
          case 'acidente':
            return [
              { id: 'transito', label: 'Acidente de trânsito', value: 'transito' },
              { id: 'medico', label: 'Erro médico', value: 'medico' },
              { id: 'queda', label: 'Queda ou acidente em estabelecimento', value: 'queda' },
              { id: 'outro_acid', label: 'Outro tipo de acidente/dano', value: 'outro_acid' }
            ];
          default:
            return [{ id: 'outro', label: 'Outro problema', value: 'outro' }];
        }
      }
    },
    {
      id: 'urgencia',
      question: 'Qual a urgência do seu caso?',
      options: [
        { id: 'alta', label: 'Muito urgente - Preciso resolver hoje', value: 'alta' },
        { id: 'media', label: 'Urgente - Preciso resolver esta semana', value: 'media' },
        { id: 'baixa', label: 'Não é urgente - Estou apenas pesquisando', value: 'baixa' }
      ]
    },
    {
      id: 'contact',
      question: 'Para conectá-lo com um advogado, precisamos de alguns dados',
      type: 'form'
    }
  ];

  const handleSelectOption = (option: Option) => {
    const step = steps[currentStep];
    
    // Armazenar seleção do usuário
    setSelections(prev => ({
      ...prev,
      [step.id]: option.value
    }));
    
    // Se for o segundo passo (problema), armazenar a área técnica correspondente
    if (step.id === 'problema' && 'technicalArea' in option) {
      setTechnicalArea(option.technicalArea as string);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(steps.length);
    }
  };

  const handleContactSubmit = async (data: ContactInfo) => {
    setIsSubmitting(true);
    setContactInfo(data);
    setNoLawyersAvailable(false); // Reset no lawyers available state
    
    try {
      // Encontrar um advogado para o lead
      const areaName = getAreaName();
      
      console.log("Buscando advogados para a área:", areaName.toLowerCase());
      
      // Primeira tentativa: buscar advogados especializados na área específica
      const { data: lawyers, error: lawyersError } = await supabase
        .from('lawyers')
        .select('id, email, specialty, subscription_active, status')
        .eq('specialty', areaName.toLowerCase())
        .eq('status', 'approved')
        .not('email', 'in', `(${adminEmails.map(email => `'${email}'`).join(',')})`)
        .order('created_at', { ascending: true });

      if (lawyersError) {
        console.error('Erro ao buscar advogados:', lawyersError);
        throw lawyersError;
      }

      console.log("Advogados encontrados:", lawyers?.length || 0, lawyers);

      let selectedLawyerId: string;

      if (!lawyers || lawyers.length === 0) {
        console.log("Nenhum advogado especializado encontrado, buscando qualquer advogado aprovado");
        
        // Segunda tentativa: buscar qualquer advogado aprovado
        const { data: anyLawyers, error: anyLawyersError } = await supabase
          .from('lawyers')
          .select('id, email, specialty, subscription_active, status')
          .eq('status', 'approved')
          .not('email', 'in', `(${adminEmails.map(email => `'${email}'`).join(',')})`)
          .order('created_at', { ascending: true });
          
        if (anyLawyersError) {
          console.error('Erro ao buscar qualquer advogado:', anyLawyersError);
          throw anyLawyersError;
        }
        
        console.log("Advogados gerais encontrados:", anyLawyers?.length || 0, anyLawyers);
        
        // Debug: buscar todos os advogados para verificar se existem no sistema
        const { data: allLawyers, error: allLawyersError } = await supabase
          .from('lawyers')
          .select('id, email, specialty, status')
          .order('created_at', { ascending: true });
          
        if (allLawyersError) {
          console.error('Erro ao buscar todos os advogados:', allLawyersError);
        } else {
          console.log("Total de advogados no sistema:", allLawyers?.length || 0);
          console.log("Status dos advogados:", allLawyers?.map(l => ({ email: l.email, status: l.status, specialty: l.specialty })));
        }
        
        if (!anyLawyers || anyLawyers.length === 0) {
          // Nova lógica: mostrar mensagem que não há advogados disponíveis
          setNoLawyersAvailable(true);
          throw new Error('Nenhum advogado disponível no sistema');
        }
        
        selectedLawyerId = anyLawyers[0].id;
      } else {
        selectedLawyerId = lawyers[0].id;
      }

      // Criar o lead
      await createLead(selectedLawyerId, data, areaName);
      setLawyerId(selectedLawyerId);
      
      // Avançar para o último passo
      setCurrentStep(steps.length);
      
      toast({
        title: "Advogado encontrado!",
        description: "Um profissional foi notificado sobre sua solicitação.",
      });
    } catch (error) {
      console.error('Erro ao processar lead:', error);
      
      // Se o erro for de "nenhum advogado disponível", exibimos um alerta específico
      if (!noLawyersAvailable) {
        toast({
          title: "Erro",
          description: "Não foi possível encontrar um advogado. Tente novamente.",
          variant: "destructive"
        });
      }
      
      // Mesmo com erro, avançamos para a mensagem final
      setCurrentStep(steps.length);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createLead = async (lawyerId: string, data: ContactInfo, areaName: string) => {
    try {
      const message = generateMessage();
      
      const { data: leadData, error } = await supabase
        .from('leads')
        .insert({
          lawyer_id: lawyerId,
          client_name: data.name,
          client_email: `cliente_${new Date().getTime()}@example.com`,
          client_phone: data.phone,
          case_area: areaName.toLowerCase(),
          description: message,
          status: 'pending'
        })
        .select();
      
      if (error) {
        console.error('Erro ao criar lead:', error);
        throw error;
      }
      
      console.log('Lead criado com sucesso:', leadData);
    } catch (error) {
      console.error('Erro na função createLead:', error);
      throw error;
    }
  };

  const getAreaName = (): string => {
    // Mapeamento das áreas técnicas para nomes amigáveis
    const areaNames: Record<string, string> = {
      'trabalhista': 'Direito Trabalhista',
      'consumidor': 'Direito do Consumidor',
      'familia': 'Direito de Família',
      'imobiliario': 'Direito Imobiliário',
      'civil': 'Direito Civil'
    };
    
    return areaNames[technicalArea] || 'Direito';
  };

  const getProblemDescription = (): string => {
    // Obter descrição do problema baseado nas seleções
    const situacao = selections.situacao;
    const problema = selections.problema;
    const detalhe = selections.detalhe;
    
    let descricao = '';
    
    // Descrição baseada na situação
    const situacaoDescricoes: Record<string, string> = {
      'orientacao': 'preciso apenas de orientação jurídica sobre',
      'processo': 'desejo entrar com um processo relacionado a',
      'citado': 'fui citado em um processo envolvendo'
    };
    
    descricao = situacaoDescricoes[situacao] || '';
    
    // Mapeamento de problemas para descrições mais detalhadas
    const problemaDescricoes: Record<string, string> = {
      'trabalho': 'um problema trabalhista',
      'divida': 'uma questão relacionada a dívidas ou consumo',
      'familia': 'uma questão familiar',
      'imovel': 'um problema imobiliário',
      'acidente': 'um acidente ou dano sofrido'
    };
    
    descricao += ' ' + (problemaDescricoes[problema] || 'uma questão jurídica');
    
    // Adicionar detalhes específicos se disponíveis
    if (detalhe) {
      // Poderíamos adicionar mais detalhes específicos aqui se necessário
      descricao += ` (${detalhe})`;
    }
    
    return descricao;
  };

  const generateMessage = (): string => {
    const area = getAreaName();
    const problemDesc = getProblemDescription();
    const urgencia = selections.urgencia === 'alta' 
      ? 'muito urgente' 
      : selections.urgencia === 'media' 
      ? 'urgente' 
      : 'não urgente';

    const name = contactInfo?.name || '';

    return `Olá, me chamo ${name} e encontrei seu contato pelo JurisQuick.

${problemDesc.charAt(0).toUpperCase() + problemDesc.slice(1)}.
A situação é ${urgencia} para mim.

Poderia me ajudar com algumas orientações iniciais, por favor?

Obrigado.`;
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelections({});
    setTechnicalArea('');
    setContactInfo(null);
    setLawyerId(null);
    setNoLawyersAvailable(false);
    contactForm.reset();
  };

  return (
    <motion.div 
      className="card-custom max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-10 rounded-full ${
                index <= currentStep ? 'bg-juris-accent' : 'bg-white bg-opacity-20'
              }`}
            />
          ))}
        </div>
        {currentStep > 0 && currentStep < steps.length && (
          <button 
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="text-sm text-juris-text text-opacity-70 hover:text-opacity-100"
          >
            Voltar
          </button>
        )}
      </div>

      {currentStep < steps.length && (
        <div className="animate-fade-in step-transition">
          <h3 className="text-xl md:text-2xl font-medium mb-6 text-center">
            {steps[currentStep].question}
          </h3>
          
          {(steps[currentStep] as any).type === 'form' ? (
            <Form {...contactForm}>
              <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome completo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite seu nome completo" 
                          {...field} 
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white" 
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Telefone com WhatsApp</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000" 
                          {...field} 
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white" 
                          required
                          type="tel"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-juris-accent hover:bg-opacity-90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Buscando advogado...
                    </>
                  ) : (
                    "Encontrar advogado"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-3">
              {steps[currentStep].options ? (
                steps[currentStep].options.map((option) => (
                  <button
                    key={option.id}
                    className="w-full text-left justify-start py-6 px-4 bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 text-juris-text rounded-md transition-all"
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.label}
                  </button>
                ))
              ) : steps[currentStep].getDynamicOptions ? (
                steps[currentStep].getDynamicOptions(selections).map((option) => (
                  <button
                    key={option.id}
                    className="w-full text-left justify-start py-6 px-4 bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 text-juris-text rounded-md transition-all"
                    onClick={() => handleSelectOption(option)}
                  >
                    {option.label}
                  </button>
                ))
              ) : null}
            </div>
          )}
          
          {technicalArea && currentStep > 0 && (
            <div className="mt-4 text-xs text-juris-text text-opacity-50">
              <span className="opacity-50">Área técnica identificada:</span> {getAreaName()}
            </div>
          )}
        </div>
      )}

      {currentStep === steps.length && contactInfo && (
        <>
          {noLawyersAvailable && (
            <Alert variant="warning" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Não há advogados disponíveis</AlertTitle>
              <AlertDescription>
                Infelizmente não temos advogados aprovados disponíveis para a área de {getAreaName()} no momento. 
                Um administrador foi notificado e entrará em contato em breve.
              </AlertDescription>
            </Alert>
          )}
          <ResultMessage
            message={generateMessage()}
            areaExpert={getAreaName()}
            contactInfo={contactInfo}
            isActive={!noLawyersAvailable}
            onRestart={handleRestart}
            lawyerId={lawyerId}
          />
          
          {noLawyersAvailable && (
            <div className="mt-6">
              <button
                onClick={handleRestart}
                className="w-full py-3 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-md transition-all"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default OnboardingForm;
