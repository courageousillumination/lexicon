import { AppShell, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../organisms/AppSidebar";

export function AuthenticatedLayout() {
  return (
    <AppShell navbar={{ width: 240, breakpoint: "sm" }} padding="md">
      <AppSidebar />
      <AppShell.Main>
        <Container size="sm" py="md">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
