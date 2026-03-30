import { useCallback, useEffect, useState } from "react";
import {
  listPendingSelfies,
  approveSelfie,
  rejectSelfie,
  ApiError,
  type AdminUser,
} from "@amazebid/shared";
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
      setUsers(await listPendingSelfies(accessToken));
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
      await approveSelfie(accessToken, user.id);
      setActionMsg(`✓ ${user.first_name} ${user.last_name} — ${t("admin.msg_id_verified")}`);
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
      await rejectSelfie(accessToken, rejectTarget.id, rejectReason);
      setActionMsg(`✗ ${rejectTarget.first_name} ${rejectTarget.last_name} — ${t("admin.msg_rejected")}`);
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
          {t("admin.id_review_title")}
        </h1>

        {actionMsg && <Alert kind="success" className="mb-4">{actionMsg}</Alert>}
        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted text-sm py-8">{t("admin.no_pending_ids")}</p>
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
            <h2 className="text-lg font-bold text-heading mb-1">{t("admin.reject_id_title")}</h2>
            <p className="text-sm text-muted mb-4">
              {t("admin.reject_id_desc_prefix")} <strong className="text-text">{rejectTarget.first_name} {rejectTarget.last_name}</strong>.{" "}
              {t("admin.reject_id_desc_suffix")}
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t("admin.reject_id_placeholder")}
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
                {t("admin.confirm_rejection")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex-1"
              >
                {t("common.cancel")}
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
  const { t } = useLanguage();
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
          {user.date_of_birth && (
            <span>DOB: <span className="text-text">{user.date_of_birth}</span></span>
          )}
          <span className="capitalize bg-yellow-500/10 text-yellow-400 font-semibold px-2.5 py-0.5 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {/* Selfie */}
      <div className="mb-5">
        <DocImage label={t("admin.selfie_label")} src={user.profile_photo} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button size="sm" onClick={onApprove} loading={acting}>
          {t("admin.verify_id")}
        </Button>
        <Button size="sm" variant="danger" onClick={onReject} disabled={acting}>
          {t("admin.reject_resubmit")}
        </Button>
      </div>
    </div>
  );
}

function DocImage({ label, src }: { label: string; src: string | null | undefined }) {
  const { t } = useLanguage();
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
          <p className="text-xs text-accent mt-1 text-center">{t("admin.click_full_size")}</p>
        </a>
      ) : (
        <div className="w-full aspect-[4/3] rounded-xl border border-border bg-bg flex items-center justify-center">
          <span className="text-xs text-muted">{t("admin.no_image")}</span>
        </div>
      )}
    </div>
  );
}
