import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getSellerProducts,
  deleteProduct,
  type Product,
} from "@amazebid/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { ImageIcon, PackageIcon } from "../../components/ui/icons";

export default function SellerProducts() {
  const { accessToken } = useAuth();
  const { t } = useLanguage();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const STATUS_FILTERS = [
    { key: "all", label: t("seller.filter_all") },
    { key: "active", label: t("seller.filter_active") },
    { key: "pending", label: t("seller.filter_pending") },
    { key: "rejected", label: t("seller.filter_rejected") },
    { key: "inactive", label: t("seller.filter_inactive") },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["seller-products", statusFilter],
    queryFn: () => getSellerProducts(accessToken!),
    enabled: !!accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(accessToken!, id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success(t("seller.toast_product_deleted"));
      setDeleteConfirm(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : t("seller.toast_delete_failed");
      toast.error(msg);
    },
  });

  const allProducts: Product[] = data?.results ?? [];
  const products = allProducts.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return p.is_active && p.is_approved;
    if (statusFilter === "pending") return !p.is_approved && p.is_active;
    if (statusFilter === "rejected") return !!p.rejection_reason;
    if (statusFilter === "inactive") return !p.is_active;
    return true;
  });

  function getProductBadge(p: Product) {
    if (p.rejection_reason) return { label: t("seller.badge_rejected"), bg: "rgba(248,113,113,0.12)", text: "#f87171" };
    if (!p.is_approved) return { label: t("seller.badge_pending_approval"), bg: "rgba(251,191,36,0.12)", text: "#fbbf24" };
    if (!p.is_active) return { label: t("seller.badge_inactive"), bg: "rgba(255,255,255,0.06)", text: "var(--text-soft)" };
    return { label: t("seller.badge_active"), bg: "rgba(74,222,128,0.12)", text: "#4ade80" };
  }

  return (
    <SellerLayout>
      <div className="max-w-5xl">
        <BackButton to="/seller" label={t("seller.orders_back_dashboard")} className="mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            {t("seller.my_products")}
          </h1>
          <Link
            to="/seller/products/new"
            className="px-5 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 bg-[var(--accent)] text-white shadow-[0_12px_28px_rgba(255,106,61,0.22)]"
          >
            {t("seller.add_product")}
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: statusFilter === f.key ? "rgba(255,125,72,0.12)" : "white",
                border: `1px solid ${statusFilter === f.key ? "rgba(255,125,72,0.3)" : "var(--border)"}`,
                color: statusFilter === f.key ? "var(--accent)" : "var(--text-soft)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-16 text-center shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <PackageIcon size={28} />
            </div>
            <p className="font-medium mb-2" style={{ color: "var(--text-h)" }}>
              {t("seller.no_products")}
            </p>
            <Link
              to="/seller/products/new"
              className="px-5 py-2.5 rounded-xl font-medium text-sm inline-block mt-2"
              style={{ background: "var(--accent)", color: "white" }}
            >
              {t("seller.add_first_product")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => {
              const badge = getProductBadge(p);
              const primaryImageUnknown = (p as unknown as { primary_image?: unknown }).primary_image;
              const img =
                (typeof primaryImageUnknown === "string"
                  ? primaryImageUnknown
                  : (primaryImageUnknown as { image?: string } | null)?.image) ??
                p.images?.[0]?.image;
              return (
                <div
                  key={p.id}
                  className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_14px_34px_rgba(23,32,51,0.05)]"
                >
                  {/* Top row: image + info + badge */}
                  <div className="flex items-center gap-3">
                    {/* Image */}
                    <div
                      className="size-14 rounded-2xl shrink-0 overflow-hidden"
                      style={{ background: "var(--surface-muted)" }}
                    >
                      {img ? (
                        <img src={img} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[color:var(--text-soft)]"><ImageIcon size={18} /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: "var(--text-h)" }}>
                        {p.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                        ؋{parseFloat(p.price).toLocaleString()} · {p.category.name}
                      </p>
                      {p.rejection_reason && (
                        <p className="text-xs mt-1" style={{ color: "#f87171" }}>
                          {t("seller.badge_rejected")}: {p.rejection_reason}
                        </p>
                      )}
                    </div>

                    {/* Badge */}
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Actions row — full width on mobile, right-aligned */}
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <Link
                      to={`/seller/products/${p.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
                      style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      {t("addresses.edit")}
                    </Link>
                    {deleteConfirm === p.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
                          className="px-2 py-1.5 rounded-lg text-xs"
                          style={{ background: "#f87171", color: "white" }}
                        >
                          {t("addresses.delete")}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
                        style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
                      >
                        {t("addresses.delete")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
