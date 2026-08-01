import { useContext, useState, type FormEvent } from "react";
import {
  Alert,
  Badge,
  Button,
  Group,
  List,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  useCreateLexiconEntry,
  useEnhanceLexiconEntries,
  useLexiconEntries,
} from "../api/lexicon-entry";
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
  const createEntry = useCreateLexiconEntry(lexicon?.id);
  const enhanceEntries = useEnhanceLexiconEntries(lexicon?.id);
  const [value, setValue] = useState("");

  const entries = entriesQuery.data ?? [];
  const error =
    errorMessage(entriesQuery.error, "Unable to load entries") ??
    errorMessage(createEntry.error, "Unable to create entry") ??
    errorMessage(enhanceEntries.error, "Unable to enhance entry");

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || !lexicon) {
      return;
    }

    try {
      await createEntry.mutateAsync(trimmed);
      setValue("");
    } catch {
      // Error is surfaced via createEntry.error
    }
  }

  async function onEnhance(entryId: string) {
    try {
      await enhanceEntries.mutateAsync([entryId]);
    } catch {
      // Error is surfaced via enhanceEntries.error
    }
  }

  if (!lexicon) {
    return (
      <Stack gap="md">
        <Title order={1}>Lexicon</Title>
        <Text c="dimmed">
          Create or select a lexicon in the sidebar to get started.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1}>{lexicon.name}</Title>
        <Text c="dimmed">Lexical entries in this lexicon.</Text>
      </Stack>

      <Stack gap="sm" component="section" aria-labelledby="add-entry-heading">
        <Title order={2} id="add-entry-heading">
          Add an entry
        </Title>
        <form onSubmit={(event) => void onCreate(event)}>
          <Group align="flex-end" gap="sm" wrap="nowrap">
            <TextInput
              label="Value"
              name="value"
              required
              flex={1}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              placeholder="e.g. 你好"
            />
            <Button type="submit" loading={createEntry.isPending}>
              Add
            </Button>
          </Group>
        </form>
      </Stack>

      <Stack gap="sm" component="section" aria-labelledby="entries-heading">
        <Title order={2} id="entries-heading">
          Entries
        </Title>
        {entriesQuery.isPending ? <Text c="dimmed">Loading…</Text> : null}
        {!entriesQuery.isPending && entries.length === 0 ? (
          <Text c="dimmed">No entries yet. Add one above.</Text>
        ) : null}
        {entries.length > 0 ? (
          <List spacing="sm">
            {entries.map((entry) => {
              const enhancing =
                enhanceEntries.isPending &&
                enhanceEntries.variables?.includes(entry.id);

              return (
                <List.Item key={entry.id}>
                  <Group gap="sm" justify="space-between" wrap="wrap">
                    <Group gap="sm">
                      <Text>{entry.value}</Text>
                      <Badge size="sm" variant="light">
                        {entry.type}
                      </Badge>
                      <Badge size="sm" variant="outline">
                        {entry.status}
                      </Badge>
                      {entry.tags.map((tag) => (
                        <Badge key={tag} size="sm" color="gray" variant="light">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                    <Button
                      size="xs"
                      variant="default"
                      loading={enhancing}
                      onClick={() => void onEnhance(entry.id)}
                    >
                      Enhance
                    </Button>
                  </Group>
                </List.Item>
              );
            })}
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
