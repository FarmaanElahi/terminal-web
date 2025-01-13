"use client";
import {
  Column,
  ColumnDef,
  ColumnPinningState,
  getCoreRowModel,
  Row,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import {
  CSSProperties,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormattedCell } from "@/components/symbols/formatted_cell";
import { defaultSymbolColumns } from "@/components/symbols/column";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";

const getCommonPinningStyles = (column: Column<Symbol>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  // const isFirstRightPinnedColumn =
  //   isPinned === "right" && column.getIsFirstColumn("right");

  return {
    // boxShadow: isLastLeftPinnedColumn
    //   ? "-4px 0 4px -4px gray inset"
    //   : isFirstRightPinnedColumn
    //     ? "4px 0 4px -4px gray inset"
    //     : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: isLastLeftPinnedColumn ? "#fff" : "transparent",
  };
};

function useColumnPinning(columns: ColumnDef<Symbol>[]) {
  const [left, right] = useMemo(() => {
    const leftCols = columns
      .filter((c) => (c.meta as Record<string, boolean>).pinLeft)
      .map((c) => c.id as string);

    const rightCols = columns
      .filter((c) => (c.meta as Record<string, boolean>).pinRight)
      .map((c) => c.id as string);

    return [leftCols, rightCols];
  }, [columns]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left,
    right,
  });

  return { columnPinning, setColumnPinning, getCommonPinningStyles };
}

function useSymbolColumns(columnKeys?: string[]) {
  return useMemo(() => {
    const columns = defaultSymbolColumns.map((c) => {
      // eslint-disable-next-line
      // @ts-ignore
      return { ...c, id: c.accessorKey } as ColumnDef<Symbol>;
    });

    const f = ["name", ...(columnKeys ?? [])];
    const filtered = columns.filter((c) => f?.includes(c.id as string));

    return filtered.map((col) => {
      return {
        ...col,
        cell: (props) => <FormattedCell cell={props} />,
      } as ColumnDef<Symbol>;
    });
  }, [columnKeys]);
}

export function useSymbolTable(
  id: string,
  data: Symbol[],
  columnKey?: string[],
) {
  // Defaults
  const columns = useSymbolColumns(columnKey);
  const symbolSwitcher = useGroupSymbolSwitcher();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { columnPinning, setColumnPinning } = useColumnPinning(columns);

  // Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnPinning, rowSelection },
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    getRowId: (row) => [row.exchange, row.name].join(":"),
  });

  // Switch Group Symbol
  useEffect(() => {
    const symbol = Object.keys(rowSelection).filter((s) => rowSelection[s])[0];
    if (!symbol) return;
    symbolSwitcher(symbol);
  }, [rowSelection, symbolSwitcher]);

  // Handle Keyboard Navigation to change selection
  const handleKeyDown: KeyboardEventHandler = (e) => {
    const rows = table.getRowModel().rows;
    const total = rows.length;
    if (total === 0) return;

    const selected = table.getSelectedRowModel().rows?.[0];
    const selectedIndex = selected?.index;
    // When the key is down or space,navigate to the next symbol
    if (e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      const nextIndex =
        selectedIndex === undefined || selectedIndex + 1 >= total
          ? 0
          : selectedIndex + 1;
      const nextRow = rows[nextIndex];
      if (!nextRow) return;
      nextRow.toggleSelected();
      console.log("Selec");
    }

    // When the key is down or space,navigate to the previous symbol
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex =
        selectedIndex === undefined || selectedIndex - 1 < 0
          ? total - 1
          : selectedIndex - 1;
      const nextRow = rows[nextIndex];
      if (!nextRow) return;
      nextRow.toggleSelected();
    }
  };

  // Scroll the selected row into view
  useEffect(() => {
    const scrollableContainer = document.querySelector(`#symbol-table-${id}`);
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0 && scrollableContainer) {
      const selectedRowId = selectedRows[0].id; // Handle first selected row
      const selectedRow = document.querySelector(
        `#symbol-table-${id} [data-ticker="${selectedRowId}"]`,
      );
      console.log("Selected row", selectedRow);
      if (selectedRow) {
        const rowRect = selectedRow.getBoundingClientRect();
        const containerRect = scrollableContainer.getBoundingClientRect();
        console.log("Selected row", rowRect, containerRect);

        // Check if the row is outside the viewport
        if (
          rowRect.top < containerRect.top ||
          rowRect.bottom > containerRect.bottom
        ) {
          console.log("Outside row");
          selectedRow.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }
  }, [rowSelection, table, id]);

  // Custom Table and Row Props
  const tableProps = useCallback(() => ({ id: `symbol-table-${id}` }), [id]);
  const rowProps = useCallback(
    (row: Row<Symbol>) => ({ "data-ticker": row.id }),
    [],
  );


  return {
    id,
    table,
    tableProps,
    rowProps,
    getCommonPinningStyles,
    handleKeyDown,
  };
}
