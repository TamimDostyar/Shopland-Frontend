import type { ReactNode } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  ShieldIcon,
  UserIcon,
} from "../ui/icons";

interface Props {
  children: ReactNode;
}

const NAV = [
  { to: "/admin/products", label: "Product approvals", icon: PackageIcon },
  { to: "/admin/sellers/pending", label: "Pending sellers", icon: ClockIcon },
  { to: "/admin/sellers/approved", label: "Approved sellers", icon: CheckCircleIcon },
  { to: "/admin/sellers/rejected", label: "Rejected sellers", icon: UserIcon },
  { to: "/admin/id-review", label: "ID review queue", icon: ShieldIcon },
];

export default function AdminLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb,#edf3f9)] lg:flex">
      <aside className="flex shrink-0 flex-col border-r border-[color:var(--border)] bg-[rgba(255,255,255,0.88)] px-4 py-6 backdrop-blur-xl lg:w-72">
        <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#172033,#243457)] p-5 text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/16"
          >
            <ArrowLeftIcon size={14} />
            Back
          </button>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Admin Panel
          </p>
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Shopland Control
          </p>
          <p className="mt-3 text-sm text-white/72">
            Review catalog quality, seller onboarding, and identity verification from one place.
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-2 py-6">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[linear-gradient(90deg,rgba(255,106,61,0.14),rgba(31,122,255,0.1))] text-[color:var(--accent)]"
                    : "text-[color:var(--text)] hover:bg-white hover:text-[color:var(--accent)]"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_16px_40px_rgba(23,32,51,0.05)]">
          <div className="mb-3 text-sm font-semibold text-[color:var(--text-h)]">Signed in as admin</div>
          <p className="mb-3 truncate text-xs text-[color:var(--text-soft)]">{user?.email}</p>
          <Link
            to="/"
            className="mb-2 flex w-full items-center gap-2 rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-left text-sm font-semibold text-[color:var(--text-h)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <ArrowLeftIcon size={14} />
            Back to Home
          </Link>
          <button
            onClick={() => { void handleLogout(); }}
            className="w-full rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-left text-sm font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-h-screen flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
