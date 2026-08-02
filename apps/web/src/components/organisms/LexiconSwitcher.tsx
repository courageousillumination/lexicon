import { useContext } from "react";
import { Button, Group, Menu, Stack, Text } from "@mantine/core";
import { IconCheck, IconChevronDown, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { languageLabel } from "@lexicon/shared/model";
import { useLexicons } from "../../api/lexicon";
import { LexiconContext } from "../../contexts/LexiconContext";

export type LexiconSwitcherProps = {
  onNavigate?: () => void;
};

export function LexiconSwitcher({ onNavigate }: LexiconSwitcherProps) {
  const { lexicon, setLexiconId } = useContext(LexiconContext)!;
  const lexiconsQuery = useLexicons();
  const navigate = useNavigate();
  const lexicons = lexiconsQuery.data ?? [];

  const label = lexiconsQuery.isPending
    ? "Loading…"
    : (lexicon?.name ?? "Select lexicon");

  return (
    <Menu
      shadow="md"
      width="target"
      position="bottom-start"
      withinPortal
      styles={{
        dropdown: {
          backgroundColor: "var(--mantine-color-book-0)",
          borderColor: "var(--mantine-color-book-2)",
        },
      }}
    >
      <Menu.Target>
        <Button
          variant="light"
          color="book"
          fullWidth
          justify="space-between"
          px="sm"
          h="auto"
          py={8}
          rightSection={<IconChevronDown size={14} stroke={1.8} />}
        >
          <Stack gap={2} align="flex-start" style={{ minWidth: 0, flex: 1 }}>
            <Text
              fw={600}
              size="sm"
              truncate
              lh={1.3}
              c="var(--mantine-color-book-9)"
              w="100%"
              ta="left"
            >
              {label}
            </Text>
            {lexicon ? (
              <Text size="xs" c="book.6" truncate w="100%" ta="left">
                {languageLabel(lexicon.sourceLanguage)} →{" "}
                {languageLabel(lexicon.targetLanguage)}
              </Text>
            ) : null}
          </Stack>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {lexicons.length > 0 ? (
          <>
            <Menu.Label>Switch lexicon</Menu.Label>
            {lexicons.map((item) => (
              <Menu.Item
                key={item.id}
                onClick={() => {
                  setLexiconId(item.id);
                  onNavigate?.();
                  navigate("/");
                }}
                rightSection={
                  item.id === lexicon?.id ? (
                    <IconCheck
                      size={16}
                      stroke={1.8}
                      color="var(--mantine-color-book-7)"
                    />
                  ) : undefined
                }
              >
                <Group gap={6} wrap="nowrap">
                  <Text size="sm" truncate>
                    {item.name}
                  </Text>
                </Group>
              </Menu.Item>
            ))}
            <Menu.Divider />
          </>
        ) : null}
        <Menu.Item
          leftSection={<IconSettings size={16} stroke={1.6} />}
          onClick={() => {
            onNavigate?.();
            void navigate("/lexicons");
          }}
        >
          Manage Lexicons
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
