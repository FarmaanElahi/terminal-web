import { CustomIndicator, LineStudyPlotStyle, PineJS } from "./pinejs";

interface MSwingProp {
  d_short: number;
  d_long: number;
  ma_type: "EMA" | "SMA";
  ma_length: number;
}

export function MSwing(PineJS: PineJS): CustomIndicator<MSwingProp> {
  return {
    name: "TM-MSwing",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-MSwing",
      defaults: {
        inputs: { d_short: 20, d_long: 50, ma_type: "EMA", ma_length: 9 },
        bands: [
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 0,
            visible: true,
          },
        ],
        styles: {
          swing_line: { plottype: LineStudyPlotStyle.Line },
          swing_line_ma: {
            plottype: LineStudyPlotStyle.Line,
            color: "#363a45",
            linewidth: 1,
          },
        },
        palettes: {
          mSwingLineColorPalette: {
            colors: {
              0: { color: "#2196F3", width: 2, style: 0 },
              1: { color: "#E040FB", width: 2, style: 0 },
            },
          },
        },
      },
      bands: [{ id: "hline_0", isHidden: false, name: "Zero Line" }],
      description: "TM-MSwing",
      format: { type: "inherit" },
      id: "TM-MSwing@tv-basicstudies-1",
      inputs: [
        { id: "d_short", name: "Day Short", type: "integer" },
        { id: "d_long", name: "Day Long", type: "integer" },
        {
          id: "ma_type",
          name: "MA Type",
          type: "text",
          options: ["EMA", "SMA"],
        },
        { id: "ma_length", name: "MA Length", type: "integer", min: 1 },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {
        mSwingLineColorPalette: {
          valToIndex: { 0: 0, 1: 1 },
          colors: {
            0: { name: "Swing Line Up" },
            1: { name: "Swing Line Down" },
          },
        },
      },
      plots: [
        { id: "swing_line", type: "line" },
        {
          id: "swing_line_colorer",
          type: "colorer",
          target: "swing_line",
          palette: "mSwingLineColorPalette",
        },
        { id: "swing_line_ma", type: "line" },
      ],
      styles: {
        swing_line: { title: "Swing Line" },
        swing_line_ma: { title: "Swing Line MA" },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.d_short = this._input(0);
        this.d_long = this._input(1);
        this.ma_type = this._input(2);
        this.ma_length = this._input(3);
      };
      this.main = function (ctx) {
        this._context = ctx;
        const close = this._context.new_unlimited_var(
          PineJS.Std.close(this._context),
        );
        const mom_short =
          ((close.get(0) - close.get(this.d_short)) * 100) /
          close.get(this.d_short) /
          this.d_short;

        const mom_long =
          ((close.get(0) - close.get(this.d_long)) * 100) /
          close.get(this.d_long) /
          this.d_long;
        const mom = this._context.new_unlimited_var(mom_short + mom_long);
        const maType = this.ma_type === "SMA" ? PineJS.Std.sma : PineJS.Std.ema;
        const mom_ma = maType(mom, this.ma_length, this._context);
        const momColor = mom.get() > 0 ? 0 : 1;
        return [mom.get(0), momColor, mom_ma];
      };
    },
  };
}
