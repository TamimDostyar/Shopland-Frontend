import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { confirmPasswordReset, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <AuthLayout title="Reset password">
        <Alert kind="error">
          Invalid or missing reset token.{" "}
          <Link to="/forgot-password" className="underline">
            Request a new link
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
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await confirmPasswordReset(token, newPassword, confirmPassword);
      navigate("/login", { state: { passwordReset: true }, replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter your new password below">
      <form onSubmit={(e) => { void handleSubmit(e); }} className="flex flex-col gap-4">
        {error && <Alert kind="error">{error}</Alert>}

        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
