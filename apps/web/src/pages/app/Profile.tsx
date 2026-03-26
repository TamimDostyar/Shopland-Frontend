import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth, verifyPhone, resendPhoneCode, ApiError } from "@shopland/shared";
import MainLayout from "../../components/layout/MainLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import BackButton from "../../components/ui/BackButton";
import OtpInput from "../../components/forms/OtpInput";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user, accessToken, setTokensAndUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [emailVerifyError, setEmailVerifyError] = useState("");
  const [emailVerifySuccess, setEmailVerifySuccess] = useState(false);

  // Phone verification state
  const [codeSent, setCodeSent] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneVerifySuccess, setPhoneVerifySuccess] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const t = setTimeout(() => setPhoneCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phoneCooldown]);

  async function handleSendCode() {
    setPhoneLoading(true);
    setPhoneError("");
    try {
      await resendPhoneCode(accessToken!);
      setCodeSent(true);
      setPhoneCooldown(60);
    } catch (err) {
      setPhoneError(err instanceof ApiError ? err.message : "Failed to send code.");
    } finally {
      setPhoneLoading(false);
    }
  }

  async function handleVerifyPhone() {
    setPhoneLoading(true);
    setPhoneError("");
    try {
      await verifyPhone(user!.phone_number!, phoneCode);
      await refreshUser();
      setPhoneVerifySuccess(true);
    } catch (err) {
      setPhoneError(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setPhoneLoading(false);
    }
  }

  async function handleResendPhone() {
    setPhoneLoading(true);
    setPhoneError("");
    try {
      await resendPhoneCode(accessToken!);
      setPhoneCooldown(60);
    } catch (err) {
      setPhoneError(err instanceof ApiError ? err.message : "Failed to resend code.");
    } finally {
      setPhoneLoading(false);
    }
  }

  if (!user) return null;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  const { verification_status: vs } = user;

  async function handleGoogleVerify(credential: string) {
    setEmailVerifyError("");
    try {
      const res = await googleAuth(credential);
      await setTokensAndUser(res.access, res.refresh, res.user);
      await refreshUser();
      setEmailVerifySuccess(true);
    } catch (err) {
      setEmailVerifyError(err instanceof ApiError ? err.message : "Google verification failed.");
    }
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BackButton to="/" label="Back to Home" className="mb-5" />

        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          My Profile
        </h1>

        {/* Verification banners */}
        <div className="flex flex-col gap-3 mb-6">
          {!vs.phone && user.phone_number && (
            <div className="rounded-2xl border border-orange-400/30 bg-orange-400/8 px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
              <p className="font-semibold mb-2" style={{ color: "var(--text-h)" }}>Phone not verified</p>
              {phoneVerifySuccess ? (
                <p className="text-green-400 font-medium">Phone verified!</p>
              ) : !codeSent ? (
                <>
                  <p className="mb-3" style={{ color: "var(--text-soft)" }}>
                    Verify <strong>{user.phone_number}</strong> to complete your account setup.
                  </p>
                  {phoneError && <p className="mb-2 text-red-400 text-xs">{phoneError}</p>}
                  <Button size="sm" loading={phoneLoading} onClick={() => void handleSendCode()}>
                    Send verification code
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-3" style={{ color: "var(--text-soft)" }}>
                    Enter the 6-digit verification code.
                  </p>
                  <OtpInput value={phoneCode} onChange={setPhoneCode} error={phoneError} />
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <Button
                      size="sm"
                      loading={phoneLoading}
                      disabled={phoneCode.length < 6}
                      onClick={() => void handleVerifyPhone()}
                    >
                      Verify
                    </Button>
                    {phoneCooldown > 0 ? (
                      <span className="text-xs" style={{ color: "var(--text-soft)" }}>
                        Resend in {phoneCooldown}s
                      </span>
                    ) : (
                      <button
                        className="text-xs underline"
                        style={{ color: "var(--text-soft)" }}
                        onClick={() => void handleResendPhone()}
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {!vs.email && (
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/8 px-4 py-3 text-sm" style={{ color: "var(--text)" }}>
              <p className="font-semibold mb-2" style={{ color: "var(--text-h)" }}>
                Email not verified
              </p>
              {emailVerifySuccess ? (
                <p className="text-green-400 font-medium">Email verified!</p>
              ) : (
                <>
                  <p className="mb-3" style={{ color: "var(--text-soft)" }}>
                    Sign in with Google using <strong>{user.email}</strong> to verify your email instantly.
                  </p>
                  {emailVerifyError && (
                    <p className="mb-2 text-red-400 text-xs">{emailVerifyError}</p>
                  )}
                  <GoogleLogin
                    onSuccess={(resp) => { if (resp.credential) void handleGoogleVerify(resp.credential); }}
                    onError={() => setEmailVerifyError("Google sign-in failed.")}
                    text="signin_with"
                    shape="pill"
                    size="medium"
                  />
                </>
              )}
            </div>
          )}
          {!vs.id && (
            <Alert kind="info">
              ID verification is under review. You&apos;ll be notified once it&apos;s complete.
            </Alert>
          )}
          {user.role === "seller" && vs.seller_approved === false && (
            <Alert kind="info">
              Your seller application is pending approval. We&apos;ll review it shortly.
            </Alert>
          )}
        </div>

        {/* Info card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-4 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="size-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)" }}
            >
              {user.first_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--text-h)" }}>
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm capitalize" style={{ color: "var(--text-soft)" }}>
                {user.role}
              </p>
            </div>
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone_number ?? "—"} />
            <InfoRow label="Father's name" value={user.father_name} />
            <InfoRow label="Date of birth" value={user.date_of_birth ?? "—"} />
          </div>

          <hr style={{ borderColor: "var(--border)" }} />

          <div className="flex gap-3 flex-wrap">
            <VerBadge label="Phone" ok={vs.phone} />
            <VerBadge label="Email" ok={vs.email} />
            <VerBadge label="ID" ok={vs.id} />
            {user.role === "seller" && (
              <VerBadge label="Seller approved" ok={vs.seller_approved ?? false} />
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={() => navigate("/profile/addresses")}>
            Manage Addresses →
          </Button>
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            My Orders →
          </Button>
          {(user.role === "seller") && (
            <Button variant="ghost" onClick={() => navigate("/seller")}>
              Seller Dashboard →
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs mb-0.5" style={{ color: "var(--text-soft)" }}>{label}</p>
      <p style={{ color: "var(--text)" }}>{value}</p>
    </div>
  );
}

function VerBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        background: ok ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
        color: ok ? "#4ade80" : "var(--text-soft)",
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: ok ? "#4ade80" : "var(--text-soft)" }}
      />
      {label}
    </span>
  );
}
