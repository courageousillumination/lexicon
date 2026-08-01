import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLexicon } from "@lexicon/shared/repository";
import type { Lexicon } from "@lexicon/shared/model";
import { getSupabase } from "../lib/supabase";
import { authenticatedFetch } from "./common";

export const lexiconKeys = {
  all: ["lexicons"] as const,
  lists: () => [...lexiconKeys.all, "list"] as const,
};

/**
 * Get all lexicons (note: API based call)
 * @returns
 */
export function useLexicons() {
  return useQuery({
    queryKey: lexiconKeys.lists(),
    queryFn: () => authenticatedFetch<Lexicon[]>("/api/lexicons"),
  });
}

/**
 * Create a new lexicon (note: direct supabase)
 * @returns
 */
export function useCreateLexicon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createLexicon(getSupabase(), { name }),
    onSuccess: (created) => {
      queryClient.setQueryData<Lexicon[]>(lexiconKeys.lists(), (current) =>
        current ? [created, ...current] : [created],
      );
    },
  });
}
