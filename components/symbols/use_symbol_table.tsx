"use client";
import {
  Column,
  ColumnDef,
  ColumnPinningState,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { Symbol } from "@/types/symbol";
import {
  CSSProperties,
  RefObject,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useScreener } from "@/lib/state/screener";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useColumns } from "@/components/symbols/symbol_column";

const getCommonPinningStyles = (column: Column<Symbol>): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");

  return {
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

function useSymbolColumns(visibleColumns: string[]) {
  const columns = useColumns();

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const visibility = { name: true } as Record<string, boolean>;
    const defCol = new Set(visibleColumns ?? []);
    columns.forEach(({ id }) => (visibility[id!] = defCol.has(id!)));
    return visibility;
  });

  // API
  const queryColumn = useMemo(() => {
    const columnByKey = columns.reduce(
      (acc, column) => {
        return { ...acc, [column.id!]: column };
      },
      {} as Record<string, ColumnDef<Symbol>>,
    );
    return (
      Object.keys(columnVisibility)
        .filter((c) => columnVisibility[c])
        // eslint-disable-next-line
        // @ts-ignore
        .flatMap((c) => [c, ...(columnByKey[c]?.meta?.cols ?? [])] as string[])
    );
  }, [columns, columnVisibility]);

  const [columnOrder, setColumnOrder] = useState<string[]>(
    Object.entries(columnVisibility)
      .filter(([, v]) => v)
      .map(([k]) => k),
  );

  return {
    columns,
    queryColumn,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
  };
}

export function useSymbolTable(
  containerRef: RefObject<HTMLDivElement | null>,
  defaultColumns: string[],
) {
  // Defaults
  const {
    columns,
    queryColumn,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
  } = useSymbolColumns(defaultColumns);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const { columnPinning, setColumnPinning } = useColumnPinning(columns);

  const result = useScreener({
    columns: queryColumn,
    sort: sorting.map((s) => ({ field: s.id, asc: !s.desc })),
  });

  // Data
  const data = useMemo(
    () => result.data?.pages?.flatMap((p) => p.data) ?? ([] as Symbol[]),
    [result.data],
  );

  // Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnOrder,
      rowSelection,
      columnVisibility,
      sorting,
      columnPinning,
    },
    state: {
      columnPinning,
      rowSelection,
      columnVisibility,
      sorting,
      columnOrder,
    },
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    enableMultiRowSelection: false,
    manualSorting: true,
    getRowId: (row) => [row.exchange, row.name].join(":"),
  });

  // Infinite Loading
  const totalCount = result?.data?.pages?.[0]?.meta?.total ?? 0;
  const totalLoaded = data.length;
  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const { isFetching, fetchNextPage, isLoading } = result;
  const loadMore = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalLoaded < totalCount
        ) {
          void fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalLoaded, totalCount],
  );

  // Set Up Virtualizer
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    //estimate row height for accurate scrollbar dragging
    estimateSize: () => 40,
    getScrollElement: () => containerRef.current,
    overscan: 5,
  });

  //Scroll to top of table when sorting changes
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    if (!!table.getRowModel().rows.length) {
      rowVirtualizer.scrollToIndex?.(0);
    }
  };
  //since this table option is derived from table row model state, we're using the table.setOptions utility
  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  return { table, loadMore, isLoading, rowVirtualizer };
}
