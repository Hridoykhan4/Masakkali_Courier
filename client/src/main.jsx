// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import Router from "./routers/Router.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import ThemeProvider from "./providers/ThemeProvider.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <ToastContainer position="top-center" autoClose={2000} />
          <div className="font-urbanist antialiased">
            {/* Suspense is moved inside the Router elements for better UX */}
            <RouterProvider router={Router} />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
