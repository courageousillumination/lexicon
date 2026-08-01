export function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
