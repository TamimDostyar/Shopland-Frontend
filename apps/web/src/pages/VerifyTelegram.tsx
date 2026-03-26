import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPhone, getTelegramLink, resendPhoneCode, ApiError } from "@shopland/shared";
import AuthLayout from "../components/layout/AuthLayout";
import OtpInput from "../components/forms/OtpInput";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";

const RESEND_COOLDOWN = 60;

export default function VerifyTelegram() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, refreshUser } = useAuth();

  const phoneNumber: string =
    (location.state as { phone_number?: string })?.phone_number ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [telegramLink, setTelegramLink] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = useCallback(() => setCooldown(RESEND_COOLDOWN), []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Fetch the Telegram bot deep link on mount
  useEffect(() => {
    if (!accessToken) return;
    setLinkLoading(true);
    getTelegramLink(accessToken)
      .then((data) => setTelegramLink(data.link))
      .catch(() => {/* already verified or error — silently ignore */})
      .finally(() => setLinkLoading(false));
  }, [accessToken]);

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
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!accessToken) return;
    setResendLoading(true);
    setError("");
    try {
      const res = await resendPhoneCode(accessToken) as { detail: string; telegram_link?: string };
      if (res.telegram_link) {
        setTelegramLink(res.telegram_link);
      }
      startCooldown();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code.");
    } finally {
      setResendLoading(false);
    }
  }

  async function handleGetNewLink() {
    if (!accessToken) return;
    setLinkLoading(true);
    setError("");
    try {
      const data = await getTelegramLink(accessToken);
      setTelegramLink(data.link);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not generate link.");
    } finally {
      setLinkLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Verify via Telegram"
      subtitle="Open our Telegram bot to receive your verification code"
      backTo="/profile"
      backLabel="Back to Profile"
    >
      <div className="flex flex-col gap-5">
        {success && <Alert kind="success">Verified! Redirecting…</Alert>}
        {error && <Alert kind="error">{error}</Alert>}

        {/* Step 1: Telegram bot link */}
        <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface-muted)] p-4">
          <p className="mb-3 text-sm font-semibold" style={{ color: "var(--text-h)" }}>
            Step 1 — Open the bot
          </p>
          <p className="mb-3 text-sm" style={{ color: "var(--text-soft)" }}>
            Tap the button below. The bot will send your 6-digit verification code instantly.
          </p>
          {telegramLink ? (
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.375l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.963.184z" />
              </svg>
              Open Shopland Bot on Telegram
            </a>
          ) : (
            <Button
              onClick={() => { void handleGetNewLink(); }}
              loading={linkLoading}
              variant="ghost"
              className="w-full"
            >
              {linkLoading ? "Generating link…" : "Get Telegram bot link"}
            </Button>
          )}
          {telegramLink && (
            <button
              onClick={() => { void handleGetNewLink(); }}
              disabled={linkLoading}
              className="mt-2 w-full text-center text-xs text-[color:var(--text-soft)] hover:text-[color:var(--accent)] disabled:opacity-50"
            >
              {linkLoading ? "Refreshing…" : "Get a new link"}
            </button>
          )}
        </div>

        {/* Step 2: Enter OTP */}
        <div>
          <p className="mb-3 text-sm font-semibold" style={{ color: "var(--text-h)" }}>
            Step 2 — Enter the code from Telegram
          </p>
          <OtpInput value={code} onChange={setCode} />
        </div>

        <Button
          onClick={() => { void handleVerify(); }}
          loading={loading}
          disabled={code.length < 6 || success}
          className="w-full"
        >
          Verify
        </Button>

        <div className="text-center text-sm" style={{ color: "var(--text-soft)" }}>
          Didn&apos;t receive it?{" "}
          {cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <button
              onClick={() => { void handleResend(); }}
              disabled={resendLoading}
              className="text-[color:var(--accent)] hover:underline disabled:opacity-50"
            >
              {resendLoading ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
