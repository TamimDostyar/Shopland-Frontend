import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { confirmPasswordReset, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useLanguage } from "../context/LanguageContext";

export default function ResetPassword() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <AuthLayout title={t("reset.title")}>
        <Alert kind="error">
          {t("reset.invalid_token")}{" "}
          <Link to="/forgot-password" className="underline">
            {t("reset.request_new")}
          </Link>
          .
        </Alert>
      </AuthLayout>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError(t("reset.error_mismatch"));
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword, confirmPassword);
      navigate("/login", { state: { passwordReset: true }, replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("reset.error_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t("reset.title")} subtitle={t("reset.subtitle")}>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
        {error && <Alert kind="error">{error}</Alert>}

        <Input
          label={t("reset.new_password")}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Input
          label={t("reset.confirm_password")}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          {t("reset.submit")}
        </Button>
      </form>
    </AuthLayout>
  );
}
