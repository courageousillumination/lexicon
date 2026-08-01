import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@lexicon/shared/supabase";

function requireEnv(
  name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY",
): string {
  const value = import.meta.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

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
