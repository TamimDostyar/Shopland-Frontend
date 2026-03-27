import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSeller,
  approveSeller,
  rejectSeller,
  ApiError,
  type AdminSeller,
} from "@shopland/shared";
import AdminLayout from "../../components/layout/AdminLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

export default function SellerDetail() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [seller, setSeller] = useState<AdminSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken || !id) return;
    try {
      setSeller(await getSeller(accessToken, id));
    } catch {
      setError(t("admin.error_load_seller"));
    } finally {
      setLoading(false);
    }
  }, [accessToken, id, t]);

  useEffect(() => { void load(); }, [load]);

  async function handleApprove() {
    if (!accessToken || !seller) return;
    setActing(true);
    try {
      await approveSeller(accessToken, seller.user.id);
      setActionMsg(`${seller.shop_name} has been approved.`);
      setSeller((s) => s ? { ...s, is_approved: true, rejection_reason: "" } : s);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin.action_failed"));
    } finally {
      setActing(false);
    }
  }

  async function handleReject() {
    if (!accessToken || !seller || !rejectReason.trim()) return;
    setActing(true);
    try {
      await rejectSeller(accessToken, seller.user.id, rejectReason);
      setActionMsg(`${seller.shop_name} has been rejected.`);
      setSeller((s) =>
        s ? { ...s, is_approved: false, rejection_reason: rejectReason } : s,
      );
      setShowRejectForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin.action_failed"));
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-24">
          <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!seller) {
    return (
      <AdminLayout>
        <Alert kind="error">Seller not found.</Alert>
      </AdminLayout>
    );
  }

  const { user } = seller;
  const currentStatus = seller.is_approved
    ? "approved"
    : seller.rejection_reason
    ? "rejected"
    : "pending";

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted hover:text-accent mb-6 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
              {seller.shop_name}
            </h1>
            <p className="text-muted text-sm">{seller.shop_category} · Applied {new Date(seller.created_at).toLocaleDateString()}</p>
          </div>
          <StatusChip status={currentStatus} />
        </div>

        {actionMsg && <Alert kind="success" className="mb-4">{actionMsg}</Alert>}
        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {/* Action buttons */}
        {!seller.is_approved && (
          <div className="flex gap-3 mb-8">
            <Button onClick={() => { void handleApprove(); }} loading={acting}>
              Approve seller
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowRejectForm((v) => !v)}
              disabled={acting}
            >
              {showRejectForm ? "Cancel" : "Reject / needs data"}
            </Button>
          </div>
        )}

        {showRejectForm && (
          <div className="bg-surface border border-error/30 rounded-xl p-4 mb-6 flex flex-col gap-3">
            <p className="text-sm text-muted">Rejection reason (sent to seller by email):</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Business license photo is unclear, please resubmit."
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:border-error transition-colors resize-none text-sm"
            />
            <Button
              variant="danger"
              onClick={() => { void handleReject(); }}
              loading={acting}
              disabled={!rejectReason.trim()}
              size="sm"
            >
              Confirm rejection
            </Button>
          </div>
        )}

        {seller.rejection_reason && (
          <Alert kind="error" className="mb-6">
            <strong>Rejection reason:</strong> {seller.rejection_reason}
          </Alert>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Owner / personal */}
          <Section title="Owner details">
            <Row label="Full name" value={`${user.first_name} ${user.last_name}`} />
            <Row label="Father's name" value={user.father_name} />
            <Row label="Email" value={user.email} />
            <Row label="Phone" value={user.phone_number ?? "—"} />
            <Row label="National ID" value={user.national_id ?? "—"} />
            <Row label="Date of birth" value={user.date_of_birth ?? "—"} />
            <Row label="ID verified" value={user.is_id_verified ? "Yes ✓" : "No"} />
          </Section>

          {/* Shop */}
          <Section title="Shop details">
            <Row label="Shop name" value={seller.shop_name} />
            <Row label="Category" value={seller.shop_category} />
            <Row label="Business phone" value={seller.business_phone} />
            <Row label="Address" value={`${seller.shop_address_street}, ${seller.shop_address_district}`} />
            <Row label="City / Province" value={`${seller.shop_address_city}, ${seller.shop_address_province}`} />
            {seller.business_description && (
              <Row label="Description" value={seller.business_description} />
            )}
          </Section>
        </div>

        {/* Documents */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-heading mb-4">Documents & Photos</h2>
          <div className="grid grid-cols-3 gap-4">
            <DocImage label="Selfie / Profile photo" src={user.profile_photo} />
            <DocImage label="National ID" src={user.national_id_photo} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm text-text">{value}</span>
    </div>
  );
}

function DocImage({ label, src }: { label: string; src: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted font-medium">{label}</p>
      {src ? (
        <a href={src} target="_blank" rel="noreferrer" className="block">
          <img
            src={src}
            alt={label}
            className="w-full aspect-[4/3] object-cover rounded-xl border border-border hover:border-accent transition-colors cursor-zoom-in"
          />
          <p className="text-xs text-accent mt-1 text-center">Click to open full size</p>
        </a>
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl border border-border bg-surface flex items-center justify-center">
          <span className="text-xs text-muted">No image</span>
        </div>
      )}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-success/10 text-success",
    rejected: "bg-error/10 text-error",
    pending: "bg-yellow-500/10 text-yellow-400",
  };
  return (
    <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${map[status] ?? ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
