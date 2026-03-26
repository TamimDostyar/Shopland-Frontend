import type { ReactNode } from "react";

type Kind = "error" | "success" | "info" | "warning";

const styles: Record<Kind, string> = {
  error: "bg-error/10 border-error/30 text-error",
  success: "bg-success/10 border-success/30 text-success",
  info: "bg-accent/10 border-accent/30 text-accent",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
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
      className={`rounded-xl border px-4 py-3 text-sm ${styles[kind]} ${className}`}
    >
      {children}
    </div>
  );
}
