import { CustomIndicator, LineStudyPlotStyle, PineJS } from "./pinejs";

interface MarketCycleCountProps {
  comparativeTickerId: string;
  verticalOffset: number;
  maLength: number;
  maType: "SMA" | "EMA";
}

export function RSLine(PineJS: PineJS): CustomIndicator<MarketCycleCountProps> {
  return {
    name: "TM-RS Line",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-RS Line",
      defaults: {
        inputs: {
          comparativeTickerId: "NSE:NIFTY",
          maLength: 21,
          maType: "EMA",
          verticalOffset: 30,
        },
        styles: {
          rs_line: { plottype: LineStudyPlotStyle.Line },
          rs_ma: {
            plottype: LineStudyPlotStyle.Line,
            color: "#FF5252",
            linewidth: 1,
          },
        },
        palettes: {
          rsLineColorPalette: {
            colors: {
              0: { color: "#2196F3", width: 2, style: 0 },
              1: { color: "#E040FB", width: 2, style: 0 },
            },
          },
          rsFillUpperColor: {
            colors: {
              0: { color: "#2196F3", width: 1, style: 0 },
            },
          },
          rsFillLowerColor: {
            colors: {
              0: { color: "#E040FB", width: 1, style: 0 },
            },
          },
        },
        filledAreasStyle: {
          fill_rs_upper: {
            color: "purple",
            transparency: 75,
            visible: true,
          },
          fill_rs_lower: {
            color: "yellow",
            transparency: 75,
            visible: true,
          },
        },
      },
      description: "TM-RS Line",
      format: { type: "inherit" },
      id: "TM-RSLine@tv-basicstudies-1",
      inputs: [
        {
          id: "comparativeTickerId",
          name: "Calculate RS Vs Index",
          group: "RS Line",
          type: "symbol",
        },
        {
          id: "verticalOffset",
          name: "Vertical Offset",
          type: "integer",
          group: "RS Line",
        },
        {
          id: "maLength",
          name: "RS MA Length",
          type: "integer",
          group: "RS Line MA",
        },
        {
          id: "maType",
          name: "RS MA Type",
          type: "text",
          options: ["SMA", "EMA"],
          group: "RS Line MA",
        },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {
        rsLineColorPalette: {
          valToIndex: { 0: 0, 1: 1 },
          colors: {
            0: { name: "RS Line Up" },
            1: { name: "RS Line Down" },
          },
        },
        rsFillUpperColor: {
          valToIndex: { 0: 0 },
          colors: {
            0: { name: " RS Upper Area" },
          },
        },
        rsFillLowerColor: {
          valToIndex: { 0: 0 },
          colors: {
            0: { name: " RS Lower Area" },
          },
        },
      },
      plots: [
        { id: "rs_line", type: "line" },
        { id: "rs_ma", type: "line" },
        {
          id: "rs_line_colorer",
          type: "colorer",
          target: "rs_line",
          palette: "rsLineColorPalette",
        },
        {
          id: "plot_fill_rs_upper",
          type: "colorer", // StudyPlotType.Colorer,
          target: "fill_rs_upper",
          palette: "rsFillUpperColor",
        },
        {
          id: "plot_fill_rs_lower",
          type: "colorer", // StudyPlotType.Colorer,
          target: "fill_rs_lower",
          palette: "rsFillLowerColor",
        },
      ],
      filledAreas: [
        {
          id: "fill_rs_upper",
          objAId: "rs_line",
          objBId: "rs_ma",
          type: "plot_plot",
          title: "Above RS Line MA",
          palette: "rsFillUpperColor",
          fillToIntersection: true,
        },
        {
          id: "fill_rs_lower",
          objAId: "rs_ma",
          objBId: "rs_line",
          type: "plot_plot",
          title: "Below RS Line MA",
          palette: "rsFillLowerColor",
          fillToIntersection: true,
        },
      ],
      styles: {
        rs_line: {
          title: "RS Line",
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
        },
        rs_ma: {
          title: "RS Line MA",
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
        this.comparativeTickerId = this._input(0);
        this.verticalOffset = this._input(1);
        this.maLength = this._input(2);
        this.maType = this._input(3);

        // Load additional symbol data
        ctx.new_sym(
          this.comparativeTickerId,
          PineJS.Std.period(this._context),
          PineJS.Std.currencyCode(this._context),
          PineJS.Std.unitId(this._context),
          "regular",
        );
      };
      this.main = function (ctx) {
        this._context = ctx;

        // Main Symbol
        this._context.select_sym(0);
        const mainValue = PineJS.Std.close(this._context);
        const main = this._context.new_var(mainValue);
        const mainTime = this._context.new_var(this._context.symbol.time);

        // Switch to comparative symbol
        this._context.select_sym(1);
        const compV = PineJS.Std.close(this._context);
        const comp = this._context.new_var(compV);
        const compTime = this._context.new_var(this._context.symbol.time);

        // Switch back to main symbol and align the series
        this._context.select_sym(0);
        const alignedV = comp.adopt(compTime, mainTime, 1);
        const alignedComp = this._context.new_var(alignedV);

        const rsLine =
          (main.get() / alignedComp.get()) * 100 * this.verticalOffset;
        const rsLineSeries = this._context.new_unlimited_var(rsLine);
        const ma = this.maType === "SMA" ? "sma" : "ema";
        const rsMA = PineJS.Std[ma](rsLineSeries, this.maLength, this._context);

        const rsColor = rsLine > rsMA ? 0 : 1;
        const rsUpperArea = rsLine > rsMA ? 0 : NaN;
        const rsLowerArea = rsLine < rsMA ? 0 : NaN;
        return [rsLine, rsMA, rsColor, rsUpperArea, rsLowerArea];
      };
    },
  };
}
