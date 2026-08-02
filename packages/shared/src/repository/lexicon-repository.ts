import type { SupabaseClient } from "@supabase/supabase-js";
import type { LanguageCode } from "../model/language.js";
import type { Lexicon } from "../model/lexicon.js";
import type { Database, LexiconRow } from "../supabase/index.js";
import { dataOrThrow, dataOrThrowMany, dataOrThrowMaybe } from "./common.js";

export type CreateLexiconInput = Omit<Lexicon, "id" | "entries">;
export type UpdateLexiconInput = Omit<Lexicon, "entries">;

export interface LexiconSearchOptions {
  /** Maximum number of lexicons to return. */
  limit?: number;
}

type Client = SupabaseClient<Database>;

const LEXICON_COLUMNS =
  "id, name, source_language, target_language, created_at, updated_at" as const;

function mapRow(row: Omit<LexiconRow, "user_id">): Lexicon {
  return {
    id: row.id,
    name: row.name,
    sourceLanguage: row.source_language as LanguageCode,
    targetLanguage: row.target_language as LanguageCode,
  };
}

export async function createLexicon(
  client: Client,
  input: CreateLexiconInput,
): Promise<Lexicon> {
  const result = await client
    .from("lexicons")
    .insert({
      name: input.name,
      source_language: input.sourceLanguage,
      target_language: input.targetLanguage,
    })
    .select(LEXICON_COLUMNS)
    .single();

  return dataOrThrow(result, mapRow);
}

export async function updateLexicon(
  client: Client,
  input: UpdateLexiconInput,
): Promise<Lexicon> {
  const result = await client
    .from("lexicons")
    .update({
      name: input.name,
      source_language: input.sourceLanguage,
      target_language: input.targetLanguage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select(LEXICON_COLUMNS)
    .single();

  return dataOrThrow(result, mapRow);
}

export async function getLexicon(
  client: Client,
  id: string,
): Promise<Lexicon | null> {
  const result = await client
    .from("lexicons")
    .select(LEXICON_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  return dataOrThrowMaybe(result, mapRow);
}

export async function getLexicons(
  client: Client,
  options: LexiconSearchOptions = {},
): Promise<Lexicon[]> {
  let query = client
    .from("lexicons")
    .select(LEXICON_COLUMNS)
    .order("created_at", { ascending: false });

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  return dataOrThrowMany(await query, mapRow);
}

export async function deleteLexicon(client: Client, id: string): Promise<void> {
  dataOrThrowMaybe(await client.from("lexicons").delete().eq("id", id));
}
