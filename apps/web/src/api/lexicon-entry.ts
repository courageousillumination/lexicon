import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteLexiconEntry,
  getLexiconEntries,
  getLexiconEntry,
  updateLexiconEntry,
  type UpdateLexiconEntryInput,
} from "@lexicon/shared/repository";
import { createLexiconEntries } from "@lexicon/shared/service";
import type { LexiconEntry, LexiconEntryStatus } from "@lexicon/shared";
import { authenticatedFetch } from "./common";
import { apiUrl } from "../lib/api-url";
import { getSupabase } from "../lib/supabase";

export type LexiconEntryListFilters = {
  status?: LexiconEntryStatus;
};

const ENHANCE_BATCH_SIZE = 20;

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

export function useUpdateLexiconEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateLexiconEntryInput) =>
      updateLexiconEntry(getSupabase(), input),
    onSuccess: (updated) => {
      queryClient.setQueryData(lexiconEntryKeys.detail(updated.id), updated);
      void queryClient.invalidateQueries({
        queryKey: [...lexiconEntryKeys.lists(), updated.lexiconId],
      });
    },
  });
}

export function useCreateLexiconEntries(lexiconId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: string[]) => {
      if (!lexiconId) {
        throw new Error("No lexicon selected");
      }

      const result = await createLexiconEntries(
        getSupabase(),
        lexiconId,
        values,
      );

      if (result.created.length === 0 && result.duplicates.length === 0) {
        throw new Error("No values to create");
      }

      return result;
    },
    onSuccess: (result) => {
      if (!lexiconId || result.created.length === 0) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: [...lexiconEntryKeys.lists(), lexiconId],
      });

      for (const entry of result.created) {
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

      const entries: LexiconEntry[] = [];

      for (let i = 0; i < ids.length; i += ENHANCE_BATCH_SIZE) {
        const batch = ids.slice(i, i + ENHANCE_BATCH_SIZE);
        const result = await authenticatedFetch<{ entries: LexiconEntry[] }>(
          apiUrl(`/api/lexicons/${lexiconId}/entries/enhance`),
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: batch }),
          },
        );
        entries.push(...result.entries);
      }

      return { entries };
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

      await Promise.all(ids.map((id) => deleteLexiconEntry(getSupabase(), id)));
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
