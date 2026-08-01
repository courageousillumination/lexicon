import type { SupabaseClient } from "@supabase/supabase-js";
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

function mapRow(row: Omit<LexiconRow, "user_id">): Lexicon {
  return {
    id: row.id,
    name: row.name,
  };
}

export async function createLexicon(
  client: Client,
  input: CreateLexiconInput,
): Promise<Lexicon> {
  const result = await client
    .from("lexicons")
    .insert({ name: input.name })
    .select("id, name, created_at, updated_at")
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select("id, name, created_at, updated_at")
    .single();

  return dataOrThrow(result, mapRow);
}

export async function getLexicon(
  client: Client,
  id: string,
): Promise<Lexicon | null> {
  const result = await client
    .from("lexicons")
    .select("id, name, created_at, updated_at")
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
    .select("id, name, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (options.limit !== undefined) {
    query = query.limit(options.limit);
  }

  return dataOrThrowMany(await query, mapRow);
}

export async function deleteLexicon(client: Client, id: string): Promise<void> {
  dataOrThrowMaybe(await client.from("lexicons").delete().eq("id", id));
}
