import type { Env } from "./env.js";

export function supabaseEnv(config: Env) {
  return {
    url: config.SUPABASE_URL,
    publishableKeys: { default: config.SUPABASE_PUBLISHABLE_KEY },
    secretKeys: { default: config.SUPABASE_SECRET_KEY },
    jwks: new URL(`${config.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
  };
}
