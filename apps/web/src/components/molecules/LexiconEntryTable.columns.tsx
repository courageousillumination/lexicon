import { Anchor, Badge, Checkbox, Text } from "@mantine/core";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { LexiconEntry } from "@lexicon/shared/model";

function primaryDefinition(entry: LexiconEntry): string {
  return entry.definitions[0]?.definition?.trim() || "—";
}

function statusColor(
  status: LexiconEntry["status"],
): "gray" | "book" | "yellow" {
  switch (status) {
    case "active":
      return "book";
    case "draft":
      return "yellow";
    case "archived":
      return "gray";
  }
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
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <Anchor
        component={Link}
        to={`/lexicon/entries/${row.original.id}`}
        fw={500}
        style={{ whiteSpace: "nowrap" }}
      >
        {row.original.value}
      </Anchor>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge size="sm" variant="light" color={statusColor(row.original.status)}>
        {row.original.status}
      </Badge>
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
