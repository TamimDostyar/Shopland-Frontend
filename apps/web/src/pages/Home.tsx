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

const CATEGORY_ICONS: Record<string, string> = {
  electronics: "📱",
  clothing: "👕",
  food: "🍎",
  home: "🏠",
  books: "📚",
  sports: "⚽",
  toys: "🧸",
  beauty: "💄",
  automotive: "🚗",
  health: "💊",
};

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
      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,125,72,0.12) 0%, rgba(80,70,255,0.12) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(255,125,72,0.15)", color: "var(--accent)", border: "1px solid rgba(255,125,72,0.25)" }}
          >
            Afghanistan's Online Marketplace
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
          >
            Buy & Sell with{" "}
            <span style={{ color: "var(--accent)" }}>Confidence</span>
          </h1>
          <p className="text-lg max-w-xl mb-8" style={{ color: "var(--text-soft)" }}>
            Discover thousands of products from verified sellers across Afghanistan.
            Fast delivery, cash on delivery, trusted transactions.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link
              to="/search"
              className="px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Browse Products
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl font-semibold transition-colors hover:bg-white/5"
              style={{ border: "1px solid var(--border)", color: "var(--text-h)" }}
            >
              Start Selling
            </Link>
          </div>
        </div>

        {/* Decorative orbs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "var(--accent)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "#5046e5" }}
        />
      </section>

      {/* ─── Category Bar ─────────────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {catLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-28 rounded-xl shrink-0 animate-pulse"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  />
                ))
              : categories
                  .filter((c: Category) => !c.parent)
                  .slice(0, 10)
                  .map((cat: Category) => {
                    const icon =
                      CATEGORY_ICONS[cat.slug] ??
                      CATEGORY_ICONS[cat.name.toLowerCase()] ??
                      "🛍️";
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all hover:-translate-y-0.5"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                          (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                          (e.currentTarget as HTMLElement).style.color = "var(--text)";
                        }}
                      >
                        <span>{icon}</span>
                        {cat.name}
                      </Link>
                    );
                  })}
            <Link
              to="/search"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-all hover:opacity-90"
              style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)", border: "1px solid rgba(255,125,72,0.2)" }}
            >
              All Categories →
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
        {/* ─── Featured Products ─────────────────────────────────────────── */}
        <ProductSection
          title="Popular Products"
          subtitle="Most viewed items by shoppers"
          products={featured}
          loading={featuredLoading}
          seeAllLink="/search?sort=most_viewed"
        />

        {/* ─── Newest Arrivals ────────────────────────────────────────────── */}
        <ProductSection
          title="Just Added"
          subtitle="Fresh listings from our sellers"
          products={newest}
          loading={newestLoading}
          seeAllLink="/search?sort=newest"
        />

        {/* ─── Browse Categories ──────────────────────────────────────────── */}
        {!catLoading && categories.length > 0 && (
          <section>
            <SectionHeader title="Browse by Category" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories
                .filter((c: Category) => !c.parent)
                .slice(0, 12)
                .map((cat: Category) => {
                  const icon =
                    CATEGORY_ICONS[cat.slug] ??
                    CATEGORY_ICONS[cat.name.toLowerCase()] ??
                    "🛍️";
                  return (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-lg group"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      }}
                    >
                      <span className="text-3xl">{icon}</span>
                      <span className="text-sm font-medium" style={{ color: "var(--text-h)" }}>
                        {cat.name}
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
          className="text-xl font-bold"
          style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-soft)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {seeAllLink && (
        <Link
          to={seeAllLink}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--accent)" }}
        >
          See all →
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
          className="rounded-2xl p-10 text-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <p style={{ color: "var(--text-soft)" }}>No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
