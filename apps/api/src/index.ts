import { serve } from "@hono/node-server";
import { config as loadDotenv } from "dotenv";
import { buildApp } from "./server.js";

loadDotenv();

const { app, config } = buildApp();

serve(
  {
    fetch: app.fetch,
    hostname: config.HOST,
    port: config.PORT,
  },
  (info) => {
    console.log(`API listening on http://${info.address}:${info.port}`);
  },
);
