import { Alert, Anchor, Button, Stack, Text, Title } from "@mantine/core";
import { Link, useParams } from "react-router-dom";
import {
  useEnhanceLexiconEntries,
  useLexiconEntry,
} from "../api/lexicon-entry";
import { LexiconEntryCard } from "../components/molecules/LexiconEntryCard";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

export function LexiconEntryPage() {
  const { id } = useParams<{ id: string }>();
  const entryQuery = useLexiconEntry(id);
  const enhanceEntries = useEnhanceLexiconEntries(entryQuery.data?.lexiconId);
  const loadError = errorMessage(entryQuery.error, "Unable to load entry");
  const enhanceError = errorMessage(
    enhanceEntries.error,
    "Unable to enhance entry",
  );

  if (entryQuery.isPending) {
    return <Text c="dimmed">Loading…</Text>;
  }

  if (loadError) {
    return (
      <Alert color="red" title="Something went wrong">
        {loadError}
      </Alert>
    );
  }

  if (!entryQuery.data) {
    return (
      <Stack gap="md">
        <Title order={1}>Entry not found</Title>
        <Text c="dimmed">
          This entry may have been deleted.{" "}
          <Anchor component={Link} to="/lexicon">
            Back to entries
          </Anchor>
        </Text>
      </Stack>
    );
  }

  const entry = entryQuery.data;

  return (
    <Stack gap="md">
      <Anchor component={Link} to="/lexicon" size="sm">
        ← Entries
      </Anchor>
      <LexiconEntryCard
        entry={entry}
        actions={
          <Button
            size="xs"
            variant="default"
            loading={enhanceEntries.isPending}
            onClick={() => void enhanceEntries.mutateAsync([entry.id])}
          >
            Enhance
          </Button>
        }
      />
      {enhanceError ? (
        <Alert color="red" title="Something went wrong">
          {enhanceError}
        </Alert>
      ) : null}
    </Stack>
  );
}
