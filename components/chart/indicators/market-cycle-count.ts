import { CustomIndicator, LineStudyPlotStyle, PineJS } from "./pinejs";

interface MarketCycleCountProps {
  comparativeTickerId: string;
  maType: "MA" | "EMA";
  maLength: number;
}

export function MarketCycleCount(
  PineJS: PineJS,
): CustomIndicator<MarketCycleCountProps> {
  return {
    name: "TM-MarketCycle",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-Market Cycle",
      canExtendTimeScale: true,
      defaults: {
        inputs: {
          market: "NSE:NIFTY",
          maType: "EMA",
          maLength: 21,
        },
        styles: {
          cycle_days: {
            linestyle: 0,
            linewidth: 2,
            plottype: LineStudyPlotStyle.Histogram,
          },
        },
        palettes: {
          trend_color_palette: {
            colors: {
              0: { color: "green", width: 1, style: 0 },
              1: { color: "red", width: 1, style: 0 },
            },
          },
        },
      },
      description: "TM-Market Cycle",
      format: { type: "inherit" },
      id: "TM-MarketCycleCount@tv-basicstudies-1",
      inputs: [
        {
          id: "market",
          name: "Base Line Index",
          type: "symbol",
        },
        {
          id: "maType",
          name: "MA Type",
          type: "text",
          options: ["EMA", "MA"],
        },
        {
          id: "maLength",
          name: "MA Length",
          type: "integer",
          min: 1,
          max: 1000,
        },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {
        trend_color_palette: {
          colors: {
            0: {
              name: "Up Cycle",
            },
            1: {
              name: "Down Cycle",
            },
          },
        },
      },
      plots: [
        {
          id: "cycle_days",
          type: "line",
        },
        {
          id: "trend_color",
          type: "colorer",
          palette: "trend_color_palette",
          target: "cycle_days",
        },
      ],
      styles: {
        cycle_days: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Cycle Count",
        },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        // Store inputs
        this.comparativeTickerId = this._input(0);
        this.maType = this._input(1);
        this.maLength = this._input(2);
        // Load additional symbol data
        ctx.new_sym(
          this.comparativeTickerId,
          "D", // Use daily data for market cycle
          PineJS.Std.currencyCode(this._context),
          PineJS.Std.unitId(this._context),
          "regular",
        );
        this._context.setMinimumAdditionalDepth(this.maLength);
      };
      this.main = function (ctx) {
        this._context = ctx;

        // Calculate Base Line Index MA
        // Switch to the comparative symbol
        this._context.select_sym(1);

        // Close Price
        const close = PineJS.Std.close(this._context);
        const closeSeries = this._context.new_unlimited_var(close);

        // MA
        const maFunc = this.maType === "MA" ? "sma" : "ema";
        const ma = PineJS.Std[maFunc](
          closeSeries,
          this.maLength,
          this._context,
        );
        const maSeries = this._context.new_unlimited_var(ma);

        const isCurrentAboveMA = PineJS.Std.ge(close, ma);
        const isPrevAboveMa = PineJS.Std.ge(
          closeSeries.get(1),
          maSeries.get(1),
        );

        const isPrevBelowMa = !isPrevAboveMa;
        const cycleCountSeries = this._context.new_unlimited_var();
        const prev = cycleCountSeries.get(1);

        let cycleCount = 0;
        // When the market is above the MA
        if (isCurrentAboveMA) {
          cycleCount = isPrevAboveMa ? prev + 1 : 1;
        }
        // When the Market is below MA
        if (!isCurrentAboveMA) {
          cycleCount = isPrevBelowMa
            ? prev - 1 // Continuation of the trend
            : -1;
        }
        cycleCountSeries.set(cycleCount);

        const trendColor = isCurrentAboveMA ? 0 : 1;
        //========= End Calculation ==========

        return [
          // Market cycle count
          cycleCount,
          trendColor,
        ] satisfies (number | string)[];
      };
    },
  };
}
