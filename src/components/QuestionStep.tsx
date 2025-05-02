
import React from 'react';
import { Button } from '@/components/ui/button';

export interface Option {
  id: string;
  label: string;
  value: string;
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
          <Button
            key={option.id}
            variant="outline"
            className="w-full text-left justify-start py-6 bg-white bg-opacity-5 hover:bg-opacity-10 border-white border-opacity-10 text-juris-text"
            onClick={() => onSelectOption(option)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionStep;
