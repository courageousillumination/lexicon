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

/** Produces `api/[[...route]].js` for Vercel — shared is inlined so workspace TS is not loaded at runtime. */
export default defineConfig({
  entry: {
    "handler": "src/vercel.ts",
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
