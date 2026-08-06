export type Env = {
  NODE_ENV: "development" | "test" | "production";
  HOST: string;
  PORT: number;
  /** Directory of built web assets to serve (SPA). Unset in local API-only dev. */
  WEB_DIST?: string;
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  SUPABASE_SECRET_KEY: string;
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL: string;
};

export type EnvOverrides = Partial<{
  [K in keyof Env]: string | number | undefined;
}>;

function readString(
  source: Record<string, string | undefined>,
  key: string,
  fallback?: string,
): string {
  const value = source[key] ?? fallback;
  if (value === undefined || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function readPort(source: Record<string, string | undefined>): number {
  const raw = source.PORT ?? "3000";
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${raw}`);
  }
  return port;
}

function readNodeEnv(
  source: Record<string, string | undefined>,
): Env["NODE_ENV"] {
  const value = source.NODE_ENV ?? "development";
  if (value !== "development" && value !== "test" && value !== "production") {
    throw new Error(`Invalid NODE_ENV value: ${value}`);
  }
  return value;
}

/** Load and validate API environment configuration. */
export function loadEnv(overrides: EnvOverrides = {}): Env {
  const source: Record<string, string | undefined> = {
    ...process.env,
    ...Object.fromEntries(
      Object.entries(overrides).map(([key, value]) => [
        key,
        value === undefined ? undefined : String(value),
      ]),
    ),
  };

  const webDist = source.WEB_DIST?.trim();

  return {
    NODE_ENV: readNodeEnv(source),
    HOST: source.HOST || "0.0.0.0",
    PORT: readPort(source),
    ...(webDist ? { WEB_DIST: webDist } : {}),
    SUPABASE_URL: readString(source, "SUPABASE_URL"),
    SUPABASE_PUBLISHABLE_KEY: readString(source, "SUPABASE_PUBLISHABLE_KEY"),
    SUPABASE_SECRET_KEY: readString(source, "SUPABASE_SECRET_KEY"),
    OPENROUTER_API_KEY: readString(source, "OPENROUTER_API_KEY"),
    OPENROUTER_MODEL: readString(
      source,
      "OPENROUTER_MODEL",
      "google/gemini-2.5-flash-lite",
    ),
  };
}
