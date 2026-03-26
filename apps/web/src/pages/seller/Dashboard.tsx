import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getSellerOrders,
  getLowStock,
  getEarningsSummary,
  getSellerProducts,
} from "@shopland/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import { useAuth } from "../../hooks/useAuth";

export default function SellerDashboard() {
  const { accessToken, user } = useAuth();

  const { data: pendingOrders } = useQuery({
    queryKey: ["seller-orders", "pending"],
    queryFn: () => getSellerOrders(accessToken!, "pending"),
    enabled: !!accessToken,
  });

  const { data: activeOrders } = useQuery({
    queryKey: ["seller-orders", "active"],
    queryFn: () => getSellerOrders(accessToken!),
    enabled: !!accessToken,
  });

  const { data: lowStock } = useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: () => getLowStock(accessToken!),
    enabled: !!accessToken,
  });

  const { data: earnings } = useQuery({
    queryKey: ["earnings", "summary"],
    queryFn: () => getEarningsSummary(accessToken!),
    enabled: !!accessToken,
  });

  const { data: pendingProducts } = useQuery({
    queryKey: ["seller-products", "pending"],
    queryFn: () => getSellerProducts(accessToken!, { is_approved: "false" }),
    enabled: !!accessToken,
  });

  const pendingCount = pendingOrders?.count ?? 0;
  const activeCount = (activeOrders?.results ?? []).filter((o) =>
    ["accepted", "processing", "ready_for_pickup"].includes(o.status),
  ).length;
  const lowStockCount = lowStock?.count ?? 0;
  const pendingProductsCount = pendingProducts?.count ?? 0;

  return (
    <SellerLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            Welcome back, {user?.first_name} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "New Orders",
              value: pendingCount,
              icon: "🔔",
              color: pendingCount > 0 ? "#fbbf24" : undefined,
              link: "/seller/orders",
              urgent: pendingCount > 0,
            },
            {
              label: "Active Orders",
              value: activeCount,
              icon: "🚚",
              link: "/seller/orders",
            },
            {
              label: "Low Stock Alerts",
              value: lowStockCount,
              icon: "⚠️",
              color: lowStockCount > 0 ? "#f87171" : undefined,
              link: "/seller/inventory",
            },
            {
              label: "Pending Approval",
              value: pendingProductsCount,
              icon: "🕐",
              link: "/seller/products",
            },
            {
              label: "This Month (Net)",
              value: earnings?.total_net ? `؋${parseFloat(earnings.total_net).toLocaleString()}` : "—",
              icon: "💰",
              link: "/seller/earnings",
            },
            {
              label: "Pending Settlement",
              value: earnings?.total_pending ? `؋${parseFloat(earnings.total_pending).toLocaleString()}` : "—",
              icon: "⏳",
              link: "/seller/earnings",
            },
          ].map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="rounded-2xl p-5 block transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "var(--surface)",
                border: `1px solid ${stat.urgent ? "rgba(251,191,36,0.3)" : "var(--border)"}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                {stat.urgent && (
                  <span
                    className="size-2 rounded-full animate-pulse"
                    style={{ background: "#fbbf24" }}
                  />
                )}
              </div>
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--heading)",
                  color: stat.color ?? "var(--text-h)",
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-soft)" }}>
                {stat.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Add Product", to: "/seller/products/new", accent: true },
              { label: "Manage Orders", to: "/seller/orders" },
              { label: "Update Stock", to: "/seller/inventory" },
              { label: "View Earnings", to: "/seller/earnings" },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                style={
                  a.accent
                    ? { background: "var(--accent)", color: "white" }
                    : { border: "1px solid var(--border)", color: "var(--text)" }
                }
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
