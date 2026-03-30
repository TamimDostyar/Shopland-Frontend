import type { ReactNode } from "react";
import { useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  ShieldIcon,
  UserIcon,
} from "../ui/icons";
import type { TranslationKey } from "@amazebid/shared";


interface Props {
  children: ReactNode;
}

const NAV_CONFIG: { to: string; labelKey: TranslationKey; icon: typeof PackageIcon }[] = [
  { to: "/admin/products", labelKey: "admin.nav_product_approvals", icon: PackageIcon },
  { to: "/admin/sellers/pending", labelKey: "admin.nav_pending_sellers", icon: ClockIcon },
  { to: "/admin/sellers/approved", labelKey: "admin.nav_approved_sellers", icon: CheckCircleIcon },
  { to: "/admin/sellers/rejected", labelKey: "admin.nav_rejected_sellers", icon: UserIcon },
  { to: "/admin/id-review", labelKey: "admin.nav_id_review", icon: ShieldIcon },
];

export default function AdminLayout({ children }: Props) {
  const { t, dir, locale } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nav = useMemo(
    () => NAV_CONFIG.map((item) => ({ ...item, label: t(item.labelKey) })),
    [locale, t],
  );

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div dir={dir} className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb,#edf3f9)] lg:flex">
      <aside className="flex shrink-0 flex-col border-b border-[color:var(--border)] bg-[rgba(255,255,255,0.88)] px-4 py-4 backdrop-blur-xl lg:w-72 lg:border-b-0 lg:border-r lg:py-6">
        {/* Brand card — desktop only */}
        <div className="hidden lg:block rounded-[1.75rem] bg-[linear-gradient(135deg,#172033,#243457)] p-5 text-white">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/16"
          >
            <ArrowLeftIcon size={14} />
            {t("common.back")}
          </button>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            {t("admin.panel_badge")}
          </p>
          <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            {t("admin.control_title")}
          </p>
          <p className="mt-3 text-sm text-white/72">
            {t("admin.control_subtitle")}
          </p>
        </div>

        {/* Mobile back button — shown only on mobile */}
        <div className="flex items-center gap-3 lg:hidden mb-1">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[color:var(--text)] shadow-sm"
          >
            <ArrowLeftIcon size={13} />
            {t("common.back")}
          </button>
          <span className="text-sm font-bold text-[color:var(--text-h)]">{t("admin.control_title")}</span>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-1 lg:flex-col lg:overflow-visible lg:py-6">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-w-fit items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors lg:min-w-0 lg:gap-3 lg:px-4 lg:py-3 ${
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

        {/* Account section — desktop only */}
        <div className="hidden lg:block lg:mt-auto rounded-[1.5rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_16px_40px_rgba(23,32,51,0.05)]">
          <div className="mb-3 text-sm font-semibold text-[color:var(--text-h)]">{t("admin.signed_in")}</div>
          <p className="mb-3 truncate text-xs text-[color:var(--text-soft)]">{user?.email}</p>
          <Link
            to="/"
            className="mb-2 flex w-full items-center gap-2 rounded-xl border border-[color:var(--border)] bg-white px-3 py-2 text-left text-sm font-semibold text-[color:var(--text-h)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <ArrowLeftIcon size={14} />
            {t("login.back_home")}
          </Link>
          <button
            onClick={() => { void handleLogout(); }}
            className="w-full rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-left text-sm font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
          >
            {t("nav.signout")}
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
