import { Anchor, Checkbox, Text } from "@mantine/core";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { LexiconEntry } from "@lexicon/shared/model";

function primaryDefinition(entry: LexiconEntry): string {
  return entry.definitions[0]?.definition?.trim() || "—";
}

export const lexiconEntryColumns: ColumnDef<LexiconEntry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all entries"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.value}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    size: 40,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <Anchor
        component={Link}
        to={`/lexicon/entries/${row.original.id}`}
        fw={500}
      >
        {row.original.value}
      </Anchor>
    ),
  },
  {
    accessorKey: "pronunciation",
    header: "Pronunciation",
    cell: ({ row }) => {
      const pronunciation = row.original.pronunciation.trim();
      return (
        <Text size="sm" fs={pronunciation ? "italic" : undefined} c="dimmed">
          {pronunciation || "—"}
        </Text>
      );
    },
  },
  {
    id: "definition",
    header: "Definition",
    accessorFn: (entry) => primaryDefinition(entry),
    cell: ({ row }) => (
      <Text size="sm" c={row.original.definitions[0] ? undefined : "dimmed"}>
        {primaryDefinition(row.original)}
      </Text>
    ),
  },
];
