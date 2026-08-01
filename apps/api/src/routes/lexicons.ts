import { Hono } from "hono";
import { withSupabase } from "@supabase/server/adapters/hono";
import { getLexicons } from "@lexicon/shared/repository";
import type { Database } from "@lexicon/shared/supabase";
import type { AppEnv } from "../app-env.js";
import type { Env } from "../env.js";
import { supabaseEnv } from "../supabase-env.js";

export function createLexiconsRoutes(config: Env): Hono<AppEnv> {
  const routes = new Hono<AppEnv>();

  routes.use(
    "*",
    withSupabase<Database>({
      auth: "user",
      env: supabaseEnv(config),
    }),
  );

  routes.get("/", async (c) => {
    const items = await getLexicons(c.var.supabaseContext.supabase);
    return c.json(items);
  });

  return routes;
}
