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
import { screenerColumns } from "@/components/screener/column";
import { FormattedCell } from "@/components/screener/formatted_cell";

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

function useColumnPinning(columns: ColumnDef<Symbol, unknown>[]) {
  const leftCols = useMemo(
    () =>
      columns
        .filter((c) => (c.meta as Record<string, boolean>).pinLeft)
        // eslint-disable-next-line
        // @ts-ignore
        .map((c) => (c.accessorKey ?? c.id) as string),
    [columns],
  );

  const rightCols = useMemo(
    () =>
      columns
        .filter((c) => (c.meta as Record<string, boolean>).pinRight)
        // eslint-disable-next-line
        // @ts-ignore
        .map((c) => (c.accessorKey ?? c.id) as string),
    [columns],
  );
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: leftCols,
    right: rightCols,
  });

  return { columnPinning, setColumnPinning, getCommonPinningStyles };
}

export function useDefaultColumn() {
  return screenerColumns;
}

function useScreenerColumn(columnKeys?: string[]) {
  const columns = useDefaultColumn();

  return useMemo(() => {
    const f = ["name", ...(columnKeys ?? [])];
    // eslint-disable-next-line
    // @ts-ignore
    const filtered = columns.filter((c) => f?.includes(c.accessorKey));

    return filtered.map((col) => {
      return {
        ...col,
        cell: (props) => <FormattedCell cell={props} />,
      } as ColumnDef<Symbol>;
    });
  }, [columns, columnKeys]);
}

export function useScreenerTable(
  id: string,
  data: Symbol[],
  columnKey?: string[],
) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const columns = useScreenerColumn(columnKey);
  const { columnPinning, setColumnPinning } = useColumnPinning(columns);
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

  // Keyboard navigation
  const handleKeyDown: KeyboardEventHandler = (e) => {
    const rows = table.getRowModel().rows;
    const total = rows.length;
    if (total === 0) return;

    const selected = table.getSelectedRowModel().rows?.[0];
    const selectedIndex = selected?.index;
    // When the key is down or space,navigate to the next symbol
    if (e.key === "ArrowDown" || e.key === " ") {
      console.log("Space", selectedIndex);
      e.preventDefault();
      const nextIndex =
        selectedIndex === undefined || selectedIndex + 1 >= total
          ? 0
          : selectedIndex + 1;
      const nextRow = rows[nextIndex];
      if (!nextRow) return;
      nextRow.toggleSelected();
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
    const scrollableContainer = document.querySelector(`#screener-${id}`);
    console.log("EE", scrollableContainer);
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length > 0 && scrollableContainer) {
      const selectedRowId = selectedRows[0].id; // Handle first selected row
      const selectedRow = document.querySelector(
        `#screener-${id} tr[data-ticker="${selectedRowId}"]`,
      );
      if (selectedRow) {
        const rowRect = selectedRow.getBoundingClientRect();
        const containerRect = scrollableContainer.getBoundingClientRect();

        // Check if the row is outside the viewport
        if (
          rowRect.top < containerRect.top ||
          rowRect.bottom > containerRect.bottom
        ) {
          console.log("Out", selectedRow);
          selectedRow.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }
  }, [rowSelection, table, id]);

  const tableProps = useCallback(() => ({ id: `screener-${id}` }), [id]);
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
