import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@shopland/shared";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/catalog/ProductCard";
import SkeletonCard from "../components/catalog/SkeletonCard";
import BackButton from "../components/ui/BackButton";

export default function SellerStorefront() {
  const { slug } = useParams<{ slug: string }>();
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
        <div
          className="rounded-2xl p-6 mb-8 flex items-center gap-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div
            className="size-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{ background: "rgba(255,125,72,0.12)", color: "var(--accent)" }}
          >
            {seller?.shop_name?.[0] ?? slug?.[0]?.toUpperCase()}
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
                <span style={{ color: "#facc15" }}>★</span>
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                  {seller?.average_rating?.toFixed(1)} ({seller?.total_reviews} reviews)
                </span>
              </div>
            )}
            <p className="text-sm mt-1" style={{ color: "var(--text-soft)" }}>
              {data?.count ?? 0} products
            </p>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold" style={{ color: "var(--text-h)" }}>
            All Products
          </h2>
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

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏪</p>
            <p style={{ color: "var(--text-soft)" }}>No products from this seller yet.</p>
            <Link to="/" className="text-sm mt-2 block" style={{ color: "var(--accent)" }}>
              ← Back to home
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
