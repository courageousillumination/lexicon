import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLexicon, getLexicons } from "@lexicon/shared/repository";
import type { Lexicon } from "@lexicon/shared/model";
import { getSupabase } from "../lib/supabase";

export const lexiconKeys = {
  all: ["lexicons"] as const,
  lists: () => [...lexiconKeys.all, "list"] as const,
};

export function useLexicons() {
  return useQuery({
    queryKey: lexiconKeys.lists(),
    queryFn: () => getLexicons(getSupabase()),
  });
}

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
