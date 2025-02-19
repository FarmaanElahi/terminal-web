"use client";

import React, { HTMLAttributes, useCallback, useMemo } from "react";
import { useScreener2, useScreens, useUpdateScreen } from "@/lib/state/symbol";
import {
  ClientSideRowModelModule,
  ColDef,
  ColumnApiModule,
  CustomFilterModule,
  DateFilterModule,
  GridState,
  GridStateModule,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  StateUpdatedEvent,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { defaultSymbolColumns } from "@/components/symbols/symbol_column";
import { Symbol } from "@/types/symbol";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { AgGridReact } from "ag-grid-react";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";
import "../grid/ag-theme.css";
import debounce from "debounce";
import { toast } from "sonner";
import { Json } from "@/types/generated/supabase";
import {
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  GroupFilterModule,
  MultiFilterModule,
  SetFilterModule,
  SideBarModule,
} from "ag-grid-enterprise";

// Register all Community features
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  AdvancedFilterModule,
  SideBarModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  SetFilterModule,
  MultiFilterModule,
  GroupFilterModule,
  CustomFilterModule,
  ColumnsToolPanelModule,
  GridStateModule,
  ColumnApiModule,
  RowApiModule,
]);

interface ScreenerProps extends HTMLAttributes<HTMLDivElement> {
  activeScreenId?: string | null;
}

function useColumnDefs() {
  // Get initial column definitions with screen state
  return useMemo(() => {
    return defaultSymbolColumns.map((c) => {
      const field = (c as AccessorKeyColumnDef<Symbol>)
        .accessorKey as keyof Symbol;

      return {
        field,
        colId: field,
        lockPinned: field === "name",
        lockVisible: field === "name",
        lockPosition: field === "name",
        headerName: typeof c.header === "string" ? c.header : undefined,
      } satisfies ColDef<Symbol>;
    });
  }, []);
}

function useActiveScreen(activeScreenId?: string | null) {
  const { data: screens } = useScreens();
  return screens?.find((s) => s.id && s.id === activeScreenId);
}

function useScreenerChangeCallback(activeScreenId?: string | null) {
  const mutation = useUpdateScreen((screen) =>
    toast(`${screen.name} screen updated`),
  );

  // Debounced update function
  const updateScreen = useMemo(
    () => debounce(mutation.mutate, 1000),
    [mutation.mutate],
  );

  // Handle grid state changes
  return useCallback(
    (params: StateUpdatedEvent) => {
      const id = activeScreenId;
      if (!id) return;

      const state = params.api.getState() as Json;

      // const state = {
      //   columnVisibility,
      //   columnOrder,
      //   columnPinning,
      //   filter,
      //   sort,
      //   columnSizing,
      // } as Json;

      updateScreen({ id, payload: { state } });
    },
    [activeScreenId, updateScreen],
  );
}

function useGridInitialState(activeScreenId?: string | null) {
  const activeScreen = useActiveScreen(activeScreenId);
  const colDefs = useColumnDefs();

  const defaultState = useMemo(() => {
    const defaultVisible = new Set([
      "name",
      "mcap",
      "day_close",
      "sector",
      "industry",
      "dcr",
      "wcr",
      "relative_vol_10D",
      "RS_10D_pct",
      "RS_20D_pct",
      "RSNH_1M",
      "gap_pct_D",
    ]);

    const hiddenColIds = colDefs
      .filter((c) => !defaultVisible.has(c.colId))
      .map((c) => c.colId);

    return {
      columnVisibility: { hiddenColIds },
      columnPinning: { leftColIds: ["name"], rightColIds: [] },
    } satisfies GridState;
  }, [colDefs]);

  return (activeScreen?.state ?? defaultState) as GridState;
}

export function Screener({ activeScreenId }: ScreenerProps) {
  const colDefs = useColumnDefs();
  const switcher = useGroupSymbolSwitcher();
  const handleStateChange = useScreenerChangeCallback(activeScreenId);
  const { data: rowData } = useScreener2();
  const initialState = useGridInitialState(activeScreenId);

  return (
    <div className={"h-full"}>
      <AgGridReact
        key={activeScreenId ?? "default"}
        className="ag-terminal-theme"
        enableAdvancedFilter={true}
        includeHiddenColumnsInAdvancedFilter={true}
        rowData={rowData}
        columnDefs={colDefs}
        initialState={initialState}
        defaultColDef={{
          filter: true,
          sortable: true,
          resizable: true,
        }}
        sideBar={true}
        onStateUpdated={handleStateChange}
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
}
