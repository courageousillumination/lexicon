import { Stack, Text, Title } from "@mantine/core";
import { ManageLexiconsPanel } from "../components/organisms/ManageLexiconsPanel";

export function LexiconsPage() {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1}>Lexicons</Title>
        <Text c="dimmed">Create and manage your lexicons.</Text>
      </Stack>
      <ManageLexiconsPanel />
    </Stack>
  );
}
