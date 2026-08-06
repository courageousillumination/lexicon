import { serve } from "@hono/node-server";
import { config as loadDotenv } from "dotenv";
import { buildApp } from "./server.js";

loadDotenv();

const { app, config } = buildApp();

/** Vercel (and `vercel dev`) use this default export. */
export default app;

// Local / Docker: run a long-lived Node server.
if (!process.env.VERCEL) {
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
}
