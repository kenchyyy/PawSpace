// StepIndicator.tsx
import React from 'react';
import { ServiceType } from '../types';
import { FiUser, FiPieChart, FiCheckCircle } from 'react-icons/fi';

interface StepProps {
  currentStep: 'customer' | 'pet' | 'review';
  serviceType: ServiceType;
  completedSteps: ('customer' | 'pet')[];
  onStepClick: (stepId: 'customer' | 'pet' | 'review') => void;
}

const StepIndicator: React.FC<StepProps> = ({ currentStep, serviceType, completedSteps, onStepClick }) => {
  const steps = [
    { id: 'customer', label: 'Customer', icon: <FiUser /> },
    { id: 'pet', label: serviceType === 'grooming' ? 'Pet & Service' : 'Pet & Stay', icon: <FiPieChart /> },
    { id: 'review', label: 'Review', icon: <FiCheckCircle /> }
  ];

  return (
    <div className="relative mb-8">
      <div className="flex justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div
            className="h-1 bg-purple-600 transition-all duration-300 ease-in-out"
            style={{
              width: currentStep === 'customer' ? '0%' :
                currentStep === 'pet' ? '50%' : '100%'
            }}
          ></div>
        </div>

        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id as 'customer' | 'pet') || currentStep === 'review';
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center cursor-pointer`}
              onClick={() => isCompleted && !isCurrent ? onStepClick(step.id as 'customer' | 'pet' | 'review') : undefined}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isCurrent
                  ? 'bg-purple-600 text-white shadow-md border-2 border-purple-600'
                  : isCompleted
                    ? 'bg-purple-100 text-purple-600 border-2 border-purple-600'
                    : 'bg-white text-gray-400 border-2 border-gray-300'
              }`}>
                {isCompleted && !isCurrent ? (
                  <FiCheckCircle size={18} />
                ) : (
                  React.cloneElement(step.icon, { size: 18 })
                )}
              </div>
              <span className={`text-xs font-medium text-center ${
                isCurrent || isCompleted ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;