import { useScreener } from "@/lib/api";
import React, { HTMLAttributes } from "react";
import { columns } from "@/components/screener/column";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
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

type ScreenerProps = HTMLAttributes<HTMLDivElement>;

interface ScreenerTableProps extends HTMLAttributes<HTMLDivElement> {
  data: Symbol[];
}

export function Screener({ className, ...props }: ScreenerProps) {
  const { isLoading, error, data } = useScreener();
  if (isLoading) return "Loading...";
  if (error) return `Error: ${error}`;
  return <ScreenerTable data={data ?? []} className={className} {...props} />;
}

function ScreenerTable({ data, className, ...props }: ScreenerTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("h-full overflow-auto", className)} {...props}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
