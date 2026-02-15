import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router"],
          map: ["leaflet", "react-leaflet"],
          charts: ["recharts"],
          payment: ["@stripe/stripe-js", "@stripe/react-stripe-js"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
