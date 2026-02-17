import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    minify: "esbuild", // ESBuild is less aggressive than Terser
    rollupOptions: {
      output: {
        // NO MANUAL CHUNKS. Let Vite handle it.
        // If the bundle is big, it's fine. A big working app is better than a broken small one.
        manualChunks: undefined,
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
