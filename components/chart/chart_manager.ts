import type { TradingView } from "@/components/chart/charting";
import type { TradingViewWidgetOptions } from "@/components/chart/types";
import { Feed } from "@/components/chart/feed";
import { getTradingView } from "@/components/chart/loader";

export class ChartManager {
  private readonly widgets = new Map<string, TradingView.widget>();

  async create(id: string, container: HTMLElement) {
    if (this.widgets.has(id)) {
      return this.widgets.get(id)!;
    }
    const TradingView = await getTradingView();
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
    const datafeed = new Feed("http://localhost:8000");
    return {
      symbol: "NSE:JINDRILL",
      datafeed,
      autosize: true,
      library_path: "/charting_library/",
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
        // "study_templates",
        "saveload_separate_drawings_storage",
        // "chart_template_storage",
        // "pricescale_currency",
        "pre_post_market_sessions",
        "studies_extend_time_scale",
      ],
      load_last_chart: true,
      // save_load_adapter: new ChartStorage(),
    };
  }

  close(id: string) {
    this.widgets.get(id)?.remove();
    this.widgets.delete(id);
  }
}
