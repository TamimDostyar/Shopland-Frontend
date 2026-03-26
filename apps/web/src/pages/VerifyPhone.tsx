import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPhone, resendPhoneCode, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import OtpInput from "../components/forms/OtpInput";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

const RESEND_COOLDOWN = 60;

export default function VerifyPhone() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const phoneNumber: string = (location.state as { phone_number?: string })?.phone_number ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = useCallback(() => {
    setCooldown(RESEND_COOLDOWN);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleVerify() {
    if (code.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyPhone(phoneNumber, code);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => navigate("/app/profile"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendLoading(true);
    setError("");
    try {
      await resendPhoneCode(phoneNumber);
      startCooldown();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Verify your phone"
      subtitle={phoneNumber ? `We sent a 6-digit code to ${phoneNumber}` : "Enter the code sent to your phone"}
      backTo="/app/profile"
      backLabel="Back to Profile"
    >
      <div className="flex flex-col gap-5">
        {success && (
          <Alert kind="success">Phone verified! Redirecting…</Alert>
        )}

        {error && <Alert kind="error">{error}</Alert>}

        <OtpInput value={code} onChange={setCode} />

        <Button
          onClick={() => { void handleVerify(); }}
          loading={loading}
          disabled={code.length < 6 || success}
          className="w-full"
        >
          Verify
        </Button>

        <div className="text-center text-sm text-muted">
          Didn't receive it?{" "}
          {cooldown > 0 ? (
            <span className="text-muted">Resend in {cooldown}s</span>
          ) : (
            <button
              onClick={() => { void handleResend(); }}
              disabled={resendLoading}
              className="text-accent hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
