import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  getProducts,
  getCategories,
  getApiBaseUrl,
  type Category,
  type Locale,
  type Product,
} from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import { useLanguage } from "../context/LanguageContext";
import {
  ArrowRightIcon,
  CategoryIcon,
} from "../components/ui/icons";

function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) {
    const base = getApiBaseUrl();
    return `${base.replace(/\/$/, "")}${url}`;
  }
  return url;
}

function getProductImage(product: Product): string | null {
  const primaryImageUnknown = (product as unknown as { primary_image?: unknown }).primary_image;
  const rawImg =
    (typeof primaryImageUnknown === "string"
      ? primaryImageUnknown
      : (primaryImageUnknown as { image?: string } | undefined)?.image) ??
    product.images?.[0]?.image;

  return resolveMediaUrl(rawImg);
}

function localizedCategoryName(cat: { name: string; name_fa?: string; name_ps?: string }, locale: Locale): string {
  if (locale === "fa" && cat.name_fa) return cat.name_fa;
  if (locale === "ps" && cat.name_ps) return cat.name_ps;
  return cat.name;
}

export default function Home() {
  const { t, locale } = useLanguage();

  const { data: categoriesData, isLoading: catLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ["products", "most_viewed"],
    queryFn: () => getProducts({ sort: "most_viewed", limit: 8 }),
  });

  const { data: newestData, isLoading: newestLoading } = useQuery({
    queryKey: ["products", "newest"],
    queryFn: () => getProducts({ sort: "newest", limit: 8 }),
  });

  const categories = categoriesData ?? [];
  const featured: Product[] = featuredData?.results ?? [];
  const newest: Product[] = newestData?.results ?? [];
  const showcaseProducts = [...featured, ...newest].filter(
    (product, index, list) => list.findIndex((item) => item.id === product.id) === index,
  ).slice(0, 8);

  return (
    <MainLayout>
      <section className="px-4 pt-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-white p-4 shadow-[0_30px_80px_rgba(23,32,51,0.1)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  {t("home.featured_label")}
                </div>
                <h1
                  className="mt-1 text-3xl font-bold sm:text-4xl"
                  style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
                >
                  {t("home.featured_title")}
                </h1>
              </div>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(255,106,61,0.26)]"
              >
                {t("home.browse_all")}
                <ArrowRightIcon size={16} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
              <FeaturedShowcaseCard product={showcaseProducts[0]} large locale={locale} featuredFallback={t("home.featured_fallback")} />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                {showcaseProducts.slice(1, 3).map((product) => (
                  <FeaturedShowcaseCard key={product.id} product={product} locale={locale} featuredFallback={t("home.featured_fallback")} />
                ))}
                {showcaseProducts.length < 3 &&
                  Array.from({ length: 3 - showcaseProducts.length }).map((_, index) => (
                    <FeaturedShowcaseCard key={`placeholder-top-${index}`} locale={locale} featuredFallback={t("home.featured_fallback")} />
                  ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showcaseProducts.slice(3, 6).map((product) => (
                <FeaturedShowcaseCard key={product.id} product={product} compact locale={locale} featuredFallback={t("home.featured_fallback")} />
              ))}
              {showcaseProducts.length < 6 &&
                Array.from({ length: 6 - showcaseProducts.length }).map((_, index) => (
                  <FeaturedShowcaseCard key={`placeholder-bottom-${index}`} compact locale={locale} featuredFallback={t("home.featured_fallback")} />
                ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {showcaseProducts.slice(6, 8).map((product) => (
              <FeaturedShowcaseCard key={product.id} product={product} locale={locale} featuredFallback={t("home.featured_fallback")} />
            ))}
            {showcaseProducts.length < 8 &&
              Array.from({ length: 8 - showcaseProducts.length }).map((_, index) => (
                <FeaturedShowcaseCard key={`placeholder-side-${index}`} locale={locale} featuredFallback={t("home.featured_fallback")} />
              ))}
            <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,#fff4ec,#eef5ff)] p-6 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                {t("home.shop_more_label")}
              </div>
              <h2
                className="mt-2 text-2xl font-bold"
                style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
              >
                {t("home.shop_more_title")}
              </h2>
              <p className="mt-3 text-sm text-[color:var(--text-soft)]">
                {t("home.shop_more_desc")}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/search?sort=most_viewed"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(255,106,61,0.22)]"
                >
                  {t("home.best_sellers")}
                  <ArrowRightIcon size={15} />
                </Link>
                <Link
                  to="/search?sort=newest"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--text-h)]"
                >
                  {t("home.new_arrivals")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                {t("home.department_label")}
              </div>
              <h2 className="text-2xl font-bold text-[color:var(--text-h)]" style={{ fontFamily: "var(--heading)" }}>
                {t("home.department_title")}
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent)]"
            >
              {t("home.browse_catalog")}
              <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {catLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 w-36 shrink-0 animate-pulse rounded-2xl"
                    style={{ background: "var(--surface-muted)" }}
                  />
                ))
              : categories
                  .filter((c: Category) => !c.parent)
                  .slice(0, 10)
                  .map((cat: Category) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex shrink-0 items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold whitespace-nowrap text-[color:var(--text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-white hover:text-[color:var(--accent)]"
                    >
                      <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[color:var(--accent)]">
                        <CategoryIcon slug={cat.slug} size={18} />
                      </div>
                      {localizedCategoryName(cat, locale)}
                    </Link>
                  ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10">
        <ProductSection
          title={t("home.popular_title")}
          subtitle={t("home.popular_subtitle")}
          products={featured}
          loading={featuredLoading}
          seeAllLink="/search?sort=most_viewed"
          seeAllLabel={t("home.see_all")}
          emptyLabel={t("home.no_products")}
        />

        <ProductSection
          title={t("home.just_added_title")}
          subtitle={t("home.just_added_subtitle")}
          products={newest}
          loading={newestLoading}
          seeAllLink="/search?sort=newest"
          seeAllLabel={t("home.see_all")}
          emptyLabel={t("home.no_products")}
        />

        {!catLoading && categories.length > 0 && (
          <section>
            <SectionHeader
              title={t("home.by_category_title")}
              subtitle={t("home.by_category_subtitle")}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories
                .filter((c: Category) => !c.parent)
                .slice(0, 12)
                .map((cat: Category) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group flex flex-col items-start gap-4 rounded-[1.75rem] border border-[color:var(--border)] bg-white p-5 text-left shadow-[0_16px_40px_rgba(23,32,51,0.05)] transition-all hover:-translate-y-1 hover:border-[color:var(--accent)]"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
                      <CategoryIcon slug={cat.slug} size={22} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-h)" }}>
                      {localizedCategoryName(cat, locale)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--accent)]">
                      {t("home.shop_now")}
                      <ArrowRightIcon size={13} />
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}

function SectionHeader({
  title,
  subtitle,
  seeAllLink,
  seeAllLabel = "See all",
}: {
  title: string;
  subtitle?: string;
  seeAllLink?: string;
  seeAllLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {seeAllLink && (
        <Link
          to={seeAllLink}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-accent)] px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
          style={{ color: "var(--accent)" }}
        >
          {seeAllLabel}
          <ArrowRightIcon size={14} />
        </Link>
      )}
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  loading,
  seeAllLink,
  seeAllLabel,
  emptyLabel,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  loading: boolean;
  seeAllLink?: string;
  seeAllLabel?: string;
  emptyLabel?: string;
}) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} seeAllLink={seeAllLink} seeAllLabel={seeAllLabel} />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div
          className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-10 text-center shadow-[0_18px_46px_rgba(23,32,51,0.05)]"
        >
          <p style={{ color: "var(--text-soft)" }}>{emptyLabel}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedShowcaseCard({
  product,
  large = false,
  compact = false,
  locale,
  featuredFallback,
}: {
  product?: Product;
  large?: boolean;
  compact?: boolean;
  locale: Locale;
  featuredFallback: string;
}) {
  const img = product ? getProductImage(product) : null;
  const price = product ? parseFloat(product.discount_price ?? product.price) : null;

  if (!product) {
    return (
      <div
        className={`overflow-hidden rounded-[1.6rem] bg-[var(--surface-muted)] animate-pulse ${
          large ? "min-h-[220px] sm:min-h-[360px]" : compact ? "min-h-[120px] sm:min-h-[140px]" : "min-h-[160px] sm:min-h-[172px]"
        }`}
      />
    );
  }

  const catName = product.category
    ? localizedCategoryName(product.category, locale)
    : featuredFallback;

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group relative overflow-hidden rounded-[1.6rem] border border-[color:var(--border)] bg-[var(--surface-muted)] shadow-[0_16px_40px_rgba(23,32,51,0.06)] ${
        large ? "min-h-[220px] sm:min-h-[360px]" : compact ? "min-h-[120px] sm:min-h-[140px]" : "min-h-[160px] sm:min-h-[172px]"
      }`}
    >
      {img ? (
        <img
          src={img}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fff1ea,#edf4ff)]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.02),rgba(17,24,39,0.68))]" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">
          {catName}
        </div>
        <div className={`${large ? "mt-3 max-w-md text-2xl sm:text-3xl" : compact ? "mt-2 text-base" : "mt-3 text-lg"} font-bold leading-tight text-white`}>
          {product.name}
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-white/80">
            {product.seller?.shop_name ?? "Shopland Seller"}
          </div>
          {price !== null && (
            <div className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-[color:var(--text-h)]">
              ؋{price.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
