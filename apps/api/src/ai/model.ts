import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";
import type { Env } from "../env.js";

export function createAiModel(config: Env): LanguageModel {
  const openrouter = createOpenRouter({
    apiKey: config.OPENROUTER_API_KEY,
  });

  return openrouter(config.OPENROUTER_MODEL, {
    plugins: [{ id: "response-healing" }],
  });
}
