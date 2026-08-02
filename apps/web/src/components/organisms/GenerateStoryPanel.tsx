import { useContext } from "react";
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Group,
  HoverCard,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import type { LexiconEntry } from "@lexicon/shared/model";
import { useLexiconEntries } from "../../api/lexicon-entry";
import { useGenerateStory } from "../../api/story";
import { LexiconContext } from "../../contexts/LexiconContext";
import { LexiconEntryCard } from "../molecules/LexiconEntryCard";

function errorMessage(error: unknown, fallback: string): string | null {
  if (!error) {
    return null;
  }
  return error instanceof Error ? error.message : fallback;
}

function entryByValue(
  entries: LexiconEntry[] | undefined,
  value: string,
): LexiconEntry | undefined {
  return entries?.find((entry) => entry.value === value);
}

export function GenerateStoryPanel() {
  const { lexicon } = useContext(LexiconContext)!;
  const entriesQuery = useLexiconEntries(lexicon?.id);
  const generateStory = useGenerateStory();

  const entryCount = entriesQuery.data?.length ?? 0;
  const error = errorMessage(
    generateStory.error,
    "Unable to generate a story",
  );
  const story = generateStory.data?.story;

  async function onGenerate() {
    if (!lexicon) {
      return;
    }

    await generateStory.mutateAsync({ lexiconId: lexicon.id });
  }

  if (!lexicon) {
    return (
      <Text c="dimmed">
        <Anchor component={Link} to="/lexicons">
          Create a lexicon
        </Anchor>{" "}
        to generate a story, or select one in the sidebar.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      <Text c="dimmed">
        Generate a short story using only vocabulary from{" "}
        <Text span fw={500}>
          {lexicon.name}
        </Text>
        .
      </Text>

      <Group>
        <Button
          onClick={() => void onGenerate()}
          loading={generateStory.isPending}
          disabled={entryCount === 0 || entriesQuery.isPending}
        >
          Generate story
        </Button>
        <Text size="sm" c="dimmed">
          {entriesQuery.isPending
            ? "Loading vocabulary…"
            : entryCount === 0
              ? "Add entries first"
              : `${entryCount} vocabulary ${entryCount === 1 ? "item" : "items"} available`}
        </Text>
      </Group>

      {error ? (
        <Alert color="red" title="Something went wrong">
          {error}
        </Alert>
      ) : null}

      {story ? (
        <Stack gap="sm">
          <Title order={3}>{story.title}</Title>
          <Text style={{ whiteSpace: "pre-wrap" }}>{story.story}</Text>
          {story.wordsUsed.length > 0 ? (
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                Words used
              </Text>
              <Group gap="xs">
                {story.wordsUsed.map((word) => {
                  const entry = entryByValue(entriesQuery.data, word);
                  if (!entry) {
                    return (
                      <Badge key={word} variant="light">
                        {word}
                      </Badge>
                    );
                  }

                  return (
                    <HoverCard
                      key={word}
                      width={320}
                      shadow="md"
                      openDelay={200}
                      closeDelay={100}
                      withinPortal
                    >
                      <HoverCard.Target>
                        <Badge
                          component={Link}
                          to={`/lexicon/entries/${entry.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="light"
                          style={{ cursor: "pointer", textDecoration: "none" }}
                        >
                          {word}
                        </Badge>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <LexiconEntryCard entry={entry} />
                      </HoverCard.Dropdown>
                    </HoverCard>
                  );
                })}
              </Group>
            </Stack>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
