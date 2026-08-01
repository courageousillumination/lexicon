import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@lexicon/shared/supabase";
import { requireEnv } from "./env";

let client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(
      requireEnv("VITE_SUPABASE_URL"),
      requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
    );
  }

  return client;
}
