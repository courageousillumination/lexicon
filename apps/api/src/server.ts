import { Hono } from "hono";
import { cors } from "hono/cors";
import { withSupabase } from "@supabase/server/adapters/hono";
import type { SupabaseContext } from "@supabase/server";
import { createHealthResponse } from "@lexicon/shared";
import { getLexicons } from "@lexicon/shared/repository";
import type { Database } from "@lexicon/shared/supabase";
import { loadEnv, type Env, type EnvOverrides } from "./env.js";

export type AppEnv = {
  Variables: {
    config: Env;
    supabaseContext: SupabaseContext<Database>;
  };
};

export type BuildAppOptions = {
  /** Override process env for tests. */
  env?: EnvOverrides;
};

export type App = Hono<AppEnv>;

function supabaseEnv(config: Env) {
  return {
    url: config.SUPABASE_URL,
    publishableKeys: { default: config.SUPABASE_PUBLISHABLE_KEY },
    secretKeys: { default: config.SUPABASE_SECRET_KEY },
    jwks: new URL(`${config.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
  };
}

export function buildApp(options: BuildAppOptions = {}): {
  app: App;
  config: Env;
} {
  const config = loadEnv(options.env);
  const app = new Hono<AppEnv>();

  app.use(
    "*",
    cors({
      origin: "*",
      allowHeaders: ["Authorization", "Content-Type", "apikey"],
    }),
  );

  app.use("*", async (c, next) => {
    c.set("config", config);
    await next();
  });

  app.get("/api/health", (c) => c.json(createHealthResponse("api")));

  const lexicons = new Hono<AppEnv>();

  lexicons.use(
    "*",
    withSupabase<Database>({
      auth: "user",
      env: supabaseEnv(config),
    }),
  );

  lexicons.get("/", async (c) => {
    const items = await getLexicons(c.var.supabaseContext.supabase);
    return c.json(items);
  });

  app.route("/api/lexicons", lexicons);

  return { app, config };
}
