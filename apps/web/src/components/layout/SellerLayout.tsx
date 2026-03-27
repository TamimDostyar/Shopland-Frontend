import type { ReactNode } from "react";
import { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { APP_NAME } from "@shopland/shared";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  DashboardIcon,
  PackageIcon,
  StoreIcon,
  TruckIcon,
  WalletIcon,
} from "../ui/icons";

const NAV_CONFIG = [
  { to: "/seller", labelKey: "seller.nav_overview" as const, icon: DashboardIcon, exact: true },
  { to: "/seller/products", labelKey: "seller.nav_products" as const, icon: StoreIcon, exact: false },
  { to: "/seller/inventory", labelKey: "seller.nav_inventory" as const, icon: PackageIcon, exact: false },
  { to: "/seller/orders", labelKey: "seller.nav_orders" as const, icon: ClipboardIcon, exact: false },
  { to: "/seller/earnings", labelKey: "seller.nav_earnings" as const, icon: WalletIcon, exact: false },
];

export default function SellerLayout({ children }: { children: ReactNode }) {
  const { t, dir, locale } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = useMemo(
    () => NAV_CONFIG.map((item) => ({ ...item, label: t(item.labelKey) })),
    [locale, t],
  );

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div dir={dir} className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb,#edf3f9)] text-[color:var(--text)] lg:flex">
      <aside
        className="flex shrink-0 flex-col border-b border-[color:var(--border)] bg-[rgba(255,255,255,0.85)] px-4 py-4 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r lg:px-4 lg:py-5"
        style={{
          boxShadow: "0 22px 60px rgba(23,32,51,0.08)",
        }}
      >
        <div className="hidden lg:block rounded-[1.75rem] bg-[linear-gradient(135deg,#172033,#243457)] p-4 text-white sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
              <StoreIcon size={20} />
            </div>
            <div>
              <div className="text-lg font-bold" style={{ fontFamily: "var(--heading)" }}>
                {APP_NAME}
              </div>
              <div className="text-xs uppercase tracking-[0.16em] text-white/65">
                {t("seller.hub_subtitle")}
              </div>
            </div>
          </div>
          <p className="text-sm text-white/76">
            {t("seller.sidebar_blurb")}
          </p>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto py-5 lg:mx-0 lg:flex-1 lg:flex-col lg:overflow-visible lg:py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all lg:min-w-0 ${
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

        <div className="hidden lg:block rounded-[1.5rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_16px_40px_rgba(23,32,51,0.05)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <TruckIcon size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[color:var(--text-h)]">
                {user?.first_name || t("seller.account_fallback")}
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
            {t("seller.back_to_store")}
          </Link>
          <button
            onClick={() => { void handleLogout(); }}
            className="block w-full rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-left text-sm font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
          >
            {t("nav.signout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 rounded-[1.75rem] border border-[color:var(--border)] bg-white px-4 py-4 shadow-[0_18px_50px_rgba(23,32,51,0.05)] sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  {t("seller.topbar_badge")}
                </div>
                <div className="text-lg font-bold text-[color:var(--text-h)] sm:text-xl" style={{ fontFamily: "var(--heading)" }}>
                  {t("seller.topbar_title")}
                </div>
              </div>
              <Link
                to="/seller/products/new"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,106,61,0.22)] sm:w-auto"
              >
                {t("seller.add_product")}
              </Link>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
