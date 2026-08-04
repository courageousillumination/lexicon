import type { ReactNode } from "react";
import { Alert, Center, Loader, Text } from "@mantine/core";
import { useLexiconEntry } from "../../api/lexicon-entry";
import { LexiconEntryCard } from "./LexiconEntryCard";

export type LexiconEntryCardLoaderProps = {
  entryId: string;
  actions?: ReactNode;
};

export function LexiconEntryCardLoader({
  entryId,
  actions,
}: LexiconEntryCardLoaderProps) {
  const entryQuery = useLexiconEntry(entryId);

  if (entryQuery.isPending) {
    return (
      <Center py="md">
        <Loader size="sm" aria-label="Loading entry" />
      </Center>
    );
  }

  if (entryQuery.error) {
    return (
      <Alert color="red" title="Something went wrong">
        {entryQuery.error instanceof Error
          ? entryQuery.error.message
          : "Unable to load entry"}
      </Alert>
    );
  }

  if (!entryQuery.data) {
    return (
      <Text size="sm" c="dimmed">
        Entry not found
      </Text>
    );
  }

  return <LexiconEntryCard entry={entryQuery.data} actions={actions} />;
}
