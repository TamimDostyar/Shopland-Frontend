import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  getProducts,
  getCategories,
  type Category,
  type Product,
} from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import {
  ArrowRightIcon,
  CategoryIcon,
  CheckCircleIcon,
  ShieldIcon,
  SparklesIcon,
  StoreIcon,
  TruckIcon,
} from "../components/ui/icons";

export default function Home() {
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

  return (
    <MainLayout>
      <section className="px-4 pt-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fff4ec,#eef5ff)] px-7 py-8 shadow-[0_30px_80px_rgba(23,32,51,0.1)] sm:px-10 sm:py-12">
            <div className="absolute -right-16 top-8 h-52 w-52 rounded-full bg-[rgba(31,122,255,0.12)] blur-3xl" />
            <div className="absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-[rgba(255,106,61,0.16)] blur-3xl" />
            <div className="relative max-w-2xl">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)] shadow-[0_14px_36px_rgba(23,32,51,0.06)]">
                <SparklesIcon size={14} />
                Reimagined marketplace
              </span>
              <h1
                className="max-w-2xl text-4xl font-bold leading-[1.02] sm:text-6xl"
                style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
              >
                Shop cleaner, brighter, and faster across every aisle.
              </h1>
              <p className="mt-5 max-w-xl text-lg" style={{ color: "var(--text-soft)" }}>
                Discover verified sellers, polished storefronts, and a marketplace flow inspired by the clarity of top ecommerce platforms without the clutter.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(255,106,61,0.26)]"
                >
                  Browse products
                  <ArrowRightIcon size={16} />
                </Link>
                <Link
                  to="/register/seller"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/85 px-6 py-3.5 text-sm font-semibold text-[color:var(--text-h)] shadow-[0_14px_32px_rgba(23,32,51,0.05)]"
                >
                  <StoreIcon size={16} />
                  Start selling
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                icon: <ShieldIcon size={18} />,
                title: "Verified shopping",
                text: "Identity-backed buyer and seller accounts improve trust across the platform.",
              },
              {
                icon: <TruckIcon size={18} />,
                title: "Cash on delivery",
                text: "Simple order flow with delivery-first payment expectations built in.",
              },
              {
                icon: <CheckCircleIcon size={18} />,
                title: "Modern storefronts",
                text: "Cleaner product cards, faster scanning, and stronger visual hierarchy throughout.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_46px_rgba(23,32,51,0.06)]"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold text-[color:var(--text-h)]">{item.title}</h2>
                <p className="mt-2 text-sm text-[color:var(--text-soft)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-[color:var(--border)] bg-white/72 p-4 shadow-[0_18px_46px_rgba(23,32,51,0.05)] backdrop-blur-sm md:grid-cols-3">
          {[
            { stat: "20k+", label: "Monthly browsing sessions" },
            { stat: "Verified", label: "Identity and profile checks" },
            { stat: "Bright UX", label: "Modern marketplace refresh" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.4rem] bg-[var(--surface-muted)] px-5 py-4">
              <div className="text-2xl font-bold text-[color:var(--text-h)]" style={{ fontFamily: "var(--heading)" }}>
                {item.stat}
              </div>
              <div className="text-sm text-[color:var(--text-soft)]">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_46px_rgba(23,32,51,0.06)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                Shop by department
              </div>
              <h2 className="text-2xl font-bold text-[color:var(--text-h)]" style={{ fontFamily: "var(--heading)" }}>
                Explore the catalog faster
              </h2>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent)]"
            >
              Browse full catalog
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
                  .map((cat: Category) => {
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="flex shrink-0 items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold whitespace-nowrap text-[color:var(--text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:bg-white hover:text-[color:var(--accent)]"
                      >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[color:var(--accent)]">
                          <CategoryIcon slug={cat.slug} size={18} />
                        </div>
                        {cat.name}
                      </Link>
                    );
                  })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10">
        <ProductSection
          title="Popular Products"
          subtitle="High-interest items surfaced in a cleaner, faster shopping grid"
          products={featured}
          loading={featuredLoading}
          seeAllLink="/search?sort=most_viewed"
        />

        <ProductSection
          title="Just Added"
          subtitle="Fresh listings from shops that recently updated their catalog"
          products={newest}
          loading={newestLoading}
          seeAllLink="/search?sort=newest"
        />

        {!catLoading && categories.length > 0 && (
          <section>
            <SectionHeader title="Browse by Category" subtitle="Jump directly into the departments shoppers use most." />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories
                .filter((c: Category) => !c.parent)
                .slice(0, 12)
                .map((cat: Category) => {
                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="group flex flex-col items-start gap-4 rounded-[1.75rem] border border-[color:var(--border)] bg-white p-5 text-left shadow-[0_16px_40px_rgba(23,32,51,0.05)] transition-all hover:-translate-y-1 hover:border-[color:var(--accent)]"
                    >
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-accent)] text-[color:var(--accent)]">
                        <CategoryIcon slug={cat.slug} size={22} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "var(--text-h)" }}>
                        {cat.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--accent)]">
                        Shop now
                        <ArrowRightIcon size={13} />
                      </span>
                    </Link>
                  );
                })}
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
}: {
  title: string;
  subtitle?: string;
  seeAllLink?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
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
          See all
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
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  loading: boolean;
  seeAllLink?: string;
}) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} seeAllLink={seeAllLink} />
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
          <p style={{ color: "var(--text-soft)" }}>No products available yet.</p>
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
