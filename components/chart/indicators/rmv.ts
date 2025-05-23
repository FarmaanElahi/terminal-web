import {
  CustomIndicator,
  IContext,
  LineStudyPlotStyle,
  LineStyle,
  PineJS,
  StudyPlotDisplayMode,
} from "./pinejs";

interface MarketCycleCountProps {
  loopback: number;
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
          showBgColor: true,
          midpoint1: 10,
          midpoint2: 20,
          midpoint3: 30,
        },
        styles: {
          midpoint_1: {
            plottype: LineStudyPlotStyle.Line,
            linestyle: LineStyle.Dotted,
            color: "green",
            linewidth: 1,
            transparency: 30,
            visible: false,
          },
          midpoint_2: {
            plottype: LineStudyPlotStyle.Line,
            linestyle: LineStyle.Dotted,
            color: "orange",
            linewidth: 1,
            transparency: 30,
            visible: false,
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
            visible: false,
          },
          bg_color: { display: StudyPlotDisplayMode.All },
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
          id: "showBgColor",
          name: "Show BG Color",
          type: "bool",
          group: "RMV",
        },
        { id: "midpoint1", name: "Midpoint 1", type: "float", group: "RMV" },
        { id: "midpoint2", name: "Midpoint 2", type: "float", group: "RMV" },
        { id: "midpoint3", name: "Midpoint 3", type: "float", group: "RMV" },
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
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.loopback = this._input(0);
        this.showBgColor = this._input(1);
        this.midpoint1 = this._input(2);
        this.midpoint2 = this._input(3);
        this.midpoint3 = this._input(4);
      };
      this.main = function (ctx) {
        this._context = ctx;

        const rmv = simpleRMV(PineJS, this._context, this.loopback);

        const histogramThreshold = 30;
        let rmvHistColor = NaN;
        if (rmv > histogramThreshold) rmvHistColor = 1;
        if (rmv <= histogramThreshold) rmvHistColor = 0;

        let bgColor = NaN;
        if (this.showBgColor && rmv >= 0 && rmv <= 10) bgColor = 10;
        if (this.showBgColor && rmv > 10 && rmv <= 20) bgColor = 20;

        return [
          this.midpoint1,
          this.midpoint2,
          this.midpoint3,
          rmv,
          rmv,
          rmvHistColor,
          bgColor,
        ];
      };
    },
  };
}

function simpleRMV(PineJS: PineJS, _context: IContext, loopback: number) {
  const atr = PineJS.Std.atr(loopback, _context);
  const atrSeries = _context.new_unlimited_var(atr);

  const min_atr = PineJS.Std.lowest(atrSeries, loopback, _context);
  const max_atr = PineJS.Std.highest(atrSeries, loopback, _context);

  return (100 * (atr - min_atr)) / (max_atr - min_atr);
}
