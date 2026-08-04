import { useState } from "react";
import {
  Alert,
  Anchor,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconPencil, IconSparkles } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import {
  useEnhanceLexiconEntries,
  useLexiconEntry,
} from "../api/lexicon-entry";
import { LexiconEntryCard } from "../components/molecules/LexiconEntryCard";
import { EditLexiconEntryForm } from "../components/organisms/EditLexiconEntryForm";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

export function LexiconEntryPage() {
  const { id } = useParams<{ id: string }>();
  const [editing, setEditing] = useState(false);
  const entryQuery = useLexiconEntry(id);
  const enhanceEntries = useEnhanceLexiconEntries(entryQuery.data?.lexiconId);
  const loadError = errorMessage(entryQuery.error, "Unable to load entry");
  const enhanceError = errorMessage(
    enhanceEntries.error,
    "Unable to enhance entry",
  );

  if (entryQuery.isPending) {
    return (
      <Center py="xl">
        <Loader aria-label="Loading entry" />
      </Center>
    );
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
        <Group gap={6} component="span">
          <IconArrowLeft size={14} stroke={1.8} />
          Entries
        </Group>
      </Anchor>
      <Paper p="lg">
        {editing ? (
          <EditLexiconEntryForm
            key={entry.id}
            entry={entry}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        ) : (
          <LexiconEntryCard
            entry={entry}
            actions={
              <Group gap="sm">
                <Button
                  size="sm"
                  variant="light"
                  color="gray"
                  leftSection={<IconPencil size={16} stroke={1.6} />}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  leftSection={<IconSparkles size={16} stroke={1.6} />}
                  loading={enhanceEntries.isPending}
                  onClick={() => void enhanceEntries.mutateAsync([entry.id])}
                >
                  Enhance
                </Button>
              </Group>
            }
          />
        )}
      </Paper>
      {!editing && enhanceError ? (
        <Alert color="red" title="Something went wrong">
          {enhanceError}
        </Alert>
      ) : null}
    </Stack>
  );
}
