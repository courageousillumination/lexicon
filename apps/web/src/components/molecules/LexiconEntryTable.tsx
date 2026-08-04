import { useContext } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Button,
  Group,
  Menu,
  Pagination,
  Paper,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconDots, IconSparkles, IconTrash } from "@tabler/icons-react";
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: entries,
    columns: lexiconEntryColumns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  const hasSelection = selectedIds.length > 0;
  const columnCount = table.getAllColumns().length;
  const pageCount = table.getPageCount();
  const { pageIndex, pageSize } = table.getState().pagination;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, entries.length);

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
    <Stack gap="sm">
      <Paper p={0} style={{ overflow: "hidden" }}>
        <Table striped withTableBorder={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th colSpan={columnCount}>
                <Group justify="space-between" gap="sm" wrap="nowrap">
                  <Menu position="bottom-start">
                    <Menu.Target>
                      <Button
                        size="xs"
                        variant="light"
                        color="gray"
                        leftSection={<IconDots size={14} stroke={1.6} />}
                        loading={busy}
                      >
                        Actions
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconSparkles size={14} stroke={1.6} />}
                        disabled={!hasSelection || busy}
                        onClick={() => void onEnhance()}
                      >
                        Enhance
                        {hasSelection ? ` (${selectedIds.length})` : ""}
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} stroke={1.6} />}
                        disabled={!hasSelection || busy}
                        onClick={() => void onDelete()}
                      >
                        Delete
                        {hasSelection ? ` (${selectedIds.length})` : ""}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  <Text size="sm" c="dimmed">
                    {hasSelection ? `${selectedIds.length} selected` : null}
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
      </Paper>

      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Text size="sm" c="dimmed">
          {from}–{to} of {entries.length}
        </Text>
        {pageCount > 1 ? (
          <Pagination
            total={pageCount}
            value={pageIndex + 1}
            onChange={(page) => table.setPageIndex(page - 1)}
            size="sm"
          />
        ) : null}
      </Group>
    </Stack>
  );
}
