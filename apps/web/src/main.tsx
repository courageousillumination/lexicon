import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./contexts/AuthProvider";
import { QueryProvider } from "./contexts/QueryProvider";
import { App } from "./App";
import { theme } from "./theme";

// Mantine base styles.
import "@mantine/core/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryProvider>
    </MantineProvider>
  </StrictMode>,
);
