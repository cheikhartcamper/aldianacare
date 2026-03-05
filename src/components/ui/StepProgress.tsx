import { Check } from 'lucide-react';

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                  ${index < currentStep
                    ? 'bg-primary text-white'
                    : index === currentStep
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {index < currentStep ? <Check size={14} /> : index + 1}
              </div>
              <span className={`text-[10px] mt-1.5 text-center max-w-[60px] leading-tight ${index <= currentStep ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-16px] transition-colors duration-300 ${index < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
