import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 10%, rgba(255,125,72,0.12), transparent 28%), radial-gradient(circle at 70% 85%, rgba(80,70,255,0.14), transparent 28%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
            Shopland
          </Link>
        </div>

        <div className="bg-surface/80 backdrop-blur border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="text-xl font-bold text-heading mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-muted mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
