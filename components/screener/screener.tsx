"use client";

import React, { HTMLAttributes, useCallback, useMemo } from "react";
import { useScreener2, useScreens, useUpdateScreen } from "@/lib/state/symbol";
import {
  GetRowIdFunc,
  GetRowIdParams,
  GridState,
  StateUpdatedEvent,
} from "ag-grid-community";
import {
  defaultColumns,
  extendedColumnType,
} from "@/components/symbols/columns";
import { AgGridReact } from "ag-grid-react";
import { useGroupSymbolSwitcher } from "@/lib/state/grouper";
import "../grid/ag-theme.css";
import debounce from "debounce";
import { toast } from "sonner";
import { Json } from "@/types/generated/supabase";
import { useActiveScreener } from "@/hooks/use-active-screener";
import type { Symbol } from "@/types/symbol";

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

  // Debounced update function
  const updateScreen = useMemo(
    () => debounce(mutation.mutate, 1000),
    [mutation.mutate],
  );

  // Handle grid state changes
  return useCallback(
    (params: StateUpdatedEvent) => {
      // Started because the grid was created
      if (params.sources?.[0] === "gridInitializing") return;

      // Doesn't have active screener
      const id = activeScreenId;
      if (!id) return;

      const currentState = params.api.getState() as Json;
      updateScreen({ id, payload: { state: currentState } });
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
      sideBar: {
        visible: true,
        position: "right",
        openToolPanel: null,
        toolPanels: { columns: { expandedGroupIds: [] } },
      },
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

  const statusBar = useMemo(
    () => ({
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent" },
        { statusPanel: "agTotalRowCountComponent" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    }),
    [],
  );

  const getRowId = useCallback<GetRowIdFunc>(
    ({ data }: GetRowIdParams<Symbol>) => data.ticker!,
    [],
  );

  return (
    <div {...props} className={"h-full"}>
      <AgGridReact
        dataTypeDefinitions={extendedColumnType}
        key={activeScreenId ?? "default"}
        className="ag-terminal-theme"
        enableAdvancedFilter={true}
        rowSelection={{ mode: "multiRow" }}
        selectionColumnDef={{ pinned: "left" }}
        sideBar={true}
        includeHiddenColumnsInAdvancedFilter={true}
        rowData={rowData}
        enableCharts
        autoSizeStrategy={{
          type: "fitGridWidth",
          defaultMinWidth: 120,
          columnLimits: [
            {
              colId: "name",
              minWidth: 180,
            },
          ],
        }}
        columnDefs={colDefs}
        initialState={initialState}
        getRowId={getRowId}
        defaultColDef={{
          filter: true,
          sortable: true,
          resizable: true,
          enableRowGroup: true,
        }}
        rowGroupPanelShow={"onlyWhenGrouping"}
        onStateUpdated={handleStateChange}
        statusBar={statusBar}
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
