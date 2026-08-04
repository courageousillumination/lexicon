export interface TaggedText {
  text: string;

  segments: TaggedTextSegment[];
}

/** Used for non lexical components (such as punctuation). */
export interface TextTaggedTextSegment {
  type: "text";
  value: string;
}

export interface LexicalTaggedTextSegment {
  type: "lexical";

  /** Text value. */
  value: string;

  /**
   * ID of the lexical entry in the lexicon.
   * Could be missing if this lexeme is not present in the lexicon (but in the text).
   */
  lexicalEntryId?: string;
}

export type TaggedTextSegment =
  TextTaggedTextSegment | LexicalTaggedTextSegment;
