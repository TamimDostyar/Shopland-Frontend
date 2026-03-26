import React from "react";
import { RouterProvider } from "react-router-dom";
import { setApiBaseUrl } from "@shopland/shared";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./router";

setApiBaseUrl(
  import.meta.env.MODE === "LOCAL"
    ? "http://localhost:8000"
    : (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:8000",
);

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
