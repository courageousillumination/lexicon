import { defineConfig } from "vitest/config";
import { viteSharedAliases } from "./aliases.ts";

export default defineConfig({
  resolve: {
    alias: viteSharedAliases,
  },
  test: {
    globals: true,
    environment: "node",
  },
});
