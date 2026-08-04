import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLexiconEntry,
  deleteLexiconEntry,
  getLexiconEntries,
  getLexiconEntry,
} from "@lexicon/shared/repository";
import type {
  CreateLexiconEntryInput,
  LexiconEntry,
  LexiconEntryStatus,
} from "@lexicon/shared";
import { authenticatedFetch } from "./common";
import { getSupabase } from "../lib/supabase";

export type LexiconEntryListFilters = {
  status?: LexiconEntryStatus;
};

export const lexiconEntryKeys = {
  all: ["lexicon-entries"] as const,
  lists: () => [...lexiconEntryKeys.all, "list"] as const,
  list: (lexiconId: string, filters: LexiconEntryListFilters = {}) =>
    [...lexiconEntryKeys.lists(), lexiconId, filters] as const,
  details: () => [...lexiconEntryKeys.all, "detail"] as const,
  detail: (id: string) => [...lexiconEntryKeys.details(), id] as const,
};

export function useLexiconEntries(
  lexiconId: string | undefined,
  filters: LexiconEntryListFilters = {},
) {
  return useQuery({
    queryKey: lexiconEntryKeys.list(lexiconId ?? "", filters),
    queryFn: () =>
      getLexiconEntries(getSupabase(), {
        lexiconId: lexiconId!,
        status: filters.status,
      }),
    enabled: Boolean(lexiconId),
  });
}

export function useLexiconEntry(id: string | undefined) {
  return useQuery({
    queryKey: lexiconEntryKeys.detail(id ?? ""),
    queryFn: () => getLexiconEntry(getSupabase(), id!),
    enabled: Boolean(id),
  });
}

export function useCreateLexiconEntries(lexiconId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: string[]) => {
      if (!lexiconId) {
        throw new Error("No lexicon selected");
      }

      const normalized = [
        ...new Set(values.map((value) => value.trim()).filter(Boolean)),
      ];

      if (normalized.length === 0) {
        throw new Error("No values to create");
      }

      return Promise.all(
        normalized.map((value) => {
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
        }),
      );
    },
    onSuccess: (created) => {
      if (!lexiconId || created.length === 0) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: [...lexiconEntryKeys.lists(), lexiconId],
      });

      for (const entry of created) {
        queryClient.setQueryData(lexiconEntryKeys.detail(entry.id), entry);
      }
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

      void queryClient.invalidateQueries({
        queryKey: [...lexiconEntryKeys.lists(), lexiconId],
      });

      for (const entry of result.entries) {
        queryClient.setQueryData(lexiconEntryKeys.detail(entry.id), entry);
      }
    },
  });
}

export function useDeleteLexiconEntries(lexiconId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!lexiconId) {
        throw new Error("No lexicon selected");
      }

      await Promise.all(
        ids.map((id) => deleteLexiconEntry(getSupabase(), id)),
      );
      return ids;
    },
    onSuccess: (ids) => {
      if (!lexiconId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: [...lexiconEntryKeys.lists(), lexiconId],
      });

      for (const id of ids) {
        queryClient.removeQueries({ queryKey: lexiconEntryKeys.detail(id) });
      }
    },
  });
}
