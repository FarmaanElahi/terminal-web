import React, { HTMLAttributes, RefObject, useEffect } from "react";
import { flexRender, Row, Table as TTable } from "@tanstack/react-table";
import { useSymbolTable } from "@/components/symbols/use_screener_table";
import type { Symbol } from "@/types/symbol";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  columns?: string[];
  sort?: { field: string; asc: boolean }[];
}

export function SymbolTable(props: SymbolTableProps) {
  const { columns } = props;
  const { table, loadMore, isLoading, switchSymbol } = useSymbolTable(
    columns ?? [],
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
      switchSymbol={switchSymbol}
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
  switchSymbol,
}: {
  rows: Row<Symbol>[];
  isLoading: boolean;
  table: TTable<Symbol>;
  containerRef: RefObject<HTMLDivElement | null>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  loadMore: (el: HTMLDivElement | null) => void;
  switchSymbol: (symbol: string) => void;
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
      <Table className="grid">
        <TableHeader className="grid sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="flex"
                    style={{ width: header.getSize() }}
                  >
                    <div
                      className={cn({
                        "cursor-pointer select-none":
                          header.column.getCanSort(),
                      })}
                      onClick={header.column.getToggleSortingHandler}
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
          className="grid relative"
          //tells scrollbar how big the table is
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<Symbol>;
            return (
              <TableRow
                data-index={virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                key={row.id}
                className="flex absolute w-full"
                //this should always be a `style` as it changes on scroll
                style={{ transform: `translateY(${virtualRow.start}px)` }}
                onClick={() => switchSymbol(row.id)}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="flex"
                      style={{ width: cell.column.getSize() }}
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
