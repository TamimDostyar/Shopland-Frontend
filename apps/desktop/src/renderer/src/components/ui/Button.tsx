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
    "bg-accent text-white hover:opacity-90 active:opacity-80 disabled:opacity-50",
  ghost:
    "bg-transparent border border-border text-text hover:border-accent hover:text-accent disabled:opacity-50",
  danger:
    "bg-error/10 border border-error text-error hover:bg-error/20 disabled:opacity-50",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
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
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all cursor-pointer ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {loading ? (
        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
