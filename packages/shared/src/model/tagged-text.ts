export interface TaggedText {
  text: string;

  segments: TaggedTextSegment[];
}

/** Used for non lexical components (such as punctuation). */
interface TextTaggedTextSegment {
  type: "text";
  value: string;
}

interface LexicalTaggedTextSegment {
  type: "lexical";

  /** Text value. */
  value: string;

  /**
   * ID of the lexical entry in the lexicon.
   * Could be missing if this lexeme is not present in the lexicon (but in the text).
   */
  lexicalEntryId?: string;
}

type TaggedTextSegment = TextTaggedTextSegment | LexicalTaggedTextSegment;
