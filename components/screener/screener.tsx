"use client";

import React, { HTMLAttributes, useCallback, useMemo } from "react";
import { useScreener2, useScreens, useUpdateScreen } from "@/lib/state/symbol";
import {
  CellStyleModule,
  ClientSideRowModelModule,
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
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
import {
  defaultColumns,
  extendedColumnType,
} from "@/components/symbols/symbol_column";
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
import { useActiveScreener } from "@/hooks/use-active-screener";

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
  TooltipModule,
  CellStyleModule,
]);

type ScreenerProps = HTMLAttributes<HTMLDivElement>;

function useColumnDefs() {
  return useMemo(() => defaultColumns, []);
}

function useActiveScreen(activeScreenId?: string | null) {
  const { data: screens } = useScreens();
  return screens?.find((s) => s.id && s.id === activeScreenId);
}

function useScreenerChangeCallback(activeScreenId?: string | null) {
  const mutation = useUpdateScreen((screen) =>
    toast(`${screen.name} screen updated`),
  );

  const initialStateRef = React.useRef<Json | null>(null);

  // Reset initial state when screen changes
  React.useEffect(() => {
    initialStateRef.current = null;
  }, [activeScreenId]);

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

      const currentState = params.api.getState() as Json;

      // Initialize the reference state if not set
      if (!initialStateRef.current) {
        initialStateRef.current = currentState;
        return;
      }

      // Only update if the state has actually changed from initial
      if (
        JSON.stringify(initialStateRef.current) !== JSON.stringify(currentState)
      ) {
        updateScreen({ id, payload: { state: currentState } });
      }
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
      .filter((c) => c.colId && !defaultVisible.has(c.colId))
      .map((c) => c.colId!)
      .filter(Boolean);

    return {
      columnVisibility: { hiddenColIds },
      columnPinning: { leftColIds: ["name"], rightColIds: [] },
    } satisfies GridState;
  }, [colDefs]);

  return (activeScreen?.state ?? defaultState) as GridState;
}

export function Screener(props: ScreenerProps) {
  const { activeScreenId } = useActiveScreener();
  const colDefs = useColumnDefs();
  const switcher = useGroupSymbolSwitcher();
  const handleStateChange = useScreenerChangeCallback(activeScreenId);
  const { data: rowData } = useScreener2();
  const initialState = useGridInitialState(activeScreenId);

  return (
    <div {...props} className={"h-full"}>
      <AgGridReact
        dataTypeDefinitions={extendedColumnType}
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
