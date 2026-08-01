import { defineConfig } from "tsdown";
import { sharedSrc } from "./aliases.ts";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  sourcemap: true,
  clean: true,
  dts: false,
  hash: false,
  fixedExtension: false,
  alias: {
    "@lexicon/shared": sharedSrc,
  },
});
