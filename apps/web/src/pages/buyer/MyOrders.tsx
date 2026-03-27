import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders, type Order, type OrderStatus } from "@shopland/shared";
import MainLayout from "../../components/layout/MainLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

export default function MyOrders() {
  const { accessToken } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState(0);

  const TABS = [
    { label: t("orders.tab_active"), statuses: ["pending", "accepted", "processing", "ready_for_pickup", "out_for_delivery"] },
    { label: t("orders.tab_completed"), statuses: ["delivered", "completed"] },
    { label: t("orders.tab_cancelled"), statuses: ["cancelled_by_buyer", "cancelled_by_seller", "cancelled_by_admin"] },
  ];

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

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "buyer", tab],
    queryFn: () => getMyOrders(accessToken!),
    enabled: !!accessToken,
  });

  const allOrders: Order[] = data?.results ?? [];
  const filteredOrders = allOrders.filter((o) =>
    TABS[tab].statuses.includes(o.status),
  );

  const emptyMessages = [
    t("orders.no_active"),
    t("orders.no_completed"),
    t("orders.no_cancelled"),
  ];

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <BackButton to="/" label={t("orders.back")} className="mb-5" />

        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {t("orders.title")}
        </h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--surface)" }}>
          {TABS.map((tabItem, i) => (
            <button
              key={tabItem.label}
              onClick={() => setTab(i)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === i ? "rgba(255,125,72,0.12)" : "transparent",
                color: tab === i ? "var(--accent)" : "var(--text-soft)",
                border: tab === i ? "1px solid rgba(255,125,72,0.2)" : "1px solid transparent",
              }}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl animate-pulse"
                style={{ background: "var(--surface)" }}
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">📦</p>
            <p style={{ color: "var(--text-soft)" }}>{emptyMessages[tab]}</p>
            {tab === 0 && (
              <Link
                to="/"
                className="text-sm mt-3 block"
                style={{ color: "var(--accent)" }}
              >
                {t("orders.start_shopping")}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} statusColors={STATUS_COLORS} moreItemsLabel={t("orders.more_items")} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function OrderCard({
  order,
  statusColors,
  moreItemsLabel,
}: {
  order: Order;
  statusColors: Record<string, { bg: string; text: string; label: string }>;
  moreItemsLabel: string;
}) {
  const st = statusColors[order.status] ?? statusColors.pending;
  const firstItem = order.items?.[0];

  return (
    <Link
      to={`/orders/${order.order_number}`}
      className="block rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-sm" style={{ color: "var(--text-h)" }}>
            {order.order_number}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
          style={{ background: st.bg, color: st.text }}
        >
          {st.label}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-4">
        {firstItem?.product?.primary_image && (
          <div className="size-12 rounded-xl overflow-hidden shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
            <img src={firstItem.product.primary_image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate" style={{ color: "var(--text)" }}>
            {firstItem?.product_name}
          </p>
          {(order.items?.length ?? 0) > 1 && (
            <p className="text-xs" style={{ color: "var(--text-soft)" }}>
              +{order.items.length - 1} {moreItemsLabel}
            </p>
          )}
        </div>
        <p className="font-semibold text-sm shrink-0" style={{ color: "var(--accent)" }}>
          ؋{parseFloat(order.total).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export type { OrderStatus };
