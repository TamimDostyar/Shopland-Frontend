import { Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
  const { t } = useLanguage();

  return (
    <AuthLayout title={t("register.title")} subtitle={t("register.subtitle")}>
      <div className="flex flex-col gap-4">
        <Link
          to="/register/buyer"
          className="group flex flex-col gap-1 p-5 rounded-xl border border-border bg-surface hover:border-accent transition-colors"
        >
          <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
            {t("register.buyer")}
          </span>
          <span className="text-sm text-muted">
            {t("register.buyer_desc")}
          </span>
        </Link>

        <Link
          to="/register/seller"
          className="group flex flex-col gap-1 p-5 rounded-xl border border-border bg-surface hover:border-accent transition-colors"
        >
          <span className="text-base font-semibold text-heading group-hover:text-accent transition-colors">
            {t("register.seller")}
          </span>
          <span className="text-sm text-muted">
            {t("register.seller_desc")}
          </span>
        </Link>

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
