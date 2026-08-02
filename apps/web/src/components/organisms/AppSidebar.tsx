import { useContext, useState } from "react";
import {
  Anchor,
  AppShell,
  Button,
  Divider,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useSignOut } from "../../hooks/auth";
import { LexiconSwitcher } from "./LexiconSwitcher";

const NAV_ITEMS = [
  { value: "/lexicon", label: "Entries" },
  { value: "/story", label: "Story" },
] as const;

export function AppSidebar() {
  const { user } = useContext(AuthContext)!;
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [signingOut, setSigningOut] = useState(false);

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
        <Stack gap="sm">
          <Anchor component={Link} to="/" underline="never" c="inherit">
            <Title order={3}>Lexicon</Title>
          </Anchor>
          <LexiconSwitcher />
        </Stack>
      </AppShell.Section>

      <Divider my="md" />

      <AppShell.Section grow>
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
