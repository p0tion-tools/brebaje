"use client";

import { AppContent } from "@/app/components/layouts/AppContent";
import { CircuitGrid } from "@/app/components/ui/CircuitGrid";
import { ProgressStepper } from "@/app/components/ui/ProgressStepper";
import { useState } from "react";

const CONTRIBUTION_STEPS = [
  {
    step: 1,
    title: "Starting",
  },
  {
    step: 2,
    title: "Downloading",
  },
  {
    step: 3,
    title: "Computing",
  },
  {
    step: 4,
    title: "Uploading",
  },
  {
    step: 5,
    title: "Verifying",
  },
  {
    step: 6,
    title: "Complete",
  },
];

export default function ContributePage() {
  // Simulating progress - replace with actual ceremony state
  const [currentStep, setCurrentStep] = useState(3); // Example: at step 3
  const [completedCircuits, setCompletedCircuits] = useState(12);
  const totalCircuits = 32; // Example total

  const currentStepData = CONTRIBUTION_STEPS.find(
    (s) => s.step === currentStep
  );

  return (
    <div className="min-h-screen bg-gradient-homepage">
      <AppContent className="py-16">
        <div className="max-w-4xl mx-auto p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Contributing to Ceremony
            </h1>
            <p className="text-gray-600 text-sm">
              Please do not close this tab during the process
            </p>
          </div>

          {/* Progress Stepper - More prominent */}
          <div className="mb-12 py-8 bg-white rounded-xl border-2 border-black px-6">
            <ProgressStepper
              steps={CONTRIBUTION_STEPS}
              currentStep={currentStep}
            />
          </div>

          {/* Current Step Status */}
          {currentStep < 6 && (
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          )}

          {/* Success Message */}
          {currentStep === 6 && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 rounded-lg">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold">
                  Contribution completed successfully!
                </span>
              </div>
            </div>
          )}

          {/* Divider - More visible */}
          <hr className="border-t-2 border-gray-300 my-10" />

          {/* Circuit Grid Progress - Smaller and compact */}
          <CircuitGrid
            totalCircuits={totalCircuits}
            completedCircuits={completedCircuits}
          />

          {/* Warning Message */}
          {currentStep < 6 && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Do not refresh or leave this page
                </span>
              </div>
            </div>
          )}

          {/* Debug Controls - Remove in production */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center mb-4">
              Debug Controls (Remove in production)
            </p>
            <div className="flex gap-2 justify-center flex-wrap mb-4">
              {CONTRIBUTION_STEPS.map((step) => (
                <button
                  key={step.step}
                  onClick={() => {
                    setCurrentStep(step.step);
                    setCompletedCircuits(
                      Math.floor((step.step / 6) * totalCircuits)
                    );
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentStep === step.step
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Step {step.step}
                </button>
              ))}
            </div>
            {/* Circuit slider */}
            <div className="max-w-md mx-auto">
              <label className="text-xs text-gray-500 block mb-2">
                Circuits: {completedCircuits} / {totalCircuits}
              </label>
              <input
                type="range"
                min="0"
                max={totalCircuits}
                value={completedCircuits}
                onChange={(e) => setCompletedCircuits(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </AppContent>
    </div>
  );
}
