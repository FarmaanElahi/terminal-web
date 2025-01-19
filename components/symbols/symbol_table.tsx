import React, {
  HTMLAttributes,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Column, flexRender, Table as TTable } from "@tanstack/react-table";
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
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Paintbrush,
  Settings,
} from "lucide-react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DragEndEvent } from "@dnd-kit/core/dist/types";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  columns: string[];
  sort?: { field: string; asc: boolean }[];
}

export function SymbolTable(props: SymbolTableProps) {
  const { columns } = props;
  //we need a reference to the scrolling element for logic down below
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { table, loadMore, rowVirtualizer } = useSymbolTable(
    containerRef,
    columns,
  );
  const switchSymbol = useGroupSymbolSwitcher();

  useEffect(() => {
    loadMore(containerRef.current);
  }, [loadMore]);

  return (
    <div className="h-full relative">
      <SymbolTableControl table={table} />
      <SymbolTableUI
        containerRef={containerRef}
        table={table}
        loadMore={loadMore}
        switchSymbol={switchSymbol}
        rowVirtualizer={rowVirtualizer}
      />
    </div>
  );
}

interface SymbolTableUIProps extends HTMLAttributes<HTMLDivElement> {
  table: TTable<Symbol>;
  containerRef: RefObject<HTMLDivElement | null>;
  loadMore: (el: HTMLDivElement | null) => void;
  switchSymbol: (symbol: string) => void;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
}

function SymbolTableUI({
  table,
  containerRef,
  loadMore,
  switchSymbol,
  rowVirtualizer,
}: SymbolTableUIProps) {
  const { rows } = table.getRowModel();
  const onKeyDown: KeyboardEventHandler = (event) => {
    if (event.currentTarget !== document.activeElement?.parentElement) return;

    if (event.key === "ArrowDown" || event.key === " ") {
      event.preventDefault();
      const indexStr = document.activeElement.getAttribute("data-index");
      const index = indexStr ? +indexStr + 1 : 0;
      const nextIndexStr = "" + index;
      rowVirtualizer.scrollToIndex(index, { align: "end", behavior: "smooth" });
      console.log("Key down pressed");
      const el = Array.from(event.currentTarget?.children).find(
        (el) => el.getAttribute("data-index") === nextIndexStr,
      ) as HTMLElement | undefined;
      el?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const indexStr = document.activeElement.getAttribute("data-index");
      const index = indexStr ? +indexStr - 1 : 0;
      const nextIndexStr = "" + index;
      rowVirtualizer.scrollToIndex(index, {
        align: "start",
        behavior: "smooth",
      });
      const el = Array.from(event.currentTarget?.children).find(
        (el) => el.getAttribute("data-index") === nextIndexStr,
      ) as HTMLElement | undefined;
      el?.focus();
    }
  };

  return (
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
                const canSort = header.column.getCanSort();
                const sortingOrder = header.column.getIsSorted()
                  ? table
                      .getState()
                      .sorting.findIndex((s) => s.id === header.column.id) + 1
                  : -1;
                const sorting = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    className={cn("flex justify-start items-center", {
                      "cursor-pointer select-none": canSort,
                    })}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <div className="flex-1" />
                    {sorting === "asc" && <ArrowUp className="size-4" />}
                    {sorting === "desc" && <ArrowDown className="size-4" />}
                    <span>{sortingOrder >= 0 ? sortingOrder : undefined}</span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className="grid relative cursor-default"
          //tells scrollbar how big the table is
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          onKeyDown={onKeyDown}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableRow
                data-index={virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                key={row.id}
                className="flex absolute w-full h-10 px-2 focus:bg-muted focus:outline-none"
                //this should always be a `style` as it changes on scroll
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${virtualRow.size}px`,
                  top: 0,
                  left: 0,
                }}
                onFocusCapture={() => switchSymbol(row.id)}
                tabIndex={0}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="flex justify-start align-middle items-center"
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

function SymbolTableControl({ table }: { table: TTable<Symbol> }) {
  return (
    <div className="absolute end-0 z-40 bg-muted flex border-t">
      {table.getState().sorting?.length > 0 ? (
        <Button
          className="rounded-none h-10 text-red-500 hover:text-red-500 bg-transparent hover:bg-transparent"
          variant="ghost"
          onClick={() => table.setSorting([])}
        >
          <Paintbrush className="size-4" />
        </Button>
      ) : undefined}
      <SymbolColumnSheet table={table} />
    </div>
  );
}

function SymbolColumnSheet({ table }: { table: TTable<Symbol> }) {
  const [open, setOpen] = useState(false);

  const columnByCategory = useMemo(() => {
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
      {Object.keys(columnByCategory).map((category) => {
        const groupColumns = columnByCategory[category];
        const groupColumnCount = groupColumns.length;
        const visibleGroupColumns = groupColumns.filter((c) =>
          c.getIsVisible(),
        );
        const visibleGroupColumnsCount = visibleGroupColumns.length;

        const g = (
          <div className="flex flex-col gap-2">
            {groupColumns.map((column) => (
              <div key={column.id} className="flex gap-2">
                <Checkbox
                  checked={column.getIsVisible()}
                  disabled={!column.getCanHide()}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                      column.toggleVisibility(checked);
                      console.log(
                        "New Column order",
                        table.getVisibleFlatColumns(),
                      );
                    }
                  }}
                />
                <label
                  htmlFor={column.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.columnDef.header as string}
                </label>
              </div>
            ))}
          </div>
        );

        return (
          <Collapsible key={category} className="border space-y-2 rounded">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full inline-flex justify-between rounded"
              >
                {category}
                <span className="flex-1"></span>
                {`${visibleGroupColumnsCount}/${groupColumnCount}`}
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
    <div>
      <Sheet open={open} onOpenChange={setOpen} modal={false}>
        <SheetTrigger asChild>
          <Button
            className="rounded-none h-10  bg-transparent hover:bg-transparent"
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
          <div className="flex">
            {colsUI}
            <SymbolColumnOrder table={table} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SymbolColumnOrder({ table }: { table: TTable<Symbol> }) {
  const columnOrder = table.getState().columnOrder;
  const columns = columnOrder
    .map((c) => table.getColumn(c)!)
    .filter((c) => c.getIsVisible());

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      table.setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="w-48 flex flex-col">
      <DndContext
        onDragOver={handleDragOver}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={columns} strategy={verticalListSortingStrategy}>
          {columns.map((c) => (
            <ColumnDraggable key={c.id} column={c} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function ColumnDraggable({ column }: { column: Column<Symbol> }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id, disabled: !!column.getIsPinned() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {column.columnDef.header as string}
    </div>
  );
}
