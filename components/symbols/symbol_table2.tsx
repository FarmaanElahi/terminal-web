import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { defaultSymbolColumns } from "@/components/symbols/symbol_column";
import { Symbol } from "@/types/symbol";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import React, { HTMLAttributes, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { useScreener2 } from "@/lib/state/symbol";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

interface SymbolTableProps extends HTMLAttributes<HTMLDivElement> {
  columns: string[];
  sort: Array<{ field: string; asc: boolean }>;
}

import { themeQuartz } from "ag-grid-community";

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz.withParams({
  backgroundColor: "#1f2836",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor",
  },
  foregroundColor: "#FFF",
  headerFontSize: 14,
  headerFontWeight: 700,
  fontFamily: { googleFont: "Quicksand" },
  wrapperBorderRadius: 0,
});

export function SymbolTable2({ columns }: SymbolTableProps) {
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
    <div className="h-full relative">
      <AgGridReact
        theme={myTheme}
        enableAdvancedFilter={true}
        includeHiddenColumnsInAdvancedFilter={true}
        rowData={rowData}
        columnDefs={colDefs}
        onCellFocused={(event) => {
          const { rowIndex } = event;
          if (rowIndex === undefined || rowIndex === null) return;
          const symbol = event.api.getDisplayedRowAtIndex(rowIndex)?.data;
          if (!symbol) return;
          const { exchange, name } = symbol;
          if (!exchange || !name) return;
          switcher([exchange, name].join(":"));
        }}
        defaultColDef={{ filter: true, initialHide: false }}
      />
    </div>
  );
}
