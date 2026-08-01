import { useContext, useState } from "react";
import {
  AppShell,
  Button,
  NavLink,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useLexicons } from "../../api/lexicon";
import { AuthContext } from "../../contexts/AuthContext";
import { LexiconContext } from "../../contexts/LexiconContext";
import { useSignOut } from "../../hooks/auth";

const NAV_ITEMS = [
  { value: "/lexicon", label: "Lexicon" },
  { value: "/story", label: "Story" },
] as const;

export function AppSidebar() {
  const { user } = useContext(AuthContext)!;
  const { lexicon, setLexiconId } = useContext(LexiconContext)!;
  const lexiconsQuery = useLexicons();
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [signingOut, setSigningOut] = useState(false);

  const lexicons = lexiconsQuery.data ?? [];

  async function onSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      void navigate("/sign-in", { replace: true });
    }
  }

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section>
        <Title order={3}>Lexicon</Title>
      </AppShell.Section>

      <AppShell.Section grow mt="md">
        <Stack gap="xs">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.value}
              label={item.label}
              active={location.pathname === item.value}
              onClick={() => void navigate(item.value)}
            />
          ))}
        </Stack>
      </AppShell.Section>

      <AppShell.Section>
        <Stack gap="sm">
          <Select
            label="Active lexicon"
            placeholder={
              lexiconsQuery.isPending
                ? "Loading…"
                : lexicons.length === 0
                  ? "No lexicons yet"
                  : "Select a lexicon"
            }
            data={lexicons.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={lexicon?.id ?? null}
            onChange={(value) => {
              if (value) {
                setLexiconId(value);
              }
            }}
            disabled={lexicons.length === 0}
            searchable
          />
          <Text size="sm" c="dimmed" lineClamp={2}>
            {user?.email}
          </Text>
          <Button
            variant="default"
            fullWidth
            onClick={() => void onSignOut()}
            loading={signingOut}
          >
            Sign out
          </Button>
        </Stack>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
