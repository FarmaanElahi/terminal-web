"use client";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { defaultSymbolColumns } from "@/components/symbols/symbol_column";
import { Symbol } from "@/types/symbol";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import React, { forwardRef, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { useScreener2 } from "@/lib/state/symbol";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";
import "../grid/ag-theme.css";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

interface SymbolTable2Props {
  columns: string[];
  sort?: { field: string; asc: boolean }[];
  onStateUpdated?: () => void;
  className?: string;
}

export const SymbolTable2 = forwardRef<AgGridReact, SymbolTable2Props>(
  function SymbolTable2({ columns, onStateUpdated, className }, ref) {
    const colDefs = useMemo(() => {
      const colSet = new Set(columns);
      return defaultSymbolColumns.map((c) => {
        const field = (c as AccessorKeyColumnDef<Symbol>)
          .accessorKey as keyof Symbol;
        const pinned = field === "name" ? "left" : undefined;
        return {
          field,
          colId: field,
          headerName: typeof c.header === "string" ? c.header : undefined,
          initialHide: !colSet.has(field),
          lockPinned: field === "name",
          pinned,
        } satisfies ColDef<Symbol>;
      });
    }, [columns]);

    const switcher = useGroupSymbolSwitcher();
    const { data: rowData } = useScreener2();
    return (
      <div className={className}>
        <AgGridReact
          ref={ref}
          className="ag-terminal-theme"
          enableAdvancedFilter={true}
          includeHiddenColumnsInAdvancedFilter={true}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            filter: true,
            initialHide: false,
            sortable: true,
            resizable: true,
          }}
          sideBar={true}
          onStateUpdated={onStateUpdated}
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
