import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./contexts/AuthProvider";
import { App } from "./App";

// Mantine base styles.
import "@mantine/core/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
);
