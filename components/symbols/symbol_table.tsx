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
import { useSymbolTable } from "@/components/symbols/use_screener_table";

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  data: Symbol[];
  columns?: string[];
}

export function SymbolTable(props: SymbolTableProps) {
  const { id, data, columns, className } = props;

  const { table, tableProps, rowProps, handleKeyDown } = useSymbolTable(
    id,
    data,
    columns,
  );

  return (
    <div
      {...props}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      {...tableProps()}
      className={cn("max-h-full overflow-auto select-none", className)}
    >
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    // style={{ ...getCommonPinningStyles(header.column) }}
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
                {...rowProps(row)}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => row.toggleSelected()}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    // style={{ ...getCommonPinningStyles(cell.column) }}
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
