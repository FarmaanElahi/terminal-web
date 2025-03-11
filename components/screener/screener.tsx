"use client";

import React, { HTMLAttributes, useCallback, useMemo } from "react";
import {
  useScreener,
  useScreens,
  useUpdateScreen,
  useUpdateWatchlist,
  useWatchlist,
} from "@/lib/state/symbol";
import {
  AgColumn,
  GetContextMenuItems,
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
import { useActiveScreenerId } from "@/hooks/use-active-screener";
import type { Symbol } from "@/types/symbol";
import { cn } from "@/lib/utils";

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
      "industry",
      "dcr",
      "wcr",
      "relative_vol_10D",
      "relative_vol_20D",
    ]);

    const hiddenColIds = colDefs
      .filter((c) => c.colId && !defaultVisible.has(c.colId))
      .map((c) => c.colId!)
      .filter(Boolean);

    return { columnVisibility: { hiddenColIds } } satisfies GridState;
  }, [colDefs]);

  return (activeScreen?.state ?? defaultState) as GridState;
}

export function Screener(props: ScreenerProps) {
  const { activeScreenId } = useActiveScreenerId();
  const colDefs = useColumnDefs();
  const switcher = useGroupSymbolSwitcher();
  const handleStateChange = useScreenerChangeCallback(activeScreenId);
  const { data: rowData } = useScreener();
  const { isLoading } = useScreens();
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

  const { data: watchlists } = useWatchlist();
  const { mutate: updateWatchlist } = useUpdateWatchlist((w) => {
    toast(`${w.name} updated`);
  });

  const getContextMenuItems = useCallback<GetContextMenuItems<Symbol>>(
    (params) => {
      const symbol = params.node?.data;
      if (!symbol?.ticker) return [];

      return [
        // Watchlist menu
        {
          name: `Add ${params.node?.data?.name} to Watchlist`,
          subMenu: watchlists?.map((w) => {
            const checked = w.symbols?.includes(symbol.ticker!);
            const updatedSymbols = checked
              ? w.symbols.filter((s) => s !== symbol.ticker)
              : [...(w.symbols ?? []), symbol.ticker!];
            return {
              name: w.name,
              subMenuRole: "menu",
              checked,
              action: () =>
                updateWatchlist({
                  id: w.id,
                  payload: { symbols: updatedSymbols },
                }),
            };
          }),
          suppressCloseOnSelect: true,
        },
        "separator",
        "copy",
      ];
    },
    [watchlists, updateWatchlist],
  );

  return (
    <div {...props} className={cn("h-full relative", props.className)}>
      {!isLoading && (
        <AgGridReact
          headerHeight={48}
          dataTypeDefinitions={extendedColumnType}
          key={activeScreenId ?? "default"}
          getContextMenuItems={getContextMenuItems}
          className="ag-terminal-theme"
          enableAdvancedFilter={true}
          rowSelection={{ mode: "multiRow" }}
          selectionColumnDef={{ pinned: "left", maxWidth: 48 }}
          sideBar={false}
          maintainColumnOrder={true}
          includeHiddenColumnsInAdvancedFilter={true}
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
            wrapHeaderText: true,
            filter: true,
            sortable: true,
            resizable: true,
            enableRowGroup: true,
          }}
          rowGroupPanelShow={"onlyWhenGrouping"}
          onStateUpdated={handleStateChange}
          statusBar={statusBar}
          onCellFocused={(event) => {
            // If the cell was focus because of selection change, we will ignore
            // switching the symbol
            if (
              (event.column as AgColumn)?.colId === "ag-Grid-SelectionColumn"
            ) {
              return;
            }

            const { rowIndex } = event;
            if (rowIndex === undefined || rowIndex === null) return;
            const symbol = event.api.getDisplayedRowAtIndex(rowIndex)?.data;
            if (!symbol) return;
            const { exchange, name } = symbol;
            if (!exchange || !name) return;
            switcher([exchange, name].join(":"));
          }}
        />
      )}
    </div>
  );
}
