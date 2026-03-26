import { useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
}

export default function OtpInput({ value, onChange, length = 6, error }: Props) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  function handleChange(index: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(length, " ").split("");
    chars[index] = digit || " ";
    const next = chars.join("").trimEnd();
    onChange(next);
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (value[index]) {
        const chars = value.padEnd(length, " ").split("");
        chars[index] = " ";
        onChange(chars.join("").trimEnd());
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) inputs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
    e.preventDefault();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`w-11 h-13 text-center text-xl font-bold rounded-xl border ${
              error ? "border-error" : "border-border"
            } bg-surface text-heading focus:outline-none focus:border-accent transition-colors`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-error text-center">{error}</p>}
    </div>
  );
}
