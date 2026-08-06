import { buildApp } from "./server.js";

/** Bundled Vercel entry — default-export the Hono app for the Node runtime. */
const { app } = buildApp();

export default app;
