import { useNavigate } from "react-router-dom";
import type { TranslationKey } from "@shopland/shared";
import AppLayout from "../../components/layout/AppLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

function roleLabel(role: string, t: (key: TranslationKey) => string): string {
  if (role === "buyer") return t("register.buyer");
  if (role === "seller") return t("register.seller");
  return role;
}

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const { verification_status: vs } = user;

  return (
    <AppLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-heading mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          {t("profile.title")}
        </h1>

        <div className="flex flex-col gap-3 mb-6">
          {!vs.phone && (
            <Alert kind="warning">
              {t("profile.phone_not_verified")}{" "}
              <button
                onClick={() => navigate("/verify-phone", { state: { phone_number: user.phone_number ?? "" } })}
                className="underline font-medium"
              >
                {t("profile.verify_now")}
              </button>
            </Alert>
          )}
          {!vs.email && (
            <Alert kind="warning">
              {t("profile.email_not_verified")}{" "}
              <button
                onClick={() => navigate("/verify-email")}
                className="underline font-medium"
              >
                {t("profile.verify_email_action")}
              </button>
            </Alert>
          )}
          {!vs.id && (
            <Alert kind="info">
              {t("profile.id_under_review")}
            </Alert>
          )}
          {user.role === "seller" && vs.seller_approved === false && (
            <Alert kind="info">
              {t("profile.seller_pending")}
            </Alert>
          )}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
              {user.first_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-heading">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-muted capitalize">{roleLabel(user.role, t)}</p>
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <InfoRow label={t("profile.email")} value={user.email} />
            <InfoRow label={t("profile.phone")} value={user.phone_number ?? "—"} />
            <InfoRow label={t("profile.fathers_name")} value={user.father_name} />
            <InfoRow label={t("profile.dob")} value={user.date_of_birth ?? "—"} />
          </div>

          <hr className="border-border" />

          <div className="flex gap-3 flex-wrap">
            <Badge label={t("profile.badge_phone")} ok={vs.phone} />
            <Badge label={t("profile.badge_email")} ok={vs.email} />
            <Badge label={t("profile.badge_id")} ok={vs.id} />
            {user.role === "seller" && (
              <Badge label={t("profile.badge_seller")} ok={vs.seller_approved ?? false} />
            )}
          </div>
        </div>

        <div className="mt-4">
          <Button variant="ghost" onClick={() => navigate("/app/addresses")}>
            {t("profile.manage_addresses")}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted text-xs mb-0.5">{label}</p>
      <p className="text-text">{value}</p>
    </div>
  );
}

function Badge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        ok ? "bg-success/10 text-success" : "bg-border text-muted"
      }`}
    >
      <span className={`size-1.5 rounded-full ${ok ? "bg-success" : "bg-muted"}`} />
      {label}
    </span>
  );
}
