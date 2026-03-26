import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ShieldIcon, SparklesIcon, StoreIcon } from "../ui/icons";

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
    <div className="min-h-screen bg-bg px-4 py-8">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(255,106,61,0.16), transparent 26%), radial-gradient(circle at 88% 10%, rgba(31,122,255,0.15), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.5))",
        }}
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--accent)] shadow-[0_14px_36px_rgba(23,32,51,0.06)]">
              <SparklesIcon size={16} />
              Refined for modern marketplace flows
            </div>
            <Link to="/" className="mb-8 flex w-fit items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff6a3d,#ff9e62)] text-white shadow-[0_14px_34px_rgba(255,106,61,0.28)]">
                <StoreIcon size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-[color:var(--text-h)]" style={{ fontFamily: "var(--font-heading)" }}>
                  Shopland
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                  Marketplace
                </div>
              </div>
            </Link>

            <h1 className="max-w-lg text-5xl font-bold leading-[1.05] text-[color:var(--text-h)]" style={{ fontFamily: "var(--font-heading)" }}>
              Fresh storefront design with fast, trusted account flows.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-[color:var(--text-soft)]">
              Create an account, verify your identity, and move straight into buying or selling with a cleaner interface built for commerce.
            </p>

            <div className="mt-10">
              <div
                className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-5 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
                  <ShieldIcon size={18} />
                </div>
                <div className="text-base font-semibold text-[color:var(--text-h)]">Trusted onboarding</div>
                <p className="mt-2 text-sm text-[color:var(--text-soft)]">Verification-first flows help buyers and sellers move safely.</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_28px_70px_rgba(23,32,51,0.12)] backdrop-blur-xl"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(250,251,255,0.85))",
          }}
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff6a3d,#ff9e62)] text-white shadow-[0_12px_28px_rgba(255,106,61,0.24)]">
                <StoreIcon size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-[color:var(--text-h)]" style={{ fontFamily: "var(--font-heading)" }}>
                  Shopland
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  Accounts
                </div>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[color:var(--text-soft)]">
              <ShieldIcon size={14} />
              Secure access
            </div>
          </div>

          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text-soft)] transition-all hover:-translate-x-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              <ArrowLeftIcon size={14} />
              {backLabel}
            </button>
          )}

          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-h)" }}
          >
            {title}
          </h1>
          {subtitle && <p className="mb-6 text-sm" style={{ color: "var(--text-soft)" }}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
