import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  children: ReactNode;
}

const NAV = [
  { to: "/admin/products", label: "📦 Product approvals" },
  { to: "/admin/sellers/pending", label: "🕐 Pending sellers" },
  { to: "/admin/sellers/approved", label: "✅ Approved sellers" },
  { to: "/admin/sellers/rejected", label: "✗ Rejected sellers" },
  { to: "/admin/id-review", label: "🪪 ID review queue" },
];

export default function AdminLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col py-6 px-4 shrink-0">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted hover:text-accent mb-4 flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
          <p className="text-xs text-accent font-semibold uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <p className="text-lg font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
            Shopland
          </p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-text hover:bg-surface"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-muted mb-3 truncate">{user?.email}</p>
          <button
            onClick={() => { void handleLogout(); }}
            className="text-sm text-muted hover:text-error transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto min-h-screen">{children}</main>
    </div>
  );
}
