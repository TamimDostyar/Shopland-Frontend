import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
  ApiError,
  type Product,
} from "@shopland/shared";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import BackButton from "../../components/ui/BackButton";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductApproval() {
  const { t } = useLanguage();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [acting, setActing] = useState<string | null>(null); // product id being acted on

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError("");
    try {
      const data = await getPendingProducts(accessToken);
      setProducts(data.results ?? (data as unknown as Product[]));
    } catch {
      setError(t("admin.error_load_products"));
    } finally {
      setLoading(false);
    }
  }, [accessToken, t]);

  useEffect(() => { void load(); }, [load]);

  async function handleApprove(product: Product) {
    if (!accessToken) return;
    setActing(product.id);
    try {
      await approveProduct(accessToken, product.id);
      setActionMsg(`✓ "${product.name}" approved and is now live.`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Approval failed.");
    } finally {
      setActing(null);
    }
  }

  async function handleRejectConfirm() {
    if (!accessToken || !rejectTarget || !rejectReason.trim()) return;
    setActing(rejectTarget.id);
    try {
      await rejectProduct(accessToken, rejectTarget.id, rejectReason);
      setActionMsg(`✗ "${rejectTarget.name}" rejected.`);
      setProducts((prev) => prev.filter((p) => p.id !== rejectTarget.id));
      setRejectTarget(null);
      setRejectReason("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("admin.rejection_failed"));
    } finally {
      setActing(null);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <BackButton className="mb-5" />

        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-h)" }}
          >
            Product Approval Queue
          </h1>
          <button
            onClick={() => { void load(); }}
            className="text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-soft)", border: "1px solid var(--border)" }}
          >
            ↻ Refresh
          </button>
        </div>

        {actionMsg && <Alert kind="success" className="mb-4">{actionMsg}</Alert>}
        {error && <Alert kind="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="text-4xl mb-3">✅</div>
            <p className="text-lg font-semibold" style={{ color: "var(--text-h)" }}>
              All caught up!
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
              No products are waiting for review.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                acting={acting === product.id}
                onView={() => navigate(`/product/${product.slug}`)}
                onApprove={() => { void handleApprove(product); }}
                onReject={() => setRejectTarget(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl p-6 w-full max-w-md"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-h)" }}>
              Reject product
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-soft)" }}>
              Rejecting <strong style={{ color: "var(--text)" }}>{rejectTarget.name}</strong>.
              The seller will receive this reason.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain what's wrong (e.g. prohibited item, misleading description)…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none mb-4"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={() => { void handleRejectConfirm(); }}
                loading={acting === rejectTarget.id}
                disabled={!rejectReason.trim()}
                className="flex-1"
              >
                Confirm rejection
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function ProductCard({
  product,
  acting,
  onView,
  onApprove,
  onReject,
}: {
  product: Product;
  acting: boolean;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const primaryImage = product.images?.find((i) => i.is_primary) ?? product.images?.[0];

  return (
    <div
      className="rounded-2xl p-5 flex gap-5"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {/* Thumbnail */}
      <div className="shrink-0">
        {primaryImage ? (
          <img
            src={primaryImage.image}
            alt={product.name}
            className="size-20 rounded-xl object-cover"
            style={{ border: "1px solid var(--border)" }}
          />
        ) : (
          <div
            className="size-20 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            📦
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-base" style={{ color: "var(--text-h)" }}>
              {product.name}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-soft)" }}>
              {product.category.name}
              {product.brand ? ` · ${product.brand.name}` : ""}
              {" · "}
              <span style={{ color: "var(--accent)" }}>
                ؋{Number(product.price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="ml-1 line-through text-xs" style={{ color: "var(--text-soft)" }}>
                  ؋{Number(product.discount_price).toLocaleString()}
                </span>
              )}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-soft)" }}>
              Seller: <strong style={{ color: "var(--text)" }}>{product.seller?.shop_name}</strong>
              {" · "}{product.city}, {product.province}
              {" · "}Condition: <span className="capitalize">{product.condition}</span>
            </p>
          </div>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0"
            style={{ background: "rgba(255,193,7,0.1)", color: "#ffc107" }}
          >
            Pending Review
          </span>
        </div>

        {/* Description preview */}
        <p
          className="text-sm mt-2 line-clamp-2"
          style={{ color: "var(--text-soft)" }}
        >
          {product.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Button size="sm" onClick={onApprove} loading={acting}>
            ✓ Approve
          </Button>
          <Button size="sm" variant="danger" onClick={onReject} disabled={acting}>
            ✗ Reject
          </Button>
          <Button size="sm" variant="ghost" onClick={onView}>
            Preview listing →
          </Button>
        </div>
      </div>
    </div>
  );
}
