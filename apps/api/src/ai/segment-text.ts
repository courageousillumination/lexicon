import { generateText, Output, type LanguageModel } from "ai";
import { z } from "zod";
import {
  languageLabel,
  type LanguageCode,
  type TaggedTextSegment,
} from "@lexicon/shared/model";

const segmentedTextSchema = z.object({
  segments: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("text"),
          value: z
            .string()
            .describe("Non-lexical surface text (punctuation, whitespace, etc.)"),
        }),
        z.object({
          type: z.literal("lexical"),
          value: z
            .string()
            .describe("A lexical unit as it appears in the text"),
        }),
      ]),
    )
    .min(1)
    .describe("Ordered lexical and non-lexical segments covering the text"),
});

export type SegmentTextContext = {
  targetLanguage: LanguageCode;
};

/**
 * Uses AI to segment text into lexical and non-lexical spans.
 * Does not attach lexicon entry IDs — that happens in a later linking step.
 */
export async function segmentText(
  text: string,
  context: SegmentTextContext,
  model: LanguageModel,
): Promise<TaggedTextSegment[]> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Cannot segment empty text");
  }

  const targetLabel = languageLabel(context.targetLanguage);

  const { output } = await generateText({
    model,
    output: Output.object({
      schema: segmentedTextSchema,
      name: "TaggedTextSegmentation",
      description: "Lexical segmentation of a text for language learners",
    }),
    system: [
      "You segment learner texts into lexical and non-lexical spans.",
      `The text is written in ${targetLabel} (${context.targetLanguage}).`,
      'Mark vocabulary units as type "lexical" (words, multi-character words, or meaningful morphemes as appropriate for the language).',
      'Mark punctuation, whitespace, and other non-vocabulary material as type "text".',
      "Do not translate or rewrite the text.",
      "Prefer to preserve the original characters, spacing, punctuation, and newlines so segments still read as the input.",
      "Keep newline characters (\\n) as type \"text\" segments when present.",
      "For languages without clear word boundaries (e.g. Chinese), segment into the natural reading units a learner would look up.",
      "Prefer multi-character lexical units when they form a single word (e.g. 喜欢, not 喜 + 欢).",
    ].join(" "),
    prompt: trimmed,
  });

  if (!output) {
    throw new Error("Model did not return a segmentation");
  }

  return output.segments;
}
