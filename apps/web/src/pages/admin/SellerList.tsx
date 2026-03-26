import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  listSellers,
  approveSeller,
  rejectSeller,
  ApiError,
  type AdminSeller,
  type SellerStatus,
} from "@shopland/shared";
import AdminLayout from "../../components/layout/AdminLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const STATUS_LABELS: Record<SellerStatus, string> = {
  pending: "Pending Applications",
  approved: "Approved Sellers",
  rejected: "Rejected / Needs More Data",
};

export default function SellerList() {
  const { status = "pending" } = useParams<{ status: SellerStatus }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [sellers, setSellers] = useState<AdminSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState<AdminSeller | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    setActionMsg("");
    try {
      const data = await listSellers(accessToken, status as SellerStatus);
      setSellers(data);
    } catch {
      setError("Failed to load sellers.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, status]);

  useEffect(() => { void load(); }, [load]);

  async function handleApprove(seller: AdminSeller) {
    if (!accessToken) return;
    setActing(true);
    try {
      await approveSeller(accessToken, seller.user.id);
      setActionMsg(`✓ ${seller.shop_name} approved.`);
      setSellers((prev) => prev.filter((s) => s.user.id !== seller.user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setActing(false);
    }
  }

  async function handleRejectConfirm() {
    if (!accessToken || !rejectTarget || !rejectReason.trim()) return;
    setActing(true);
    try {
      await rejectSeller(accessToken, rejectTarget.user.id, rejectReason);
      setActionMsg(`✗ ${rejectTarget.shop_name} rejected.`);
      setSellers((prev) =>
        prev.filter((s) => s.user.id !== rejectTarget.user.id),
      );
      setRejectTarget(null);
      setRejectReason("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Action failed.");
    } finally {
      setActing(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-heading mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          {STATUS_LABELS[status as SellerStatus] ?? "Sellers"}
        </h1>

        {actionMsg && (
          <Alert kind="success" className="mb-4">{actionMsg}</Alert>
        )}
        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sellers.length === 0 ? (
          <p className="text-muted text-sm py-8">No sellers in this category.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sellers.map((seller) => (
              <SellerCard
                key={seller.user.id}
                seller={seller}
                status={status as SellerStatus}
                onView={() => navigate(`/admin/sellers/detail/${seller.user.id}`)}
                onApprove={() => { void handleApprove(seller); }}
                onReject={() => setRejectTarget(seller)}
                acting={acting}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-heading mb-1">Reject application</h2>
            <p className="text-sm text-muted mb-4">
              Rejecting <strong className="text-text">{rejectTarget.shop_name}</strong>.
              The seller will receive this reason by email.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain what's missing or incorrect…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => { void handleRejectConfirm(); }}
                loading={acting}
                disabled={!rejectReason.trim()}
                className="flex-1"
              >
                Confirm rejection
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function SellerCard({
  seller,
  status,
  onView,
  onApprove,
  onReject,
  acting,
}: {
  seller: AdminSeller;
  status: SellerStatus;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  acting: boolean;
}) {
  const { user } = seller;
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex gap-5">
      {/* Selfie thumbnail */}
      <div className="shrink-0">
        {user.profile_photo ? (
          <img
            src={user.profile_photo}
            alt="selfie"
            className="size-14 rounded-xl object-cover"
          />
        ) : (
          <div className="size-14 rounded-xl bg-accent/10 flex items-center justify-center text-xl font-bold text-accent">
            {user.first_name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-heading text-base">{seller.shop_name}</p>
            <p className="text-sm text-muted">{seller.shop_category}</p>
          </div>
          <StatusBadge status={status} rejectionReason={seller.rejection_reason} />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <Pair label="Owner" value={`${user.first_name} ${user.last_name}`} />
          <Pair label="Email" value={user.email} />
          <Pair label="Phone" value={user.phone_number ?? "—"} />
          <Pair label="Business phone" value={seller.business_phone} />
          <Pair label="City" value={seller.shop_address_city} />
          <Pair label="Applied" value={new Date(seller.created_at).toLocaleDateString()} />
        </div>

        {seller.rejection_reason && (
          <p className="mt-2 text-xs text-error bg-error/5 rounded-lg px-3 py-2">
            Reason: {seller.rejection_reason}
          </p>
        )}

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button size="sm" variant="ghost" onClick={onView}>
            View details & documents →
          </Button>
          {status !== "approved" && (
            <Button size="sm" onClick={onApprove} loading={acting}>
              Approve
            </Button>
          )}
          {status !== "rejected" && (
            <Button size="sm" variant="danger" onClick={onReject} disabled={acting}>
              Reject / needs data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, rejectionReason }: { status: SellerStatus; rejectionReason: string }) {
  if (status === "approved")
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success">Approved</span>;
  if (status === "rejected" || rejectionReason)
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-error/10 text-error">Needs data</span>;
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400">Pending</span>;
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted">{label}: </span>
      <span className="text-text">{value}</span>
    </div>
  );
}
