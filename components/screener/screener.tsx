"use client";

import React, { HTMLAttributes, useCallback, useMemo } from "react";
import {
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
  GridReadyEvent,
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
import { buildDataSource } from "@/components/grid/datasource";

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
      "price_change_today_pct",
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
  const { isLoading } = useScreens();
  const initialState = useGridInitialState(activeScreenId);

  const statusBar = useMemo(
    () => ({
      statusPanels: [
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agTotalRowCountComponent" },
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

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.setGridOption("serverSideDatasource", buildDataSource());
  }, []);

  return (
    <div {...props} className={cn("h-full relative", props.className)}>
      {!isLoading && (
        <AgGridReact
          onGridReady={onGridReady}
          rowModelType={"serverSide"}
          onColumnVisible={(event) =>
            event.api.refreshServerSide({ purge: true })
          }
          dataTypeDefinitions={extendedColumnType}
          key={activeScreenId ?? "default"}
          getContextMenuItems={getContextMenuItems}
          className="ag-terminal-theme"
          enableAdvancedFilter={true}
          headerHeight={36}
          rowHeight={32}
          sideBar={false}
          maintainColumnOrder={true}
          includeHiddenColumnsInAdvancedFilter={true}
          autoSizeStrategy={{
            type: "fitCellContents",
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
            const { ticker } = symbol;
            if (!ticker) return;
            switcher(ticker);
          }}
        />
      )}
    </div>
  );
}
