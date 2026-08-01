import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import { createHealthResponse } from "@lexicon/shared";
import { envSchema, type Env } from "./env.js";

declare module "fastify" {
  interface FastifyInstance {
    config: Env;
  }
}

export async function buildServer(options: { logger?: boolean } = {}) {
  const app = Fastify({
    logger: options.logger ?? true,
  });

  await app.register(fastifyEnv, {
    confKey: "config",
    schema: envSchema,
    dotenv: true,
  });

  await app.register(cors, {
    origin: true,
  });

  app.get("/api/health", async () => createHealthResponse("api"));

  return app;
}
