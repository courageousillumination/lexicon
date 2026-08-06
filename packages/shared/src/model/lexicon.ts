import type { LexiconEntry } from "./lexicon-entry.js";
import type { LanguageCode } from "./language.js";

/**
 * The Lexicon is the core model of lexicon. It represents all of the lexemes
 * in a given user's lexicon.
 */
export interface Lexicon {
  /** Unique ID for the lexicon. */
  id: string;

  /** Human-readable name of the lexicon. */
  name: string;

  /** Language the learner already knows (definitions, glosses). */
  sourceLanguage: LanguageCode;

  /** Language being learned (entry values). */
  targetLanguage: LanguageCode;

  /**
   * Entries in the lexicon.
   *
   * Presence depends on how the lexicon is requested.
   */
  entries?: LexiconEntry[];
}
