import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { viteSharedAliases } from "./aliases.ts";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: viteSharedAliases,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
