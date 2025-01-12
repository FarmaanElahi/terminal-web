import {
  Column,
  ColumnDef,
  ColumnPinningState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import { CSSProperties, useMemo, useState } from "react";
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

export function useScreenerTable(data: Symbol[], columnKey?: string[]) {
  const columns = useScreenerColumn(columnKey);
  const { columnPinning, setColumnPinning } = useColumnPinning(columns);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnPinning },
    onColumnPinningChange: setColumnPinning,
  });

  return { table, getCommonPinningStyles };
}
