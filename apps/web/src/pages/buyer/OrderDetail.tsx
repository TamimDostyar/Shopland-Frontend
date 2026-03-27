import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getMyOrder,
  cancelOrder,
  confirmDelivery,
  type OrderStatusEntry,
} from "@shopland/shared";
import MainLayout from "../../components/layout/MainLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { STATUS_COLORS } from "./MyOrders";

const TIMELINE_STEPS = [
  { status: "pending", label: "Order Placed" },
  { status: "accepted", label: "Accepted by Seller" },
  { status: "processing", label: "Being Prepared" },
  { status: "ready_for_pickup", label: "Ready for Pickup" },
  { status: "out_for_delivery", label: "Out for Delivery" },
  { status: "delivered", label: "Delivered" },
  { status: "completed", label: "Completed" },
];

export default function OrderDetail() {
  const { t } = useLanguage();
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => getMyOrder(accessToken!, orderNumber!),
    enabled: !!accessToken && !!orderNumber,
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(accessToken!, orderNumber!, cancelReason || undefined),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["order", orderNumber] });
      toast.success(t("orders.toast_cancelled"));
      setShowCancelForm(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmDelivery(accessToken!, orderNumber!),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["order", orderNumber] });
      toast.success(t("orders.toast_delivery_confirmed"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="h-8 w-48 rounded-xl animate-pulse mb-6" style={{ background: "var(--surface)" }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl mb-4 animate-pulse" style={{ background: "var(--surface)" }} />
          ))}
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-4xl mb-4">😕</p>
          <p style={{ color: "var(--text-h)" }}>Order not found</p>
          <Link to="/orders" style={{ color: "var(--accent)" }}>← Back to orders</Link>
        </div>
      </MainLayout>
    );
  }

  const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
  const canCancel = ["pending", "accepted", "processing"].includes(order.status);
  const canConfirm = order.status === "delivered";
  const delivery = order.delivery_address_display ?? (order.delivery_address
    ? {
        full_name: order.delivery_address.full_name,
        street: order.delivery_address.street_address,
        district: order.delivery_address.district,
        city: order.delivery_address.city,
        province: order.delivery_address.province,
      }
    : null);

  // Find current step index for timeline
  const currentStepIdx = TIMELINE_STEPS.findIndex((s) => s.status === order.status);
  const isCancelled = order.status.startsWith("cancelled") || order.status === "rejected";

  // Map status history by new_status
  const historyMap: Record<string, OrderStatusEntry> = {};
  order.status_history.forEach((h) => { historyMap[h.new_status] = h; });

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back + Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton to="/orders" label="My Orders" />
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
            <Link to="/orders" className="hover:underline">My Orders</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{order.order_number}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              {order.order_number}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-soft)" }}>
              Placed on {new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </p>
          </div>
          <span
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ background: st.bg, color: st.text }}
          >
            {st.label}
          </span>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-semibold mb-5" style={{ color: "var(--text-h)" }}>Order Progress</h2>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, i) => {
                const isDone = currentStepIdx > i;
                const isCurrent = currentStepIdx === i;
                const entry = historyMap[step.status];
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          background: isDone || isCurrent
                            ? "var(--accent)"
                            : "rgba(255,255,255,0.06)",
                          color: isDone || isCurrent ? "white" : "var(--text-soft)",
                          border: isCurrent ? "2px solid var(--accent)" : "none",
                        }}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div
                          className="w-0.5 h-8 my-1"
                          style={{
                            background: isDone
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.08)",
                          }}
                        />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: isDone || isCurrent ? "var(--text-h)" : "var(--text-soft)",
                        }}
                      >
                        {step.label}
                      </p>
                      {entry && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                          {new Date(entry.created_at).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                          {entry.note ? ` — ${entry.note}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div
                  className="size-14 rounded-xl shrink-0 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {item.product?.primary_image ? (
                    <img src={item.product.primary_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text-h)" }}>
                    {item.product_name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                    {(item.seller?.shop_name ?? item.seller_shop ?? "Seller")} · x{item.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium shrink-0" style={{ color: "var(--accent)" }}>
                  ؋{parseFloat(item.subtotal).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="border-t mt-4 pt-4 space-y-2 text-sm" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-soft)" }}>Subtotal</span>
              <span>؋{parseFloat(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-soft)" }}>Delivery</span>
              <span>؋{parseFloat(order.delivery_fee).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span style={{ color: "var(--text-h)" }}>Total</span>
              <span style={{ color: "var(--accent)" }}>؋{parseFloat(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold mb-3" style={{ color: "var(--text-h)" }}>Delivery Address</h2>
          <p className="text-sm" style={{ color: "var(--text)" }}>
            {delivery?.full_name ?? "Address unavailable"}
          </p>
          <p className="text-sm" style={{ color: "var(--text-soft)" }}>
            {[delivery?.street, delivery?.district].filter(Boolean).join(", ") || "Street unavailable"}
          </p>
          <p className="text-sm" style={{ color: "var(--text-soft)" }}>
            {[delivery?.city, delivery?.province].filter(Boolean).join(", ") || "City unavailable"}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
            📞 {order.delivery_phone}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {canConfirm && (
            <button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "#4ade80", color: "#060816" }}
            >
              {confirmMutation.isPending && (
                <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
              ✓ Confirm Delivery Received & Pay
            </button>
          )}

          {canCancel && !showCancelForm && (
            <button
              onClick={() => setShowCancelForm(true)}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all"
              style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
            >
              Cancel Order
            </button>
          )}

          {showCancelForm && (
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              <p className="text-sm font-medium" style={{ color: "var(--text-h)" }}>
                Reason for cancellation (optional)
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Tell us why you're cancelling..."
                className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "#f87171", color: "white" }}
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  Keep Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
