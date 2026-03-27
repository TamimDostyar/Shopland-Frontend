import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getSellerOrders,
  acceptOrder,
  rejectOrder,
  markProcessing,
  markReady,
  type Order,
} from "@shopland/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { STATUS_COLORS } from "../buyer/MyOrders";

export default function SellerOrders() {
  const { t } = useLanguage();
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState(0);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const TABS = useMemo(
    () => [
      { label: t("seller.orders_tab_new"), filter: (o: Order) => o.status === "pending" },
      {
        label: t("orders.tab_active"),
        filter: (o: Order) =>
          ["accepted", "processing", "ready_for_pickup", "out_for_delivery"].includes(o.status),
      },
      { label: t("orders.tab_completed"), filter: (o: Order) => ["delivered", "completed"].includes(o.status) },
      {
        label: t("orders.tab_cancelled"),
        filter: (o: Order) => o.status.startsWith("cancelled") || o.status === "rejected",
      },
    ],
    [t],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["seller-orders-all"],
    queryFn: () => getSellerOrders(accessToken!),
    enabled: !!accessToken,
    refetchInterval: 30000,
  });

  const allOrders: Order[] = data?.results ?? [];
  const orders = allOrders.filter(TABS[tab].filter);

  function getDeliveryText(order: Order) {
    const delivery = order.delivery_address_display ?? (order.delivery_address
      ? {
          city: order.delivery_address.city,
          province: order.delivery_address.province,
        }
      : null);

    return [delivery?.city, delivery?.province].filter(Boolean).join(", ") || t("seller.address_unavailable");
  }

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: ["seller-orders-all"] });
  }

  const acceptMutation = useMutation({
    mutationFn: (n: string) => acceptOrder(accessToken!, n),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_order_accepted"));
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const rejectMutation = useMutation({
    mutationFn: ({ n, r }: { n: string; r: string }) => rejectOrder(accessToken!, n, r),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_order_rejected"));
      setRejectModal(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const processingMutation = useMutation({
    mutationFn: (n: string) => markProcessing(accessToken!, n),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_preparing"));
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const readyMutation = useMutation({
    mutationFn: (n: string) => markReady(accessToken!, n),
    onSuccess: async () => {
      await invalidate();
      toast.success(t("seller.toast_ready"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const newCount = allOrders.filter((o) => o.status === "pending").length;

  return (
    <SellerLayout>
      <div className="max-w-4xl">
        <BackButton to="/seller" label={t("seller.orders_back_dashboard")} className="mb-5" />

        <h1
          className="mb-6 text-2xl font-bold"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {t("seller.orders_title")}
        </h1>

        {/* Tabs */}
        <div
          className="mb-6 grid grid-cols-2 gap-1 rounded-xl p-1 sm:grid-cols-4"
          style={{ background: "var(--surface)" }}
        >
          {TABS.map((tabDef, i) => (
            <button
              key={tabDef.label}
              onClick={() => setTab(i)}
              className="relative min-w-0 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                background: tab === i ? "rgba(255,125,72,0.12)" : "transparent",
                color: tab === i ? "var(--accent)" : "var(--text-soft)",
                border: tab === i ? "1px solid rgba(255,125,72,0.2)" : "1px solid transparent",
              }}
            >
              {tabDef.label}
              {i === 0 && newCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 size-4 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center sm:p-12"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">🧾</p>
            <p style={{ color: "var(--text-soft)" }}>{t("seller.orders_empty")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
              return (
                <div
                  key={order.id}
                  className="rounded-2xl p-4 sm:p-5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        to={`/seller/orders/${order.order_number}`}
                        className="block break-all font-semibold hover:underline"
                        style={{ color: "var(--text-h)" }}
                      >
                        {order.order_number}
                      </Link>
                      <p className="mt-0.5 text-xs leading-5" style={{ color: "var(--text-soft)" }}>
                        {new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                        {" · "}
                        {getDeliveryText(order)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: st.bg, color: st.text }}
                      >
                        {st.label}
                      </span>
                      <p className="font-semibold text-sm" style={{ color: "var(--accent)" }}>
                        ؋{parseFloat(order.total).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="mb-4 space-y-1">
                    {(order.items ?? []).slice(0, 3).map((item) => (
                      <p key={item.id} className="text-xs leading-5 break-words" style={{ color: "var(--text-soft)" }}>
                        • {item.product_name} × {item.quantity} — ؋{parseFloat(item.subtotal).toLocaleString()}
                      </p>
                    ))}
                    {(order.items?.length ?? 0) > 3 && (
                      <p className="text-xs" style={{ color: "var(--text-soft)" }}>
                        +{order.items.length - 3} {t("orders.more_items")}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => acceptMutation.mutate(order.order_number)}
                          disabled={acceptMutation.isPending}
                          className="w-full rounded-xl px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                          style={{ background: "#4ade80", color: "#060816" }}
                        >
                          ✓ {t("seller.order_accept")}
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(order.order_number);
                            setRejectReason("");
                          }}
                          className="w-full rounded-xl px-4 py-2 text-sm font-medium transition-all hover:opacity-90 sm:w-auto"
                          style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                        >
                          ✗ {t("seller.order_reject")}
                        </button>
                      </>
                    )}
                    {order.status === "accepted" && (
                      <button
                        onClick={() => processingMutation.mutate(order.order_number)}
                        disabled={processingMutation.isPending}
                        className="w-full rounded-xl px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                        style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
                      >
                        📦 {t("seller.mark_preparing")}
                      </button>
                    )}
                    {order.status === "processing" && (
                      <button
                        onClick={() => readyMutation.mutate(order.order_number)}
                        disabled={readyMutation.isPending}
                        className="w-full rounded-xl px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
                        style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
                      >
                        ✅ {t("seller.mark_ready_pickup")}
                      </button>
                    )}
                    <Link
                      to={`/seller/orders/${order.order_number}`}
                      className="w-full rounded-xl px-4 py-2 text-center text-sm transition-all hover:bg-white/5 sm:w-auto"
                      style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      {t("seller.view_details")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(6,8,22,0.8)" }}>
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "#0b0f1f", border: "1px solid var(--border)" }}
          >
            <h3 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>
              {t("seller.reject_modal_title")}
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder={t("seller.reject_reason_placeholder")}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none mb-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
              required
            />
            <div className="flex gap-3">
              <button
                onClick={() =>
                  rejectMutation.mutate({ n: rejectModal, r: rejectReason })
                }
                disabled={!rejectReason.trim() || rejectMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
                style={{ background: "#f87171", color: "white" }}
              >
                {t("seller.reject_order")}
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                {t("cart.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
