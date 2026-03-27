import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { ArrowRightIcon, ShieldIcon, StoreIcon, UserIcon } from "../components/ui/icons";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
  const { t } = useLanguage();
  return (
    <AuthLayout title={t("register.title")} subtitle={t("register.subtitle")}>
      <div className="flex flex-col gap-4">
        <Link
          to="/register/buyer"
          className="group flex gap-4 p-5 rounded-[1.5rem] border border-border bg-white hover:border-accent transition-colors shadow-[0_14px_34px_rgba(23,32,51,0.05)]"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <UserIcon size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
                {t("register.buyer")}
              </span>
              <ArrowRightIcon size={16} className="text-[color:var(--text-soft)] group-hover:text-[color:var(--accent)]" />
            </div>
            <span className="mt-1 block text-sm text-muted">
              {t("register.buyer_desc")}
            </span>
          </div>
        </Link>

        <Link
          to="/register/seller"
          className="group flex gap-4 p-5 rounded-[1.5rem] border border-border bg-white hover:border-accent transition-colors shadow-[0_14px_34px_rgba(23,32,51,0.05)]"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <StoreIcon size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
                {t("register.seller")}
              </span>
              <ArrowRightIcon size={16} className="text-[color:var(--text-soft)] group-hover:text-[color:var(--accent)]" />
            </div>
            <span className="mt-1 block text-sm text-muted">
              {t("register.seller_desc")}
            </span>
          </div>
        </Link>

        <div className="rounded-[1.5rem] bg-[var(--surface-muted)] p-4 text-sm text-[color:var(--text-soft)]">
          <div className="mb-1 inline-flex items-center gap-2 font-semibold text-[color:var(--text-h)]">
            <ShieldIcon size={16} className="text-[color:var(--accent)]" />
            {t("register.account_verification")}
          </div>
          {t("register.verification_desc")}
        </div>

        <p className="text-center text-sm text-muted mt-2">
          {t("register.have_account")}{" "}
          <Link to="/login" className="text-accent hover:underline">
            {t("register.signin")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
