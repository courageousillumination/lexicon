import { useContext } from "react";
import { Button, Group, Menu, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useLexicons } from "../../api/lexicon";
import { LexiconContext } from "../../contexts/LexiconContext";

export function LexiconSwitcher() {
  const { lexicon, setLexiconId } = useContext(LexiconContext)!;
  const lexiconsQuery = useLexicons();
  const navigate = useNavigate();
  const lexicons = lexiconsQuery.data ?? [];

  const label = lexiconsQuery.isPending
    ? "Loading…"
    : (lexicon?.name ?? "Select lexicon");

  return (
    <Menu shadow="md" width="target" position="bottom-start" withinPortal>
      <Menu.Target>
        <Button
          variant="subtle"
          color="gray"
          fullWidth
          justify="space-between"
          px="xs"
          h="auto"
          py={6}
        >
          <Group justify="space-between" wrap="nowrap" gap="xs" w="100%">
            <Text
              fw={600}
              size="sm"
              truncate
              lh={1.3}
              mt={2}
              c="var(--mantine-color-text)"
            >
              {label}
            </Text>

            <Text size="xs" c="dimmed" aria-hidden fw={400}>
              ▾
            </Text>
          </Group>
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
                  navigate("/");
                }}
                rightSection={
                  item.id === lexicon?.id ? (
                    <Text size="sm" c="dimmed" aria-hidden>
                      ✓
                    </Text>
                  ) : undefined
                }
              >
                {item.name}
              </Menu.Item>
            ))}
            <Menu.Divider />
          </>
        ) : null}
        <Menu.Item onClick={() => void navigate("/lexicons")}>
          Manage Lexicons
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
