import React from "react";
import { APP_NAME, APP_VERSION, formatPrice, formatDate } from "@shopland/shared";
import type { Product } from "@shopland/shared";

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Handmade Ceramic Vase",
    description: "A beautiful hand-crafted ceramic vase.",
    price: 49.99,
    currency: "USD",
    images: [],
    category: "Home & Garden",
    sellerId: "u1",
    createdAt: new Date().toISOString(),
  },
];

export default function App(): React.JSX.Element {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "2px solid #222", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{APP_NAME}</h1>
        <span style={{ fontSize: "0.875rem", color: "#666" }}>v{APP_VERSION} — Desktop (Electron)</span>
      </header>
      <main>
        <h2 style={{ marginBottom: "1rem" }}>Featured Listings</h2>
        {DEMO_PRODUCTS.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "1.25rem",
              marginBottom: "1rem",
            }}
          >
            <h3>{p.title}</h3>
            <p style={{ color: "#555" }}>{p.description}</p>
            <strong style={{ color: "#2a7a2a" }}>{formatPrice(p.price, p.currency)}</strong>
            <br />
            <time style={{ fontSize: "0.75rem", color: "#999" }}>{formatDate(p.createdAt)}</time>
          </div>
        ))}
      </main>
    </div>
  );
}
