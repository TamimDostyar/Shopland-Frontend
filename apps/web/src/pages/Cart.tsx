import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  type Cart as CartType,
  type CartItem,
} from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import BackButton from "../components/ui/BackButton";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../context/LanguageContext";
import { AlertTriangleIcon, CartIcon, ImageIcon, TruckIcon } from "../components/ui/icons";

export default function Cart() {
  const { t } = useLanguage();
  const { accessToken, isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [clearConfirm, setclearConfirm] = useState(false);

  const { data: cart, isLoading } = useQuery<CartType>({
    queryKey: ["cart"],
    queryFn: () => getCart(accessToken!),
    enabled: !!accessToken,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string; qty: number }) =>
      updateCartItem(accessToken!, itemId, qty),
    onSuccess: async (updatedCart) => {
      qc.setQueryData(["cart"], updatedCart);
      await refreshCart();
    },
    onError: () => toast.error(t("cart.error_qty")),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(accessToken!, itemId),
    onSuccess: async (updatedCart) => {
      qc.setQueryData(["cart"], updatedCart);
      await refreshCart();
      toast.success(t("cart.removed"));
    },
    onError: async () => {
      await qc.invalidateQueries({ queryKey: ["cart"] });
      await refreshCart();
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearCart(accessToken!),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cart"] });
      await refreshCart();
      setclearConfirm(false);
      toast.success(t("cart.cleared"));
    },
  });

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <CartIcon size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-h)" }}>
            {t("cart.signin_title")}
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-soft)" }}>
            {t("cart.signin_desc")}
          </p>
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl font-medium text-sm inline-block"
            style={{ background: "var(--accent)", color: "white" }}
          >
            {t("cart.login")}
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-[1.75rem] mb-4 animate-pulse"
              style={{ background: "var(--surface-muted)" }}
            />
          ))}
        </div>
      </MainLayout>
    );
  }

  const items: CartItem[] = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackButton to="/" label={t("cart.continue_shopping")} className="mb-5" />

        <h1
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {t("cart.title")}
          {items.length > 0 && (
            <span className="ml-3 text-base font-normal" style={{ color: "var(--text-soft)" }}>
              ({items.length} {items.length === 1 ? t("cart.item") : t("cart.items")})
            </span>
          )}
        </h1>

        {isEmpty ? (
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-16 text-center shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <CartIcon size={28} />
            </div>
            <p className="font-medium mb-2" style={{ color: "var(--text-h)" }}>
              {t("cart.empty_title")}
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-soft)" }}>
              {t("cart.empty_desc")}
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl font-medium text-sm inline-block"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {t("cart.browse")}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQtyChange={(qty) =>
                    updateMutation.mutate({ itemId: item.id, qty })
                  }
                  onRemove={() => removeMutation.mutate(item.id)}
                  disabled={updateMutation.isPending || removeMutation.isPending}
                />
              ))}

              {/* Clear cart */}
              {!clearConfirm ? (
                <button
                  onClick={() => setclearConfirm(true)}
                  className="mt-2 rounded-full bg-[var(--danger-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
                >
                  {t("cart.clear")}
                </button>
              ) : (
                <div
                  className="rounded-[1.5rem] p-4 flex items-center gap-4 border border-[color:rgba(217,75,75,0.18)] bg-[var(--danger-soft)]"
                >
                  <p className="text-sm flex-1" style={{ color: "var(--text)" }}>
                    {t("cart.clear_confirm")}
                  </p>
                  <button
                    onClick={() => clearMutation.mutate()}
                    disabled={clearMutation.isPending}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: "#f87171", color: "white" }}
                  >
                    {t("cart.clear_yes")}
                  </button>
                  <button
                    onClick={() => setclearConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                  >
                    {t("cart.cancel")}
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 h-fit sticky top-24 space-y-4 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <h2 className="font-semibold" style={{ color: "var(--text-h)" }}>
                {t("cart.order_summary")}
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-soft)" }}>{t("cart.subtotal")}</span>
                  <span style={{ color: "var(--text)" }}>
                    ؋{parseFloat(cart?.subtotal ?? "0").toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-soft)" }}>{t("cart.delivery")}</span>
                  <span style={{ color: "var(--text-soft)" }}>{t("cart.delivery_calculated")}</span>
                </div>
                <div
                  className="border-t pt-3 flex justify-between font-semibold"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--text-h)" }}>{t("cart.total")}</span>
                  <span style={{ color: "var(--accent)" }}>
                    ؋{parseFloat(cart?.total ?? "0").toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full rounded-full bg-[var(--accent)] py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,106,61,0.22)] transition-opacity hover:opacity-90"
              >
                {t("cart.checkout")}
              </button>

              <div
                className="rounded-[1.5rem] p-4 text-xs flex items-center gap-3"
                style={{ background: "var(--success-soft)", color: "var(--text-soft)" }}
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-[color:var(--success)]">
                  <TruckIcon size={18} />
                </div>
                {t("cart.cod_note")}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function CartItemRow({
  item,
  onQtyChange,
  onRemove,
  disabled,
}: {
  item: CartItem;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const { t } = useLanguage();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const price = parseFloat(item.product.discount_price ?? item.product.price);
  const maxQty = item.product.available_quantity;

  return (
    <div
      className="rounded-[1.75rem] p-4 flex gap-4 border border-[color:var(--border)] bg-white shadow-[0_16px_40px_rgba(23,32,51,0.05)]"
    >
      {/* Image */}
      <Link to={`/product/${item.product.slug}`} className="shrink-0">
        <div
          className="size-20 rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-muted)" }}
        >
          {item.product.primary_image ? (
            <img
              src={item.product.primary_image}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[color:var(--text-soft)]"><ImageIcon size={22} /></div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.product.slug}`}
          className="font-medium text-sm line-clamp-2 hover:underline"
          style={{ color: "var(--text-h)" }}
        >
          {item.product.name}
        </Link>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
          {item.product.seller.shop_name}
        </p>
        {!item.product.in_stock && (
          <p className="text-xs mt-1 inline-flex items-center gap-1.5 font-semibold" style={{ color: "#f87171" }}>
            <AlertTriangleIcon size={14} />
            {t("cart.out_of_stock")}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          {/* Qty control */}
          <div
            className="flex items-center rounded-full overflow-hidden border border-[color:var(--border)] bg-[var(--surface-muted)]"
          >
            <button
              disabled={disabled || item.quantity <= 1}
              onClick={() => onQtyChange(item.quantity - 1)}
              className="px-3 py-1 text-sm disabled:opacity-30"
              style={{ color: "var(--text)" }}
            >
              -
            </button>
            <span className="px-3 py-1 text-sm font-medium" style={{ color: "var(--text-h)" }}>
              {item.quantity}
            </span>
            <button
              disabled={disabled || item.quantity >= maxQty}
              onClick={() => onQtyChange(item.quantity + 1)}
              className="px-3 py-1 text-sm disabled:opacity-30"
              style={{ color: "var(--text)" }}
            >
              +
            </button>
          </div>

          {/* Price */}
          <span className="font-semibold text-sm" style={{ color: "var(--accent)" }}>
            ؋{(price * item.quantity).toLocaleString()}
          </span>

          {/* Remove */}
          {!showRemoveConfirm ? (
            <button
              onClick={() => setShowRemoveConfirm(true)}
              className="ml-auto rounded-full bg-[var(--danger-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--error)] transition-colors hover:bg-[#fde3e3]"
            >
              {t("cart.remove")}
            </button>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onRemove}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ background: "#f87171", color: "white" }}
              >
                {t("cart.remove_yes")}
              </button>
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="text-xs px-2 py-1 rounded-lg"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                {t("cart.remove_no")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
