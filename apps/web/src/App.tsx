import { useEffect, useState } from "react";
import type { HealthResponse } from "@lexicon/shared";
import "./App.css";

export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/health")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Health check failed (${response.status})`);
        }

        return (await response.json()) as HealthResponse;
      })
      .then((data) => {
        if (!cancelled) {
          setHealth(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app">
      <h1>Lexicon</h1>
      <p>React frontend wired to the Fastify API.</p>
      {health ? (
        <p className="status ok">
          API status: {health.status} ({health.service})
        </p>
      ) : null}
      {error ? <p className="status error">{error}</p> : null}
      {!health && !error ? <p className="status">Checking API…</p> : null}
    </main>
  );
}
