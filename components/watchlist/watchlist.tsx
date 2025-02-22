"use client";

import React, { HTMLAttributes, useCallback, useMemo } from "react";
import {
  useUpdateWatchlist,
  useWatchlist,
  useWatchlistSymbols,
} from "@/lib/state/symbol";
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
import type { Symbol } from "@/types/symbol";
import { useActiveWatchlistId } from "@/hooks/use-active-watchlist";

type WatchlistProps = HTMLAttributes<HTMLDivElement>;

function useColumnDefs() {
  return useMemo(() => defaultColumns, []);
}

function useActiveWatchlist(activeWatchlistId?: string | null) {
  const { data: watchlist } = useWatchlist();
  return watchlist?.find((s) => s.id && s.id === activeWatchlistId);
}

function useWatchlistChangeCallback(activeWatchlist?: string | null) {
  const mutation = useUpdateWatchlist((watchlist) =>
    toast(`${watchlist.name} Watchlist updated`),
  );

  // Debounced update function
  const updateWatchlist = useMemo(
    () => debounce(mutation.mutate, 1000),
    [mutation.mutate],
  );

  // Handle grid state changes
  return useCallback(
    (params: StateUpdatedEvent) => {
      // Started because the grid was created
      if (params.sources?.[0] === "gridInitializing") return;

      // Doesn't have active screener
      const id = activeWatchlist;
      if (!id) return;

      const currentState = params.api.getState() as Json;
      updateWatchlist({ id, payload: { state: currentState } });
    },
    [activeWatchlist, updateWatchlist],
  );
}

function useGridInitialState(activeScreenId?: string | null) {
  const activeScreen = useActiveWatchlist(activeScreenId);
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

export function Watchlist(props: WatchlistProps) {
  const { activeWatchlistId } = useActiveWatchlistId();
  const watchlist = useActiveWatchlist(activeWatchlistId);
  const { data: rowData } = useWatchlistSymbols(watchlist);

  const switcher = useGroupSymbolSwitcher();
  const handleStateChange = useWatchlistChangeCallback(activeWatchlistId);
  const colDefs = useColumnDefs();
  const initialState = useGridInitialState(activeWatchlistId);

  const getRowId = useCallback<GetRowIdFunc>(
    ({ data }: GetRowIdParams<Symbol>) => data.ticker!,
    [],
  );

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

  return (
    <div {...props} className={"h-full"}>
      <AgGridReact
        dataTypeDefinitions={extendedColumnType}
        key={activeWatchlistId ?? "default"}
        className="ag-terminal-theme"
        rowSelection={{ mode: "multiRow" }}
        // selectionColumnDef={{ pinned: "left" }}
        sideBar={true}
        rowData={rowData}
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
          filter: false,
          sortable: true,
          resizable: true,
        }}
        statusBar={statusBar}
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
