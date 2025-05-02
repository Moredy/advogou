
import React from 'react';

export interface Option {
  id: string;
  label: string;
  value: string;
  technicalArea?: string;
}

interface QuestionStepProps {
  question: string;
  options: Option[];
  onSelectOption: (option: Option) => void;
  isActive: boolean;
}

const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  options,
  onSelectOption,
  isActive
}) => {
  if (!isActive) return null;
  
  return (
    <div className="animate-fade-in step-transition">
      <h3 className="text-xl md:text-2xl font-medium mb-6 text-center">{question}</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            className="w-full text-left justify-start py-6 px-4 bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 text-juris-text rounded-md transition-all"
            onClick={() => onSelectOption(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionStep;
