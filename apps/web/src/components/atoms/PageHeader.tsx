import type { ReactNode } from "react";
import { Group, Stack, Text, Title } from "@mantine/core";

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
};

export function PageHeader({ title, description, aside }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
      <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
        <Title order={1}>{title}</Title>
        {description ? (
          <Text c="dimmed" size="md">
            {description}
          </Text>
        ) : null}
      </Stack>
      {aside}
    </Group>
  );
}
