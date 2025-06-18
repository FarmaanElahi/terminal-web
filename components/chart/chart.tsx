"use client";
import React, {
  HTMLAttributes,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChartManager } from "@/lib/state/charts";
import { useGroupSymbol } from "@/lib/state/grouper";
import { useTheme } from "next-themes";
import {
  CrossHairMovedEventParams,
  IOrderLine,
  TradingView,
} from "@/components/chart/charting";
import {
  ContextMenuItemsProcessor,
  TradingViewWidgetOptions,
} from "@/components/chart/types";
import { getIndicators } from "@/components/chart/indicators";
import { TerminalBroker } from "@/components/chart/terminal/broker_terminal";
import { AlertBuilder, AlertParams } from "@/components/alerts/alert_builder";
import { ChartManager } from "./chart_manager";
import {
  chartLayout,
  useAlerts,
  useCreateScanner,
  useDeleteAlert,
  useDeleteScanner,
  useScanners,
  useUpdateAlert,
  useUpdateScanner,
} from "@/lib/state/symbol";
import { Alert } from "@/types/supabase";
import { toast } from "sonner";
import IWatchListApi = TradingView.IWatchListApi;

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  layoutId?: string;
  onLayoutChange?: (id: string) => void;
  features?: TVChartOptions["features"];
}

interface TVChartOptions {
  containerRef: RefObject<HTMLDivElement>;
  symbol: string;
  theme: "light" | "dark";
  showAlertBuilder?: (p: AlertParams) => void;
  layoutId?: string;
  onLayoutChange?: (layout: string) => void;
  features?: {
    enableWatchlist?: boolean;
    enableSearch?: boolean;
  };
}

export function Chart({
  layoutId,
  onLayoutChange,
  features,
  ...props
}: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>;

  const symbol = useGroupSymbol() ?? "NSE:NIFTY";
  const theme = useTheme();
  const chartTheme =
    theme.theme === "dark"
      ? "dark"
      : theme.theme === "light"
        ? "light"
        : (theme.systemTheme ?? "light");

  const [showAlert, setShowAlert] = useState<AlertParams | undefined>(
    undefined,
  );
  const [showEditAlert, setShowEditAlert] = useState<boolean>(false);
  const [editingAlert, setEditingAlert] = useState<Alert | undefined>(
    undefined,
  );

  const { widget } = useTVChart({
    containerRef: chartContainerRef,
    layoutId,
    onLayoutChange,
    symbol,
    theme: chartTheme,
    showAlertBuilder: (p) => setShowAlert(p),
    features,
  });

  useTVAlertOnChart(widget, (a) => {
    setEditingAlert(a);
    setShowEditAlert(true);
  });

  return (
    <>
      <AlertBuilder
        open={!!showAlert}
        onOpenChange={(value) =>
          value ? setShowAlert(showAlert) : setShowAlert(undefined)
        }
        alertParams={showAlert}
      />

      <AlertBuilder
        open={showEditAlert}
        onOpenChange={() => {
          setShowEditAlert(false);
          setEditingAlert(undefined);
        }}
        existingAlert={editingAlert}
        alertParams={{
          type: "constant",
          symbol: "NSE:NIFTY",
          params: { constant: 100 },
        }}
      />
      <div
        ref={chartContainerRef}
        className={"h-full overflow-auto"}
        {...props}
      />
    </>
  );
}

function useTVChart({
  containerRef,
  theme,
  symbol,
  showAlertBuilder,
  layoutId,
  onLayoutChange,
  features,
}: TVChartOptions) {
  const widgetRef = useRef<TradingView.widget | null>(null);
  const [widget, setWidget] = useState<TradingView.widget | null>(null);
  const [watchlistAPI, setWatchlistAPI] = useState<IWatchListApi | null>(null);
  const chartManager = useChartManager();
  const { setSymbol, changeTheme, onReady, onDestroy, crosshairRef } =
    useTVInit(widget);
  const { data } = useScanners(["simple"]);
  const { mutate: updateWatchlist } = useUpdateScanner();
  const { mutate: createWatchlist } = useCreateScanner();
  const { mutate: deleteWatchlist } = useDeleteScanner();
  const watchlistInit = useRef(false);

  // Update the watchlist from external changes
  useEffect(() => {
    console.log("EFF 1");
    if (!watchlistAPI || !data || watchlistInit.current) return;
    watchlistInit.current = true;

    // Update the current list either updated externally or within the chart
    data.forEach((value) => {
      watchlistAPI.saveList({
        id: value.id,
        symbols: value.symbols,
        title: value.name,
      });
    });

    // Update the list and remove item externally.
    const localListId = Object.values(watchlistAPI.getAllLists()).map(
      (l) => l.listId,
    );
    const remoteListId = data.map((d) => d.id);
    const removed = new Set(localListId).difference(new Set(remoteListId));
    removed.forEach((l) => watchlistAPI.deleteList(l));
  }, [watchlistAPI, data]);

  useEffect(() => {
    console.log("EFF 2");
    if (!watchlistAPI) return;

    // List changed
    const listChanged = watchlistAPI.onListChanged();
    const listChangedCb = (id: string) => {
      const localList = watchlistAPI.getAllLists()[id];
      updateWatchlist({
        id,
        payload: { symbols: localList.symbols },
      });
    };
    listChanged.subscribe(null, listChangedCb);

    // List Created
    const listAdded = watchlistAPI.onListAdded();
    const listAddedCb = (id: string) => {
      setTimeout(() => {
        const local = watchlistAPI.getAllLists()[id];
        createWatchlist({
          id,
          type: "simple",
          name: local.title,
          symbols: local.symbols,
        });
      });
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    listAdded.subscribe(null, listAddedCb);

    // List Removed
    const listRemoved = watchlistAPI.onListRemoved();
    const listRemovedCb = (id: string) => deleteWatchlist(id);
    listRemoved.subscribe(null, listRemovedCb);

    // List Renamed
    const listRenamed = watchlistAPI.onListRenamed();
    const listRenamedCb = (id: string, old: string, name: string) =>
      updateWatchlist({ id, payload: { name } });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    listRenamed.subscribe(null, listRenamedCb);

    return () => {
      listChanged.unsubscribe(null, listChangedCb);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      listAdded.unsubscribe(null, listAddedCb);
      listRemoved.unsubscribe(null, listRemovedCb);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      listRenamed.unsubscribe(null, listRenamedCb);
    };
  }, [watchlistAPI, updateWatchlist, createWatchlist, deleteWatchlist]);

  useEffect(() => {
    if (!containerRef.current) return;

    const TradingView = window.TradingView;
    const config = getTVChartConfig({
      container: containerRef.current,
      chartManager,
      features,
    });

    let widget: TradingView.widget | null = null;

    async function withLayout(layoutId: string) {
      const layout = await chartLayout(layoutId).catch(() => null);
      if (!layout) return withSymbol();

      const l = layout!;
      const s = layout?.content as Record<string, unknown>;
      const layoutContent = s.content
        ? JSON.parse(s.content as string)
        : undefined;
      return new TradingView.widget({
        ...config,
        container: containerRef.current,
        load_last_chart: false,
        theme,
        saved_data: layoutContent,
        saved_data_meta_info: {
          name: l.name as string,
          uid: l.id as string,
          description: l.name as string,
        },
        context_menu: {
          items_processor: createContextMenuProcessor(
            widgetRef,
            crosshairRef,
            showAlertBuilder,
          ),
        },
      });
    }

    async function withSymbol() {
      return new TradingView.widget({
        ...config,
        container: containerRef.current,
        theme,
        symbol,
        context_menu: {
          items_processor: createContextMenuProcessor(
            widgetRef,
            crosshairRef,
            showAlertBuilder,
          ),
        },
      });
    }

    async function create() {
      widget = await (layoutId ? withLayout(layoutId as string) : withSymbol());
      widget.onChartReady(async () => {
        widgetRef.current = widget;
        setWatchlistAPI(await widget!.watchList());
        onReady(widget!, onLayoutChange);
        setWidget(widget);
        console.log("Set widget ready");
      });
      widget.onDestroy(() => onDestroy(widget!));
    }

    void create();

    return () => widget?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useEffect(() => {
    setSymbol(symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  useEffect(() => {
    changeTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return { widget };
}

function useTVInit(widget: TradingView.widget | null) {
  const crosshairRef = useRef<CrossHairMovedEventParams>(undefined);
  const onCrossHairdMoved = useCallback(
    (ev: CrossHairMovedEventParams) => (crosshairRef.current = ev),
    [],
  );

  const setSymbol = useCallback(
    (newSymbol: string) => {
      if (!widget) return;

      for (let i = 0; i < widget.chartsCount(); i++) {
        const chart = widget.chart(i);
        const resolution = chart.resolution();
        chart.setSymbol(newSymbol, resolution);
      }
    },
    [widget],
  );

  const changeTheme = useCallback(
    (newTheme: "dark" | "light") => {
      widget?.changeTheme(newTheme);
    },
    [widget],
  );

  const onReady = useCallback(
    (widget: TradingView.widget, onLayoutChange?: (id: string) => void) => {
      widget.subscribe("onAutoSaveNeeded", () =>
        widget.saveChartToServer(() => console.log("Chart saved to server")),
      );

      if (onLayoutChange) {
        widget.subscribe("chart_load_requested", (e: unknown) =>
          onLayoutChange((e as { id: string }).id),
        );
      }
      widget.activeChart().crossHairMoved().subscribe(null, onCrossHairdMoved);
    },
    [onCrossHairdMoved],
  );

  const onDestroy = useCallback(
    (widget: TradingView.widget) => {
      widget
        .activeChart()
        .crossHairMoved()
        .unsubscribe(null, onCrossHairdMoved);
    },
    [onCrossHairdMoved],
  );

  return { onReady, changeTheme, setSymbol, crosshairRef, onDestroy };
}

function createContextMenuProcessor(
  widgetReadyRef: RefObject<TradingView.widget | null>,
  crosshairRef: RefObject<CrossHairMovedEventParams | undefined>,
  showAlertBuilder?: (al: AlertParams) => void,
) {
  const processor: ContextMenuItemsProcessor = async (
    items,
    actionsFactory,
    params,
  ) => {
    if (params.menuName === "ObjectTreeContextMenu" && widgetReadyRef.current) {
      if (params.detail.type === "shape" && params.detail.id) {
        const points = widgetReadyRef.current
          .activeChart()
          .getShapeById(params.detail.id)
          ?.getPoints();
        const symbol = widgetReadyRef.current.activeChart().symbol();
        if (points && points.length === 2) {
          const newItem = actionsFactory.createAction({
            actionId: "Terminal.TrendlineAlert",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-plus-icon lucide-alarm-clock-plus"><circle cx="12" cy="13" r="8"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/><path d="M12 10v6"/><path d="M9 13h6"/></svg>`,
            label: `Add Alert on Trend Line`,
            onExecute: () => {
              showAlertBuilder?.({
                type: "trend_line",
                symbol,
                params: { trend_line: points },
              });
            },
          });

          return [newItem, actionsFactory.createSeparator(), ...items];
        }
        if (points && points.length === 1) {
          const price = parseFloat(points[0].price.toFixed(2));
          const newItem = actionsFactory.createAction({
            actionId: "Terminal.AddAlert",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-plus-icon lucide-alarm-clock-plus"><circle cx="12" cy="13" r="8"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/><path d="M12 10v6"/><path d="M9 13h6"/></svg>`,
            label: `Add Alert at ${price}`,
            onExecute: () =>
              showAlertBuilder?.({
                symbol,
                params: { constant: price },
                type: "constant",
              }),
          });
          return [newItem, actionsFactory.createSeparator(), ...items];
        }
      }
    }

    // Called for chart context menu
    if (widgetReadyRef.current) {
      const price = crosshairRef.current
        ? +crosshairRef.current.price.toFixed(2)
        : 1000;

      const symbol = widgetReadyRef.current.activeChart().symbol();
      const newItem = actionsFactory.createAction({
        actionId: "Terminal.AddAlert",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-plus-icon lucide-alarm-clock-plus"><circle cx="12" cy="13" r="8"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/><path d="M12 10v6"/><path d="M9 13h6"/></svg>`,
        label: `Add Alert at ${price}`,
        onExecute: () =>
          showAlertBuilder?.({
            symbol,
            params: { constant: price },
            type: "constant",
          }),
      });
      return [newItem, actionsFactory.createSeparator(), ...items];
    }
    return items;
  };
  return processor;
}

function getTVChartConfig({
  container,
  chartManager,
  features,
}: {
  container: HTMLElement;
  chartManager: ChartManager;
  features: TVChartOptions["features"];
}) {
  const option = {
    container: container,
    datafeed: chartManager.datafeed,
    autosize: true,
    library_path: "/external/charting_library/",
    debug: false,
    timezone: "Asia/Kolkata",
    interval: "1D",
    locale: "en",
    auto_save_delay: 3,
    load_last_chart: true,
    custom_css_url: "/static/css/charts/styles.css",
    custom_indicators_getter: getIndicators,
    save_load_adapter: chartManager.chartStorage,
    broker_factory: (host) => new TerminalBroker(host, chartManager.accounts),
    broker_config: {
      configFlags: {
        supportLevel2Data: true,
        supportNativeReversePosition: true,
        supportClosePosition: true,
        supportPLUpdate: true,
        showQuantityInsteadOfAmount: true,
        supportEditAmount: false,
        supportOrderBrackets: true,
        supportMarketBrackets: true,
        supportPositionBrackets: true,
      },
    },
    disabled_features: [
      "order_panel",
      "trading_account_manager",
      "open_account_manager",
      "symbol_search_hot_key",
      "header_symbol_search",
      "allow_arbitrary_symbol_search_input",
      "object_tree_legend_mode",
      "show_symbol_logo_in_legend",
      "symbol_info",
      "header_quick_search",
      "countdown",
      "timeframes_toolbar",
      "show_object_tree",
    ],
    enabled_features: [
      "custom_resolutions",
      "show_dom_first_time",
      features?.enableWatchlist ? undefined : "hide_right_toolbar",
      "hide_left_toolbar_by_default",
      "border_around_the_chart",
      "create_volume_indicator_by_default",
      "items_favoriting",
      "show_symbol_logos",
      "show_symbol_logo_for_compare_studies",
      "show_symbol_logo_in_legend",
      "study_templates",
      "saveload_separate_drawings_storage",
      "chart_template_storage",
      "pricescale_currency",
      "pre_post_market_sessions",
      "studies_extend_time_scale",
      "hide_image_invalid_symbol",
    ].filter((f) => f),
  } as TradingViewWidgetOptions;

  if (features?.enableWatchlist) {
    option.widgetbar = { watchlist: true };
  }
  if (features?.enableSearch) {
    option.disabled_features =
      option.disabled_features?.filter(
        (f) => !["symbol_search_hot_key", "header_symbol_search"].includes(f),
      ) ?? [];
  }

  return option;
}

function useTVAlertOnChart(
  widget: TradingView.widget | null,
  showAlert: (a: Alert) => void,
) {
  const activeOrderLines = useRef<Record<string, IOrderLine>>({});
  const { data: alerts } = useAlerts();
  const { mutate: updateAlert } = useUpdateAlert(() => toast("Alert Updated"));
  const { mutate: deleteAlert } = useDeleteAlert(() => toast("Alert deleted"));
  const [activeSymbols, setActiveSymbols] = useState<string[]>([]);

  useEffect(() => {
    if (!widget) return;

    function ref() {
      if (!widget) return;

      const symbols = [];
      for (let i = 0; i < widget.chartsCount(); i++) {
        symbols.push(widget.chart(i).symbol());
      }
      setActiveSymbols(symbols);
      console.log("Alert symbol refreshed");
    }

    function refetch() {
      if (!widget) return;

      for (let i = 0; i < widget.chartsCount(); i++) {
        const sub = widget.chart(i).onSymbolChanged();
        sub.subscribe(null, ref);
      }
      ref();
    }

    refetch();
  }, [widget]);

  useEffect(() => {
    if (!alerts) return;

    async function renderAlertLine(index: number, alert: Alert) {
      if (!widget) return;

      // Only price alert are showing as order line
      const price = (alert.rhs_attr as Record<string, number>)?.[
        "constant"
      ] as number;
      if (!price) return;

      // Add the new oder line
      const chart = widget.chart(index);
      chart.dataReady(async () => {
        if (activeOrderLines.current[alert.id]) {
          activeOrderLines.current[alert.id].remove();
        }

        const orderline = await chart.createOrderLine();
        orderline
          .setText(alert.notes ?? `Alert: ${price}`)
          .setPrice(price)
          .setLineColor("#F2C55C")
          .setBodyBackgroundColor("#F2C55C")
          .setBodyBorderColor("#494949")
          .setBodyTextColor("#494949")
          .setQuantityBackgroundColor("#F2C55C")
          .setQuantityTextColor("#494949")
          .setCancelButtonBackgroundColor("#F2C55C")
          .setCancelButtonBorderColor("#494949")
          .setCancelButtonIconColor("#494949")
          .setCancelButtonBorderColor("#494949")
          .setQuantityBorderColor("#494949")
          .setLineStyle(2)
          .setExtendLeft(true)
          .setCancelTooltip("Cancel Alert")
          .onCancel(() => deleteAlert(alert.id))
          .onModify(() => showAlert(alert))
          .onMove(() => {
            updateAlert({
              id: alert.id,
              payload: {
                rhs_attr: { constant: orderline.getPrice() },
              },
            });
          });
        activeOrderLines.current[alert.id] = orderline;
      });
    }

    // Reset the order
    Object.values(activeOrderLines.current).forEach((o) => o.remove());
    activeOrderLines.current = {};

    activeSymbols.forEach((value, index) => {
      alerts
        .filter((a) => a.symbol === value)
        .forEach((a) => renderAlertLine(index, a));
      console.log("Orderline created", value);
    });
  }, [widget, alerts, activeSymbols, deleteAlert, updateAlert, showAlert]);
}
