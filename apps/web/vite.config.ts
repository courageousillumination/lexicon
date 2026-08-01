import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSharedAliases } from "./aliases.ts";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: viteSharedAliases,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
