import { describe, expect, it } from "vitest";
import { createHealthResponse } from "./index.js";

describe("createHealthResponse", () => {
  it("returns an ok health payload", () => {
    const result = createHealthResponse("api");

    expect(result.status).toBe("ok");
    expect(result.service).toBe("api");
    expect(result.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
    );
  });
});
