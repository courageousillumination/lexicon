import { beforeAll, describe, expect, it } from "vitest";
import { buildApp, type App } from "./server.js";

describe("API routes", () => {
  let app: App;

  beforeAll(() => {
    ({ app } = buildApp({
      env: {
        SUPABASE_URL: "http://127.0.0.1:54321",
        SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
        SUPABASE_SECRET_KEY: "test-secret-key",
        OPENROUTER_API_KEY: "test-openrouter-key",
      },
    }));
  });

  it("requires authentication to enhance lexicon entries", async () => {
    const response = await app.request(
      "/api/lexicons/00000000-0000-0000-0000-000000000001/entries/enhance",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: ["00000000-0000-0000-0000-000000000002"] }),
      },
    );

    expect(response.status).toBe(401);
  });
});
