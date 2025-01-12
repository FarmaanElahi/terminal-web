import { useScreenerAPI } from "@/lib/api";
import React, { HTMLAttributes } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Symbol } from "@/types/symbol";
import { cn } from "@/lib/utils";
import { useScreenerTable } from "@/components/screener/use_screener_table";

type ScreenerProps = HTMLAttributes<HTMLDivElement>;

interface ScreenerTableProps extends HTMLAttributes<HTMLDivElement> {
  data: Symbol[];
  columns?: string[];
}

export function Screener({ className, ...props }: ScreenerProps) {
  const { isLoading, error, data } = useScreenerAPI();
  if (isLoading) return "Loading...";
  if (error) return `Error: ${error}`;
  return (
    <ScreenerTable
      data={data ?? []}
      columns={["day_close"]}
      className={className}
      {...props}
    />
  );
}

function ScreenerTable({
  data,
  columns,
  className,
  ...props
}: ScreenerTableProps) {
  const { table, getCommonPinningStyles } = useScreenerTable(data, columns);
  return (
    <div className={cn("h-full overflow-auto", className)} {...props}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ ...getCommonPinningStyles(header.column) }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ ...getCommonPinningStyles(cell.column) }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
