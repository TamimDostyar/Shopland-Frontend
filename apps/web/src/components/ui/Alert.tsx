import type { ReactNode } from "react";

type Kind = "error" | "success" | "info" | "warning";

const styles: Record<Kind, string> = {
  error: "bg-[var(--danger-soft)] border-[color:rgba(217,75,75,0.22)] text-[color:var(--error)]",
  success: "bg-[var(--success-soft)] border-[color:rgba(22,155,101,0.22)] text-[color:var(--success)]",
  info: "bg-[rgba(31,122,255,0.09)] border-[color:rgba(31,122,255,0.18)] text-[color:var(--accent-secondary)]",
  warning: "bg-[var(--warning-soft)] border-[color:rgba(237,167,35,0.24)] text-[#b97500]",
};

interface Props {
  kind?: Kind;
  children: ReactNode;
  className?: string;
}

export default function Alert({ kind = "error", children, className = "" }: Props) {
  return (
    <div
      role="alert"
      className={`rounded-2xl border px-4 py-3 text-sm ${styles[kind]} ${className}`}
    >
      {children}
    </div>
  );
}
