import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrder } from "@amazebid/shared";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { CheckCircleIcon, TruckIcon } from "../components/ui/icons";

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { accessToken } = useAuth();
  const { t } = useLanguage();

  const { data: order } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => getMyOrder(accessToken!, orderNumber!),
    enabled: !!accessToken && !!orderNumber,
  });

  const delivery = order?.delivery_address_display ?? (order?.delivery_address
    ? {
        full_name: order.delivery_address.full_name,
        city: order.delivery_address.city,
        province: order.delivery_address.province,
      }
    : null);

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div
          className="size-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(22,155,101,0.12)", border: "2px solid rgba(22,155,101,0.22)" }}
        >
          <CheckCircleIcon size={34} style={{ color: "#169b65" }} />
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {t("orders.confirmation_title")}
        </h1>
        <p className="mb-6" style={{ color: "var(--text-soft)" }}>
          {t("orders.confirmation_subtitle")}
        </p>

        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 mb-6 text-left space-y-4 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-soft)" }}>{t("orders.order_number_label")}</p>
            <p
              className="text-xl font-bold tracking-wide"
              style={{ fontFamily: "var(--heading)", color: "var(--accent)" }}
            >
              {order?.order_number ?? orderNumber}
            </p>
          </div>

          {order && (
            <>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-soft)" }}>{t("orders.total_cod")}</p>
                <p className="font-bold text-lg inline-flex items-center gap-2" style={{ color: "var(--text-h)" }}>
                  <TruckIcon size={18} className="text-[color:var(--accent)]" />
                  ؋{parseFloat(order.total).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-soft)" }}>{t("orders.deliver_to")}</p>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {delivery
                    ? `${delivery.full_name} — ${[delivery.city, delivery.province].filter(Boolean).join(", ")}`
                    : t("orders.address_unavailable")}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            to={`/orders/${orderNumber}`}
            className="px-5 py-2.5 rounded-xl font-medium text-sm"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {t("orders.track_order")}
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl font-medium text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {t("orders.continue_shopping")}
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
