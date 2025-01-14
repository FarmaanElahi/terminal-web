import React, { HTMLAttributes, RefObject, useEffect } from "react";
import { flexRender, Row, Table as TTable } from "@tanstack/react-table";
import { useSymbolTable } from "@/components/symbols/use_symbol_table";
import type { Symbol } from "@/types/symbol";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  columns?: string[];
  sort?: { field: string; asc: boolean }[];
}

export function SymbolTable(props: SymbolTableProps) {
  const { columns } = props;
  const { table, loadMore } = useSymbolTable(columns ?? []);
  const switchSymbol = useGroupSymbolSwitcher();

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    loadMore(tableContainerRef.current);
  }, [loadMore]);

  return (
    <SymbolTableUI
      containerRef={tableContainerRef}
      table={table}
      loadMore={loadMore}
      switchSymbol={switchSymbol}
    />
  );
}

function fixMeasureElement() {
  //measure dynamic row height, except in firefox because it measures table border height incorrectly
  return typeof window !== "undefined" &&
    navigator.userAgent.indexOf("Firefox") === -1
    ? (element: Element) => element?.getBoundingClientRect().height
    : undefined;
}

function SymbolTableUI({
  table,
  containerRef,
  loadMore,
  switchSymbol,
}: {
  table: TTable<Symbol>;
  containerRef: RefObject<HTMLDivElement | null>;
  loadMore: (el: HTMLDivElement | null) => void;
  switchSymbol: (symbol: string) => void;
}) {
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    //estimate row height for accurate scrollbar dragging
    estimateSize: () => 40,
    getScrollElement: () => containerRef.current,
    measureElement: fixMeasureElement(),
    overscan: 5,
  });

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
