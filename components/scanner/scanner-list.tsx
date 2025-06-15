"use client";

import React, {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useAllScanner,
  useScanners,
  useUpdateScanner,
} from "@/lib/state/symbol";
import {
  AgColumn,
  CellFocusedEvent,
  ColumnVisibleEvent,
  GetContextMenuItems,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
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
import { useGroupFilter, useGroupSymbolSwitcher } from "@/lib/state/grouper";
import "../grid/ag-theme.css";
import debounce from "debounce";
import { toast } from "sonner";
import { Json } from "@/types/generated/supabase";
import type { Symbol } from "@/types/symbol";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateScanner } from "./scanner-selector";
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

function useScanner(
  types: Scanner["type"][],
  type: string,
  scannerId: string | null,
) {
  const { data: scanners } = useScanners(types);
  return scanners?.find((s) => s.id && s.id === scannerId);
}

function useScannerChangeCallback(type: string, activeScanner?: string | null) {
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
  const { scannerId, types, type } = useCurrentScanner();
  const { isLoading } = useScanners(types);
  const { data: scanners } = useAllScanner();
  const scanner = useScanner(types, type, scannerId);

  const [openScannerCreator, setOpenScannerCreator] = useState(false);
  const { data } = useScanners(types);
  if (isLoading) return <></>;

  return (
    <div {...props} className={cn("h-full", props.className)}>
      {
        <CreateScanner
          open={openScannerCreator}
          setOpen={setOpenScannerCreator}
        />
      }
      {((type === "Watchlist" && !scannerId) || !data || data.length === 0) && (
        <CreateNewWatchlistOnEmpty setOpen={setOpenScannerCreator} />
      )}
      {type === "Watchlist" && scannerId && (
        <SymbolList scanner={scanner} scanners={scanners ?? []} />
      )}
      {type === "Screener" && (
        <SymbolList scanner={scanner} scanners={scanners ?? []} />
      )}
    </div>
  );
}

function useGridBase(scanner?: Scanner, scanners?: Scanner[]) {
  const { type } = useCurrentScanner();
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
  const { data: allWatchlists } = useScanners(["simple"]);
  const { mutate: updateScanner } = useUpdateScanner((w) => {
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
          subMenu: allWatchlists?.map((w) => {
            const checked = w.symbols?.includes(symbol.ticker!);
            const updatedSymbols = checked
              ? w.symbols.filter((s) => s !== symbol.ticker)
              : [...(w.symbols ?? []), symbol.ticker!];
            return {
              name: w.name,
              subMenuRole: "menu",
              checked,
              action: () =>
                updateScanner({
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
    [allWatchlists, updateScanner],
  );

  const switcher = useGroupSymbolSwitcher();
  const realtimeClient = useRealtimeClient();
  const datasource = useMemo(
    () => new RealtimeDatasource(realtimeClient, type),
    [realtimeClient, type],
  );
  const onGridReady = useCallback(
    (p: GridReadyEvent) => {
      ref.current = p.api;
      datasource.onReady(p.api, scanner, scanners);
    },
    [scanner, scanners, datasource],
  );

  const onStateUpdated = useScannerChangeCallback(type, scanner?.id);

  const processClipboardPaste = useCallback(
    (params: ProcessDataFromClipboardParams) => {
      if (!scanner) return params.data;
      const tickers = params.data[0]?.[0]
        ?.split(/[\\n ,]+/)
        ?.filter((s) => s)
        ?.map((s) => s?.trim()?.toUpperCase());

      if (!tickers || tickers.length === 0) return params.data;
      updateScanner({
        id: scanner.id,
        payload: { symbols: [...scanner.symbols, ...tickers] },
      });

      return params.data;
    },
    [scanner, updateScanner],
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

  const filter = useGroupFilter();
  const ref = useRef<GridApi | null>(null);
  useEffect(() => {
    if (type === "Watchlist" || !ref.current) return;

    if (filter?.state?.advancedFilterModel) {
      console.log("Temp filter added", filter);
      ref.current?.setAdvancedFilterModel(filter.state?.advancedFilterModel);
      ref.current?.refreshServerSide({ purge: true });
    } else {
      console.log("Temp filter removed");
      ref.current?.setAdvancedFilterModel(null);
      ref.current?.refreshServerSide({ purge: true });
    }
  }, [filter, scanner?.id, type]);

  return {
    ref,
    initialState: (scanner?.state as GridState) ?? initialState,
    onCellFocused,
    getRowId,
    datasource,
    statusBar,
    onGridReady,
    switcher,
    getContextMenuItems,
    updateWatchlist: updateScanner,
    onStateUpdated,
    processClipboardPaste,
    defaultColDef,
    onColumnVisible,
  };
}

function SymbolList({
  scanner,
  scanners,
}: {
  scanner?: Scanner;
  scanners: Scanner[];
}) {
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
  } = useGridBase(scanner, scanners);

  return (
    <AgGridReact
      key={scanner?.id}
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

function CreateNewWatchlistOnEmpty({
  setOpen,
  ...props
}: WatchlistCreateDialogProps) {
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
