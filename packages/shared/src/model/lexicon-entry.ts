export interface Definition {
  /** Definition of the lexical unit. */
  definition: string;

  /** Language of the definition. */
  language: string;
}

/** Handles variants of a single entry. */
export interface LexiconEntryVariant {
  /** Value of this variant  */
  value: string;

  /** Pronunciation of this variant. */
  pronunciation: string;

  /** Description of this variant. */
  description: string;
}

/**
 * Individual lexicon entry.
 *
 * NOTE: There may be multiple entries with the same value _if_ they have different pronunciations and meanings.
 * The uniqueness should be enforced across type, value, and pronunciation.
 */
export interface LexiconEntryBase {
  /** Unique ID for this entry. */
  id: string;

  /** Lexicon this entry belongs to. */
  lexiconId: string;

  /** The status of this entry. */
  status: "draft" | "active" | "archived";

  /** Value of this entry (unicode) */
  value: string;

  /**
   * Pronunciation for this entry.
   *
   * Type will depend on the target language: Chinese will use pinyin, English will use IPA, etc.
   */
  pronunciation: string;

  /** Language of this entry. */
  language: string;

  /**
   * Definitions for this entry.
   *
   * NOTE: definitions can be provided in multiple languages (usually source + target).
   */
  definitions: Definition[];

  /** Possible variants of this entry (e.g. traditional vs simplified, UK vs US, etc.) */
  variants: LexiconEntryVariant[];

  /** User defined tags for this entry. */
  tags: string[];
}

/** A morpheme is a single unit of meaning. */
export interface Morpheme extends LexiconEntryBase {
  /** The type of morpheme. */
  type: "morpheme";
}

/** A lexeme is a single unit of meaning that combines one or more morphemes. */
export interface Lexeme extends LexiconEntryBase {
  /** The type of lexeme. */
  type: "lexeme";
}

/** A phrase is a single unit of meaning that is a combination of lexemes. */
export interface Phrase extends LexiconEntryBase {
  /** The type of phrase. */
  type: "phrase";
}

export type LexiconEntry = Morpheme | Lexeme | Phrase;

export type LexiconEntryType = LexiconEntry["type"];
