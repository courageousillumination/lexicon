import type { SupabaseClient } from "@supabase/supabase-js";
import type { LexiconEntry } from "../model/lexicon-entry.js";
import type { Database } from "../supabase/index.js";
import {
  createLexiconEntry,
  getLexiconEntries,
  type CreateLexiconEntryInput,
} from "../repository/lexicon-entry-repository.js";

type Client = SupabaseClient<Database>;

export type DuplicateLexiconEntry = {
  value: string;
  existing: LexiconEntry;
};

export type CreateLexiconEntriesResult = {
  created: LexiconEntry[];
  duplicates: DuplicateLexiconEntry[];
};

/**
 * Create lexicon entries from captured values, skipping duplicates by exact
 * `value` within the lexicon. Checks and creates one value at a time.
 */
export async function createLexiconEntries(
  client: Client,
  lexiconId: string,
  values: string[],
): Promise<CreateLexiconEntriesResult> {
  const normalized = [
    ...new Set(values.map((value) => value.trim()).filter(Boolean)),
  ];

  const created: LexiconEntry[] = [];
  const duplicates: DuplicateLexiconEntry[] = [];

  for (const value of normalized) {
    const existing = await getLexiconEntries(client, {
      lexiconId,
      value,
      limit: 1,
    });

    if (existing[0]) {
      duplicates.push({ value, existing: existing[0] });
      continue;
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

    created.push(await createLexiconEntry(client, input));
  }

  return { created, duplicates };
}
