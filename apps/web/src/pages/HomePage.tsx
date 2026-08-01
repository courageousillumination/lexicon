import { useContext, useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Container,
  List,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { createLexicon } from "@lexicon/shared/repository";
import type { Lexicon } from "@lexicon/shared/model";
import { AuthContext } from "../contexts/AuthContext";
import { fetchLexicons } from "../lib/api";
import { getSupabase } from "../lib/supabase";
import { useSignOut } from "../hooks/auth";

export function HomePage() {
  const { user } = useContext(AuthContext)!;
  const signOut = useSignOut();
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
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>Lexicon</Title>
          <Text c="dimmed">Signed in as {user?.email}</Text>
        </Stack>

        <Stack
          gap="sm"
          component="section"
          aria-labelledby="create-lexicon-heading"
        >
          <Title order={2} id="create-lexicon-heading">
            Create a lexicon
          </Title>
          <form onSubmit={(event) => void onCreate(event)}>
            <Stack gap="sm">
              <TextInput
                label="Name"
                name="name"
                required
                maxLength={120}
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="e.g. Mandarin essentials"
              />
              <Button type="submit" loading={submitting} w="fit-content">
                Create
              </Button>
            </Stack>
          </form>
        </Stack>

        <Stack gap="sm" component="section" aria-labelledby="lexicons-heading">
          <Title order={2} id="lexicons-heading">
            Your lexicons
          </Title>
          {loading ? <Text c="dimmed">Loading…</Text> : null}
          {!loading && lexicons.length === 0 ? (
            <Text c="dimmed">No lexicons yet. Create one above.</Text>
          ) : null}
          {lexicons.length > 0 ? (
            <List spacing="xs">
              {lexicons.map((lexicon) => (
                <List.Item key={lexicon.id}>{lexicon.name}</List.Item>
              ))}
            </List>
          ) : null}
        </Stack>

        {error ? (
          <Alert color="red" title="Something went wrong">
            {error}
          </Alert>
        ) : null}

        <Button
          variant="default"
          w="fit-content"
          onClick={() => void onSignOut()}
          loading={signingOut}
        >
          Sign out
        </Button>
      </Stack>
    </Container>
  );
}
