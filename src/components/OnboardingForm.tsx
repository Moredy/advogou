
import React, { useState } from 'react';
import { motion } from "framer-motion";
import QuestionStep, { Option } from './QuestionStep';
import ResultMessage from './ResultMessage';

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [technicalArea, setTechnicalArea] = useState(''); 
  
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
    }
    // Contact preference question removed
  ];

  const handleSelectOption = (option: Option) => {
    const step = steps[currentStep];
    
    // Armazenar seleção do usuário
    setSelections(prev => ({
      ...prev,
      [step.id]: option.value
    }));
    
    // Se for o primeiro passo, armazenar a área técnica correspondente
    if (step.id === 'problema' && 'technicalArea' in option) {
      setTechnicalArea(option.technicalArea as string);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(steps.length);
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
    const problema = selections.problema;
    const detalhe = selections.detalhe;
    
    let descricao = '';
    
    // Mapeamento de problemas para descrições mais detalhadas
    const problemaDescricoes: Record<string, string> = {
      'trabalho': 'um problema trabalhista',
      'divida': 'uma questão relacionada a dívidas ou consumo',
      'familia': 'uma questão familiar',
      'imovel': 'um problema imobiliário',
      'acidente': 'um acidente ou dano sofrido'
    };
    
    descricao = problemaDescricoes[problema] || 'uma questão jurídica';
    
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

    return `Olá, encontrei seu contato pelo JurisQuick.

Estou com ${problemDesc}.
A situação é ${urgencia} para mim.

Poderia me ajudar com algumas orientações iniciais, por favor?

Obrigado.`;
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelections({});
    setTechnicalArea('');
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
          
          {/* Mostrar área técnica para debug (remover em produção) */}
          {technicalArea && currentStep > 0 && (
            <div className="mt-4 text-xs text-juris-text text-opacity-50">
              <span className="opacity-50">Área técnica identificada:</span> {getAreaName()}
            </div>
          )}
        </div>
      )}

      {currentStep === steps.length && (
        <ResultMessage
          message={generateMessage()}
          areaExpert={getAreaName()}
          isActive={true}
          onRestart={handleRestart}
        />
      )}
    </motion.div>
  );
};

export default OnboardingForm;
