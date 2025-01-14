import React, {
  HTMLAttributes,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Column,
  flexRender,
  Row,
  Table as TTable,
} from "@tanstack/react-table";
import { useSymbolTable } from "@/components/symbols/use_symbol_table";
import type { Symbol } from "@/types/symbol";
import { Virtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Settings, X } from "lucide-react";

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  columns?: string[];
  sort?: { field: string; asc: boolean }[];
}

export function SymbolTable(props: SymbolTableProps) {
  const { columns } = props;
  //we need a reference to the scrolling element for logic down below
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { table, loadMore, rowVirtualizer, isLoading } = useSymbolTable(
    containerRef,
    columns,
  );
  const switchSymbol = useGroupSymbolSwitcher();

  useEffect(() => {
    loadMore(containerRef.current);
  }, [loadMore]);

  return (
    <SymbolTableUI
      containerRef={containerRef}
      table={table}
      loadMore={loadMore}
      switchSymbol={switchSymbol}
      rowVirtualizer={rowVirtualizer}
    />
  );
}

function SymbolTableUI({
  table,
  containerRef,
  loadMore,
  switchSymbol,
  rowVirtualizer,
}: {
  table: TTable<Symbol>;
  containerRef: RefObject<HTMLDivElement | null>;
  loadMore: (el: HTMLDivElement | null) => void;
  switchSymbol: (symbol: string) => void;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
}) {
  const { rows } = table.getRowModel();

  return (
    <div className="relative h-full">
      <SymbolColumnSheet table={table} />
      <div
        className="overflow-auto relative h-full border"
        onScroll={(e) => loadMore(e.currentTarget)}
        ref={containerRef}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <Table className="grid">
          <TableHeader className="grid sticky top-0 z-10 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => {
                  const sortingOrder = header.column.getIsSorted()
                    ? table
                        .getState()
                        .sorting.findIndex((s) => s.id === header.column.id)
                    : -1;

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
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                        {sortingOrder >= 0 ? sortingOrder + 1 : undefined}
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
    </div>
  );
}

function SymbolColumnSheet({ table }: { table: TTable<Symbol> }) {
  const [open, setOpen] = useState(false);

  const groupsColumn = useMemo(() => {
    const columns = table.getAllColumns();
    return columns.reduce(
      (acc, column) => {
        // eslint-disable-next-line
        // @ts-ignore
        const category = column.columnDef?.meta?.category ?? "Unknown";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(column);
        return acc;
      },
      {} as Record<string, Column<Symbol>[]>,
    );
  }, [table]);

  const colsUI = (
    <div className="h-full overflow-auto space-y-2">
      {Object.keys(groupsColumn).map((c) => {
        const g = (
          <div className="flex flex-col gap-2">
            {groupsColumn[c].map((c) => (
              <div key={c.id} className="flex gap-2">
                <Checkbox
                  checked={c.getIsVisible()}
                  disabled={!c.getCanHide()}
                  onCheckedChange={(checked) =>
                    typeof checked === "boolean"
                      ? c.toggleVisibility(checked)
                      : undefined
                  }
                />
                <label
                  htmlFor={c.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {c.columnDef.header as string}
                </label>
              </div>
            ))}
          </div>
        );
        return (
          <Collapsible key={c} className="border space-y-2 rounded">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full inline-flex justify-between rounded"
              >
                {c}
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className={"h-96 overflow-auto px-4 py-2"}>
              {g}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );

  return (
    <div className="absolute end-0 z-40">
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetTrigger asChild>
          <Button
            className="hover:bg-white/40 bg-white/40 rounded-none"
            variant="ghost"
          >
            <Settings className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className={"w-1/4 h-full border flex flex-col"}>
          <SheetHeader>
            <SheetTitle>Columns</SheetTitle>
            <SheetClose />
          </SheetHeader>
          {colsUI}
        </SheetContent>
      </Sheet>
    </div>
  );
}
