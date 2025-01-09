import type { TradingView } from "@/components/chart/charting";
import type { TradingViewWidgetOptions } from "@/components/chart/types";
import { Datafeed } from "@/components/chart/datafeed";
import { getTradingView } from "@/components/chart/loader";
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

  async create(id: string, container: HTMLElement) {
    if (this.widgets.has(id)) {
      return this.widgets.get(id)!;
    }
    const TradingView = await getTradingView();
    // const TradingView = window.TradingView
    const c = this.getConfig();
    const tvWidget = new TradingView.widget({ container, ...c });
    this.widgets.set(id, tvWidget);
    tvWidget.onChartReady(() => this.onChartReady(id));
    return tvWidget;
  }

  private getChart(id: string) {
    if (this.widgets.has(id)) {
      return this.widgets.get(id)!;
    }
    throw new Error("Unable to get chart");
  }

  private onChartReady = (id: string) => {
    console.log("Chart ready");
    this.getChart(id).subscribe("onAutoSaveNeeded", () =>
      this.getChart(id).saveChartToServer(() =>
        console.log("Chart saved to server"),
      ),
    );
  };

  private getConfig(): Omit<TradingViewWidgetOptions, "container"> {
    // const userSettingAdapter = new UserSetting();
    // await userSettingAdapter.load();
    const timezone = "Asia/Kolkata";
    return {
      symbol: "NSE:JINDRILL",
      datafeed: this.datafeed,
      autosize: true,
      library_path: "/external/charting_library/",
      debug: false,
      fullscreen: true,
      timezone,
      interval: "1D",
      locale: "en",
      auto_save_delay: 3,
      disabled_features: ["order_panel", "trading_account_manager"],
      enabled_features: [
        "show_symbol_logos",
        "show_symbol_logo_for_compare_studies",
        "show_symbol_logo_in_legend",
        "study_templates",
        "saveload_separate_drawings_storage",
        "chart_template_storage",
        // "pricescale_currency",
        "pre_post_market_sessions",
        "studies_extend_time_scale",
      ],
      save_load_adapter: this.chartStorage,
    };
  }

  close(id: string) {
    this.widgets.get(id)?.remove();
    this.widgets.delete(id);
  }
}
