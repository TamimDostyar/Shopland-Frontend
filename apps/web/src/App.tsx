import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setApiBaseUrl } from "@shopland/shared";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import { router } from "./router";

setApiBaseUrl(
  import.meta.env.MODE === "LOCAL"
    ? "http://localhost:8000"
    : (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:8000",
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // Don't hammer the API when throttled or forbidden.
      retry: (failureCount, error: unknown) => {
        const status = (error as { status?: number })?.status;
        if (status === 401 || status === 403 || status === 429) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string ?? "";

export default function App() {
  return (
    <LanguageProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0b0f1f",
                color: "#c8cde0",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
              },
              success: { iconTheme: { primary: "#4ade80", secondary: "#060816" } },
              error: { iconTheme: { primary: "#f87171", secondary: "#060816" } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
    </LanguageProvider>
  );
}
