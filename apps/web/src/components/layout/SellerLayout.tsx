import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/seller", label: "Overview", icon: "📊", exact: true },
  { to: "/seller/products", label: "Products", icon: "🛍️", exact: false },
  { to: "/seller/inventory", label: "Inventory", icon: "📦", exact: false },
  { to: "/seller/orders", label: "Orders", icon: "🧾", exact: false },
  { to: "/seller/earnings", label: "Earnings", icon: "💰", exact: false },
];

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex" style={{ color: "var(--text)" }}>
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col border-r"
        style={{
          background: "rgba(11,15,31,0.8)",
          borderColor: "var(--border)",
        }}
      >
        {/* Brand */}
        <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
          <Link
            to="/"
            className="text-lg font-bold"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            Shop<span style={{ color: "var(--accent)" }}>land</span>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
            Seller Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-accent/10 text-accent" : "text-text hover:bg-white/5"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs mb-2 truncate" style={{ color: "var(--text-soft)" }}>
            {user?.email}
          </p>
          <Link
            to="/"
            className="block px-3 py-2 rounded-xl text-xs transition-all hover:bg-white/5 mb-1"
            style={{ color: "var(--text-soft)" }}
          >
            ← Back to Store
          </Link>
          <button
            onClick={() => { void handleLogout(); }}
            className="block w-full text-left px-3 py-2 rounded-xl text-xs transition-all hover:bg-white/5"
            style={{ color: "#f87171" }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
