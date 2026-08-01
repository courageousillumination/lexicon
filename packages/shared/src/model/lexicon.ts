import { LexiconEntry } from "./lexicon-entry";

/**
 * The Lexicon is the core model of lexicon. It represents all of the lexemes
 * in a given user's lexicon.
 */
export interface Lexicon {
  /** Unique ID for the lexicon. */
  id: string;

  /** Human-readable name of the lexicon. */
  name: string;

  /**
   * Entries in the lexicon.
   *
   * Presence depends on how the lexicon is requested.
   */
  entries?: LexiconEntry[];
}
