import { Stack } from "@mantine/core";
import { PageHeader } from "../components/atoms/PageHeader";
import { GenerateStoryPanel } from "../components/organisms/GenerateStoryPanel";

export function StoryPage() {
  return (
    <Stack gap="xl">
      <PageHeader title="Story" />
      <GenerateStoryPanel />
    </Stack>
  );
}
