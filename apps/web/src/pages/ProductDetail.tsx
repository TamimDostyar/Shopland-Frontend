import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ApiError,
  getProduct,
  addToCart,
  getProducts,
  localizedCategoryName,
  localizedProductName,
} from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import BackButton from "../components/ui/BackButton";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../context/LanguageContext";
import {
  ImageIcon,
  LocationIcon,
  StarIcon,
  StoreIcon,
  TruckIcon,
} from "../components/ui/icons";

export default function ProductDetail() {
  const { t, locale } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const { accessToken, isAuthenticated, user } = useAuth();
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
    if (user?.role !== "buyer") {
      toast.error(t("product.buyer_required_toast"));
      return;
    }
    if (!accessToken || !product) return;
    setAdding(true);
    try {
      await addToCart(accessToken, product.id, qty);
      await refreshCart();
      toast.success(t("product.added"));
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error(t("product.add_failed"));
      }
    } finally {
      setAdding(false);
    }
  }

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
            <ImageIcon size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-h)" }}>
            {t("product.not_found")}
          </h2>
          <Link to="/" className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
            {t("product.back_home")}
          </Link>
        </div>
      </MainLayout>
    );
  }

  const displayName = localizedProductName(product, locale);
  const categoryLabel = localizedCategoryName(product.category, locale);
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : null;
  const displayPrice = discountPrice ?? price;
  const images = product.images ?? [];
  const allImages = images.length > 0 ? images : product.primary_image ? [{ image: product.primary_image, id: "p", is_primary: true }] : [];
  const maxQty = product.available_quantity ?? 99;
  const canAddToCart = isAuthenticated && user?.role === "buyer" && product.in_stock !== false;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <BackButton />
          <nav className="hidden sm:flex items-center gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
            <Link to="/" style={{ color: "var(--text-soft)" }} className="hover:underline">
              {t("category.home_breadcrumb")}
            </Link>
            <span>/</span>
            <Link
              to={`/category/${product.category.slug}`}
              style={{ color: "var(--text-soft)" }}
              className="hover:underline"
            >
              {categoryLabel}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }} className="truncate max-w-[200px]">
              {displayName}
            </span>
          </nav>
        </div>

        <div className="mb-16 grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div
              className="aspect-square overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#f6f8fc,#eef3f8)] shadow-[0_22px_56px_rgba(23,32,51,0.08)]"
            >
              {allImages[selectedImg] ? (
                <img
                  src={allImages[selectedImg].image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[color:var(--text-soft)]">
                  <div className="flex size-20 items-center justify-center rounded-full bg-white/80">
                    <ImageIcon size={36} />
                  </div>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(i)}
                    className="size-18 shrink-0 overflow-hidden rounded-2xl bg-white transition-all"
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

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold capitalize text-[color:var(--text-soft)]"
              >
                {product.condition}
              </span>
              {product.city && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-accent)] px-3 py-1.5 text-xs font-semibold text-[color:var(--accent)]"
                >
                  <LocationIcon size={13} /> {product.city}, {product.province}
                </span>
              )}
            </div>

            <h1
              className="text-2xl font-bold leading-tight"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              {displayName}
            </h1>

            {(product.average_rating ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      size={16}
                      style={{ color: s <= Math.round(product.average_rating ?? 0) ? "#e9a322" : "rgba(23,32,51,0.18)", fill: s <= Math.round(product.average_rating ?? 0) ? "rgba(233,163,34,0.22)" : "transparent" }}
                    />
                  ))}
                </div>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {product.average_rating?.toFixed(1)} ({product.review_count} {t("product.reviews")})
                </span>
              </div>
            )}

            <div className="flex items-end gap-3">
              <span
                className="text-3xl font-bold sm:text-4xl"
                style={{ color: "var(--text-h)" }}
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
                    className="rounded-full bg-[var(--surface-accent)] px-3 py-1 text-sm font-bold"
                    style={{ background: "rgba(255,125,72,0.15)", color: "var(--accent)" }}
                  >
                    -{Math.round((1 - discountPrice / price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

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
                      only {product.available_quantity} left
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

            {product.in_stock !== false && (
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center overflow-hidden rounded-full border border-[color:var(--border)] bg-white"
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-lg font-medium transition-colors hover:bg-[var(--surface-muted)]"
                    style={{ color: "var(--text)" }}
                  >
                    -
                  </button>
                  <span
                    className="px-4 py-2.5 min-w-[3rem] text-center font-semibold"
                    style={{ color: "var(--text-h)" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="px-4 py-2.5 text-lg font-medium transition-colors hover:bg-[var(--surface-muted)]"
                    style={{ color: "var(--text)" }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => { void handleAddToCart(); }}
                  disabled={adding || !canAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,106,61,0.22)] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {adding ? (
                    <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {user && user.role !== "buyer" ? t("product.buyer_required_title") : t("product.add_to_cart")}
                </button>
              </div>
            )}

            {user && user.role !== "buyer" && (
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                You are signed in as `{user.role}`. Only buyer accounts can add products to the cart and place orders.
              </p>
            )}

            <div
              className="flex items-center gap-4 rounded-[1.75rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
            >
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-lg font-bold text-[color:var(--accent)]"
                style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)" }}
              >
                <StoreIcon size={20} />
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
                    Rated {product.seller.average_rating?.toFixed(1)} ({product.seller.total_reviews} reviews)
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

            <div
              className="flex items-center gap-3 rounded-[1.5rem] border border-[color:rgba(22,155,101,0.18)] bg-[var(--success-soft)] p-4"
            >
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-[color:var(--success)]">
                <TruckIcon size={18} />
              </div>
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                Cash on delivery available. Pay when your order arrives.
              </p>
            </div>

          </div>
        </div>

        <div
          className="mb-10 rounded-[2rem] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
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

        {related && related.results.length > 1 && (
          <section>
            <h2
              className="mb-6 text-2xl font-bold"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              Related Products
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
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
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-[2rem] animate-pulse" style={{ background: "var(--surface-muted)" }} />
          <div className="space-y-4">
            {[80, 60, 40, 70, 50].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-full animate-pulse"
                style={{ background: "rgba(23,32,51,0.08)", width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
