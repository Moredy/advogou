
import React, { useState } from 'react';
import { motion } from "framer-motion";
import QuestionStep, { Option } from './QuestionStep';
import ResultMessage from './ResultMessage';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface ContactInfo {
  name: string;
  phone: string;
}

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [technicalArea, setTechnicalArea] = useState(''); 
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  
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

  const handleContactSubmit = (data: ContactInfo) => {
    setContactInfo(data);
    setCurrentStep(steps.length);
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
                >
                  Encontrar advogado
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-3">
              {/* Renderizar opções estáticas ou dinâmicas conforme o passo */}
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
          
          {/* Mostrar área técnica para debug (remover em produção) */}
          {technicalArea && currentStep > 0 && (
            <div className="mt-4 text-xs text-juris-text text-opacity-50">
              <span className="opacity-50">Área técnica identificada:</span> {getAreaName()}
            </div>
          )}
        </div>
      )}

      {currentStep === steps.length && contactInfo && (
        <ResultMessage
          message={generateMessage()}
          areaExpert={getAreaName()}
          contactInfo={contactInfo}
          isActive={true}
          onRestart={handleRestart}
        />
      )}
    </motion.div>
  );
};

export default OnboardingForm;
