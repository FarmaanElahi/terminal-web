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
import { IOrderLine, TradingView } from "@/components/chart/charting";
import {
  ContextMenuItemsProcessor,
  TradingViewWidgetOptions,
} from "@/components/chart/types";
import { getIndicators } from "@/components/chart/indicators";
import { TerminalBroker } from "@/components/chart/terminal/broker_terminal";
import { AlertBuilder, AlertParams } from "@/components/alerts/alert_builder";
import { ChartManager } from "./chart_manager";
import { useAlerts, useDeleteAlert, useUpdateAlert } from "@/lib/state/symbol";
import { Alert } from "@/types/supabase";
import { toast } from "sonner";

interface ChartProps extends HTMLAttributes<HTMLDivElement> {
  layoutId?: string;
  onLayoutChange?: (id: string) => void;
}

export function Chart({ layoutId, onLayoutChange, ...props }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(
    null,
  ) as RefObject<HTMLDivElement>;

  const symbol = useGroupSymbol();
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
}: {
  containerRef: RefObject<HTMLDivElement>;
  symbol: string;
  theme: "light" | "dark";
  showAlertBuilder?: (p: AlertParams) => void;
  layoutId?: string;
  onLayoutChange?: (layout: string) => void;
}) {
  const ref = useRef<TradingView | null>(null);
  const [widget, setWidget] = useState<TradingView.widget | null>(null);
  const chartManager = useChartManager();
  const contextMenuItemProcessor = useChartContextMenuProcessor(
    ref,
    showAlertBuilder,
  );
  const { setSymbol, changeTheme, onReady } = useTVInit(ref);

  useEffect(() => {
    if (!containerRef.current) return;

    const TradingView = window.TradingView;
    const config = getTVChartConfig({
      container: containerRef.current,
      chartManager,
    });
    const widget = new TradingView.widget({
      ...config,
      container: containerRef.current,
      symbol,
      theme,
      context_menu: { items_processor: contextMenuItemProcessor },
    });

    widget.onChartReady(() => {
      onReady(widget, layoutId, onLayoutChange);
      ref.current = widget;
      setWidget(widget);
      console.log("Set widget ready");
    });

    return () => widget.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useEffect(() => {
    setSymbol(symbol);
  }, [symbol, setSymbol]);

  useEffect(() => {
    changeTheme(theme);
  }, [theme, changeTheme]);

  return { ref, widget };
}

function useTVInit(widgetReadyRef: RefObject<TradingView.widget>) {
  const setSymbol = useCallback(
    (newSymbol: string) => {
      const widget = widgetReadyRef.current;
      if (!widget) return;

      for (let i = 0; i < widget.chartsCount(); i++) {
        const chart = widget.chart(i);
        const resolution = chart.resolution();
        chart.setSymbol(newSymbol, resolution);
      }
    },
    [widgetReadyRef],
  );

  const changeTheme = useCallback(
    (newTheme: "dark" | "light") => {
      widgetReadyRef.current?.changeTheme(newTheme);
    },
    [widgetReadyRef],
  );

  const onReady = useCallback(
    (
      widget: TradingView.widget,
      layoutId?: string,
      onLayoutChange?: (id: string) => void,
    ) => {
      widget.subscribe("onAutoSaveNeeded", () =>
        widget.saveChartToServer(() => console.log("Chart saved to server")),
      );

      if (onLayoutChange) {
        widget.subscribe("chart_load_requested", (e: unknown) =>
          onLayoutChange((e as { id: string }).id),
        );
      }

      if (layoutId) {
        widget.getSavedCharts((record) => {
          const layout = record.find((r) => r.id === layoutId);
          if (layout) widget.loadChartFromServer(layout);
        });
      }
    },
    [],
  );

  return { onReady, changeTheme, setSymbol };
}

function useChartContextMenuProcessor(
  widgetReadyRef: RefObject<TradingView.widget>,
  showAlertBuilder?: (al: AlertParams) => void,
) {
  // const crossHairRef = useRef<CrossHairMovedEventParams | undefined>(undefined);
  // const crossHairSubRef = useRef<
  //   ISubscription<CrossHairMovedEventParams> | undefined
  // >(undefined);

  // const widget = widgetReadyRef.current;

  // useEffect(() => {
  //   if (!widget) return;
  //
  //   const crossHairSub = widget.activeChart().crossHairMoved();
  //   const cb = (v: CrossHairMovedEventParams) => (crossHairRef.current = v);
  //   crossHairSub.subscribe("crosshair", cb);
  //   crossHairSubRef.current = crossHairSub;
  //
  //   return () => {
  //     crossHairSub.unsubscribe("crosshair", cb);
  //   };
  // }, [widget]);

  return useCallback<ContextMenuItemsProcessor>(
    async (items, actionsFactory, params) => {
      if (
        params.menuName === "ObjectTreeContextMenu" &&
        widgetReadyRef.current
      ) {
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
        const price = 1000;
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
    },
    [widgetReadyRef, showAlertBuilder],
  );
}

function getTVChartConfig({
  container,
  chartManager,
}: {
  container: HTMLElement;
  chartManager: ChartManager;
}) {
  return {
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
      "show_dom_first_time",
      "hide_right_toolbar",
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
    ],
  } satisfies TradingViewWidgetOptions;
}

function useTVAlertOnChart(
  widget: TradingView.widget | null,
  showAlert: (a: Alert) => void,
) {
  const activeOrderLines = useRef<IOrderLine[]>([]);
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
        const orderline = await chart.createOrderLine();
        orderline
          .setText(alert.notes ?? `Alert: ${price}`)
          .setPrice(price)
          .setLineStyle(2)
          .setExtendLeft(true)
          .setCancelTooltip("Remove Alert")
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
        activeOrderLines.current.push(orderline);
      });
    }

    // Reset the order
    activeOrderLines.current.forEach((o) => o.remove());
    activeOrderLines.current = [];

    activeSymbols.forEach((value, index) => {
      alerts
        .filter((a) => a.symbol === value)
        .forEach((a) => renderAlertLine(index, a));
      console.log("Orderline created", value);
    });
  }, [widget, alerts, activeSymbols, deleteAlert, updateAlert, showAlert]);
}
