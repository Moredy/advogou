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
import { createLead } from '@/api/createLeadFunction';

interface ContactInfo {
  name: string;
  phone: string;
}

interface LawyerInfo {
  id: string;
  email: string;
  specialty: string;
  gender: string;
  phone: string;
}

// ID de lead temporário para casos sem advogados disponíveis
const ADMIN_FALLBACK_ID = '00000000-0000-0000-0000-000000000000';

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [technicalArea, setTechnicalArea] = useState('');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lawyerId, setLawyerId] = useState<string | null>(null);
  const [lawyerContactInfo, setLawyerContactInfo] = useState<LawyerInfo | null>(null)
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
        switch (selections.problema) {
          case 'trabalho':
            return [
              { id: 'demissao', label: 'Fui demitido injustamente', value: 'demissao' },
              { id: 'salario', label: 'Não recebi salário ou benefícios', value: 'salario' },
              { id: 'acidente_trab', label: 'Sofri um acidente no trabalho', value: 'acidente_trab' },
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
      id: 'situacao',
      question: 'Qual é a sua situação atual?',
      options: [
        { id: 'orientacao', label: 'Preciso apenas de orientação jurídica', value: 'orientacao' },
        { id: 'processo', label: 'Quero entrar com um processo', value: 'processo' },
        { id: 'citado', label: 'Fui citado em um processo', value: 'citado' }
      ]
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
      id: 'prefFeminina',
      question: 'Caso você seja mulher, tem preferência pelo atendimento feminino?',
      options: [
        { id: 'sim', label: 'Sim, prefiro ser atendida por uma advogada', value: 'sim' },
        { id: 'nao', label: 'Não, o gênero do(a) advogado(a) não importa', value: 'nao' },
        { id: 'naomulher', label: 'Não sou uma mulher', value: 'naomulher' }
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

  // Função refatorada para selecionar advogados mais adequados ao caso
  const findMatchingLawyer = async (areaName: string, detalhes: string) => {
    try {
      // Verificamos se o cliente prefere atendimento feminino
      const prefereAdvogada = selections.prefFeminina === 'sim';

      // Base da consulta
      let query = supabase
        .from('lawyers')
        .select('id, email, specialty, gender, phone',)
        .eq('status', 'approved')  // Somente advogados aprovados pelo admin
        .eq('subscription_active', true)  // Com assinatura ativa
        .neq('email', 'admin@jurisquick.com')  // Excluir o email do administrador
        .not('phone', 'is', null); // Excluir advogados sem número de telefone

      // Agora podemos usar o filtro de gênero pois a coluna existe no banco
      if (prefereAdvogada) {
        query = query.eq('gender', 'feminino');
      }

      // Finalizar a consulta ordenando por data de criação
      const { data: lawyers, error: queryError } = await query.order('created_at', { ascending: false });

      if (queryError) {
        console.error('Erro ao consultar advogados:', queryError);
        throw queryError;
      }

      console.log('Todos advogados aprovados:', lawyers);

      if (!lawyers || lawyers.length === 0) {
        console.log("Nenhum advogado aprovado encontrado");
        return null;
      }

      // Primeiro filtro: advogados com a especialidade exata
      let exactMatches = lawyers.filter(lawyer =>
        lawyer.specialty && lawyer.specialty.toLowerCase() === technicalArea.toLowerCase()
      );

      console.log(`Advogados com especialidade exata "${technicalArea}":`, exactMatches);

      // Se encontrarmos correspondências exatas, usaremos esses advogados
      if (exactMatches.length > 0) {
        const selectedLawyer = exactMatches[Math.floor(Math.random() * exactMatches.length)];
        console.log("Advogado selecionado com match exato:", selectedLawyer);
        return selectedLawyer;
      }

      // Segundo filtro: busca por palavras-chave na especialidade
      const keywords = technicalArea.split(' ');
      let partialMatches = lawyers.filter(lawyer =>
        lawyer.specialty && keywords.some(keyword =>
          lawyer.specialty.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      console.log(`Advogados com match parcial para "${technicalArea}":`, partialMatches);

      // Se encontrarmos correspondências parciais, usaremos esses advogados
      if (partialMatches.length > 0) {
        const selectedLawyer = partialMatches[Math.floor(Math.random() * partialMatches.length)];
        console.log("Advogado selecionado com match parcial:", selectedLawyer);
        return selectedLawyer;
      }

      // Se não houver correspondências, selecionamos um advogado aleatório dentre os aprovados
      const selectedLawyer = lawyers[Math.floor(Math.random() * lawyers.length)];
      console.log("Advogado selecionado aleatoriamente (sem match):", selectedLawyer);
      return selectedLawyer;
    } catch (error) {
      console.error('Erro ao buscar advogados:', error);
      return null;
    }
  };

  const handleContactSubmit = async (data: ContactInfo) => {
    setIsSubmitting(true);
    setContactInfo(data);
    setNoLawyersAvailable(false);

    try {
      // Encontrar o melhor advogado para o lead
      const areaName = getAreaName();
      const detalhes = selections.detalhe || '';

      // Buscar um advogado que corresponda às necessidades do cliente
      const matchingLawyer = await findMatchingLawyer(areaName, detalhes);

      // Verificar se encontramos um advogado adequado
      if (!matchingLawyer) {
        console.log("Nenhum advogado compatível encontrado, usando ID de fallback");
        setNoLawyersAvailable(true);

        // Criar lead para administração revisar posteriormente
        const message = generateMessage();
        await createLead({
          lawyer_id: ADMIN_FALLBACK_ID,
          client_name: data.name,
          client_email: `cliente_${new Date().getTime()}@example.com`,
          client_phone: data.phone,
          case_area: areaName.toLowerCase(),
          description: message,
          status: 'pending'
        });

        setLawyerId(ADMIN_FALLBACK_ID);
      } else {
        // Criar o lead com o advogado selecionado
        const message = generateMessage();
        await createLead({
          lawyer_id: matchingLawyer.id,
          client_name: data.name,
          client_email: `cliente_${new Date().getTime()}@example.com`,
          client_phone: data.phone,
          case_area: areaName.toLowerCase(),
          description: message,
          status: 'pending'
        });
        setLawyerContactInfo(matchingLawyer)
        setLawyerId(matchingLawyer.id);
      }

      // Avançar para o último passo
      setCurrentStep(steps.length);

    } catch (error) {
      console.error('Erro ao processar lead:', error);

      toast({
        title: "Erro",
        description: "Houve um problema ao processar sua solicitação. Tente novamente.",
        variant: "destructive"
      });

      setCurrentStep(steps.length);
    } finally {
      setIsSubmitting(false);
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

    return `Olá, me chamo ${name} e encontrei seu contato pelo Advogou.com.

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
  const formatPhoneNumber = (value: string) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}${numbers.slice(7, 11)}`;
  };

  return (
    <motion.div
      className="card-custom max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
<div className="mb-6 px-4">
  <div className="flex space-x-2 justify-center mb-2">
    {steps.map((_, index) => (
      <div
        key={index}
        className={`h-2 w-10 rounded-full ${index <= currentStep ? 'bg-juris-accent' : 'bg-white bg-opacity-20'}`}
      />
    ))}
  </div>
  {currentStep > 0 && currentStep < steps.length && (
    <div className="text-right">
      <button
        onClick={() => setCurrentStep(prev => prev - 1)}
        className="text-sm text-juris-text text-opacity-70 hover:text-opacity-100"
      >
        Voltar
      </button>
    </div>
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
                          className="bg-white bg-opacity-5 border-white border-opacity-20 text-white"
                          required
                          type="tel"
                          value={formatPhoneNumber(field.value)}
                          onChange={(e) => {
                            // Remove caracteres não numéricos e limita a 11 dígitos
                            const numbers = e.target.value.replace(/\D/g, '').slice(0, 11);
                            
                            // Salva apenas os números no control
                            field.onChange(numbers);
                          }}
                          maxLength={15}
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
                      Processando solicitação...
                    </>
                  ) : (
                    "Encontrar Advogado"
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
          {lawyerContactInfo && 
          <ResultMessage
            message={generateMessage()}
            areaExpert={getAreaName()}
            contactInfo={contactInfo}
            matchingLawyer={lawyerContactInfo}
            isActive={true}
            onRestart={handleRestart}
            lawyerId={lawyerId}
            noLawyersAvailable={noLawyersAvailable}
          />}
        </>
      )}
    </motion.div>
  );
};

export default OnboardingForm;
