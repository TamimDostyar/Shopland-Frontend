import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getSellerOrder,
  acceptOrder,
  rejectOrder,
  markProcessing,
  markReady,
} from "@amazebid/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

export default function SellerOrderDetail() {
  const { t } = useLanguage();

  const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", label: t("orders.status_pending") },
    accepted: { bg: "rgba(96,165,250,0.12)", text: "#60a5fa", label: t("orders.status_accepted") },
    processing: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa", label: t("orders.status_processing") },
    ready_for_pickup: { bg: "rgba(52,211,153,0.12)", text: "#34d399", label: t("orders.status_ready") },
    out_for_delivery: { bg: "rgba(96,165,250,0.12)", text: "#60a5fa", label: t("orders.status_out_delivery") },
    delivered: { bg: "rgba(74,222,128,0.12)", text: "#4ade80", label: t("orders.status_delivered") },
    completed: { bg: "rgba(74,222,128,0.12)", text: "#4ade80", label: t("orders.status_completed") },
    cancelled_by_buyer: { bg: "rgba(248,113,113,0.12)", text: "#f87171", label: t("orders.status_cancelled") },
    cancelled_by_seller: { bg: "rgba(248,113,113,0.12)", text: "#f87171", label: t("orders.status_cancelled_seller") },
    cancelled_by_admin: { bg: "rgba(248,113,113,0.12)", text: "#f87171", label: t("orders.status_cancelled_admin") },
    rejected: { bg: "rgba(248,113,113,0.12)", text: "#f87171", label: t("orders.status_rejected") },
  };
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["seller-order", orderNumber],
    queryFn: () => getSellerOrder(accessToken!, orderNumber!),
    enabled: !!accessToken && !!orderNumber,
  });

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: ["seller-order", orderNumber] });
    await qc.invalidateQueries({ queryKey: ["seller-orders-all"] });
  }

  const acceptMutation = useMutation({
    mutationFn: () => acceptOrder(accessToken!, orderNumber!),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_order_accepted"));
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const rejectMutation = useMutation({
    mutationFn: () => rejectOrder(accessToken!, orderNumber!, rejectReason),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_order_rejected"));
      setShowRejectForm(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const processingMutation = useMutation({
    mutationFn: () => markProcessing(accessToken!, orderNumber!),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_preparing"));
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const readyMutation = useMutation({
    mutationFn: () => markReady(accessToken!, orderNumber!),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_ready"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="space-y-4 max-w-3xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
          ))}
        </div>
      </SellerLayout>
    );
  }

  if (!order) {
    return (
      <SellerLayout>
        <div className="text-center py-20">
          <p style={{ color: "var(--text-soft)" }}>{t("seller.order_not_found")}</p>
          <Link to="/seller/orders" style={{ color: "var(--accent)" }}>{t("seller.back_to_orders")}</Link>
        </div>
      </SellerLayout>
    );
  }

  const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
  const isAccepted = ["accepted", "processing", "ready_for_pickup", "out_for_delivery"].includes(order.status);
  const delivery = order.delivery_address_display ?? (order.delivery_address
    ? {
        full_name: order.delivery_address.full_name,
        street: order.delivery_address.street_address,
        district: order.delivery_address.district,
        city: order.delivery_address.city,
        province: order.delivery_address.province,
      }
    : null);

  return (
    <SellerLayout>
      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/seller/orders" label={t("seller.orders_title")} />
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
            <Link to="/seller/orders" className="hover:underline">{t("seller.orders_title")}</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{order.order_number}</span>
          </nav>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}>
            {order.order_number}
          </h1>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: st.bg, color: st.text }}>
            {st.label}
          </span>
        </div>

        {/* Buyer Info */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold mb-3" style={{ color: "var(--text-h)" }}>{t("seller.detail_buyer_info")}</h2>
          <p className="text-sm" style={{ color: "var(--text)" }}>
            {t("checkout.delivering_to")}{" "}
            {[delivery?.city, delivery?.province].filter(Boolean).join(", ") || t("seller.address_unavailable")}
          </p>
          {isAccepted && (
            <>
              <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
                {delivery?.full_name ?? t("seller.address_unavailable")}
              </p>
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                {[delivery?.street, delivery?.district].filter(Boolean).join(", ") || t("seller.detail_street_unavailable")}
              </p>
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                📞 {order.delivery_phone}
              </p>
            </>
          )}
          {!isAccepted && (
            <p className="text-xs mt-1" style={{ color: "var(--text-soft)" }}>
              {t("seller.detail_address_after_accept")}
            </p>
          )}
        </div>

        {/* Items */}
        <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>{t("seller.detail_items")}</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-h)" }}>{item.product_name}</p>
                  <p className="text-xs" style={{ color: "var(--text-soft)" }}>× {item.quantity}</p>
                </div>
                <p className="text-sm font-medium shrink-0" style={{ color: "var(--accent)" }}>
                  ؋{parseFloat(item.subtotal).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-sm" style={{ borderColor: "var(--border)" }}>
            <span style={{ color: "var(--text-h)" }}>{t("seller.detail_total")}</span>
            <span style={{ color: "var(--accent)" }}>؋{parseFloat(order.total).toLocaleString()}</span>
          </div>
        </div>

        {order.buyer_notes && (
          <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <h2 className="font-semibold mb-2" style={{ color: "var(--text-h)" }}>{t("seller.detail_buyer_notes")}</h2>
            <p className="text-sm" style={{ color: "var(--text-soft)" }}>{order.buyer_notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {order.status === "pending" && !showRejectForm && (
            <div className="flex gap-3">
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "#4ade80", color: "#060816" }}
              >
                ✓ {t("seller.cta_accept_order")}
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex-1 py-3 rounded-xl font-medium text-sm"
                style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
              >
                ✗ {t("seller.cta_reject_order")}
              </button>
            </div>
          )}
          {order.status === "pending" && showRejectForm && (
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <p className="font-medium text-sm" style={{ color: "var(--text-h)" }}>{t("seller.reject_reason_required_label")}</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder={t("seller.reject_reason_placeholder")}
                className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => rejectMutation.mutate()}
                  disabled={!rejectReason.trim() || rejectMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
                  style={{ background: "#f87171", color: "white" }}
                >
                  {t("seller.confirm_rejection")}
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  {t("cart.cancel")}
                </button>
              </div>
            </div>
          )}
          {order.status === "accepted" && (
            <button
              onClick={() => processingMutation.mutate()}
              disabled={processingMutation.isPending}
              className="w-full py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
            >
              📦 {t("seller.mark_preparing")}
            </button>
          )}
          {order.status === "processing" && (
            <button
              onClick={() => readyMutation.mutate()}
              disabled={readyMutation.isPending}
              className="w-full py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
            >
              ✅ {t("seller.mark_ready_pickup")}
            </button>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
