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
      setActionMsg(`✓ ${seller.shop_name} — ${t("admin.msg_approved")}`);
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
      setActionMsg(`✗ ${seller.shop_name} — ${t("admin.msg_rejected")}`);
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
        <Alert kind="error">{t("admin.seller_not_found")}</Alert>
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
          {t("admin.back")}
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-heading" style={{ fontFamily: "var(--font-heading)" }}>
              {seller.shop_name}
            </h1>
            <p className="text-muted text-sm">
              {seller.shop_category} · {t("admin.applied_on")} {new Date(seller.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusChip status={currentStatus} />
        </div>

        {actionMsg && <Alert kind="success" className="mb-4">{actionMsg}</Alert>}
        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {/* Action buttons */}
        {!seller.is_approved && (
          <div className="flex gap-3 mb-8">
            <Button onClick={() => { void handleApprove(); }} loading={acting}>
              {t("admin.approve_seller")}
            </Button>
            <Button
              variant="danger"
              onClick={() => setShowRejectForm((v) => !v)}
              disabled={acting}
            >
              {showRejectForm ? t("common.cancel") : t("admin.reject_needs_data")}
            </Button>
          </div>
        )}

        {showRejectForm && (
          <div className="bg-surface border border-error/30 rounded-xl p-4 mb-6 flex flex-col gap-3">
            <p className="text-sm text-muted">{t("admin.reject_reason_label")}</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder={t("admin.reject_reason_placeholder")}
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-text placeholder:text-muted focus:outline-none focus:border-error transition-colors resize-none text-sm"
            />
            <Button
              variant="danger"
              onClick={() => { void handleReject(); }}
              loading={acting}
              disabled={!rejectReason.trim()}
              size="sm"
            >
              {t("admin.confirm_rejection")}
            </Button>
          </div>
        )}

        {seller.rejection_reason && (
          <Alert kind="error" className="mb-6">
            <strong>{t("admin.rejection_reason_prefix")}</strong> {seller.rejection_reason}
          </Alert>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Owner / personal */}
          <Section title={t("admin.section_owner")}>
            <Row label={t("admin.field_full_name")} value={`${user.first_name} ${user.last_name}`} />
            <Row label={t("admin.field_fathers_name")} value={user.father_name} />
            <Row label={t("admin.field_email")} value={user.email} />
            <Row label={t("admin.field_phone")} value={user.phone_number ?? "—"} />
            <Row label={t("admin.field_dob")} value={user.date_of_birth ?? "—"} />
            <Row label={t("admin.field_id_verified")} value={user.is_selfie_verified ? t("admin.id_verified_yes") : t("admin.id_verified_no")} />
          </Section>

          {/* Shop */}
          <Section title={t("admin.section_shop")}>
            <Row label={t("admin.field_shop_name")} value={seller.shop_name} />
            <Row label={t("admin.field_category")} value={seller.shop_category} />
            <Row label={t("admin.field_business_phone")} value={seller.business_phone} />
            <Row label={t("admin.field_address")} value={`${seller.shop_address_street}, ${seller.shop_address_district}`} />
            <Row label={t("admin.field_city_province")} value={`${seller.shop_address_city}, ${seller.shop_address_province}`} />
            {seller.business_description && (
              <Row label={t("admin.field_description")} value={seller.business_description} />
            )}
          </Section>
        </div>

        {/* Documents */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-heading mb-4">{t("admin.docs_photos")}</h2>
          <div className="grid grid-cols-3 gap-4">
            <DocImage label={t("admin.selfie_label")} src={user.profile_photo} />
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
        <div className="w-full aspect-[4/3] rounded-xl border border-border bg-surface flex items-center justify-center">
          <span className="text-xs text-muted">{t("admin.no_image")}</span>
        </div>
      )}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const { t } = useLanguage();
  const map: Record<string, string> = {
    approved: "bg-success/10 text-success",
    rejected: "bg-error/10 text-error",
    pending: "bg-yellow-500/10 text-yellow-400",
  };
  const labelMap: Record<string, string> = {
    approved: t("admin.status_approved"),
    rejected: t("admin.status_needs_data"),
    pending: t("admin.status_pending"),
  };
  return (
    <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${map[status] ?? ""}`}>
      {labelMap[status] ?? status}
    </span>
  );
}
