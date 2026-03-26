import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getSellerProducts,
  deleteProduct,
  type Product,
} from "@shopland/shared";
import SellerLayout from "../../components/layout/SellerLayout";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";

const STATUS_FILTERS = ["All", "Active", "Pending", "Rejected", "Inactive"];

export default function SellerProducts() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["seller-products", statusFilter],
    queryFn: () => getSellerProducts(accessToken!),
    enabled: !!accessToken,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(accessToken!, id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Product deleted");
      setDeleteConfirm(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const allProducts: Product[] = data?.results ?? [];
  const products = allProducts.filter((p) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return p.is_active && p.is_approved;
    if (statusFilter === "Pending") return !p.is_approved && p.is_active;
    if (statusFilter === "Rejected") return !!p.rejection_reason;
    if (statusFilter === "Inactive") return !p.is_active;
    return true;
  });

  function getProductBadge(p: Product) {
    if (p.rejection_reason) return { label: "Rejected", bg: "rgba(248,113,113,0.12)", text: "#f87171" };
    if (!p.is_approved) return { label: "Pending Approval", bg: "rgba(251,191,36,0.12)", text: "#fbbf24" };
    if (!p.is_active) return { label: "Inactive", bg: "rgba(255,255,255,0.06)", text: "var(--text-soft)" };
    return { label: "Active", bg: "rgba(74,222,128,0.12)", text: "#4ade80" };
  }

  return (
    <SellerLayout>
      <div className="max-w-5xl">
        <BackButton to="/seller" label="Dashboard" className="mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            My Products
          </h1>
          <Link
            to="/seller/products/new"
            className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "white" }}
          >
            + Add Product
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: statusFilter === f ? "rgba(255,125,72,0.12)" : "var(--surface)",
                border: `1px solid ${statusFilter === f ? "rgba(255,125,72,0.3)" : "var(--border)"}`,
                color: statusFilter === f ? "var(--accent)" : "var(--text-soft)",
              }}
            >
              {f}
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
          <div
            className="rounded-2xl p-16 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">🛍️</p>
            <p className="font-medium mb-2" style={{ color: "var(--text-h)" }}>
              No products yet
            </p>
            <Link
              to="/seller/products/new"
              className="px-5 py-2.5 rounded-xl font-medium text-sm inline-block mt-2"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => {
              const badge = getProductBadge(p);
              const img = p.primary_image ?? p.images?.[0]?.image;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  {/* Image */}
                  <div
                    className="size-14 rounded-xl shrink-0 overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
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
                        Rejected: {p.rejection_reason}
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

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/seller/products/${p.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
                      style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                    >
                      Edit
                    </Link>
                    {deleteConfirm === p.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => deleteMutation.mutate(p.id)}
                          className="px-2 py-1.5 rounded-lg text-xs"
                          style={{ background: "#f87171", color: "white" }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1.5 rounded-lg text-xs"
                          style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="px-3 py-1.5 rounded-lg text-xs transition-all hover:bg-white/5"
                        style={{ border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
                      >
                        Delete
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
