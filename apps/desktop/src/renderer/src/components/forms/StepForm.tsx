import type { ReactNode } from "react";
import Button from "../ui/Button";

interface Props {
  steps: string[];
  currentStep: number;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
  submitting?: boolean;
  nextDisabled?: boolean;
}

export default function StepForm({
  steps,
  currentStep,
  children,
  onNext,
  onBack,
  onSubmit,
  submitting,
  nextDisabled,
}: Props) {
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between mb-2">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`text-xs font-medium ${i <= currentStep ? "text-accent" : "text-muted"}`}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex flex-col gap-4">{children}</div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {currentStep > 0 && (
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        {isLast ? (
          <Button
            onClick={onSubmit}
            loading={submitting}
            disabled={nextDisabled}
            className="flex-1"
          >
            Submit
          </Button>
        ) : (
          <Button onClick={onNext} disabled={nextDisabled} className="flex-1">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
