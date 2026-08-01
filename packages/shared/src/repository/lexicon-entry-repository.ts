import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Definition,
  LexiconEntry,
  LexiconEntryType,
  LexiconEntryVariant,
} from "../model/lexicon-entry.js";
import type { Database, Json, LexiconEntryRow } from "../supabase/index.js";
import { dataOrThrow, dataOrThrowMany, dataOrThrowMaybe } from "./common.js";

export type CreateLexiconEntryInput = Omit<LexiconEntry, "id">;
export type UpdateLexiconEntryInput = LexiconEntry;

export interface LexiconEntrySearchOptions {
  /** Restrict to entries in this lexicon. */
  lexiconId: string;
  /** Restrict to specific entry IDs. */
  ids?: string[];
  /** Restrict to a single entry type. */
  type?: LexiconEntryType;
  /** Maximum number of entries to return. */
  limit?: number;
}

type Client = SupabaseClient<Database>;

const ENTRY_COLUMNS =
  "id, lexicon_id, type, status, value, pronunciation, language, definitions, variants, tags, created_at, updated_at" as const;

function asDefinitions(value: Json): Definition[] {
  return (value ?? []) as unknown as Definition[];
}

function asVariants(value: Json): LexiconEntryVariant[] {
  return (value ?? []) as unknown as LexiconEntryVariant[];
}

function mapRow(row: Omit<LexiconEntryRow, "user_id">): LexiconEntry {
  return {
    id: row.id,
    lexiconId: row.lexicon_id,
    type: row.type,
    status: row.status,
    value: row.value,
    pronunciation: row.pronunciation,
    language: row.language,
    definitions: asDefinitions(row.definitions),
    variants: asVariants(row.variants),
    tags: row.tags,
  };
}

function toRow(input: CreateLexiconEntryInput | UpdateLexiconEntryInput) {
  return {
    lexicon_id: input.lexiconId,
    type: input.type,
    status: input.status,
    value: input.value,
    pronunciation: input.pronunciation,
    language: input.language,
    definitions: input.definitions as unknown as Json,
    variants: input.variants as unknown as Json,
    tags: input.tags,
  };
}

export async function createLexiconEntry(
  client: Client,
  input: CreateLexiconEntryInput,
): Promise<LexiconEntry> {
  const result = await client
    .from("lexicon_entries")
    .insert(toRow(input))
    .select(ENTRY_COLUMNS)
    .single();

  return dataOrThrow(result, mapRow);
}

export async function updateLexiconEntry(
  client: Client,
  input: UpdateLexiconEntryInput,
): Promise<LexiconEntry> {
  const result = await client
    .from("lexicon_entries")
    .update({
      ...toRow(input),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select(ENTRY_COLUMNS)
    .single();

  return dataOrThrow(result, mapRow);
}

export async function getLexiconEntry(
  client: Client,
  id: string,
): Promise<LexiconEntry | null> {
  const result = await client
    .from("lexicon_entries")
    .select(ENTRY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  return dataOrThrowMaybe(result, mapRow);
}

export async function getLexiconEntries(
  client: Client,
  options: LexiconEntrySearchOptions,
): Promise<LexiconEntry[]> {
  if (options.ids !== undefined && options.ids.length === 0) {
    return [];
  }

  let query = client
    .from("lexicon_entries")
    .select(ENTRY_COLUMNS)
    .eq("lexicon_id", options.lexiconId)
    .order("created_at", { ascending: false });

  if (options.ids !== undefined) {
    query = query.in("id", options.ids);
  }

  if (options.type !== undefined) {
    query = query.eq("type", options.type);
  }

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  return dataOrThrowMany(await query, mapRow);
}

export async function deleteLexiconEntry(
  client: Client,
  id: string,
): Promise<void> {
  dataOrThrowMaybe(await client.from("lexicon_entries").delete().eq("id", id));
}
