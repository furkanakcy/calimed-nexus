import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { FormStep } from '../types';

interface ProgressBarProps {
  currentStep: FormStep;
}

const steps = [
  { key: 'general', label: 'Genel Bilgiler', order: 1 },
  { key: 'rooms', label: 'Mahal Listesi', order: 2 },
  { key: 'tests', label: 'Test Girişleri', order: 3 },
  { key: 'preview', label: 'Önizleme', order: 4 },
  { key: 'download', label: 'İndir', order: 5 },
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const currentOrder = steps.find(step => step.key === currentStep)?.order || 1;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.order < currentOrder;
          const isCurrent = step.key === currentStep;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.order}</span>
                  )}
                </div>
                <span className={`
                  mt-2 text-xs font-medium text-center
                  ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-4 rounded-full transition-colors
                  ${step.order < currentOrder ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
