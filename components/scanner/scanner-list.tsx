"use client";

import React, {
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useScanners, useUpdateScanner } from "@/lib/state/symbol";
import {
  AgColumn,
  CellFocusedEvent,
  ColumnVisibleEvent,
  GetContextMenuItems,
  GetRowIdFunc,
  GetRowIdParams,
  GridReadyEvent,
  GridState,
  ProcessDataFromClipboardParams,
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
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchlistCreatorDialog } from "./scanner-selector";
import { WatchlistSymbol } from "@/components/scanner/watchlist-symbol";
import { cn } from "@/lib/utils";
import { RowCountStatusBarComponent } from "@/components/grid/row-count";
import { useRealtimeClient } from "@/hooks/use-realtime";
import { Scanner } from "@/types/supabase";
import { RealtimeDatasource } from "@/components/grid/datasource";
import { useCurrentScanner } from "@/hooks/use-active-scanner";

type ScannerListProps = HTMLAttributes<HTMLDivElement>;

function useColumnDefs() {
  return useMemo(() => defaultColumns, []);
}

function useScanner(types: Scanner["type"][], scannerId: string | null) {
  const { data: scanners } = useScanners(types);
  return scanners?.find((s) => s.id && s.id === scannerId);
}

function useScannerChangeCallback(activeScanner?: string | null) {
  const mutation = useUpdateScanner((watchlist) =>
    toast(`${watchlist.name} updated`),
  );

  // Debounced update function
  const updateScanner = useMemo(
    () => debounce(mutation.mutate, 1000),
    [mutation.mutate],
  );

  // Handle grid state changes
  return useCallback(
    (params: StateUpdatedEvent) => {
      // Started because the grid was created
      if (params.sources?.[0] === "gridInitializing") return;

      // Doesn't have active screener
      const id = activeScanner;
      if (!id) return;

      const currentState = params.api.getState() as Json;
      updateScanner({ id, payload: { state: currentState } });
    },
    [activeScanner, updateScanner],
  );
}

function useGridInitialState() {
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

  return defaultState as GridState;
}

export function ScannerList(props: ScannerListProps) {
  const { scannerId, types } = useCurrentScanner();
  const scanner = useScanner(types, scannerId);

  const [openWatchlistSymbol, setOpenWatchlistSymbol] = useState(false);
  const [openWatchlistCreator, setOpenWatchlistCreator] = useState(false);

  const { data } = useScanners(types);
  return (
    <div {...props} className={cn("h-full", props.className)}>
      {scanner && (
        <WatchlistSymbol
          open={openWatchlistSymbol}
          setOpen={setOpenWatchlistSymbol}
          watchlist={scanner}
        />
      )}
      <WatchlistCreatorDialog
        open={openWatchlistCreator}
        setOpen={setOpenWatchlistCreator}
      />
      {(!scannerId || !data || data.length === 0) && (
        <CreateWatchlist setOpen={setOpenWatchlistCreator} />
      )}
      {scanner && <SymbolList watchlist={scanner as Scanner} />}
    </div>
  );
}

function useGridBase(watchlist: Scanner, types: Scanner["type"][]) {
  const initialState = useGridInitialState();

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
  const { data: allScanners } = useScanners(types);
  const { mutate: updateWatchlist } = useUpdateScanner((w) => {
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
          subMenu: allScanners?.map((w) => {
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
    [allScanners, updateWatchlist],
  );

  const switcher = useGroupSymbolSwitcher();

  const realtimeClient = useRealtimeClient();
  const datasource = useMemo(
    () => new RealtimeDatasource(realtimeClient, "wl"),
    [realtimeClient],
  );
  const onGridReady = useCallback(
    (p: GridReadyEvent) => {
      const symbols = watchlist.symbols ?? [];
      datasource.onReady(p.api, symbols);
    },
    [watchlist.symbols, datasource],
  );

  const onStateUpdated = useScannerChangeCallback(watchlist.id);

  const processClipboardPaste = useCallback(
    (params: ProcessDataFromClipboardParams) => {
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
    },
    [watchlist, updateWatchlist],
  );

  const onCellFocused = useCallback(
    (event: CellFocusedEvent) => {
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
    },
    [switcher],
  );

  const defaultColDef = useMemo(
    () => ({
      wrapHeaderText: true,
      filter: true,
      sortable: true,
      resizable: true,
      enableRowGroup: true,
    }),
    [],
  );

  const onColumnVisible = useCallback(
    (event: ColumnVisibleEvent) => event.api.refreshServerSide({ purge: true }),
    [],
  );
  return {
    initialState: (watchlist.state as GridState) ?? initialState,
    onCellFocused,
    getRowId,
    datasource,
    statusBar,
    onGridReady,
    switcher,
    getContextMenuItems,
    updateWatchlist,
    onStateUpdated,
    processClipboardPaste,
    defaultColDef,
    onColumnVisible,
  };
}

function SymbolList({ watchlist }: { watchlist: Scanner }) {
  const { types } = useCurrentScanner();
  const colDefs = useColumnDefs();
  const {
    defaultColDef,
    initialState,
    getRowId,
    statusBar,
    getContextMenuItems,
    onCellFocused,
    onGridReady,
    datasource,
    processClipboardPaste,
    onStateUpdated,
    onColumnVisible,
  } = useGridBase(watchlist, types);

  const ref = useRef<AgGridReact | null>(null);

  return (
    <AgGridReact
      ref={ref}
      key={watchlist.id}
      serverSideDatasource={datasource}
      onGridReady={onGridReady}
      suppressServerSideFullWidthLoadingRow={true}
      rowModelType={"serverSide"}
      onColumnVisible={onColumnVisible}
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
      autoSizeStrategy={{ type: "fitCellContents" }}
      columnDefs={colDefs}
      initialState={initialState}
      getRowId={getRowId}
      processDataFromClipboard={processClipboardPaste}
      statusBar={statusBar}
      defaultColDef={defaultColDef}
      onStateUpdated={onStateUpdated}
      onCellFocused={onCellFocused}
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
