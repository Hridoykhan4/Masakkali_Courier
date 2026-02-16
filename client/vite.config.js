import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. RAW HEAVY ENGINES (Non-React stuff)
            // These are huge but safe to split because they don't use React Context
            if (id.includes("firebase")) return "engine-firebase";
            if (id.includes("recharts")) return "engine-charts";
            
            // Critical fix: Split the core Leaflet library (logic) 
            // but keep 'react-leaflet' in the UI bundle.
            if (id.includes("node_modules/leaflet/")) return "engine-map-core";

            // 2. THE UI STACK (Must stay together)
            // Keeps React, React-Leaflet, Lucide, and Tanstack in one file
            return "vendor-ui-stable";
          }
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    chunkSizeWarningLimit: 2000, 
  },
});