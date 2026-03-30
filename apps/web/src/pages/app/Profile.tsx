import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, ApiError } from "@amazebid/shared";
import MainLayout from "../../components/layout/MainLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

export default function Profile() {
  const { t } = useLanguage();
  const { user, setTokensAndUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [emailVerifyError, setEmailVerifyError] = useState("");
  const [emailVerifySuccess, setEmailVerifySuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => { void refreshUser(); }, 30_000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  if (!user) return null;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  const { verification_status: vs } = user;

  async function handleGoogleVerify(credential: string) {
    setEmailVerifyError("");
    try {
      const res = await googleAuth(credential);
      await setTokensAndUser(res.access, res.refresh, res.user);
      await refreshUser();
      setEmailVerifySuccess(true);
    } catch (err) {
      setEmailVerifyError(err instanceof ApiError ? err.message : t("profile.google_verify_api_error"));
    }
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BackButton to="/" label={t("profile.back")} className="mb-5" />

        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {t("profile.title")}
        </h1>

        {/* Verification banners */}
        <div className="flex flex-col gap-3 mb-6">
          {!vs.email && (
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/8 px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
              <p className="font-semibold mb-2" style={{ color: "var(--text-h)" }}>
                {t("profile.email_not_verified")}
              </p>
              {emailVerifySuccess ? (
                <p className="text-green-400 font-medium">{t("profile.email_verified")}</p>
              ) : (
                <>
                  <p className="mb-3" style={{ color: "var(--text-soft)" }}>
                    {t("profile.google_verify_p1")} <strong>{user.email}</strong> {t("profile.google_verify_p2")}
                  </p>
                  {emailVerifyError && (
                    <p className="mb-2 text-red-400 text-xs">{emailVerifyError}</p>
                  )}
                  <GoogleLogin
                    onSuccess={(resp) => { if (resp.credential) void handleGoogleVerify(resp.credential); }}
                    onError={() => setEmailVerifyError(t("profile.google_failed"))}
                    text="signin_with"
                    shape="pill"
                    size="medium"
                  />
                </>
              )}
            </div>
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

        {/* Info card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-4 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="size-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)" }}
            >
              {user.first_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--text-h)" }}>
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm capitalize" style={{ color: "var(--text-soft)" }}>
                {user.role}
              </p>
            </div>
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <InfoRow label={t("profile.email")} value={user.email} />
            <InfoRow label={t("profile.phone")} value={user.phone_number ?? "—"} />
            <InfoRow label={t("profile.fathers_name")} value={user.father_name} />
            <InfoRow label={t("profile.dob")} value={user.date_of_birth ?? "—"} />
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          <div className="flex gap-3 flex-wrap">
            <VerBadge label={t("profile.badge_phone")} ok={vs.phone} />
            <VerBadge label={t("profile.badge_email")} ok={vs.email} />
            <VerBadge label={t("profile.badge_id")} ok={vs.id} />
            {user.role === "seller" && (
              <VerBadge label={t("profile.badge_seller")} ok={vs.seller_approved ?? false} />
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => navigate("/profile/addresses")}>
            {t("profile.manage_addresses")}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            {t("profile.my_orders")}
          </Button>
          {(user.role === "seller") && (
            <Button variant="ghost" onClick={() => navigate("/seller")}>
              {t("profile.seller_dashboard")}
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-soft)" }}>{label}</p>
      <p style={{ color: "var(--text)" }}>{value}</p>
    </div>
  );
}

function VerBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: ok ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
        color: ok ? "#4ade80" : "var(--text-soft)",
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: ok ? "#4ade80" : "var(--text-soft)" }}
      />
      {label}
    </span>
  );
}
