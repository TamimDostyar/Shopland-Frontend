import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendEmailVerification, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken, refreshUser, isAuthenticated } = useAuth();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    if (!token) return;
    setStatus("loading");
    void (async () => {
      try {
        await verifyEmail(token);
        await refreshUser();
        setStatus("success");
        setTimeout(() => navigate("/app/profile"), 1500);
      } catch (err) {
        setMessage(err instanceof ApiError ? err.message : "Verification failed.");
        setStatus("error");
      }
    })();
  }, [token, navigate, refreshUser]);

  async function handleResend() {
    if (!accessToken) return;
    setResendLoading(true);
    try {
      await resendEmailVerification(accessToken);
      setResendSent(true);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Could not resend.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthLayout title="Email Verification" backTo="/app/profile" backLabel="Back to Profile">
      <div className="flex flex-col gap-4">
        {status === "loading" && (
          <div className="flex justify-center py-8">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === "success" && (
          <Alert kind="success">Email verified successfully! Redirecting…</Alert>
        )}

        {status === "error" && (
          <>
            <Alert kind="error">{message}</Alert>
            {isAuthenticated && !resendSent && (
              <Button
                variant="ghost"
                onClick={() => { void handleResend(); }}
                loading={resendLoading}
                className="w-full"
              >
                Resend verification email
              </Button>
            )}
            {resendSent && (
              <Alert kind="success">Verification email sent. Check your inbox.</Alert>
            )}
          </>
        )}

        {!token && (
          <div className="text-center text-muted text-sm py-4">
            <p>No verification token found.</p>
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { void handleResend(); }}
                  loading={resendLoading}
                  className="mt-4"
                >
                  Send verification email
                </Button>
                {resendSent && (
                  <Alert kind="success" className="mt-3">
                    Verification email sent. Check your inbox.
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
