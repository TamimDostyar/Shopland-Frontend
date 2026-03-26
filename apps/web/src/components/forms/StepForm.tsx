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
      <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] p-4">
        <div className="flex flex-wrap justify-between gap-2 mb-3">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${i <= currentStep ? "bg-[rgba(255,106,61,0.12)] text-accent" : "bg-white text-muted"}`}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))", width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_20px_50px_rgba(23,32,51,0.06)]"
      >
        <div className="flex flex-col gap-4">{children}</div>
      </div>

      <div className="flex gap-3 pt-1">
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
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
