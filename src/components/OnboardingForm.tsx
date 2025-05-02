
import React, { useState } from 'react';
import { motion } from "framer-motion";
import QuestionStep, { Option } from './QuestionStep';
import ResultMessage from './ResultMessage';

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  
  // Definição dos passos
  const steps = [
    {
      id: 'area',
      question: 'Qual área do direito você precisa de ajuda?',
      options: [
        { id: 'civil', label: 'Direito Civil', value: 'civil' },
        { id: 'trabalhista', label: 'Direito Trabalhista', value: 'trabalhista' },
        { id: 'consumidor', label: 'Direito do Consumidor', value: 'consumidor' },
        { id: 'familia', label: 'Direito de Família', value: 'familia' },
        { id: 'imobiliario', label: 'Direito Imobiliário', value: 'imobiliario' }
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
      id: 'contato',
      question: 'Como você prefere ser contactado pelo advogado?',
      options: [
        { id: 'whatsapp', label: 'WhatsApp', value: 'whatsapp' },
        { id: 'telefone', label: 'Ligação telefônica', value: 'telefone' },
        { id: 'email', label: 'E-mail', value: 'email' }
      ]
    }
  ];

  const handleSelectOption = (option: Option) => {
    const step = steps[currentStep];
    
    setSelections(prev => ({
      ...prev,
      [step.id]: option.value
    }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(steps.length);
    }
  };

  const getAreaName = (): string => {
    const areaValue = selections.area;
    const areaOption = steps[0].options.find(opt => opt.value === areaValue);
    return areaOption?.label || 'Direito';
  };

  const generateMessage = (): string => {
    const area = getAreaName();
    const urgencia = selections.urgencia === 'alta' 
      ? 'muito urgente' 
      : selections.urgencia === 'media' 
      ? 'urgente' 
      : 'não urgente';
    const contato = selections.contato === 'whatsapp' 
      ? 'WhatsApp' 
      : selections.contato === 'telefone' 
      ? 'telefone' 
      : 'e-mail';

    return `Olá, encontrei seu contato pelo JurisQuick.

Estou precisando de ajuda com um caso de ${area}.
A situação é ${urgencia} para mim.
Prefiro ser contatado por ${contato}.

Poderia me ajudar com algumas orientações iniciais, por favor?

Obrigado.`;
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelections({});
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

      {steps.map((step, index) => (
        <QuestionStep
          key={step.id}
          question={step.question}
          options={step.options}
          onSelectOption={handleSelectOption}
          isActive={index === currentStep}
        />
      ))}

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
