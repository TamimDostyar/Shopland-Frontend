import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrder } from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { accessToken } = useAuth();

  const { data: order } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => getMyOrder(accessToken!, orderNumber!),
    enabled: !!accessToken && !!orderNumber,
  });

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        {/* Success animation */}
        <div
          className="size-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: "rgba(74,222,128,0.12)", border: "2px solid rgba(74,222,128,0.3)" }}
        >
          ✅
        </div>

        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          Order Placed!
        </h1>
        <p className="mb-6" style={{ color: "var(--text-soft)" }}>
          Your order has been placed. The seller will review it shortly.
        </p>

        {/* Order number */}
        <div
          className="rounded-2xl p-6 mb-6 text-left space-y-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--text-soft)" }}>Order Number</p>
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
                <p className="text-xs mb-1" style={{ color: "var(--text-soft)" }}>Total (Cash on Delivery)</p>
                <p className="font-bold text-lg" style={{ color: "var(--text-h)" }}>
                  ؋{parseFloat(order.total).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--text-soft)" }}>Deliver to</p>
                <p className="text-sm" style={{ color: "var(--text)" }}>
                  {order.delivery_address.full_name} — {order.delivery_address.city}, {order.delivery_address.province}
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
            Track Order
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl font-medium text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
