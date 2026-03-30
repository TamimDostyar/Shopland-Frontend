import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@amazebid/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import BackButton from "../components/ui/BackButton";
import { ArrowLeftIcon, ArrowRightIcon, StarIcon, StoreIcon } from "../components/ui/icons";
import { useLanguage } from "../context/LanguageContext";

export default function SellerStorefront() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // The seller storefront endpoint uses a shop slug filter
  // We query products filtered by seller slug
  const { data, isLoading } = useQuery({
    queryKey: ["products", "seller", slug, sort, page],
    queryFn: () => getProducts({ sort: sort as never, page }),
    enabled: !!slug,
  });

  // Get seller info from the first product
  const products = data?.results ?? [];
  const seller = products[0]?.seller;
  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <BackButton className="mb-6" />

        {/* Shop header */}
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-6 mb-8 flex items-center gap-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
          <div
            className="size-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 bg-[var(--surface-accent)] text-[color:var(--accent)]"
          >
            <StoreIcon size={26} />
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              {seller?.shop_name ?? slug}
            </h1>
            {(seller?.average_rating ?? 0) > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <StarIcon size={14} style={{ color: "#e9a322", fill: "rgba(233,163,34,0.2)" }} />
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {seller?.average_rating?.toFixed(1)} ({seller?.total_reviews} {t("storefront.reviews")})
                </span>
              </div>
            )}
            <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
              {data?.count ?? 0} {t("storefront.products")}
            </p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold" style={{ color: "var(--text-h)" }}>
            {t("storefront.all_products")}
          </h2>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-3 rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] text-sm font-semibold outline-none"
            style={{
              color: "var(--text)",
            }}
          >
            <option value="newest">{t("storefront.sort_newest")}</option>
            <option value="most_viewed">{t("storefront.sort_popular")}</option>
            <option value="price_asc">{t("storefront.sort_price_low")}</option>
            <option value="price_desc">{t("storefront.sort_price_high")}</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white py-16 text-center shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <StoreIcon size={28} />
            </div>
            <p style={{ color: "var(--text-soft)" }}>{t("storefront.no_products")}</p>
            <Link to="/" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--accent)" }}>
              <ArrowLeftIcon size={15} />
              {t("storefront.back_home")}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-30"
                  style={{ color: "var(--text)" }}
                >
                  <ArrowLeftIcon size={15} />
                  {t("storefront.prev")}
                </button>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {t("storefront.page")} {page} {t("storefront.page_of")} {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-30"
                  style={{ color: "var(--text)" }}
                >
                  {t("storefront.next")}
                  <ArrowRightIcon size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
