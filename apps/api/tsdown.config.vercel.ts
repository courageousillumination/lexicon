import path from "node:path";
import { defineConfig } from "tsdown";
import { sharedSrc } from "./aliases.ts";

const sharedAliases = {
  "@lexicon/shared/repository": path.join(sharedSrc, "repository/index.ts"),
  "@lexicon/shared/model": path.join(sharedSrc, "model/index.ts"),
  "@lexicon/shared/service": path.join(sharedSrc, "service/index.ts"),
  "@lexicon/shared/supabase": path.join(sharedSrc, "supabase/index.ts"),
  "@lexicon/shared": path.join(sharedSrc, "index.ts"),
} as const;

/** Bundles the Hono app to `api/index.js` with `@lexicon/shared` inlined. */
export default defineConfig({
  entry: {
    index: "src/vercel.ts",
  },
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "api",
  sourcemap: false,
  clean: true,
  dts: false,
  hash: false,
  fixedExtension: false,
  alias: sharedAliases,
  deps: {
    alwaysBundle: [/^@lexicon\/shared(?:\/|$)/],
  },
});
