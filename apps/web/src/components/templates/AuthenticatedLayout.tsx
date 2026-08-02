import { AppShell, Box, Burger, Container, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { IconBook2 } from "@tabler/icons-react";
import { LexiconProvider } from "../../contexts/LexiconProvider";
import { AppSidebar } from "../organisms/AppSidebar";

export function AuthenticatedLayout() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <LexiconProvider>
      <Box
        mih="100vh"
        style={{
          background: "var(--mantine-color-body)",
          backgroundImage:
            "linear-gradient(165deg, var(--mantine-color-book-0) 0%, #EFE6D8 48%, var(--mantine-color-book-1) 100%)",
        }}
      >
        <AppShell
          header={{ height: { base: 56, sm: 0 } }}
          navbar={{
            width: 260,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
          styles={{
            main: {
              background: "transparent",
              minHeight: "100vh",
            },
            navbar: {
              backgroundColor: "rgba(248, 244, 238, 0.92)",
              backdropFilter: "blur(8px)",
              borderRight:
                "1px solid var(--mantine-color-book-2)",
            },
            header: {
              backgroundColor: "rgba(248, 244, 238, 0.94)",
              backdropFilter: "blur(8px)",
              borderBottom:
                "1px solid var(--mantine-color-book-2)",
            },
          }}
        >
          <AppShell.Header hiddenFrom="sm" px="md">
            <Group h="100%" justify="space-between">
              <Group gap="sm">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  aria-label="Toggle navigation"
                />
                <Group gap={8}>
                  <IconBook2
                    size={22}
                    stroke={1.6}
                    color="var(--mantine-color-book-7)"
                  />
                  <Title order={4}>Lexicon</Title>
                </Group>
              </Group>
            </Group>
          </AppShell.Header>

          <AppSidebar onNavigate={close} />

          <AppShell.Main>
            <Container size="md" py={{ base: "md", sm: "lg" }}>
              <Outlet />
            </Container>
          </AppShell.Main>
        </AppShell>
      </Box>
    </LexiconProvider>
  );
}
