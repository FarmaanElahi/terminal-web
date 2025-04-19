import { CustomIndicator, LineStudyPlotStyle, PineJS } from "./pinejs";

interface MarketCycleCountProps {
  length: number;
  adr_option: "Range" | "Percent";
}

export function ADR(PineJS: PineJS): CustomIndicator<MarketCycleCountProps> {
  return {
    name: "TM-ADR",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-ADR",
      defaults: {
        inputs: { length: 14, adr_option: "Range" },
        styles: { adr: { plottype: LineStudyPlotStyle.Line } },
        palettes: {},
      },
      description: "TM-ADR",
      format: { type: "inherit" },
      id: "TM-ADR@tv-basicstudies-1",
      inputs: [
        { id: "length", name: "Length", type: "integer" },
        {
          id: "adr_option",
          name: "ADR",
          type: "text",
          options: ["Range", "Percent"],
        },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {},
      plots: [{ id: "adr", type: "line" }],
      styles: { adr: { title: "ADR" } },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.length = this._input(0);
        this.adr_option = this._input(1);
      };
      this.main = function (ctx) {
        this._context = ctx;
        const close = PineJS.Std.close(this._context);
        const h = this._context.new_unlimited_var(
          PineJS.Std.high(this._context),
        );
        const hSMA = PineJS.Std.sma(h, this.length, this._context);
        const l = this._context.new_unlimited_var(
          PineJS.Std.low(this._context),
        );
        const lSMA = PineJS.Std.sma(l, this.length, this._context);

        const adr = hSMA - lSMA;
        const adrp = (adr / close) * 100;
        const value = this.adr_option === "Percent" ? adrp : adr;
        return [value];
      };
    },
  };
}
