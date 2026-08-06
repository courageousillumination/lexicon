import { useMutation } from "@tanstack/react-query";
import type { TaggedText } from "@lexicon/shared/model";
import { apiUrl } from "../lib/api-url";
import { authenticatedFetch } from "./common";

export type GeneratedStory = {
  title: string;
  taggedText: TaggedText;
  wordsUsed: string[];
};

export type GenerateStoryInput = {
  lexiconId: string;
  ids?: string[];
};

export function useGenerateStory() {
  return useMutation({
    mutationFn: async ({ lexiconId, ids }: GenerateStoryInput) => {
      return authenticatedFetch<{ story: GeneratedStory }>(
        apiUrl(`/api/lexicons/${lexiconId}/stories/generate`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ids ? { ids } : {}),
        },
      );
    },
  });
}
