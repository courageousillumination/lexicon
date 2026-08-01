import { useContext } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Group, Menu, Table, Text } from "@mantine/core";
import type { LexiconEntry } from "@lexicon/shared/model";
import {
  useDeleteLexiconEntries,
  useEnhanceLexiconEntries,
} from "../../api/lexicon-entry";
import { LexiconContext } from "../../contexts/LexiconContext";
import { lexiconEntryColumns } from "./LexiconEntryTable.columns";

export type LexiconEntryTableProps = {
  entries: LexiconEntry[];
};

export function LexiconEntryTable({ entries }: LexiconEntryTableProps) {
  const { lexicon } = useContext(LexiconContext)!;
  const enhanceEntries = useEnhanceLexiconEntries(lexicon?.id);
  const deleteEntries = useDeleteLexiconEntries(lexicon?.id);
  const busy = enhanceEntries.isPending || deleteEntries.isPending;

  const table = useReactTable({
    data: entries,
    columns: lexiconEntryColumns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  const hasSelection = selectedIds.length > 0;
  const columnCount = table.getAllColumns().length;

  async function onEnhance() {
    await enhanceEntries.mutateAsync(selectedIds);
    table.resetRowSelection();
  }

  async function onDelete() {
    await deleteEntries.mutateAsync(selectedIds);
    table.resetRowSelection();
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th colSpan={columnCount}>
            <Group justify="space-between" gap="sm" wrap="nowrap">
              <Menu position="bottom-start">
                <Menu.Target>
                  <Button size="xs" variant="default" loading={busy}>
                    Actions
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    disabled={!hasSelection || busy}
                    onClick={() => void onEnhance()}
                  >
                    Enhance{hasSelection ? ` (${selectedIds.length})` : ""}
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    disabled={!hasSelection || busy}
                    onClick={() => void onDelete()}
                  >
                    Delete{hasSelection ? ` (${selectedIds.length})` : ""}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Text size="sm" c="dimmed">
                {hasSelection
                  ? `${selectedIds.length} selected`
                  : "Select rows to enable actions"}
              </Text>
            </Group>
          </Table.Th>
        </Table.Tr>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th
                key={header.id}
                w={
                  header.column.getSize() !== 150
                    ? header.column.getSize()
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {table.getRowModel().rows.map((row) => (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
