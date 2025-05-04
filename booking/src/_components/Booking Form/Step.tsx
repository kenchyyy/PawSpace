'use client';
import React from 'react';

interface StepProps {
  currentStep: 'customer' | 'pet' | 'review';
}

const Step: React.FC<StepProps> = ({ currentStep }) => {
  const steps = ['customer', 'pet', 'review'];
  
  return (
    <div className="flex justify-between mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
            currentStep === step 
              ? 'bg-purple-600 text-white shadow-md' 
              : (steps.indexOf(currentStep) >= index 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-gray-100 text-gray-400'
          )}`}>
            {index + 1}
          </div>
          <span className={`text-xs font-medium ${
            currentStep === step ? 'text-purple-600' : 'text-gray-500'
          }`}>
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Step;