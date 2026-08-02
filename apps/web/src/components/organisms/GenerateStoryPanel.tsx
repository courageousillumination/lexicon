import { useContext } from "react";
import {
  Alert,
  Anchor,
  Badge,
  Button,
  Group,
  HoverCard,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconNotebook } from "@tabler/icons-react";
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
    <Stack gap="lg">
      <Paper p="lg">
        <Stack gap="md">
          <Text c="dimmed">
            Generate a short story using only vocabulary from{" "}
            <Text span fw={600}>
              {lexicon.name}
            </Text>
            .
          </Text>

          <Group>
            <Button
              leftSection={<IconNotebook size={16} stroke={1.6} />}
              onClick={() => void onGenerate()}
              loading={generateStory.isPending}
              disabled={entryCount === 0 || entriesQuery.isPending}
            >
              Generate story
            </Button>
            {!entriesQuery.isPending && entryCount === 0 ? (
              <Text size="sm" c="dimmed">
                Add some entries to this lexicon first.
              </Text>
            ) : null}
          </Group>

          {error ? (
            <Alert color="red" title="Something went wrong">
              {error}
            </Alert>
          ) : null}
        </Stack>
      </Paper>

      {story ? (
        <Paper p="lg">
          <Stack gap="md">
            <Title order={2}>{story.title}</Title>
            <Text style={{ whiteSpace: "pre-wrap" }} lh={1.7}>
              {story.story}
            </Text>
            {story.wordsUsed.length > 0 ? (
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={600} tt="uppercase">
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
                            style={{
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
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
        </Paper>
      ) : null}
    </Stack>
  );
}
