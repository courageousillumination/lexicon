import { useMutation } from "@tanstack/react-query";
import { authenticatedFetch } from "./common";

export type GeneratedStory = {
  title: string;
  story: string;
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
        `/api/lexicons/${lexiconId}/stories/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ids ? { ids } : {}),
        },
      );
    },
  });
}
