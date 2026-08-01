import path from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const sharedSrc = path.join(repoRoot, "packages/shared/src");

/** Vite/Vitest: prefix replacement so `@lexicon/shared/model` → `src/model`. */
export const viteSharedAliases = {
  "@lexicon/shared": sharedSrc,
} as const;
