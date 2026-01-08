interface Step {
  step: number;
  title: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressStepper = ({
  steps,
  currentStep,
}: ProgressStepperProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-7 left-0 right-0 h-1 bg-gray-200 -z-10">
          {/* Progress Line Fill */}
          <div
            className="h-full bg-black transition-all duration-500 rounded-full"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = step.step < currentStep;
          const isCurrent = step.step === currentStep;
          const isPending = step.step > currentStep;

          return (
            <div
              key={step.step}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* Checkpoint Circle - Larger */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-black text-white shadow-lg"
                    : isCurrent
                      ? "bg-black text-white ring-4 ring-black ring-opacity-20 shadow-lg scale-110"
                      : "bg-white border-3 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-lg font-bold">{step.step}</span>
                )}
              </div>

              {/* Step Title - Larger */}
              <div className="mt-4 text-center">
                <p
                  className={`text-sm font-semibold ${
                    isCompleted || isCurrent ? "text-black" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
