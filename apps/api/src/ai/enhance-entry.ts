import { generateText, Output, type LanguageModel } from "ai";
import { z } from "zod";
import {
  languageLabel,
  type LanguageCode,
  type LexiconEntry,
} from "@lexicon/shared/model";

const ENHANCED_TAG = "enhanced";

const enhancedFieldsSchema = z.object({
  value: z.string().describe("Entry value in the target language"),
  type: z
    .enum(["morpheme", "lexeme", "phrase"])
    .describe("Best lexical unit type for this entry"),
  pronunciation: z
    .string()
    .describe(
      "Pronunciation guide appropriate for the entry language (e.g. pinyin, IPA, romaji)",
    ),
  language: z
    .string()
    .describe(
      "BCP 47 language tag of the entry value (must be the lexicon source or target language)",
    ),
  definitions: z
    .array(
      z.object({
        definition: z.string().describe("Clear definition of the entry"),
        language: z
          .string()
          .describe("BCP 47 language tag of this definition text"),
      }),
    )
    .min(1)
    .describe(
      "One or more definitions; include at least one in the learner's source language",
    ),
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

export type EnhanceEntryContext = {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.filter((tag) => tag.trim().length > 0))];
}

/**
 * Uses AI to fill lexicon entry fields from the existing value, then marks it enhanced.
 */
export async function enhanceEntry(
  entry: LexiconEntry,
  context: EnhanceEntryContext,
  model: LanguageModel,
): Promise<LexiconEntry> {
  const sourceLabel = languageLabel(context.sourceLanguage);
  const targetLabel = languageLabel(context.targetLanguage);

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
      `This lexicon's source language (learner knows) is ${sourceLabel} (${context.sourceLanguage}).`,
      `This lexicon's target language (being learned) is ${targetLabel} (${context.targetLanguage}).`,
      "The entry value may be written in either the source or the target language: when updating, always make the value the target language.",
      "Provide at least one definition in the source language.",
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
        lexicon: {
          sourceLanguage: context.sourceLanguage,
          targetLanguage: context.targetLanguage,
        },
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
    value: output.value,
    type: output.type,
    pronunciation: output.pronunciation,
    language: output.language,
    definitions: output.definitions,
    variants: output.variants,
    tags: uniqueTags([...output.tags, ...entry.tags, ENHANCED_TAG]),
  };
}
