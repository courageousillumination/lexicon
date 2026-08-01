import type { LexiconEntry } from "@lexicon/shared/model";

const ENHANCED_TAG = "enhanced";

/** Stub enhancer: marks an entry as enhanced via tag. */
export function enhanceEntry(entry: LexiconEntry): LexiconEntry {
  if (entry.tags.includes(ENHANCED_TAG)) {
    return entry;
  }

  return {
    ...entry,
    tags: [...entry.tags, ENHANCED_TAG],
  };
}
