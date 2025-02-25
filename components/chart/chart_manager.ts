import type { TradingView } from "@/components/chart/charting";
import type { TradingViewWidgetOptions } from "@/components/chart/types";
import { ChartStorage } from "@/components/chart/chart_storage";
import { LogoProvider } from "@/components/chart/logo_provider";
import { getIndicators } from "@/components/chart/indicators";
import { Client } from "@/utils/supabase/client";
import { DatafeedUpstox } from "@/components/chart/datafeed_upstox";

export class ChartManager {
  private readonly chartStorage: ChartStorage;
  private readonly logoProvider: LogoProvider;
  private readonly datafeed: DatafeedUpstox;

  constructor(
    private readonly client: Client,
    logoBaseUrl: string,
  ) {
    this.logoProvider = new LogoProvider(logoBaseUrl);
    this.datafeed = new DatafeedUpstox(this.logoProvider);
    this.chartStorage = new ChartStorage(this.client);
  }

  create(
    container: HTMLElement,
    symbol: string,
    theme: "dark" | "light",
    onReady: () => void,
  ) {
    const TradingView = window.TradingView;
    const c = this.getConfig();
    const tvWidget = new TradingView.widget({
      ...c,
      container,
      symbol,
      theme,
    });
    tvWidget.onChartReady(() => {
      onReady();
      this.onChartReady(tvWidget);
    });
    return tvWidget;
  }

  private onChartReady = (chart: TradingView.widget) => {
    chart.subscribe("onAutoSaveNeeded", () =>
      chart.saveChartToServer(() => console.log("Chart saved to server")),
    );
  };

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
      debug: true,
      timezone,
      interval: "1D",
      locale: "en",
      auto_save_delay: 3,
      custom_css_url: "/css/charts/styles.css",
      custom_indicators_getter: getIndicators,
      load_last_chart: true,
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
