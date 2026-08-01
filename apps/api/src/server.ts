import { Hono } from "hono";
import { cors } from "hono/cors";
import type { AppEnv } from "./app-env.js";
import { loadEnv, type Env, type EnvOverrides } from "./env.js";
import { createLexiconsRoutes } from "./routes/lexicons.js";

export type { AppEnv } from "./app-env.js";

export type BuildAppOptions = {
  /** Override process env for tests. */
  env?: EnvOverrides;
};

export type App = Hono<AppEnv>;

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

  app.route("/api/lexicons", createLexiconsRoutes(config));

  return { app, config };
}
