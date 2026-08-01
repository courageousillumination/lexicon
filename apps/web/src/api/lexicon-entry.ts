import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLexiconEntry,
  getLexiconEntries,
} from "@lexicon/shared/repository";
import type { CreateLexiconEntryInput, LexiconEntry } from "@lexicon/shared";
import { authenticatedFetch } from "./common";
import { getSupabase } from "../lib/supabase";

export const lexiconEntryKeys = {
  all: ["lexicon-entries"] as const,
  lists: () => [...lexiconEntryKeys.all, "list"] as const,
  list: (lexiconId: string) =>
    [...lexiconEntryKeys.lists(), lexiconId] as const,
};

export function useLexiconEntries(lexiconId: string | undefined) {
  return useQuery({
    queryKey: lexiconEntryKeys.list(lexiconId ?? ""),
    queryFn: () => getLexiconEntries(getSupabase(), { lexiconId: lexiconId! }),
    enabled: Boolean(lexiconId),
  });
}

export function useCreateLexiconEntry(lexiconId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: string) => {
      if (!lexiconId) {
        throw new Error("No lexicon selected");
      }

      const input: CreateLexiconEntryInput = {
        lexiconId,
        type: "lexeme",
        status: "draft",
        value,
        pronunciation: "",
        language: "",
        definitions: [],
        variants: [],
        tags: [],
      };

      return createLexiconEntry(getSupabase(), input);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<LexiconEntry[]>(
        lexiconEntryKeys.list(created.lexiconId),
        (current) => (current ? [created, ...current] : [created]),
      );
    },
  });
}

export function useEnhanceLexiconEntries(lexiconId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!lexiconId) {
        throw new Error("No lexicon selected");
      }

      return authenticatedFetch<{ entries: LexiconEntry[] }>(
        `/api/lexicons/${lexiconId}/entries/enhance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        },
      );
    },
    onSuccess: (result) => {
      if (!lexiconId) {
        return;
      }

      const updatedById = new Map(
        result.entries.map((entry) => [entry.id, entry]),
      );

      queryClient.setQueryData<LexiconEntry[]>(
        lexiconEntryKeys.list(lexiconId),
        (current) =>
          current?.map((entry) => updatedById.get(entry.id) ?? entry) ??
          result.entries,
      );
    },
  });
}
