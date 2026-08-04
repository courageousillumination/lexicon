import { useContext, useState } from "react";
import {
  Alert,
  Badge,
  Center,
  Group,
  Loader,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconBooks } from "@tabler/icons-react";
import type { LexiconEntryStatus } from "@lexicon/shared/model";
import { languageLabel } from "@lexicon/shared/model";
import { useLexiconEntries } from "../api/lexicon-entry";
import { PageHeader } from "../components/atoms/PageHeader";
import { AddLexiconEntriesForm } from "../components/organisms/AddLexiconEntriesForm";
import { LexiconEntryTable } from "../components/molecules/LexiconEntryTable";
import { LexiconContext } from "../contexts/LexiconContext";

type StatusFilter = LexiconEntryStatus | "all";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

function emptyMessage(status: StatusFilter): string {
  if (status === "all") {
    return "No entries yet. Add a word above, or switch to Bulk to paste several at once—one value per line.";
  }
  return `No ${status} entries. Try a different status, or add a new word above.`;
}

export function LexiconPage() {
  const { lexicon } = useContext(LexiconContext)!;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const entriesQuery = useLexiconEntries(
    lexicon?.id,
    statusFilter === "all" ? {} : { status: statusFilter },
  );
  const entries = entriesQuery.data ?? [];
  const error = errorMessage(entriesQuery.error, "Unable to load entries");

  return (
    <Stack gap="xl">
      <PageHeader
        title={lexicon!.name}
        aside={
          <Badge variant="light" size="lg" tt="none">
            {languageLabel(lexicon!.sourceLanguage)} →{" "}
            {languageLabel(lexicon!.targetLanguage)}
          </Badge>
        }
      />

      <AddLexiconEntriesForm />

      <Stack gap="md" component="section" aria-labelledby="entries-heading">
        <Group justify="space-between" align="center" gap="md" wrap="wrap">
          <Title order={2} id="entries-heading">
            Entries
          </Title>
          <SegmentedControl
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as StatusFilter)}
            data={[
              { label: "All", value: "all" },
              { label: "Draft", value: "draft" },
              { label: "Active", value: "active" },
              { label: "Archived", value: "archived" },
            ]}
            aria-label="Filter entries by status"
          />
        </Group>
        {entriesQuery.isPending ? (
          <Center py="xl">
            <Loader aria-label="Loading entries" />
          </Center>
        ) : null}
        {!entriesQuery.isPending && entries.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="sm" maw={320}>
              <ThemeIcon size={48} radius="md" variant="light" color="book">
                <IconBooks size={26} stroke={1.5} />
              </ThemeIcon>
              <Text ta="center" c="dimmed">
                {emptyMessage(statusFilter)}
              </Text>
            </Stack>
          </Center>
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
