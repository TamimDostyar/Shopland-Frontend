import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { ApiError, googleAuth } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { isGmailAddress } from "../utils/email";

export default function Login() {
  const { login, setTokensAndUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const passwordReset = (location.state as { passwordReset?: boolean } | null)?.passwordReset;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isGmailAddress(email)) {
      setError(t("login.error_gmail"));
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("login.error_failed"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) return;
    setError("");
    setLoading(true);
    try {
      const res = await googleAuth(credentialResponse.credential);
      await setTokensAndUser(res.access, res.refresh, res.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("login.error_google"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("login.title")} subtitle={t("login.subtitle")} backTo="/" backLabel={t("login.back_home")}>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
        {passwordReset && <Alert kind="success">{t("login.password_reset_success")}</Alert>}
        {error && <Alert kind="error">{error}</Alert>}

        <Input
          label={t("login.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="yourname@gmail.com"
          required
        />

        <div className="flex flex-col gap-1">
          <Input
            label={t("login.password")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-[color:var(--text-soft)] hover:underline">
              {t("login.forgot_password")}
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          {t("login.submit")}
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 border-t border-[color:var(--border)]" />
          <span className="text-xs text-[color:var(--text-soft)]">{t("login.or")}</span>
          <div className="flex-1 border-t border-[color:var(--border)]" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(resp) => { void handleGoogleSuccess(resp); }}
            onError={() => setError(t("login.error_google"))}
            useOneTap={false}
            shape="pill"
            text="signin_with"
          />
        </div>

        <div className="rounded-[1.4rem] bg-[var(--surface-muted)] px-4 py-3 text-xs text-[color:var(--text-soft)]">
          {t("login.gmail_note")}
        </div>

        <p className="text-center text-sm text-muted">
          {t("login.no_account")}{" "}
          <Link to="/register" className="text-accent hover:underline">
            {t("login.register")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
