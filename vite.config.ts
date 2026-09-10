import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  base: "./",
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite(),
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:4000",
    },
  },
  // Pre-bundle common TanStack dependencies so Vite doesn't re-optimize them mid-session
  optimizeDeps: {
    include: [
      "@tanstack/react-router",
    ],
  },
});