import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts, getProducts } from "@amazebid/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import BackButton from "../components/ui/BackButton";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "../components/ui/icons";
import { useLanguage } from "../context/LanguageContext";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const query = searchParams.get("q") ?? "";
  const sortParam = (searchParams.get("sort") ?? "newest") as string;
  const [sort, setSort] = useState(sortParam);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSort(searchParams.get("sort") ?? "newest");
    setPage(1);
  }, [query, searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["search", query, sort, page],
    queryFn: () =>
      query
        ? searchProducts(query, { sort: sort as never, page })
        : getProducts({ sort: sort as never, page }),
  });

  const products = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  function updateSort(newSort: string) {
    setSort(newSort);
    setPage(1);
    const params: Record<string, string> = { sort: newSort };
    if (query) params.q = query;
    setSearchParams(params);
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <BackButton to="/" label={t("search.back_home")} className="mb-5" />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-[2rem] border border-[color:var(--border)] bg-white px-6 py-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              {t("search.results_label")}
            </div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}>
              {query ? `${t("search.results_for")} "${query}"` : t("search.all_products")}
            </h1>
            {data && (
              <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }}>
                {data.count} {data.count === 1 ? t("search.count_product") : t("search.count_products")}
              </p>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
            className="rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold outline-none"
            style={{
              color: "var(--text)",
            }}
          >
            <option value="newest">{t("search.sort_newest")}</option>
            <option value="most_viewed">{t("search.sort_popular")}</option>
            <option value="price_asc">{t("search.sort_price_asc")}</option>
            <option value="price_desc">{t("search.sort_price_desc")}</option>
          </select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div
            className="rounded-[2rem] border border-[color:var(--border)] bg-white p-16 text-center shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <SearchIcon size={28} />
            </div>
            <p className="mb-2 font-medium" style={{ color: "var(--text-h)" }}>
              {t("search.no_results")} &ldquo;{query}&rdquo;
            </p>
            <p className="mb-6 text-sm" style={{ color: "var(--text-soft)" }}>
              {t("search.no_results_hint")}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              {t("search.browse_home")}
              <ArrowRightIcon size={15} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--text)] disabled:opacity-30"
                >
                  <ArrowLeftIcon size={15} />
                  {t("search.prev")}
                </button>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {page} {t("search.page_of")} {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--text)] disabled:opacity-30"
                >
                  {t("search.next")}
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
