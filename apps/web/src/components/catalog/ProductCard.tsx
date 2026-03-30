import { Link } from "react-router-dom";
import { getApiBaseUrl, localizedCategoryName, localizedProductName, type Product } from "@amazebid/shared";
import { useLanguage } from "../../context/LanguageContext";
import { ImageIcon, LocationIcon, StarIcon } from "../ui/icons";

interface Props {
  product: Product;
}

function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Absolute URL already
  if (/^https?:\/\//i.test(url)) return url;
  // Relative media path from API (e.g. "/media/...")
  if (url.startsWith("/")) {
    const base = getApiBaseUrl();
    return `${base.replace(/\/$/, "")}${url}`;
  }
  return url;
}

export default function ProductCard({ product }: Props) {
  const { t, locale } = useLanguage();
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price
    ? parseFloat(product.discount_price)
    : null;
  const displayPrice = discountPrice ?? price;
  // Backend returns `primary_image` as an object (e.g. { image: url, ... }),
  // but frontend types allow it to be missing/string. Handle both safely.
  const primaryImageUnknown = (product as unknown as { primary_image?: unknown }).primary_image;
  const rawImg =
    (typeof primaryImageUnknown === "string" ? primaryImageUnknown : (primaryImageUnknown as any)?.image) ??
    product.images?.[0]?.image;
  const img = resolveMediaUrl(rawImg);
  const sellerName = product.seller?.shop_name ?? t("product.seller_fallback");
  const title = localizedProductName(product, locale);
  const categoryLabel = product.category
    ? localizedCategoryName(product.category, locale)
    : t("product.category_fallback");

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-[1.85rem] border border-[color:var(--border)] bg-white shadow-[0_18px_42px_rgba(23,32,51,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_64px_rgba(23,32,51,0.11)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,1), rgba(250,251,255,0.98))",
      }}
    >
      <div
        className="relative aspect-square overflow-hidden bg-[linear-gradient(180deg,#f4f6fb,#eef3f8)]"
      >
        {img ? (
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[color:var(--text-soft)]">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/70">
              <ImageIcon size={28} />
            </div>
          </div>
        )}

        {discountPrice && (
          <div
            className="absolute left-3 top-3 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-white shadow-[0_10px_24px_rgba(255,106,61,0.24)]"
          >
            -{Math.round((1 - discountPrice / price) * 100)}%
          </div>
        )}

        {product.in_stock === false && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(23,32,51,0.38)" }}
          >
            <span
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[color:var(--error)]"
            >
              {t("product.out_of_stock")}
            </span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">
            {categoryLabel}
          </span>
          {product.city && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-accent)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--accent)]">
              <LocationIcon size={12} />
              {product.city}
            </span>
          )}
        </div>

        <p
          className="mb-2 line-clamp-2 min-h-[2.6rem] text-[13px] font-semibold leading-snug sm:min-h-[2.9rem] sm:text-[15px]"
          style={{ color: "var(--text-h)" }}
        >
          {title}
        </p>

        <div className="mb-2 flex items-end gap-2">
          <span className="text-lg font-bold sm:text-xl" style={{ color: "var(--text-h)" }}>
            ؋{displayPrice.toLocaleString()}
          </span>
          {discountPrice && (
            <span className="text-sm line-through" style={{ color: "var(--text-soft)" }}>
              ؋{price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-xs font-medium" style={{ color: "var(--text-soft)" }}>
            {sellerName}
          </p>
          <span className="text-xs font-semibold text-[color:var(--accent)]">
            {t("product.view_item")}
          </span>
        </div>

        {(product.average_rating ?? 0) > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            <StarIcon size={14} style={{ color: "#e9a322", fill: "rgba(233,163,34,0.22)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-soft)" }}>
              {product.average_rating?.toFixed(1)} ({product.review_count})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
