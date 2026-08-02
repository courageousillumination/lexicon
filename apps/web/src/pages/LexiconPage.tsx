import { useContext } from "react";
import { Alert, Stack, Text, Title } from "@mantine/core";
import { useLexiconEntries } from "../api/lexicon-entry";
import { AddLexiconEntriesForm } from "../components/organisms/AddLexiconEntriesForm";
import { LexiconEntryTable } from "../components/molecules/LexiconEntryTable";
import { LexiconContext } from "../contexts/LexiconContext";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

export function LexiconPage() {
  const { lexicon } = useContext(LexiconContext)!;
  const entriesQuery = useLexiconEntries(lexicon?.id);
  const entries = entriesQuery.data ?? [];
  const error = errorMessage(entriesQuery.error, "Unable to load entries");

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1}>{lexicon!.name}</Title>
        <Text c="dimmed">Lexical entries in this lexicon.</Text>
      </Stack>

      <AddLexiconEntriesForm />

      <Stack gap="md" component="section" aria-labelledby="entries-heading">
        <Title order={2} id="entries-heading">
          Entries
        </Title>
        {entriesQuery.isPending ? <Text c="dimmed">Loading…</Text> : null}
        {!entriesQuery.isPending && entries.length === 0 ? (
          <Text c="dimmed">No entries yet. Add some above.</Text>
        ) : null}
        <LexiconEntryTable entries={entries} />
      </Stack>

      {error ? (
        <Alert color="red" title="Something went wrong">
          {error}
        </Alert>
      ) : null}
    </Stack>
  );
}
