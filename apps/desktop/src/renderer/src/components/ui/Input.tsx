import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...rest }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm text-muted font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...rest}
        className={`w-full px-4 py-2.5 rounded-xl bg-surface border ${
          error ? "border-error" : "border-border"
        } text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors ${className}`}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
