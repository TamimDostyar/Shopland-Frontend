import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useLanguage } from "../context/LanguageContext";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("forgot.error_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("forgot.title")} subtitle={t("forgot.subtitle")}>
      {sent ? (
        <Alert kind="success">{t("forgot.success")}</Alert>
      ) : (
        <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
          {error && <Alert kind="error">{error}</Alert>}

          <Input
            label={t("forgot.email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            {t("forgot.submit")}
          </Button>

          <p className="text-center text-sm text-muted">
            {t("forgot.remembered")}{" "}
            <Link to="/login" className="text-accent hover:underline">
              {t("forgot.signin")}
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
