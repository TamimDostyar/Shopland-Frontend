import { Navigate, useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  if (user.role === "admin") return <Navigate to="/admin" replace />;

  const { verification_status: vs } = user;

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
          {!vs.phone && (
            <Alert kind="warning">
              Phone not verified.{" "}
              <button
                onClick={() => navigate("/verify-phone", { state: { phone_number: user.phone_number ?? "" } })}
                className="underline font-medium"
              >
                Verify now
              </button>
            </Alert>
          )}
          {!vs.email && (
            <Alert kind="warning">
              Email not verified.{" "}
              <button
                onClick={() => navigate("/verify-email")}
                className="underline font-medium"
              >
                Verify / resend email
              </button>
            </Alert>
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
