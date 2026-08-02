import { createTheme, type MantineColorsTuple, type MantineThemeOverride } from "@mantine/core";

/** Warm parchment → leather scale for a bookish feel. */
const book: MantineColorsTuple = [
  "#F8F4EE",
  "#F0E8DC",
  "#E4D5C1",
  "#D4BC9E",
  "#C4A078",
  "#A67C52",
  "#8B5E3C",
  "#6F4A2F",
  "#563925",
  "#3D2919",
];

export const theme: MantineThemeOverride = createTheme({
  primaryColor: "book",
  colors: {
    book,
  },
  defaultRadius: "md",
  fontFamily:
    '"Source Sans 3", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headings: {
    fontFamily:
      'Fraunces, Georgia, "Times New Roman", "Noto Serif", serif',
    fontWeight: "600",
  },
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
        withBorder: true,
      },
    },
    NavLink: {
      defaultProps: {
        variant: "light",
      },
      styles: {
        root: {
          borderRadius: "var(--mantine-radius-md)",
        },
      },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      },
    },
    Badge: {
      defaultProps: {
        radius: "sm",
      },
    },
  },
});
