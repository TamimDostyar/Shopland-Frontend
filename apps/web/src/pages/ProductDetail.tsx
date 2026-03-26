import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getProduct,
  addToCart,
  getProducts,
} from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import BackButton from "../components/ui/BackButton";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { accessToken, isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug!),
    enabled: !!slug,
  });

  const { data: related } = useQuery({
    queryKey: ["products", "related", product?.category.slug],
    queryFn: () =>
      getProducts({ category: product!.category.slug, limit: 6 }),
    enabled: !!product,
  });

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!accessToken || !product) return;
    setAdding(true);
    try {
      await addToCart(accessToken, product.id, qty);
      await refreshCart();
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  }

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-h)" }}>
            Product not found
          </h2>
          <Link to="/" style={{ color: "var(--accent)" }}>
            ← Back to home
          </Link>
        </div>
      </MainLayout>
    );
  }

  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const displayPrice = discountPrice ?? price;
  const images = product.images ?? [];
  const allImages = images.length > 0 ? images : product.primary_image ? [{ image: product.primary_image, id: "p", is_primary: true }] : [];
  const maxQty = product.available_quantity ?? 99;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back + Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
            <Link to="/" style={{ color: "var(--text-soft)" }} className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.category.slug}`}
              style={{ color: "var(--text-soft)" }}
              className="hover:underline"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }} className="truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* ─── Image Gallery ──────────────────────────────────────────── */}
          <div className="space-y-4">
            <div
              className="aspect-square rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {allImages[selectedImg] ? (
                <img
                  src={allImages[selectedImg].image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                  🛍️
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(i)}
                    className="shrink-0 size-16 rounded-xl overflow-hidden transition-all"
                    style={{
                      border: `2px solid ${i === selectedImg ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-soft)" }}
              >
                {product.condition}
              </span>
              {product.city && (
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-soft)" }}
                >
                  📍 {product.city}, {product.province}
                </span>
              )}
            </div>

            <h1
              className="text-2xl font-bold leading-tight"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            {(product.average_rating ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{ color: s <= Math.round(product.average_rating ?? 0) ? "#facc15" : "rgba(255,255,255,0.2)" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {product.average_rating?.toFixed(1)} ({product.review_count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span
                className="text-3xl font-bold"
                style={{ color: "var(--accent)" }}
              >
                ؋{displayPrice.toLocaleString()}
              </span>
              {discountPrice && (
                <>
                  <span
                    className="text-lg line-through"
                    style={{ color: "var(--text-soft)" }}
                  >
                    ؋{price.toLocaleString()}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-sm font-bold"
                    style={{ background: "rgba(255,125,72,0.15)", color: "var(--accent)" }}
                  >
                    -{Math.round((1 - discountPrice / price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div>
              {product.in_stock !== false ? (
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: "#4ade80" }}
                >
                  <span className="size-2 rounded-full bg-green-400" />
                  In Stock
                  {(product.available_quantity ?? 0) > 0 && product.available_quantity! <= 10 && (
                    <span style={{ color: "var(--text-soft)" }}>
                      — only {product.available_quantity} left
                    </span>
                  )}
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: "#f87171" }}
                >
                  <span className="size-2 rounded-full bg-red-400" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {product.in_stock !== false && (
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-lg font-medium transition-colors hover:bg-white/5"
                    style={{ color: "var(--text)" }}
                  >
                    −
                  </button>
                  <span
                    className="px-4 py-2.5 min-w-[3rem] text-center font-semibold"
                    style={{ color: "var(--text-h)" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="px-4 py-2.5 text-lg font-medium transition-colors hover:bg-white/5"
                    style={{ color: "var(--text)" }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => { void handleAddToCart(); }}
                  disabled={adding}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {adding ? (
                    <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  Add to Cart
                </button>
              </div>
            )}

            {/* Seller info */}
            <div
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="size-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)" }}
              >
                {product.seller.shop_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/shop/${product.seller.shop_slug}`}
                  className="font-semibold hover:underline"
                  style={{ color: "var(--text-h)" }}
                >
                  {product.seller.shop_name}
                </Link>
                {(product.seller.average_rating ?? 0) > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-soft)" }}>
                    ★ {product.seller.average_rating?.toFixed(1)} ({product.seller.total_reviews} reviews)
                  </p>
                )}
              </div>
              <Link
                to={`/shop/${product.seller.shop_slug}`}
                className="text-sm px-3 py-1.5 rounded-xl transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                View Shop
              </Link>
            </div>

            {/* Cash on delivery note */}
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}
            >
              <span className="text-xl">💵</span>
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                Cash on Delivery available — pay when your order arrives.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Description ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            Product Description
          </h2>
          <p className="leading-relaxed whitespace-pre-line" style={{ color: "var(--text)" }}>
            {product.description}
          </p>
        </div>

        {/* ─── Related Products ─────────────────────────────────────────── */}
        {related && related.results.length > 1 && (
          <section>
            <h2
              className="text-lg font-bold mb-6"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.results
                .filter((p) => p.slug !== product.slug)
                .slice(0, 6)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}

function ProductDetailSkeleton() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />
          <div className="space-y-4">
            {[80, 60, 40, 70, 50].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-xl animate-pulse"
                style={{ background: "var(--surface)", width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
