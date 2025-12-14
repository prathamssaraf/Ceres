"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { UploadStep } from "@/components/onboarding/upload-step";
import { DescribeStep } from "@/components/onboarding/describe-step";
import { VibeStep } from "@/components/onboarding/vibe-step";
import { PreviewStep } from "@/components/onboarding/preview-step";

export type DropData = {
  imageFile: File | null;
  imagePreview: string;
  name: string;
  description: string;
  price: string;
  inventory: string;
  vibePrompt: string;
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dropData, setDropData] = useState<DropData>({
    imageFile: null,
    imagePreview: "",
    name: "",
    description: "",
    price: "",
    inventory: "",
    vibePrompt: "",
  });

  const steps = [
    { id: 0, name: "Upload", component: UploadStep },
    { id: 1, name: "Describe", component: DescribeStep },
    { id: 2, name: "Vibe", component: VibeStep },
    { id: 3, name: "Preview", component: PreviewStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateDropData = (data: Partial<DropData>) => {
    setDropData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Your Drop
          </h1>
          <p className="text-neutral-400">
            Transform your product into a vibe in 30 seconds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 text-center ${
                  index <= currentStep ? "text-white" : "text-neutral-600"
                }`}
              >
                <div className="text-sm font-medium">{step.name}</div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-lg p-8">
          <CurrentStepComponent
            dropData={dropData}
            updateDropData={updateDropData}
            onNext={handleNext}
            onBack={handleBack}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>

        {/* Step Indicator */}
        <div className="mt-4 text-center text-neutral-500 text-sm">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  );
}
