import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategory, getProducts, localizedCategoryName } from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import BackButton from "../components/ui/BackButton";
import { ArrowLeftIcon, ArrowRightIcon, CategoryIcon } from "../components/ui/icons";
import { useLanguage } from "../context/LanguageContext";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useLanguage();
  const [sort, setSort] = useState<string>("newest");
  const [page, setPage] = useState(1);

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategory(slug!),
    enabled: !!slug,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", "category", slug, sort, page],
    queryFn: () => getProducts({ category: slug, sort: sort as never, page }),
    enabled: !!slug,
  });

  const products = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  const categoryTitle = category
    ? localizedCategoryName(category, locale)
    : slug ?? "";

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <BackButton label={t("common.back")} />
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
            <Link to="/" className="hover:underline">{t("category.home_breadcrumb")}</Link>
            <span>/</span>
            {category?.parent && (
              <>
                <Link to={`/category/${category.parent.slug}`} className="hover:underline">
                  {localizedCategoryName(category.parent, locale)}
                </Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: "var(--text)" }}>{categoryTitle}</span>
          </nav>
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-[2rem] border border-[color:var(--border)] bg-white px-6 py-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
          <div>
            <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <CategoryIcon slug={slug} size={24} />
            </div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}>
              {categoryTitle}
            </h1>
            {data && (
              <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }}>
                {data.count} {t("category.count_products")}
              </p>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold outline-none"
            style={{
              color: "var(--text)",
            }}
          >
            <option value="newest">{t("category.sort_newest")}</option>
            <option value="most_viewed">{t("category.sort_popular")}</option>
            <option value="price_asc">{t("category.sort_price_asc")}</option>
            <option value="price_desc">{t("category.sort_price_desc")}</option>
          </select>
        </div>

        {category && category.children.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                to={`/category/${child.slug}`}
                className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--text)] transition-all hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                {localizedCategoryName(child, locale)}
              </Link>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div
            className="rounded-[2rem] border border-[color:var(--border)] bg-white p-16 text-center shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[color:var(--accent)]">
              <CategoryIcon slug={slug} size={28} />
            </div>
            <p className="font-medium" style={{ color: "var(--text-h)" }}>
              {t("category.empty")}
            </p>
            <Link to="/" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--accent)" }}>
              <ArrowLeftIcon size={15} />
              {t("category.back_home")}
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
                  {t("category.prev")}
                </button>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {t("category.page_word")} {page} {t("category.page_of")} {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--text)] disabled:opacity-30"
                >
                  {t("category.next")}
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
