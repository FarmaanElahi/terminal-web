import type { TradingView } from "@/components/chart/charting";
import type { TradingViewWidgetOptions } from "@/components/chart/types";
import { Datafeed } from "@/components/chart/datafeed";
import { AxiosInstance } from "axios";
import { ChartStorage } from "@/components/chart/chart_storage";
import { LogoProvider } from "@/components/chart/logo_provider";

export class ChartManager {
  private readonly widgets = new Map<string, TradingView.widget>();
  private readonly datafeed: Datafeed;
  private readonly chartStorage: ChartStorage;
  private readonly logoProvider: LogoProvider;

  constructor(axios: AxiosInstance, logoBaseUrl: string) {
    this.logoProvider = new LogoProvider(logoBaseUrl);
    this.datafeed = new Datafeed(axios, this.logoProvider);
    this.chartStorage = new ChartStorage(axios);
  }

  create(container: HTMLElement, symbol: string) {
    const TradingView = window.TradingView;
    const c = this.getConfig();
    const tvWidget = new TradingView.widget({
      ...c,
      container,
      symbol: symbol ?? "NSE:NIFTY",
    });
    tvWidget.onChartReady(() => this.onChartReady(tvWidget));
    return tvWidget;
  }

  private getChart(id: string) {
    if (this.widgets.has(id)) {
      return this.widgets.get(id)!;
    }
    throw new Error("Unable to get chart");
  }

  private onChartReady = (chart: TradingView.widget) => {
    chart.subscribe("onAutoSaveNeeded", () =>
      chart.saveChartToServer(() => console.log("Chart saved to server")),
    );
  };

  private getConfig(): Omit<TradingViewWidgetOptions, "container" | "symbol"> {
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
      ],

      enabled_features: [
        "border_around_the_chart",
        "create_volume_indicator_by_default",
        "items_favoriting",
        "show_symbol_logos",
        "show_symbol_logo_for_compare_studies",
        "show_symbol_logo_in_legend",
        "study_templates",
        "saveload_separate_drawings_storage",
        "chart_template_storage",
        // "pricescale_currency",
        "pre_post_market_sessions",
        "studies_extend_time_scale",
        "hide_image_invalid_symbol",
      ],
      save_load_adapter: this.chartStorage,
    };
  }
}
