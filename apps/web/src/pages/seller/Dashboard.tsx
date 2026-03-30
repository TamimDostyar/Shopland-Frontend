import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getSellerOrders,
  getLowStock,
  getEarningsSummary,
  getSellerProducts,
} from "@amazebid/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DashboardIcon,
  TruckIcon,
  WalletIcon,
} from "../../components/ui/icons";

export default function SellerDashboard() {
  const { accessToken, user } = useAuth();
  const { t } = useLanguage();

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

  const stats = [
    {
      label: t("seller.stat_new_orders"),
      value: pendingCount,
      icon: ClockIcon,
      color: pendingCount > 0 ? "#fbbf24" : undefined,
      link: "/seller/orders",
      urgent: pendingCount > 0,
    },
    {
      label: t("seller.stat_active_orders"),
      value: activeCount,
      icon: TruckIcon,
      link: "/seller/orders",
    },
    {
      label: t("seller.stat_low_stock"),
      value: lowStockCount,
      icon: AlertTriangleIcon,
      color: lowStockCount > 0 ? "#f87171" : undefined,
      link: "/seller/inventory",
    },
    {
      label: t("seller.stat_pending_approval"),
      value: pendingProductsCount,
      icon: DashboardIcon,
      link: "/seller/products",
    },
    {
      label: t("seller.stat_monthly_net"),
      value: earnings?.total_net ? `؋${parseFloat(earnings.total_net).toLocaleString()}` : "—",
      icon: WalletIcon,
      link: "/seller/earnings",
    },
    {
      label: t("seller.stat_pending_settlement"),
      value: earnings?.total_pending ? `؋${parseFloat(earnings.total_pending).toLocaleString()}` : "—",
      icon: CheckCircleIcon,
      link: "/seller/earnings",
    },
  ];

  const quickActions = [
    { label: t("seller.action_add_product"), to: "/seller/products/new", accent: true },
    { label: t("seller.action_manage_orders"), to: "/seller/orders" },
    { label: t("seller.action_update_stock"), to: "/seller/inventory" },
    { label: t("seller.action_view_earnings"), to: "/seller/earnings" },
  ];

  return (
    <SellerLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            {t("seller.dashboard_welcome").replace("{name}", user?.first_name ?? "")}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
            {t("seller.dashboard_subtitle")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-5 block transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(23,32,51,0.08)]"
              style={{
                borderColor: stat.urgent ? "rgba(251,191,36,0.3)" : "var(--border)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
                  <stat.icon size={20} />
                </div>
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
          className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
        >
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-h)" }}>
            {t("seller.quick_actions")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((a) => (
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
