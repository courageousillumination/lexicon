import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLexicon,
  getLexicons,
  updateLexicon,
  type CreateLexiconInput,
  type UpdateLexiconInput,
} from "@lexicon/shared/repository";
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
    mutationFn: (input: CreateLexiconInput) =>
      createLexicon(getSupabase(), input),
    onSuccess: (created) => {
      queryClient.setQueryData<Lexicon[]>(lexiconKeys.lists(), (current) =>
        current ? [created, ...current] : [created],
      );
    },
  });
}

export function useUpdateLexicon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateLexiconInput) =>
      updateLexicon(getSupabase(), input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Lexicon[]>(lexiconKeys.lists(), (current) =>
        current?.map((lexicon) =>
          lexicon.id === updated.id ? updated : lexicon,
        ),
      );
    },
  });
}
