import { Link } from "react-router-dom";
import type { Product } from "@shopland/shared";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price
    ? parseFloat(product.discount_price)
    : null;
  const displayPrice = discountPrice ?? price;
  // Backend returns `primary_image` as an object (e.g. { image: url, ... }),
  // but frontend types allow it to be missing/string. Handle both safely.
  const primaryImageUnknown = (product as unknown as { primary_image?: unknown }).primary_image;
  const img =
    (typeof primaryImageUnknown === "string" ? primaryImageUnknown : (primaryImageUnknown as any)?.image) ??
    product.images?.[0]?.image;
  const sellerName = product.seller?.shop_name ?? "Shopland Seller";

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
            🛍️
          </div>
        )}

        {discountPrice && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: "var(--accent)", color: "white" }}
          >
            -{Math.round((1 - discountPrice / price) * 100)}%
          </div>
        )}

        {product.in_stock === false && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(6,8,22,0.7)" }}
          >
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(248,113,113,0.2)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p
          className="text-sm font-medium leading-snug line-clamp-2 mb-2"
          style={{ color: "var(--text-h)" }}
        >
          {product.name}
        </p>

        <div className="flex items-end gap-2 mb-2">
          <span className="text-base font-bold" style={{ color: "var(--accent)" }}>
            ؋{displayPrice.toLocaleString()}
          </span>
          {discountPrice && (
            <span className="text-xs line-through" style={{ color: "var(--text-soft)" }}>
              ؋{price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs truncate" style={{ color: "var(--text-soft)" }}>
            {sellerName}
          </p>
          {product.city && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-soft)" }}
            >
              {product.city}
            </span>
          )}
        </div>

        {(product.average_rating ?? 0) > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs" style={{ color: "#facc15" }}>★</span>
            <span className="text-xs" style={{ color: "var(--text-soft)" }}>
              {product.average_rating?.toFixed(1)} ({product.review_count})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
