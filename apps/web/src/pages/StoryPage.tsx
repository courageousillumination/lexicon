import { useContext } from "react";
import { Stack, Title } from "@mantine/core";
import { GenerateStoryPanel } from "../components/organisms/GenerateStoryPanel";
import { LexiconContext } from "../contexts/LexiconContext";

export function StoryPage() {
  const { lexicon } = useContext(LexiconContext)!;

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1}>Story</Title>
        {lexicon ? (
          <Title order={2} c="dimmed" fw={400}>
            {lexicon.name}
          </Title>
        ) : null}
      </Stack>
      <GenerateStoryPanel />
    </Stack>
  );
}
