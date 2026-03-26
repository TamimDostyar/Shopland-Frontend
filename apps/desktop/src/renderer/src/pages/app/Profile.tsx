import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const { verification_status: vs } = user;

  return (
    <AppLayout>
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-heading mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          Profile
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
              ID verification is under review. You'll be notified once it's complete.
            </Alert>
          )}
          {user.role === "seller" && vs.seller_approved === false && (
            <Alert kind="info">
              Your seller application is pending approval. We'll review it shortly.
            </Alert>
          )}
        </div>

        {/* Info card */}
        <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
              {user.first_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-heading">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-muted capitalize">{user.role}</p>
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={user.phone_number ?? "—"} />
            <InfoRow label="Father's name" value={user.father_name} />
            <InfoRow label="Date of birth" value={user.date_of_birth ?? "—"} />
          </div>

          <hr className="border-border" />

          {/* Verification badges */}
          <div className="flex gap-3 flex-wrap">
            <Badge label="Phone" ok={vs.phone} />
            <Badge label="Email" ok={vs.email} />
            <Badge label="ID" ok={vs.id} />
            {user.role === "seller" && (
              <Badge label="Seller approved" ok={vs.seller_approved ?? false} />
            )}
          </div>
        </div>

        <div className="mt-4">
          <Button variant="ghost" onClick={() => navigate("/app/addresses")}>
            Manage addresses →
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted text-xs mb-0.5">{label}</p>
      <p className="text-text">{value}</p>
    </div>
  );
}

function Badge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        ok ? "bg-success/10 text-success" : "bg-border text-muted"
      }`}
    >
      <span className={`size-1.5 rounded-full ${ok ? "bg-success" : "bg-muted"}`} />
      {label}
    </span>
  );
}
