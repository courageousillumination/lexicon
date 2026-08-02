import { Stack } from "@mantine/core";
import { PageHeader } from "../components/atoms/PageHeader";
import { ManageLexiconsPanel } from "../components/organisms/ManageLexiconsPanel";

export function LexiconsPage() {
  return (
    <Stack gap="xl">
      <PageHeader title="Lexicons" />
      <ManageLexiconsPanel />
    </Stack>
  );
}
