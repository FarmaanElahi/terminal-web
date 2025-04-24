import type { TradingViewWidgetOptions } from "@/components/chart/types";
import { ChartStorage } from "@/components/chart/chart_storage";
import { LogoProvider } from "@/components/chart/logo_provider";
import { getIndicators } from "@/components/chart/indicators";
import { Client } from "@/utils/supabase/client";
import { DatafeedUpstox } from "@/components/chart/datafeed_upstox";
import type { TradingAccount } from "@/server/integration";

export class ChartManager {
  private readonly chartStorage: ChartStorage;
  private readonly logoProvider: LogoProvider;
  private readonly datafeed: DatafeedUpstox;

  constructor(
    private readonly client: Client,
    logoBaseUrl: string,
    private readonly accounts: TradingAccount[],
  ) {
    this.logoProvider = new LogoProvider(logoBaseUrl);
    this.datafeed = new DatafeedUpstox(this.logoProvider);
    this.chartStorage = new ChartStorage(this.client);
  }

  create(
    container: HTMLElement,
    symbol: string | undefined,
    theme: "dark" | "light",
    layoutId: string | undefined,
    options?: {
      onReady: () => void;
      onLayoutChange?: (id: string) => void;
    },
  ) {
    const TradingView = window.TradingView;
    const c = this.getConfig();
    const widget = new TradingView.widget({
      ...c,
      container,
      symbol,
      theme,
    });
    widget.onChartReady(() => {
      options?.onReady?.();

      // Subscribe to chart saving
      widget.subscribe("onAutoSaveNeeded", () =>
        widget.saveChartToServer(() => console.log("Chart saved to server")),
      );

      if (options?.onLayoutChange) {
        widget.subscribe("chart_load_requested", (e: unknown) =>
          options?.onLayoutChange?.((e as { id: string }).id),
        );
      }

      if (layoutId) {
        widget.getSavedCharts((record) => {
          const layout = record.find((r) => r.id === layoutId);
          if (!layout) return;
          widget.loadChartFromServer(layout);
        });
      }
    });
    return widget;
  }

  private getConfig(): Omit<
    TradingViewWidgetOptions,
    "container" | "symbol" | "theme"
  > {
    // const userSettingAdapter = new UserSetting();
    // await userSettingAdapter.load();
    const timezone = "Asia/Kolkata";
    return {
      datafeed: this.datafeed,
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
      save_load_adapter: this.chartStorage,
      disabled_features: [
        "order_panel",
        "trading_account_manager",
        "symbol_search_hot_key",
        "header_symbol_search",
        "allow_arbitrary_symbol_search_input",
        "object_tree_legend_mode",
        "show_symbol_logo_in_legend",
        "symbol_info",
        "header_quick_search",
        "countdown",
        "timeframes_toolbar",
        "object_tree_legend_mode",
        "show_object_tree",
        // "save_chart_properties_to_local_storage",
      ],

      enabled_features: [
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
  }
}
