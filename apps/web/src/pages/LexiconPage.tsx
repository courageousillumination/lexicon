import { useContext } from "react";
import {
  Alert,
  Badge,
  Center,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconBooks } from "@tabler/icons-react";
import { languageLabel } from "@lexicon/shared/model";
import { useLexiconEntries } from "../api/lexicon-entry";
import { PageHeader } from "../components/atoms/PageHeader";
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
        <Title order={2} id="entries-heading">
          Entries
        </Title>
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
                No entries yet. Add a word above, or switch to Bulk to paste
                several at once—one value per line.
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
