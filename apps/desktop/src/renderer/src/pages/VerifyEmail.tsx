import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendEmailVerification, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

export default function VerifyEmail() {
  const { t } = useLanguage();
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
        setMessage(err instanceof ApiError ? err.message : t("verify_email.error_failed"));
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
      setMessage(err instanceof ApiError ? err.message : t("verify_email.error_resend"));
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <AuthLayout title={t("verify_email.title")}>
      <div className="flex flex-col gap-4">
        {status === "loading" && (
          <div className="flex justify-center py-8">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === "success" && (
          <Alert kind="success">{t("verify_email.success")}</Alert>
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
                {t("verify_email.resend")}
              </Button>
            )}
            {resendSent && (
              <Alert kind="success">{t("verify_email.sent_success")}</Alert>
            )}
          </>
        )}

        {!token && (
          <div className="text-center text-muted text-sm py-4">
            <p>{t("verify_email.error_no_token")}</p>
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => { void handleResend(); }}
                  loading={resendLoading}
                  className="mt-4"
                >
                  {t("verify_email.send")}
                </Button>
                {resendSent && (
                  <Alert kind="success" className="mt-3">
                    {t("verify_email.sent_success")}
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
