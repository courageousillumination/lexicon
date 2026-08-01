import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  List,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useCreateLexicon, useLexicons } from "../api/lexicon";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

export function HomePage() {
  const lexiconsQuery = useLexicons();
  const createLexicon = useCreateLexicon();
  const [name, setName] = useState("");

  const lexicons = lexiconsQuery.data ?? [];
  const error =
    errorMessage(lexiconsQuery.error, "Unable to load lexicons") ??
    errorMessage(createLexicon.error, "Unable to create lexicon");

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    try {
      await createLexicon.mutateAsync(trimmed);
      setName("");
    } catch {
      // Error is surfaced via createLexicon.error
    }
  }

  return (
    <Stack gap="xl">
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
            <Button
              type="submit"
              loading={createLexicon.isPending}
              w="fit-content"
            >
              Create
            </Button>
          </Stack>
        </form>
      </Stack>

      <Stack gap="sm" component="section" aria-labelledby="lexicons-heading">
        <Title order={2} id="lexicons-heading">
          Your lexicons
        </Title>
        {lexiconsQuery.isPending ? <Text c="dimmed">Loading…</Text> : null}
        {!lexiconsQuery.isPending && lexicons.length === 0 ? (
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
    </Stack>
  );
}
