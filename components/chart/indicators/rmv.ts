import {
  CustomIndicator,
  LineStudyPlotStyle,
  LineStyle,
  PineJS,
  StudyPlotDisplayMode,
} from "./pinejs";

interface MarketCycleCountProps {
  loopback: number;
  short1: number;
  short2: number;
  short3: number;
  midpoint1: number;
  midpoint2: number;
  midpoint3: number;
  showBgColor: boolean;
  slAtrLoopback: number;
  slAtrMultiplier: number;
}

export function RMV(PineJS: PineJS): CustomIndicator<MarketCycleCountProps> {
  return {
    name: "TM-RMV",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-RMV",
      defaults: {
        inputs: {
          loopback: 5,
          short1: 3,
          short2: 5,
          short3: 8,
          midpoint1: 10,
          midpoint2: 20,
          midpoint3: 30,
          showBgColor: true,
          slAtrLoopback: 14,
          slAtrMultiplier: 2,
        },
        styles: {
          midpoint_1: {
            plottype: LineStudyPlotStyle.Line,
            linestyle: LineStyle.Dotted,
            color: "green",
            linewidth: 1,
            transparency: 30,
          },
          midpoint_2: {
            plottype: LineStudyPlotStyle.Line,
            linestyle: LineStyle.Dotted,
            color: "orange",
            linewidth: 1,
            transparency: 30,
          },
          midpoint_3: {
            plottype: LineStudyPlotStyle.Line,
            linestyle: LineStyle.Dotted,
            color: "red",
            linewidth: 1,
            transparency: 30,
          },
          rmv: {
            plottype: LineStudyPlotStyle.Line,
            color: "#787b86",
            linewidth: 1,
            transparency: 30,
          },
          rmv_histogram: {
            linestyle: 0,
            linewidth: 1,
            plottype: LineStudyPlotStyle.Histogram,
          },
          bg_color: { display: StudyPlotDisplayMode.All },
          sl: {
            plottype: LineStudyPlotStyle.Line,
            linewidth: 2,
            transparency: 30,
          },
        },
        palettes: {
          bg_color_palette: {
            colors: {
              10: { color: "green", width: 1, style: 0 },
              20: { color: "orange", width: 1, style: 0 },
            },
          },
          rmv_histogram_color_palette: {
            colors: {
              0: { color: "white", width: 3, style: 0 },
              1: { color: "#787b86", width: 1, style: 0 },
            },
          },
        },
      },
      description: "TM-RMV",
      format: { type: "inherit" },
      id: "TM-RMV@tv-basicstudies-1",
      inputs: [
        { id: "loopback", name: "Length", type: "integer", group: "RMV" },
        {
          id: "short1",
          name: "Short-term Lookback 1",
          type: "integer",
          group: "RMV",
        },
        {
          id: "short2",
          name: "Short-term Lookback 2",
          type: "integer",
          group: "RMV",
        },
        {
          id: "short3",
          name: "Short-term Lookback 3",
          type: "integer",
          group: "RMV",
        },
        {
          id: "showBgColor",
          name: "Show BG Color",
          type: "bool",
          group: "RMV",
        },
        { id: "midpoint1", name: "Midpoint 1", type: "float", group: "RMV" },
        { id: "midpoint2", name: "Midpoint 2", type: "float", group: "RMV" },
        { id: "midpoint3", name: "Midpoint 3", type: "float", group: "RMV" },
        {
          id: "slAtrLoopback",
          name: "SL ATR Loopback",
          type: "integer",
          group: "Stoploss",
        },
        {
          id: "slAtrMultiplier",
          name: "SL ATR Multiplier",
          type: "float",
          group: "Stoploss",
        },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {
        bg_color_palette: {
          colors: {
            10: { name: "Background Color for 0-10 RMV" },
            20: { name: "Background Color for 10-20 RMV" },
          },
        },
        rmv_histogram_color_palette: {
          colors: {
            0: { name: "Histogram Bright Color" },
            1: { name: "Histogram Dim Color" },
          },
        },
      },
      plots: [
        { id: "midpoint_1", type: "line" },
        { id: "midpoint_2", type: "line" },
        { id: "midpoint_3", type: "line" },
        { id: "rmv", type: "line" },
        { id: "rmv_histogram", type: "line" },
        {
          id: "rmv_hist_colorer",
          type: "colorer",
          palette: "rmv_histogram_color_palette",
          target: "rmv_histogram",
        },
        {
          id: "bg_color",
          type: "bg_colorer",
          palette: "bg_color_palette",
        },
        { id: "sl", type: "line" },
      ],
      styles: {
        midpoint_1: {
          title: "Midpoint 1",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
        midpoint_2: {
          title: "Midpoint 2",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
        midpoint_3: {
          title: "Midpoint 3",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
        rmv: {
          title: "RMV",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
        rmv_histogram: {
          title: "RMV Histogram",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
        bg_color: {
          title: "BG Color",
        },
        sl: {
          title: "SL Percent",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.loopback = this._input(0);
        this.short1 = this._input(1);
        this.short2 = this._input(2);
        this.short3 = this._input(3);
        this.showBgColor = this._input(4);
        this.midpoint1 = this._input(5);
        this.midpoint2 = this._input(6);
        this.midpoint3 = this._input(7);
        this.slAtrLoopback = this._input(8);
        this.slAtrMultiplier = this._input(9);
      };
      this.main = function (ctx) {
        this._context = ctx;

        // Short term average
        const shortAvg = this._context.new_unlimited_var(
          (PineJS.Std.atr(this.short1, this._context) +
            PineJS.Std.atr(this.short2, this._context) +
            PineJS.Std.atr(this.short3, this._context)) /
            3,
        );

        // Highest and Lowest of the Short term average
        const highestShortAvg = PineJS.Std.highest(
          shortAvg,
          this.loopback,
          this._context,
        );
        const lowestShortAvg = PineJS.Std.lowest(
          shortAvg,
          this.loopback,
          this._context,
        );

        const rmv =
          ((shortAvg.get() - lowestShortAvg) /
            PineJS.Std.max(highestShortAvg - lowestShortAvg, 0.001)) *
          100;

        const histogramThreshold = 30;
        let rmvHistColor = NaN;
        if (rmv > histogramThreshold) rmvHistColor = 1;
        if (rmv <= histogramThreshold) rmvHistColor = 0;

        let bgColor = NaN;
        if (this.showBgColor && rmv >= 0 && rmv <= 10) bgColor = 10;
        if (this.showBgColor && rmv > 10 && rmv <= 20) bgColor = 20;

        // Stoploss calculation
        const close = PineJS.Std.close(this._context);
        const atr = PineJS.Std.atr(this.slAtrLoopback, this._context);
        const sl = atr * this.slAtrMultiplier;
        const slPer = (sl / close) * 100;

        return [
          this.midpoint1,
          this.midpoint2,
          this.midpoint3,
          rmv,
          rmv,
          rmvHistColor,
          bgColor,
          slPer,
        ];
      };
    },
  };
}
