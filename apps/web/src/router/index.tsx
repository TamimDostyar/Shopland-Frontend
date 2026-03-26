import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

// Auth pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterBuyer from "../pages/RegisterBuyer";
import RegisterSeller from "../pages/RegisterSeller";
import VerifyTelegram from "../pages/VerifyTelegram";

// Public pages
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import CategoryPage from "../pages/CategoryPage";
import SearchResults from "../pages/SearchResults";
import SellerStorefront from "../pages/SellerStorefront";

// Buyer pages
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import MyOrders from "../pages/buyer/MyOrders";
import OrderDetail from "../pages/buyer/OrderDetail";

// Profile pages
import Profile from "../pages/app/Profile";
import Addresses from "../pages/app/Addresses";

// Seller pages
import SellerDashboard from "../pages/seller/Dashboard";
import SellerProducts from "../pages/seller/Products";
import AddEditProduct from "../pages/seller/AddEditProduct";
import Inventory from "../pages/seller/Inventory";
import SellerOrders from "../pages/seller/Orders";
import SellerOrderDetail from "../pages/seller/SellerOrderDetail";
import Earnings from "../pages/seller/Earnings";

// Admin pages
import SellerList from "../pages/admin/SellerList";
import SellerDetail from "../pages/admin/SellerDetail";
import IDReview from "../pages/admin/IDReview";
import ProductApproval from "../pages/admin/ProductApproval";

// ─── Route guards ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div
        className="size-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
      />
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function SellerRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "seller" && user?.role !== "admin")
    return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  // Public
  { path: "/", element: <Home /> },
  { path: "/product/:slug", element: <ProductDetail /> },
  { path: "/category/:slug", element: <CategoryPage /> },
  { path: "/search", element: <SearchResults /> },
  { path: "/shop/:slug", element: <SellerStorefront /> },

  // Auth
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/register/buyer", element: <RegisterBuyer /> },
  { path: "/register/seller", element: <RegisterSeller /> },
  { path: "/verify-telegram", element: <VerifyTelegram /> },

  // Cart & Checkout (protected)
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-confirmed/:orderNumber",
    element: (
      <ProtectedRoute>
        <OrderConfirmation />
      </ProtectedRoute>
    ),
  },

  // Buyer Orders
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <MyOrders />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders/:orderNumber",
    element: (
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    ),
  },

  // Profile
  { path: "/app", element: <Navigate to="/profile" replace /> },
  { path: "/app/profile", element: <Navigate to="/profile" replace /> },
  { path: "/app/addresses", element: <Navigate to="/profile/addresses" replace /> },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/addresses",
    element: (
      <ProtectedRoute>
        <Addresses />
      </ProtectedRoute>
    ),
  },

  // Seller Dashboard
  {
    path: "/seller",
    element: (
      <SellerRoute>
        <SellerDashboard />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/products",
    element: (
      <SellerRoute>
        <SellerProducts />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/products/new",
    element: (
      <SellerRoute>
        <AddEditProduct />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/products/:id/edit",
    element: (
      <SellerRoute>
        <AddEditProduct />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/inventory",
    element: (
      <SellerRoute>
        <Inventory />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/orders",
    element: (
      <SellerRoute>
        <SellerOrders />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/orders/:orderNumber",
    element: (
      <SellerRoute>
        <SellerOrderDetail />
      </SellerRoute>
    ),
  },
  {
    path: "/seller/earnings",
    element: (
      <SellerRoute>
        <Earnings />
      </SellerRoute>
    ),
  },

  // Admin
  {
    path: "/admin",
    element: <Navigate to="/admin/products" replace />,
  },
  {
    path: "/admin/products",
    element: (
      <AdminRoute>
        <ProductApproval />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/sellers/:status",
    element: (
      <AdminRoute>
        <SellerList />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/sellers/detail/:id",
    element: (
      <AdminRoute>
        <SellerDetail />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/id-review",
    element: (
      <AdminRoute>
        <IDReview />
      </AdminRoute>
    ),
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);
