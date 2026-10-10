import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Keep free of other local Vite apps that often grab 5173
    port: 5174,
    strictPort: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:8787",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5174,
    proxy: {
      "/api": { target: "http://localhost:8787", changeOrigin: true },
      "/uploads": { target: "http://localhost:8787", changeOrigin: true },
    },
  },
});
