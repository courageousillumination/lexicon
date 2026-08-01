import { AppShell, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { LexiconProvider } from "../../contexts/LexiconProvider";
import { AppSidebar } from "../organisms/AppSidebar";

export function AuthenticatedLayout() {
  return (
    <LexiconProvider>
      <AppShell navbar={{ width: 240, breakpoint: "sm" }} padding="md">
        <AppSidebar />
        <AppShell.Main>
          <Container size="sm" py="md">
            <Outlet />
          </Container>
        </AppShell.Main>
      </AppShell>
    </LexiconProvider>
  );
}
