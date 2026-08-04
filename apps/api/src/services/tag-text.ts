import type { LanguageModel } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  LanguageCode,
  TaggedText,
  TaggedTextSegment,
} from "@lexicon/shared/model";
import { getLexiconEntries } from "@lexicon/shared/repository";
import type { Database } from "@lexicon/shared/supabase";
import { segmentText } from "../ai/segment-text.js";

type Client = SupabaseClient<Database>;

export type TagTextInput = {
  text: string;
  lexiconId: string;
  targetLanguage: LanguageCode;
};

/**
 * Segment text with AI, then attach lexicon entry IDs via exact value matches.
 */
export async function tagText(
  client: Client,
  input: TagTextInput,
  model: LanguageModel,
): Promise<TaggedText> {
  const text = input.text.trim();
  const segments = await segmentText(
    text,
    { targetLanguage: input.targetLanguage },
    model,
  );

  return {
    text,
    segments: await linkSegmentsToLexicon(client, input.lexiconId, segments),
  };
}

async function linkSegmentsToLexicon(
  client: Client,
  lexiconId: string,
  segments: TaggedTextSegment[],
): Promise<TaggedTextSegment[]> {
  const lexicalValues = [
    ...new Set(
      segments
        .filter((segment) => segment.type === "lexical")
        .map((segment) => segment.value),
    ),
  ];

  const entryIdByValue = new Map<string, string>();

  await Promise.all(
    lexicalValues.map(async (value) => {
      const matches = await getLexiconEntries(client, {
        lexiconId,
        value,
        limit: 1,
      });
      const match = matches[0];
      if (match) {
        entryIdByValue.set(value, match.id);
      }
    }),
  );

  return segments.map((segment) => {
    if (segment.type !== "lexical") {
      return segment;
    }

    const lexicalEntryId = entryIdByValue.get(segment.value);
    return lexicalEntryId ? { ...segment, lexicalEntryId } : segment;
  });
}
