import { Hono } from "hono";
import { withSupabase } from "@supabase/server/adapters/hono";
import {
  getLexicon,
  getLexiconEntries,
  updateLexiconEntry,
} from "@lexicon/shared/repository";
import type { Database } from "@lexicon/shared/supabase";
import type { AppEnv } from "../app-env.js";
import type { Env } from "../env.js";
import { createAiModel, enhanceEntry, generateStory } from "../ai/index.js";
import { supabaseEnv } from "../supabase-env.js";

type EnhanceEntriesBody = {
  ids?: unknown;
};

type GenerateStoryBody = {
  ids?: unknown;
};

export function createLexiconsRoutes(config: Env): Hono<AppEnv> {
  const routes = new Hono<AppEnv>();
  const model = createAiModel(config);

  routes.use(
    "*",
    withSupabase<Database>({
      auth: "user",
      env: supabaseEnv(config),
    }),
  );

  routes.post("/:lexiconId/entries/enhance", async (c) => {
    const lexiconId = c.req.param("lexiconId");
    const body = (await c.req
      .json()
      .catch(() => null)) as EnhanceEntriesBody | null;
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
    const lexicon = await getLexicon(client, lexiconId);

    if (!lexicon) {
      return c.json({ message: "Lexicon not found" }, 404);
    }

    const entries = await getLexiconEntries(client, { lexiconId, ids });

    if (entries.length !== ids.length) {
      return c.json(
        { message: "One or more lexicon entries were not found" },
        404,
      );
    }

    const languageContext = {
      sourceLanguage: lexicon.sourceLanguage,
      targetLanguage: lexicon.targetLanguage,
    };

    const updated = await Promise.all(
      entries
        .filter((entry) => !entry.definitions.length)
        .map(async (entry) => {
          const enhanced = await enhanceEntry(entry, languageContext, model);
          return updateLexiconEntry(client, enhanced);
        }),
    );

    return c.json({ entries: updated });
  });

  routes.post("/:lexiconId/stories/generate", async (c) => {
    const lexiconId = c.req.param("lexiconId");
    const body = (await c.req
      .json()
      .catch(() => ({}))) as GenerateStoryBody | null;
    const ids = body?.ids;

    if (
      ids !== undefined &&
      (!Array.isArray(ids) ||
        !ids.every((id): id is string => typeof id === "string"))
    ) {
      return c.json(
        { message: "ids must be an array of strings when provided" },
        400,
      );
    }

    const client = c.var.supabaseContext.supabase;
    const lexicon = await getLexicon(client, lexiconId);

    if (!lexicon) {
      return c.json({ message: "Lexicon not found" }, 404);
    }

    const entries = await getLexiconEntries(client, {
      lexiconId,
      ...(ids !== undefined && ids.length > 0 ? { ids } : {}),
    });

    if (entries.length === 0) {
      return c.json(
        { message: "Add lexicon entries before generating a story" },
        400,
      );
    }

    const story = await generateStory(
      { lexiconName: lexicon.name, entries },
      model,
    );

    return c.json({ story });
  });

  return routes;
}
