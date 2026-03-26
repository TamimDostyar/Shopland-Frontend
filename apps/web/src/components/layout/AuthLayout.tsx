import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}

export default function AuthLayout({ title, subtitle, children, backTo, backLabel = "Back" }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      {/* background glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 10%, rgba(255,125,72,0.12), transparent 28%), radial-gradient(circle at 70% 85%, rgba(80,70,255,0.14), transparent 28%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-h)" }}
          >
            Shop<span style={{ color: "var(--accent)" }}>land</span>
          </Link>
        </div>

        <div
          className="backdrop-blur rounded-2xl p-8 shadow-xl"
          style={{
            background: "rgba(11,15,31,0.8)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Back button */}
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-1.5 text-sm mb-5 transition-all hover:-translate-x-0.5"
              style={{ color: "var(--text-soft)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-soft)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="m12 5-7 7 7 7" />
              </svg>
              {backLabel}
            </button>
          )}

          <h1
            className="text-xl font-bold mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-h)" }}
          >
            {title}
          </h1>
          {subtitle && <p className="text-sm mb-6" style={{ color: "var(--text-soft)" }}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
