import { useEffect, useState, type FormEvent } from "react";
import { createLexicon } from "@lexicon/shared/repository";
import type { Lexicon } from "@lexicon/shared/model";
import { useAuth } from "../auth/useAuth";
import { fetchLexicons } from "../lib/api";
import { getSupabase } from "../lib/supabase";
import "../App.css";

export function HomePage() {
  const { user, signOut } = useAuth();
  const [lexicons, setLexicons] = useState<Lexicon[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void fetchLexicons()
      .then((data) => {
        if (!cancelled) {
          setLexicons(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load lexicons",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const created = await createLexicon(getSupabase(), { name: trimmed });
      setLexicons((current) => [created, ...current]);
      setName("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to create lexicon");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign out");
      setSigningOut(false);
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Lexicon</h1>
        <p>Signed in as {user?.email}</p>
      </header>

      <section
        className="app__section"
        aria-labelledby="create-lexicon-heading"
      >
        <h2 id="create-lexicon-heading">Create a lexicon</h2>
        <form className="app__form" onSubmit={(event) => void onCreate(event)}>
          <label className="app__field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Mandarin essentials"
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create"}
          </button>
        </form>
      </section>

      <section className="app__section" aria-labelledby="lexicons-heading">
        <h2 id="lexicons-heading">Your lexicons</h2>
        {loading ? <p className="status">Loading…</p> : null}
        {!loading && lexicons.length === 0 ? (
          <p className="app__empty">No lexicons yet. Create one above.</p>
        ) : null}
        {lexicons.length > 0 ? (
          <ul className="app__list">
            {lexicons.map((lexicon) => (
              <li key={lexicon.id}>{lexicon.name}</li>
            ))}
          </ul>
        ) : null}
      </section>

      {error ? <p className="status error">{error}</p> : null}

      <button
        type="button"
        className="app__sign-out"
        onClick={() => void onSignOut()}
        disabled={signingOut}
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </main>
  );
}
