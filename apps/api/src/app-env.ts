import type { SupabaseContext } from "@supabase/server";
import type { Database } from "@lexicon/shared/supabase";
import type { Env } from "./env.js";

export type AppEnv = {
  Variables: {
    config: Env;
    supabaseContext: SupabaseContext<Database>;
  };
};
