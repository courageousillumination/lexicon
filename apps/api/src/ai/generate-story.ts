import { generateText, Output, type LanguageModel } from "ai";
import { z } from "zod";
import type { LexiconEntry } from "@lexicon/shared/model";

export type GeneratedStory = {
  title: string;
  story: string;
  wordsUsed: string[];
};

const generatedStorySchema = z.object({
  title: z.string().describe("Short title for the story"),
  story: z
    .string()
    .describe("The full story text, using only allowed vocabulary"),
  wordsUsed: z
    .array(z.string())
    .describe("Which vocabulary items from the list appear in the story"),
});

export type GenerateStoryInput = {
  lexiconName: string;
  entries: LexiconEntry[];
};

/**
 * Generates a short learner story using only vocabulary from the given lexicon entries.
 */
export async function generateStory(
  input: GenerateStoryInput,
  model: LanguageModel,
): Promise<GeneratedStory> {
  const vocabulary = [
    ...new Set(input.entries.map((entry) => entry.value.trim()).filter(Boolean)),
  ];

  if (vocabulary.length === 0) {
    throw new Error("Cannot generate a story without vocabulary entries");
  }

  const { output } = await generateText({
    model,
    output: Output.object({
      schema: generatedStorySchema,
      name: "LexiconStory",
      description: "A story written only with lexicon vocabulary",
    }),
    system: [
      "You write short stories for language learners.",
      "You may ONLY use vocabulary items from the provided list (exact forms).",
      "Do not invent new content words that are not on the list.",
      "Punctuation and line breaks are allowed.",
      "Prefer a simple narrative that uses as much of the vocabulary as practical.",
      "If the vocabulary is limited, write a very short vignette rather than inventing words.",
      "Match the script/language of the vocabulary items.",
    ].join(" "),
    prompt: JSON.stringify(
      {
        lexiconName: input.lexiconName,
        vocabulary,
        entryHints: input.entries.slice(0, 80).map((entry) => ({
          value: entry.value,
          pronunciation: entry.pronunciation || undefined,
          definitions: entry.definitions.map((item) => item.definition),
        })),
      },
      null,
      2,
    ),
  });

  if (!output) {
    throw new Error("Model did not return a story");
  }

  return output;
}
