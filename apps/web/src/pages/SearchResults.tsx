import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchProducts, getProducts } from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import BackButton from "../components/ui/BackButton";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <BackButton to="/" label="Back to Home" className="mb-5" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--heading)", color: "var(--text-h)" }}
            >
              {query ? `Results for "${query}"` : "All Products"}
            </h1>
            {data && (
              <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
                {data.count} {data.count === 1 ? "product" : "products"} found
              </p>
            )}
          </div>
          <select
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
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

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium mb-2" style={{ color: "var(--text-h)" }}>
              No results for &ldquo;{query}&rdquo;
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-soft)" }}>
              Try a different search term or browse our categories.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl font-medium text-sm"
              style={{ background: "var(--accent)", color: "white" }}
            >
              Browse Home
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
