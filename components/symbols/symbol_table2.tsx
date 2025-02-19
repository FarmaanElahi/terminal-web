"use client";
import {
  AllCommunityModule,
  ColDef,
  ColumnVisibleEvent,
  FilterChangedEvent,
  FilterState,
  ModuleRegistry,
  SortChangedEvent,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { defaultSymbolColumns } from "@/components/symbols/symbol_column";
import { Symbol } from "@/types/symbol";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { useScreener2, useScreens, useUpdateScreen } from "@/lib/state/symbol";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";
import "../grid/ag-theme.css";
import debounce from "debounce";
import { toast } from "sonner";
import { Json } from "@/types/generated/supabase";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

interface SymbolTable2Props {
  columns: string[];
  sort?: { field: string; asc: boolean }[];
  className?: string;
  activeScreenId?: string | null;
}

export const SymbolTable2 = forwardRef<AgGridReact, SymbolTable2Props>(
  ({ columns, className, activeScreenId }, ref) => {
    const gridRef = useRef<AgGridReact>(null);
    const { data: screens } = useScreens();
    const activeScreen = screens?.find((s) => s.id === activeScreenId);

    // Get initial column definitions with screen state
    const colDefs = useMemo(() => {
      const screenColumns = activeScreen?.columns ?? columns;
      const colSet = new Set(screenColumns);
      return defaultSymbolColumns.map((c) => {
        const field = (c as AccessorKeyColumnDef<Symbol>)
          .accessorKey as keyof Symbol;
        const pinned = field === "name" ? "left" : undefined;
        return {
          field,
          colId: field,
          headerName: typeof c.header === "string" ? c.header : undefined,
          hide: !colSet.has(field),
          lockPinned: field === "name",
          pinned,
        } satisfies ColDef<Symbol>;
      });
    }, [columns, activeScreen?.columns]);

    // Get initial filter model from screen
    const initialFilterModel = useMemo(() => {
      return activeScreen?.filters ?? undefined;
    }, [activeScreen?.filters]);

    const switcher = useGroupSymbolSwitcher();
    const { data: rowData } = useScreener2();
    const mutation = useUpdateScreen((screen) =>
      toast(`${screen.name} screen updated`),
    );

    // Debounced update function
    const updateScreen = useMemo(
      () => debounce(mutation.mutate, 1000),
      [mutation.mutate],
    );

    // Handle grid state changes
    const handleStateChange = useCallback(
      (params: FilterChangedEvent | SortChangedEvent | ColumnVisibleEvent) => {
        console.log("Handle state", params);
        const id = activeScreenId;
        if (!id) return;

        // Filter
        const filters = params.api.getAdvancedFilterModel() as Json | null;
        // Visible columns
        const columns = params.api
          .getColumnState()
          .filter((col) => !col.hide)
          .map((col) => col.colId);

        updateScreen({ id, payload: { columns, filters } });
      },
      [activeScreenId, updateScreen],
    );

    return (
      <div className={className}>
        <AgGridReact
          key={activeScreenId ?? "default"}
          ref={(element) => {
            if (typeof ref === "function") {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
            gridRef.current = element;
          }}
          className="ag-terminal-theme"
          enableAdvancedFilter={true}
          includeHiddenColumnsInAdvancedFilter={true}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            filter: true,
            sortable: true,
            resizable: true,
          }}
          sideBar={true}
          initialState={{
            filter: initialFilterModel as FilterState,
          }}
          onFilterChanged={handleStateChange}
          onSortChanged={handleStateChange}
          onColumnVisible={handleStateChange}
          onCellFocused={(event) => {
            const { rowIndex } = event;
            if (rowIndex === undefined || rowIndex === null) return;
            const symbol = event.api.getDisplayedRowAtIndex(rowIndex)?.data;
            if (!symbol) return;
            const { exchange, name } = symbol;
            if (!exchange || !name) return;
            switcher([exchange, name].join(":"));
          }}
        />
      </div>
    );
  },
);
SymbolTable2.displayName = "SymbolTable";
