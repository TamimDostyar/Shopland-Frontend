import { createHashRouter, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterBuyer from "../pages/RegisterBuyer";
import RegisterSeller from "../pages/RegisterSeller";
import VerifyPhone from "../pages/VerifyPhone";
import VerifyEmail from "../pages/VerifyEmail";
import Profile from "../pages/app/Profile";
import Addresses from "../pages/app/Addresses";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Electron uses hash routing (file:// protocol)
export const router = createHashRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/register/buyer", element: <RegisterBuyer /> },
  { path: "/register/seller", element: <RegisterSeller /> },
  { path: "/verify-phone", element: <VerifyPhone /> },
  { path: "/verify-email", element: <VerifyEmail /> },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Navigate to="/app/profile" replace />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app/addresses",
    element: (
      <ProtectedRoute>
        <Addresses />
      </ProtectedRoute>
    ),
  },
]);
