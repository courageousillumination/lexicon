import { Hono } from "hono";
import { withSupabase } from "@supabase/server/adapters/hono";
import {
  getLexiconEntries,
  updateLexiconEntry,
} from "@lexicon/shared/repository";
import type { Database } from "@lexicon/shared/supabase";
import type { AppEnv } from "../app-env.js";
import type { Env } from "../env.js";
import { createEnhanceModel, enhanceEntry } from "../ai/index.js";
import { supabaseEnv } from "../supabase-env.js";

type EnhanceEntriesBody = {
  ids?: unknown;
};

export function createLexiconsRoutes(config: Env): Hono<AppEnv> {
  const routes = new Hono<AppEnv>();
  const model = createEnhanceModel(config);

  routes.use(
    "*",
    withSupabase<Database>({
      auth: "user",
      env: supabaseEnv(config),
    }),
  );

  routes.post("/:lexiconId/entries/enhance", async (c) => {
    const lexiconId = c.req.param("lexiconId");
    const body = (await c.req.json().catch(() => null)) as EnhanceEntriesBody | null;
    const ids = body?.ids;

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id): id is string => typeof id === "string")
    ) {
      return c.json(
        { message: "Request body must include a non-empty ids string array" },
        400,
      );
    }

    const client = c.var.supabaseContext.supabase;
    const entries = await getLexiconEntries(client, { lexiconId, ids });

    if (entries.length !== ids.length) {
      return c.json(
        { message: "One or more lexicon entries were not found" },
        404,
      );
    }

    const enhanced = await Promise.all(
      entries.map((entry) => enhanceEntry(entry, model)),
    );

    const updated = await Promise.all(
      enhanced.map((entry) => updateLexiconEntry(client, entry)),
    );

    return c.json({ entries: updated });
  });

  return routes;
}
