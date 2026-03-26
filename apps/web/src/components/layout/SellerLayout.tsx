import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  DashboardIcon,
  PackageIcon,
  StoreIcon,
  TruckIcon,
  WalletIcon,
} from "../ui/icons";

const NAV_ITEMS = [
  { to: "/seller", label: "Overview", icon: DashboardIcon, exact: true },
  { to: "/seller/products", label: "Products", icon: StoreIcon, exact: false },
  { to: "/seller/inventory", label: "Inventory", icon: PackageIcon, exact: false },
  { to: "/seller/orders", label: "Orders", icon: ClipboardIcon, exact: false },
  { to: "/seller/earnings", label: "Earnings", icon: WalletIcon, exact: false },
];

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb,#edf3f9)] text-[color:var(--text)] lg:flex">
      <aside
        className="flex shrink-0 flex-col border-r border-[color:var(--border)] bg-[rgba(255,255,255,0.85)] px-4 py-5 backdrop-blur-xl lg:w-72"
        style={{
          boxShadow: "0 22px 60px rgba(23,32,51,0.08)",
        }}
      >
        <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#172033,#243457)] p-5 text-white">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
              <StoreIcon size={20} />
            </div>
            <div>
              <div className="text-lg font-bold" style={{ fontFamily: "var(--heading)" }}>
                Shopland
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-white/65">
                Seller hub
              </div>
            </div>
          </div>
          <p className="text-sm text-white/76">
            Manage catalog, orders, and payouts from one cleaner control room.
          </p>
        </div>

        <nav className="flex-1 space-y-2 py-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[linear-gradient(90deg,rgba(255,106,61,0.14),rgba(31,122,255,0.1))] text-[color:var(--accent)] shadow-[0_12px_30px_rgba(23,32,51,0.05)]"
                    : "text-[color:var(--text)] hover:bg-white hover:text-[color:var(--accent)]"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_16px_40px_rgba(23,32,51,0.05)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <TruckIcon size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[color:var(--text-h)]">
                {user?.first_name || "Seller account"}
              </p>
              <p className="truncate text-xs text-[color:var(--text-soft)]">
                {user?.email}
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="mb-2 flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm font-semibold text-[color:var(--text)] transition-colors hover:text-[color:var(--accent)]"
          >
            <ArrowLeftIcon size={15} />
            Back to store
          </Link>
          <button
            onClick={() => { void handleLogout(); }}
            className="block w-full rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-left text-sm font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 py-5 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 rounded-[1.75rem] border border-[color:var(--border)] bg-white px-6 py-4 shadow-[0_18px_50px_rgba(23,32,51,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  Seller dashboard
                </div>
                <div className="text-xl font-bold text-[color:var(--text-h)]" style={{ fontFamily: "var(--heading)" }}>
                  Run your shop with a cleaner workflow
                </div>
              </div>
              <Link
                to="/seller/products/new"
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,106,61,0.22)]"
              >
                Add product
              </Link>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
