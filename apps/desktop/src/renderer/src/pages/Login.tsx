import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const passwordReset = (location.state as { passwordReset?: boolean } | null)?.passwordReset;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/app/profile", { replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app/profile", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("login.error_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("login.title")} subtitle={t("login.subtitle")}>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
        {passwordReset && <Alert kind="success">{t("login.password_reset_success")}</Alert>}
        {error && <Alert kind="error">{error}</Alert>}

        <Input
          label={t("login.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
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
