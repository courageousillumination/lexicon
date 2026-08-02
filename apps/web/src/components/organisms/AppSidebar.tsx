import { useContext, useState } from "react";
import {
  Anchor,
  AppShell,
  Avatar,
  Button,
  Divider,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBook2,
  IconBooks,
  IconLogout,
  IconNotebook,
} from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useSignOut } from "../../hooks/auth";
import { LexiconSwitcher } from "./LexiconSwitcher";

const NAV_ITEMS = [
  {
    value: "/lexicon",
    label: "Entries",
    icon: IconBooks,
    match: (pathname: string) =>
      pathname === "/lexicon" || pathname.startsWith("/lexicon/entries"),
  },
  {
    value: "/story",
    label: "Story",
    icon: IconNotebook,
    match: (pathname: string) => pathname === "/story",
  },
] as const;

export type AppSidebarProps = {
  onNavigate?: () => void;
};

export function AppSidebar({ onNavigate }: AppSidebarProps) {
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

  function go(path: string) {
    onNavigate?.();
    void navigate(path);
  }

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section>
        <Stack gap="md">
          <Anchor
            component={Link}
            to="/"
            underline="never"
            c="inherit"
            onClick={() => onNavigate?.()}
          >
            <Group gap="sm" wrap="nowrap">
              <IconBook2
                size={26}
                stroke={1.6}
                color="var(--mantine-color-book-7)"
              />
              <Title order={3}>Lexicon</Title>
            </Group>
          </Anchor>
          <LexiconSwitcher onNavigate={onNavigate} />
        </Stack>
      </AppShell.Section>

      <Divider my="md" />

      <AppShell.Section grow>
        <Stack gap={4}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.value}
              label={item.label}
              leftSection={<item.icon size={18} stroke={1.6} />}
              active={item.match(location.pathname)}
              onClick={() => go(item.value)}
            />
          ))}
        </Stack>
      </AppShell.Section>

      <AppShell.Section>
        <Stack gap="sm">
          <Group gap="sm" wrap="nowrap">
            <Avatar color="book" radius="xl" size="sm">
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </Avatar>
            <Text size="sm" c="dimmed" lineClamp={2} style={{ minWidth: 0 }}>
              {user?.email}
            </Text>
          </Group>
          <Button
            variant="light"
            color="gray"
            fullWidth
            leftSection={<IconLogout size={16} stroke={1.6} />}
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
