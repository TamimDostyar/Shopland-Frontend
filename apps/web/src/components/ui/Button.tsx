import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-white shadow-[0_14px_32px_rgba(255,106,61,0.26)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 disabled:opacity-50",
  ghost:
    "bg-white/70 border border-[color:var(--border)] text-[color:var(--text)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] hover:bg-white disabled:opacity-50",
  danger:
    "bg-[var(--danger-soft)] border border-[color:rgba(217,75,75,0.2)] text-[color:var(--error)] hover:bg-[#fde3e3] disabled:opacity-50",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm rounded-xl",
  md: "px-4.5 py-2.5 text-sm rounded-2xl",
  lg: "px-6 py-3 text-base rounded-2xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled ?? loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {loading ? (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
