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
import { ISubscription, TradingView } from "@/components/chart/charting";
import {
  ContextMenuItemsProcessor,
  CrossHairMovedEventParams,
  TradingViewWidgetOptions,
} from "@/components/chart/types";
import { getIndicators } from "@/components/chart/indicators";
import { TerminalBroker } from "@/components/chart/terminal/broker_terminal";
import { AlertBuilder } from "@/components/alerts/alert_builder";

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

  const [showAlert, setShowAlert] = useState<[string, number] | undefined>(
    undefined,
  );

  const { setSymbol, changeTheme } = useChart({
    containerRef: chartContainerRef,
    layoutId,
    onLayoutChange: onLayoutChange,
    symbol,
    theme: chartTheme,
    showAlertBuilder: (symbol, price) => setShowAlert([symbol, price]),
  });

  useEffect(() => {
    setSymbol(symbol);
  }, [symbol, setSymbol]);

  useEffect(() => {
    changeTheme(chartTheme);
  }, [chartTheme, changeTheme]);

  return (
    <>
      <AlertBuilder
        open={!!showAlert}
        onOpenChange={(value) =>
          value ? setShowAlert(showAlert) : setShowAlert(undefined)
        }
        initialSymbol={showAlert?.[0]}
        initialType={"price"}
        alertPrice={showAlert?.[1]}
      />
      <div
        ref={chartContainerRef}
        className={"h-full overflow-auto"}
        {...props}
      />
    </>
  );
}

export function useChart({
  containerRef,
  symbol,
  theme,
  layoutId,
  onLayoutChange,
  onReady,
  showAlertBuilder,
}: {
  showAlertBuilder?: (symbol: string, price: number) => void;
  containerRef: RefObject<HTMLElement>;
  symbol?: string;
  theme: "dark" | "light";
  layoutId?: string;
  onReady?: (widget: TradingView.widget) => void;
  onLayoutChange?: (id: string) => void;
}) {
  const chartManager = useChartManager();
  const widgetRef = useRef<TradingView.widget | null>(null);
  const widgetReadyRef = useRef<TradingView.widget | null>(null);
  const crossHairRef = useRef<CrossHairMovedEventParams | undefined>(undefined);
  const crossHairSubRef = useRef<
    ISubscription<CrossHairMovedEventParams> | undefined
  >(undefined);

  const getConfig = useCallback((): Omit<
    TradingViewWidgetOptions,
    "container" | "symbol" | "theme"
  > => {
    const timezone = "Asia/Kolkata";
    return {
      datafeed: chartManager.datafeed,
      autosize: true,
      library_path: "/external/charting_library/",
      debug: false,
      timezone,
      interval: "1D",
      locale: "en",
      auto_save_delay: 3,
      load_last_chart: true,
      custom_css_url: "/css/charts/styles.css",
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
    };
  }, [chartManager.datafeed, chartManager.chartStorage, chartManager.accounts]);

  const contextMenuItemProcessor: ContextMenuItemsProcessor = useCallback(
    async (items, actionsFactory) => {
      if (crossHairRef.current && widgetReadyRef.current) {
        const symbol = widgetReadyRef.current.activeChart().symbol();
        const price = parseFloat(crossHairRef.current.price.toFixed(2));
        const newItem = actionsFactory.createAction({
          actionId: "Terminal.AddAlert",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-plus-icon lucide-alarm-clock-plus"><circle cx="12" cy="13" r="8"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/><path d="M12 10v6"/><path d="M9 13h6"/></svg>`,
          label: `Add Alert at ${price}`,
          onExecute: () => showAlertBuilder?.(symbol, price),
        });
        return [newItem, actionsFactory.createSeparator(), ...items];
      }
      return items;
    },
    [showAlertBuilder],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const TradingView = window.TradingView;
    const config = getConfig();
    const widget = new TradingView.widget({
      ...config,
      container: containerRef.current,
      symbol,
      theme,
      context_menu: { items_processor: contextMenuItemProcessor },
    });

    widgetRef.current = widget;

    widget.onChartReady(() => {
      onReady?.(widget);
      widgetReadyRef.current = widget;

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

      const crossHairSub = widget.activeChart().crossHairMoved();
      crossHairSub.subscribe("crosshair", (v) => (crossHairRef.current = v));
      crossHairSubRef.current = crossHairSub;
    });

    return () => {
      widget.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSymbol = useCallback((newSymbol: string) => {
    const widget = widgetReadyRef.current;
    if (!widget) return;

    for (let i = 0; i < widget.chartsCount(); i++) {
      const chart = widget.chart(i);
      const resolution = chart.resolution();
      chart.setSymbol(newSymbol, resolution);
    }
  }, []);

  const changeTheme = useCallback((newTheme: "dark" | "light") => {
    widgetReadyRef.current?.changeTheme(newTheme);
  }, []);

  const destroy = useCallback(() => {
    widgetReadyRef.current?.remove();
  }, []);

  return {
    setSymbol,
    changeTheme,
    destroy,
  };
}
