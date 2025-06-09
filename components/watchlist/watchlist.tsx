"use client";

import React, {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUpdateWatchlist, useWatchlist } from "@/lib/state/symbol";
import {
  AgColumn,
  GetContextMenuItems,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
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
import type { Symbol } from "@/types/symbol";
import { useActiveWatchlistId } from "@/hooks/use-active-watchlist";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchlistCreatorDialog } from "./watchlist-selector";
import { WatchlistSymbol } from "@/components/watchlist/watchlist-symbol";
import { cn } from "@/lib/utils";
import { RealtimeDatasource } from "@/components/grid/datasource";
import { RowCountStatusBarComponent } from "@/components/grid/row-count";
import { useRealtimeClient } from "@/hooks/use-realtime";

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
      "day_close",
      "price_change_today_pct",
    ]);

    const hiddenColIds = colDefs
      .filter((c) => c.colId && !defaultVisible.has(c.colId))
      .map((c) => c.colId!)
      .filter(Boolean);

    return {
      columnVisibility: { hiddenColIds },
    } satisfies GridState;
  }, [colDefs]);

  return (activeScreen?.state ?? defaultState) as GridState;
}

export function Watchlist(props: WatchlistProps) {
  const { activeWatchlistId } = useActiveWatchlistId();
  const watchlist = useActiveWatchlist(activeWatchlistId);

  const [openWatchlistSymbol, setOpenWatchlistSymbol] = useState(false);
  const [openWatchlistCreator, setOpenWatchlistCreator] = useState(false);

  const { data: allWatchlist } = useWatchlist();
  return (
    <div {...props} className={cn("h-full", props.className)}>
      {watchlist && (
        <WatchlistSymbol
          open={openWatchlistSymbol}
          setOpen={setOpenWatchlistSymbol}
          watchlist={watchlist}
        />
      )}
      <WatchlistCreatorDialog
        open={openWatchlistCreator}
        setOpen={setOpenWatchlistCreator}
      />
      {!activeWatchlistId || !allWatchlist || allWatchlist.length === 0 ? (
        <CreateWatchlist setOpen={setOpenWatchlistCreator} />
      ) : (
        <WatchlistG activeWatchlistId={activeWatchlistId} />
      )}
    </div>
  );
}

function WatchlistG({ activeWatchlistId }: { activeWatchlistId?: string }) {
  const { data: allWatchlist, isLoading } = useWatchlist();
  const watchlist = useActiveWatchlist(activeWatchlistId);
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
      statusPanels: [{ statusPanel: RowCountStatusBarComponent }],
    }),
    [],
  );

  const [gridReady, setaGridReady] = useState(false);
  // Add a ref to store the grid API
  const realtimeClient = useRealtimeClient();
  const datasource = useMemo(
    () => new RealtimeDatasource(realtimeClient, "wl"),
    [realtimeClient],
  );

  const ref = useRef<GridApi<Symbol> | undefined>(undefined);
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      ref.current = params.api;
      setaGridReady(true);
      datasource.onReady(params.api);
    },
    [datasource],
  );

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
          subMenu: allWatchlist?.map((w) => {
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
    [allWatchlist, updateWatchlist],
  );

  useEffect(() => {
    if (isLoading || !gridReady) return;
    datasource.setUniverse(watchlist?.symbols ?? []);
    ref.current?.refreshServerSide({ purge: true });
  }, [watchlist?.symbols, datasource, ref, isLoading, gridReady]);

  return (
    <AgGridReact
      suppressServerSideFullWidthLoadingRow={true}
      rowModelType={"serverSide"}
      serverSideDatasource={datasource}
      onGridReady={onGridReady}
      onColumnVisible={(event) => event.api.refreshServerSide({ purge: true })}
      dataTypeDefinitions={extendedColumnType}
      className="ag-terminal-theme"
      selectionColumnDef={{ pinned: "left" }}
      enableAdvancedFilter={true}
      includeHiddenColumnsInAdvancedFilter={true}
      headerHeight={36}
      rowHeight={32}
      getContextMenuItems={getContextMenuItems}
      animateRows
      maintainColumnOrder={true}
      autoSizeStrategy={{
        type: "fitCellContents",
      }}
      columnDefs={colDefs}
      initialState={initialState}
      getRowId={getRowId}
      processDataFromClipboard={(params) => {
        if (!watchlist) return params.data;
        const tickers = params.data[0]?.[0]
          ?.split(/[\\n ,]+/)
          ?.filter((s) => s)
          ?.map((s) => s?.trim()?.toUpperCase());

        if (!tickers || tickers.length === 0) return params.data;
        updateWatchlist({
          id: watchlist.id,
          payload: { symbols: [...watchlist.symbols, ...tickers] },
        });

        return params.data;
      }}
      statusBar={statusBar}
      defaultColDef={{
        wrapHeaderText: true,
        filter: true,
        sortable: true,
        resizable: true,
        enableRowGroup: true,
      }}
      onStateUpdated={handleStateChange}
      onCellFocused={(event) => {
        // If the cell was focus because of selection change, we will ignore
        // switching the symbol
        if ((event.column as AgColumn)?.colId === "ag-Grid-SelectionColumn") {
          return;
        }

        const { rowIndex } = event;
        if (rowIndex === undefined || rowIndex === null) return;
        const symbol = event.api.getDisplayedRowAtIndex(rowIndex)?.data;
        if (!symbol) return;
        if (!symbol) return;
        const { ticker } = symbol;
        if (!ticker) return;
        switcher(ticker);
      }}
    />
  );
}
interface WatchlistCreateDialogProps extends HTMLAttributes<HTMLDivElement> {
  setOpen: (open: boolean) => void;
}

function CreateWatchlist({ setOpen, ...props }: WatchlistCreateDialogProps) {
  return (
    <div
      {...props}
      className={"h-full flex justify-center items-center align-middle"}
    >
      <div className="space-y-2">
        <div>Select or Create a new watchlist</div>
        <Button variant="default" onClick={() => setOpen(true)}>
          <Plus size={4} />
          New Watchlist
        </Button>
      </div>
    </div>
  );
}
