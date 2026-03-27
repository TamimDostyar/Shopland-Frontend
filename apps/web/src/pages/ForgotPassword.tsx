import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { requestPasswordResetViaGoogle, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Alert from "../components/ui/Alert";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleSuccess(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) return;
    setError("");
    setLoading(true);
    try {
      const { reset_token } = await requestPasswordResetViaGoogle(credentialResponse.credential);
      navigate(`/reset-password?token=${encodeURIComponent(reset_token)}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not verify your Google account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title={t("forgot.title")}
      subtitle={t("forgot.subtitle")}
      backTo="/login"
      backLabel={t("forgot.back")}
    >
      <div className="flex flex-col gap-4">
        {error && <Alert kind="error">{error}</Alert>}

        <p className="text-sm text-[color:var(--text-soft)]">
          {t("forgot.subtitle")}
        </p>

        <div className={`flex justify-center transition-opacity ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          <GoogleLogin
            onSuccess={(resp) => { void handleGoogleSuccess(resp); }}
            onError={() => setError(t("login.error_google"))}
            useOneTap={false}
            shape="pill"
            text="signin_with"
          />
        </div>

        <p className="text-center text-sm text-muted">
          {t("forgot.remembered")}{" "}
          <Link to="/login" className="text-accent hover:underline">
            {t("forgot.signin")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
