import type { ReactNode } from "react";
import { Badge, Group, Stack, Text, Title } from "@mantine/core";
import type { LexiconEntry } from "@lexicon/shared/model";

export type LexiconEntryCardProps = {
  entry: LexiconEntry;
  actions?: ReactNode;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Stack gap={4}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={0.4}>
        {label}
      </Text>
      {children}
    </Stack>
  );
}

function statusColor(
  status: LexiconEntry["status"],
): "gray" | "book" | "yellow" {
  switch (status) {
    case "active":
      return "book";
    case "draft":
      return "yellow";
    case "archived":
      return "gray";
  }
}

export function LexiconEntryCard({ entry, actions }: LexiconEntryCardProps) {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
        <Stack gap={4}>
          <Title order={2}>{entry.value}</Title>
          {entry.pronunciation ? (
            <Text c="dimmed" fs="italic" size="lg">
              {entry.pronunciation}
            </Text>
          ) : null}
        </Stack>
        {actions}
      </Group>

      <Group gap="xs" wrap="wrap">
        <Badge size="sm" variant="light">
          {entry.type}
        </Badge>
        <Badge size="sm" variant="light" color={statusColor(entry.status)}>
          {entry.status}
        </Badge>
        {entry.language ? (
          <Badge size="sm" variant="outline" color="gray">
            {entry.language}
          </Badge>
        ) : null}
        {entry.tags.map((tag) => (
          <Badge key={tag} size="sm" color="gray" variant="light">
            {tag}
          </Badge>
        ))}
      </Group>

      {entry.definitions.length > 0 ? (
        <Field label="Definitions">
          <Stack gap={8}>
            {entry.definitions.map((definition, index) => (
              <Group
                key={`${definition.language}-${index}`}
                gap="xs"
                align="flex-start"
              >
                {definition.language ? (
                  <Badge size="xs" variant="outline">
                    {definition.language}
                  </Badge>
                ) : null}
                <Text size="sm">{definition.definition}</Text>
              </Group>
            ))}
          </Stack>
        </Field>
      ) : null}

      {entry.variants.length > 0 ? (
        <Field label="Variants">
          <Stack gap={8}>
            {entry.variants.map((variant, index) => (
              <Stack key={`${variant.value}-${index}`} gap={2}>
                <Group gap="xs">
                  <Text size="sm" fw={600}>
                    {variant.value}
                  </Text>
                  {variant.pronunciation ? (
                    <Text size="sm" c="dimmed" fs="italic">
                      {variant.pronunciation}
                    </Text>
                  ) : null}
                </Group>
                {variant.description ? (
                  <Text size="sm" c="dimmed">
                    {variant.description}
                  </Text>
                ) : null}
              </Stack>
            ))}
          </Stack>
        </Field>
      ) : null}
    </Stack>
  );
}
