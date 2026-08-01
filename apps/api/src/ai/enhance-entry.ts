import { generateText, Output, type LanguageModel } from "ai";
import { z } from "zod";
import type { LexiconEntry } from "@lexicon/shared/model";

const ENHANCED_TAG = "enhanced";

const enhancedFieldsSchema = z.object({
  type: z
    .enum(["morpheme", "lexeme", "phrase"])
    .describe("Best lexical unit type for this entry"),
  pronunciation: z
    .string()
    .describe(
      "Pronunciation guide appropriate for the language (e.g. pinyin, IPA)",
    ),
  language: z
    .string()
    .describe("Language of the entry value (e.g. zh-CN, en, ja)"),
  definitions: z
    .array(
      z.object({
        definition: z.string().describe("Clear definition of the entry"),
        language: z
          .string()
          .describe("Language of this definition text (e.g. en)"),
      }),
    )
    .min(1)
    .describe("One or more definitions, usually including English"),
  variants: z
    .array(
      z.object({
        value: z.string(),
        pronunciation: z.string(),
        description: z.string(),
      }),
    )
    .describe("Orthography or dialect variants, if any"),
  tags: z
    .array(z.string())
    .describe("Short topical or grammatical tags for the entry"),
});

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.filter((tag) => tag.trim().length > 0))];
}

/**
 * Uses AI to fill lexicon entry fields from the existing value, then marks it enhanced.
 */
export async function enhanceEntry(
  entry: LexiconEntry,
  model: LanguageModel,
): Promise<LexiconEntry> {
  const { output } = await generateText({
    model,
    output: Output.object({
      schema: enhancedFieldsSchema,
      name: "LexiconEntryEnhancement",
      description: "Filled-in fields for a lexicon entry",
    }),
    system: [
      "You enhance lexicon entries for language learners.",
      "Given an entry value (and any existing fields), fill in missing linguistic details.",
      "Preserve the meaning of the given value; do not invent a different word.",
      "Prefer concise, accurate definitions suitable for study.",
      "If the language is unclear, infer it from the value script/characters.",
      "Leave variants empty when none are relevant.",
      "Do not update tags, those should only be updated by the user.",
    ].join(" "),
    prompt: JSON.stringify(
      {
        value: entry.value,
        type: entry.type,
        pronunciation: entry.pronunciation,
        language: entry.language,
        definitions: entry.definitions,
        variants: entry.variants,
        tags: entry.tags,
      },
      null,
      2,
    ),
  });

  if (!output) {
    throw new Error("Model did not return an enhancement payload");
  }

  return {
    ...entry,
    type: output.type,
    pronunciation: output.pronunciation,
    language: output.language,
    definitions: output.definitions,
    variants: output.variants,
    tags: uniqueTags([...output.tags, ...entry.tags, ENHANCED_TAG]),
  };
}
