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
import { defaultSymbolColumns } from "@/components/symbols/column";
import { useScreener } from "@/lib/state/screener";
import { useVirtualizer } from "@tanstack/react-virtual";

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

function useSymbolColumns(visibleColumns: string[]) {
  const columns = defaultSymbolColumns;

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    const visibility = { name: true } as Record<string, boolean>;
    const defCol = new Set(visibleColumns ?? []);
    defaultSymbolColumns.forEach(
      ({ id }) => (visibility[id!] = defCol.has(id!)),
    );
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
    columns.map((c) => c.id!),
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

function fixMeasureElement() {
  //measure dynamic row height, except in firefox because it measures table border height incorrectly
  return typeof window !== "undefined" &&
    navigator.userAgent.indexOf("Firefox") === -1
    ? (element: Element) => element?.getBoundingClientRect().height
    : undefined;
}

//  Switch Group Symbol
// useEffect(() => {
//   const symbol = Object.keys(rowSelection).filter((s) => rowSelection[s])[0];
//   if (!symbol) return;
//   symbolSwitcher(symbol);
// }, [rowSelection, symbolSwitcher]);
//
// // Handle Keyboard Navigation to change selection
// const handleKeyDown: KeyboardEventHandler = (e) => {
//   const rows = table.getRowModel().rows;
//   const total = rows.length;
//   if (total === 0) return;
//
//   const selected = table.getSelectedRowModel().rows?.[0];
//   const selectedIndex = selected?.index;
//   // When the key is down or space,navigate to the next symbol
//   if (e.key === "ArrowDown" || e.key === " ") {
//     e.preventDefault();
//     const nextIndex =
//         selectedIndex === undefined || selectedIndex + 1 >= total
//             ? 0
//             : selectedIndex + 1;
//     const nextRow = rows[nextIndex];
//     if (!nextRow) return;
//     nextRow.toggleSelected();
//     console.log("Selec");
//   }
//
//   // When the key is down or space,navigate to the previous symbol
//   if (e.key === "ArrowUp") {
//     e.preventDefault();
//     const nextIndex =
//         selectedIndex === undefined || selectedIndex - 1 < 0
//             ? total - 1
//             : selectedIndex - 1;
//     const nextRow = rows[nextIndex];
//     if (!nextRow) return;
//     nextRow.toggleSelected();
//   }
// };
//
// // Scroll the selected row into view
// useEffect(() => {
//   const scrollableContainer = document.querySelector(`#symbol-table-${id}`);
//   const selectedRows = table.getSelectedRowModel().rows;
//   if (selectedRows.length > 0 && scrollableContainer) {
//     const selectedRowId = selectedRows[0].id; // Handle first selected row
//     const selectedRow = document.querySelector(
//         `#symbol-table-${id} [data-ticker="${selectedRowId}"]`,
//     );
//     console.log("Selected row", selectedRow);
//     if (selectedRow) {
//       const rowRect = selectedRow.getBoundingClientRect();
//       const containerRect = scrollableContainer.getBoundingClientRect();
//       console.log("Selected row", rowRect, containerRect);
//
//       // Check if the row is outside the viewport
//       if (
//           rowRect.top < containerRect.top ||
//           rowRect.bottom > containerRect.bottom
//       ) {
//         console.log("Outside row");
//         selectedRow.scrollIntoView({
//           behavior: "smooth",
//           block: "nearest",
//         });
//       }
//     }
//   }
// }, [rowSelection, table, id]);
//
// // Custom Table and Row Props
// const tableProps = useCallback(() => ({ id: `symbol-table-${id}` }), [id]);
// const rowProps = useCallback(
//     (row: Row<Symbol>) => ({ "data-ticker": row.id }),
//     [],
// );
