import { useCallback, useEffect, useState } from "react";
import {
  listPendingIds,
  approveUserId,
  rejectUserId,
  ApiError,
  type AdminUser,
} from "@shopland/shared";
import AdminLayout from "../../components/layout/AdminLayout";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

export default function IDReview() {
  const { t } = useLanguage();
  const { accessToken } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  // Reject modal state
  const [rejectTarget, setRejectTarget] = useState<AdminUser | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      setUsers(await listPendingIds(accessToken));
    } catch {
      setError(t("admin.error_load_id_queue"));
    } finally {
      setLoading(false);
    }
  }, [accessToken, t]);

  useEffect(() => { void load(); }, [load]);

  async function handleApprove(user: AdminUser) {
    if (!accessToken) return;
    setActing(true);
    try {
      await approveUserId(accessToken, user.id);
      setActionMsg(`✓ ${user.first_name} ${user.last_name}'s ID verified.`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin.action_failed"));
    } finally {
      setActing(false);
    }
  }

  async function handleRejectConfirm() {
    if (!accessToken || !rejectTarget || !rejectReason.trim()) return;
    setActing(true);
    try {
      await rejectUserId(accessToken, rejectTarget.id, rejectReason);
      setActionMsg(`✗ ${rejectTarget.first_name} ${rejectTarget.last_name}'s ID rejected.`);
      setUsers((prev) => prev.filter((u) => u.id !== rejectTarget.id));
      setRejectTarget(null);
      setRejectReason("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin.action_failed"));
    } finally {
      setActing(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-heading mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          ID Review Queue
        </h1>

        {actionMsg && <Alert kind="success" className="mb-4">{actionMsg}</Alert>}
        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted text-sm py-8">No pending ID verifications.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                acting={acting}
                onApprove={() => { void handleApprove(user); }}
                onReject={() => setRejectTarget(user)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-heading mb-1">Reject ID</h2>
            <p className="text-sm text-muted mb-4">
              Rejecting <strong className="text-text">{rejectTarget.first_name} {rejectTarget.last_name}</strong>.
              The user will need to resubmit their documents.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain what's wrong (e.g. photo is blurry, ID is expired)…"
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

function UserCard({
  user,
  acting,
  onApprove,
  onReject,
}: {
  user: AdminUser;
  acting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="font-semibold text-heading text-base">
            {user.first_name} {user.last_name}
            {user.father_name ? <span className="text-muted font-normal"> / {user.father_name}</span> : null}
          </p>
          <p className="text-sm text-muted">{user.email}</p>
          {user.phone_number && <p className="text-sm text-muted">{user.phone_number}</p>}
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-muted">
          {user.national_id && (
            <span>NID: <span className="text-text">{user.national_id}</span></span>
          )}
          {user.date_of_birth && (
            <span>DOB: <span className="text-text">{user.date_of_birth}</span></span>
          )}
          <span className="capitalize bg-yellow-500/10 text-yellow-400 font-semibold px-2.5 py-0.5 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {/* Photos */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <DocImage label="Selfie / Profile photo" src={user.profile_photo} />
        <DocImage label="National ID photo" src={user.national_id_photo} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button size="sm" onClick={onApprove} loading={acting}>
          Verify ID
        </Button>
        <Button size="sm" variant="danger" onClick={onReject} disabled={acting}>
          Reject / needs resubmission
        </Button>
      </div>
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
        <div className="w-full aspect-[4/3] rounded-xl border border-border bg-bg flex items-center justify-center">
          <span className="text-xs text-muted">No image</span>
        </div>
      )}
    </div>
  );
}
