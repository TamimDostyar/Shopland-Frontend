import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col py-6 px-4 gap-1 shrink-0">
        <Link
          to="/"
          className="text-lg font-bold text-heading mb-6 block"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Shopland
        </Link>

        <NavLink
          to="/app/profile"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-text hover:bg-surface"
            }`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/app/addresses"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-text hover:bg-surface"
            }`
          }
        >
          Addresses
        </NavLink>

        {user?.role === "admin" && (
          <Link
            to="/admin"
            className="px-3 py-2 rounded-lg text-sm text-accent hover:bg-accent/10 transition-colors mt-2 font-medium"
          >
            Admin Panel →
          </Link>
        )}

        <div className="mt-auto">
          <p className="text-xs text-muted mb-3 truncate px-1">{user?.email}</p>
          <button
            onClick={() => { void handleLogout(); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted hover:text-error hover:bg-error/5 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
