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
      },
    }));
  });

  it("requires authentication to list lexicons", async () => {
    const response = await app.request("/api/lexicons");

    expect(response.status).toBe(401);
  });
});
