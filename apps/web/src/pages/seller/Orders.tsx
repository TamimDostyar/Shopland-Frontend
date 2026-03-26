import { useState } from "react";
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
import { STATUS_COLORS } from "../buyer/MyOrders";

const TABS = [
  { label: "New", filter: (o: Order) => o.status === "pending" },
  { label: "Active", filter: (o: Order) => ["accepted", "processing", "ready_for_pickup", "out_for_delivery"].includes(o.status) },
  { label: "Completed", filter: (o: Order) => ["delivered", "completed"].includes(o.status) },
  { label: "Cancelled", filter: (o: Order) => o.status.startsWith("cancelled") || o.status === "rejected" },
];

export default function SellerOrders() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState(0);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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

    return [delivery?.city, delivery?.province].filter(Boolean).join(", ") || "Address unavailable";
  }

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: ["seller-orders-all"] });
  }

  const acceptMutation = useMutation({
    mutationFn: (n: string) => acceptOrder(accessToken!, n),
    onSuccess: async () => { await invalidate(); toast.success("Order accepted"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const rejectMutation = useMutation({
    mutationFn: ({ n, r }: { n: string; r: string }) => rejectOrder(accessToken!, n, r),
    onSuccess: async () => { await invalidate(); toast.success("Order rejected"); setRejectModal(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const processingMutation = useMutation({
    mutationFn: (n: string) => markProcessing(accessToken!, n),
    onSuccess: async () => { await invalidate(); toast.success("Marked as preparing"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const readyMutation = useMutation({
    mutationFn: (n: string) => markReady(accessToken!, n),
    onSuccess: async () => { await invalidate(); toast.success("Marked as ready"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const newCount = allOrders.filter((o) => o.status === "pending").length;

  return (
    <SellerLayout>
      <div className="max-w-4xl">
        <BackButton to="/seller" label="Dashboard" className="mb-5" />

        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          Orders
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--surface)" }}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all relative"
              style={{
                background: tab === i ? "rgba(255,125,72,0.12)" : "transparent",
                color: tab === i ? "var(--accent)" : "var(--text-soft)",
                border: tab === i ? "1px solid rgba(255,125,72,0.2)" : "1px solid transparent",
              }}
            >
              {t.label}
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
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">🧾</p>
            <p style={{ color: "var(--text-soft)" }}>No {TABS[tab].label.toLowerCase()} orders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const st = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;
              return (
                <div
                  key={order.id}
                  className="rounded-2xl p-5"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <Link
                        to={`/seller/orders/${order.order_number}`}
                        className="font-semibold hover:underline"
                        style={{ color: "var(--text-h)" }}
                      >
                        {order.order_number}
                      </Link>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                        {new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                        {" · "}
                        {getDeliveryText(order)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
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
                      <p key={item.id} className="text-xs" style={{ color: "var(--text-soft)" }}>
                        • {item.product_name} × {item.quantity} — ؋{parseFloat(item.subtotal).toLocaleString()}
                      </p>
                    ))}
                    {(order.items?.length ?? 0) > 3 && (
                      <p className="text-xs" style={{ color: "var(--text-soft)" }}>
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => acceptMutation.mutate(order.order_number)}
                          disabled={acceptMutation.isPending}
                          className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                          style={{ background: "#4ade80", color: "#060816" }}
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(order.order_number);
                            setRejectReason("");
                          }}
                          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                          style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    {order.status === "accepted" && (
                      <button
                        onClick={() => processingMutation.mutate(order.order_number)}
                        disabled={processingMutation.isPending}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
                      >
                        📦 Mark as Preparing
                      </button>
                    )}
                    {order.status === "processing" && (
                      <button
                        onClick={() => readyMutation.mutate(order.order_number)}
                        disabled={readyMutation.isPending}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
                      >
                        ✅ Mark as Ready for Pickup
                      </button>
                    )}
                    <Link
                      to={`/seller/orders/${order.order_number}`}
                      className="px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/5"
                      style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      View Details
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
              Reason for Rejection
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Item is out of stock, Cannot fulfill this order..."
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
                Reject Order
              </button>
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
