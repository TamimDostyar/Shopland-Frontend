import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategory, getProducts } from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import BackButton from "../components/ui/BackButton";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back + Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--text-soft)" }}>
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            {category?.parent && (
              <>
                <Link to={`/category/${category.parent.slug}`} className="hover:underline">
                  {category.parent.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: "var(--text)" }}>{category?.name ?? slug}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              {category?.name ?? slug}
            </h1>
            {data && (
              <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
                {data.count} products
              </p>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm outline-none"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            <option value="newest">Newest</option>
            <option value="most_viewed">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Subcategories */}
        {category && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {category.children.map((child) => (
              <Link
                key={child.id}
                to={`/category/${child.slug}`}
                className="px-3 py-1.5 rounded-xl text-sm transition-all hover:border-accent hover:text-accent"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">📦</p>
            <p className="font-medium" style={{ color: "var(--text-h)" }}>
              No products in this category yet
            </p>
            <Link to="/" className="text-sm mt-2 block" style={{ color: "var(--accent)" }}>
              ← Back to home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl text-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  ← Prev
                </button>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl text-sm disabled:opacity-30"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
