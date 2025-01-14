import React, { HTMLAttributes, RefObject, useEffect, useMemo } from "react";
import { flexRender, Row, Table as TTable } from "@tanstack/react-table";
import { useSymbolTable } from "@/components/symbols/use_screener_table";
import { useScreener } from "@/lib/state/screener";
import type { Symbol } from "@/types/symbol";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  columns?: string[];
  sort?: { field: string; asc: boolean }[];
}

export function SymbolTable(props: SymbolTableProps) {
  const { id, columns, sort, className } = props;
  const { data, isFetching, fetchNextPage, isLoading } = useScreener({
    columns,
    sort,
  });
  const allData = useMemo(
    () => data?.pages?.flatMap((p) => p.data) ?? ([] as Symbol[]),
    [data],
  );

  const { table } = useSymbolTable(id, allData, columns);

  const totalDBRowCount = data?.pages?.[0]?.meta?.total ?? 0;
  const totalFetched = allData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const loadMore = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          void fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    loadMore(tableContainerRef.current);
  }, [loadMore]);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <SymbolTableUI
      containerRef={tableContainerRef}
      table={table}
      rows={rows}
      loadMore={loadMore}
      isLoading={isLoading}
      rowVirtualizer={rowVirtualizer}
    />
  );
}

function SymbolTableUI({
  rows,
  isLoading,
  table,
  containerRef,
  rowVirtualizer,
  loadMore,
}: {
  rows: Row<Symbol>[];
  isLoading: boolean;
  table: TTable<Symbol>;
  containerRef: RefObject<HTMLDivElement | null>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  loadMore: (el: HTMLDivElement | null) => void;
}) {
  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div
      className="overflow-auto relative h-full"
      onScroll={(e) => loadMore(e.currentTarget)}
      ref={containerRef}
    >
      {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
      <Table style={{ display: "grid" }}>
        <TableHeader
          style={{
            display: "grid",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              style={{ display: "flex", width: "100%" }}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      display: "flex",
                      width: header.getSize(),
                    }}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          style={{
            display: "grid",
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: "relative", //needed for absolute positioning of rows
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<Symbol>;
            return (
              <TableRow
                data-index={virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                key={row.id}
                style={{
                  display: "flex",
                  position: "absolute",
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  width: "100%",
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        display: "flex",
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
