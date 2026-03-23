import { APP_NAME, APP_VERSION, formatPrice, formatDate } from "@shopland/shared";
import type { Product } from "@shopland/shared";
import "./App.css";

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
  {
    id: "2",
    title: "Vintage Leather Wallet",
    description: "Genuine leather bifold wallet.",
    price: 29.99,
    currency: "USD",
    images: [],
    category: "Accessories",
    sellerId: "u2",
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>{APP_NAME}</h1>
        <span className="version">v{APP_VERSION} — Web</span>
      </header>
      <main>
        <h2>Featured Listings</h2>
        <ul className="product-list">
          {DEMO_PRODUCTS.map((p) => (
            <li key={p.id} className="product-card">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="price">{formatPrice(p.price, p.currency)}</span>
              <time>{formatDate(p.createdAt)}</time>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
