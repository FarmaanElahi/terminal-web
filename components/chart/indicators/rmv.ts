import { CustomIndicator, PineJS } from "./pinejs";

interface RMV2Props {
  loopback: number;
}

export function RMV(PineJS: PineJS): CustomIndicator<RMV2Props> {
  return {
    name: "TM-RMV",
    metainfo: {
      description: "TM-RMV",
      id: "TM-RMV@tv-basicstudies-1",
      shortDescription: "TM-RMV",
      isCustomIndicator: true,
      _metainfoVersion: 53,
      is_price_study: false,
      format: { type: "inherit" },
      plots: [{ id: "plot_0", type: "line" }],
      bands: [
        { id: "hline_0", isHidden: false, name: "Level 1" },
        { id: "hline_1", isHidden: false, name: "Level 2" },
        { id: "hline_2", isHidden: false, name: "Level 3" },
        { id: "hline_3", isHidden: false, name: "Level 4" },
      ],
      filledAreas: [
        {
          fillgaps: false,
          id: "fill_0",
          isHidden: false,
          objAId: "hline_0",
          objBId: "hline_1",
          title: "Zone 1",
          type: "hline_hline",
        },
        {
          fillgaps: false,
          id: "fill_1",
          isHidden: false,
          objAId: "hline_1",
          objBId: "hline_2",
          title: "Zone 2",
          type: "hline_hline",
        },
        {
          fillgaps: false,
          id: "fill_2",
          isHidden: false,
          objAId: "hline_2",
          objBId: "hline_3",
          title: "Zone 3",
          type: "hline_hline",
        },
      ],
      styles: {
        plot_0: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "lookback_period0",
          name: "Lookback Period",
          type: "integer",
          defval: 15,
        },
      ],
      defaults: {
        inputs: { lookback_period0: 15 },
        bands: [
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 15,
            visible: true,
          },
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 10,
            visible: true,
          },
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 5,
            visible: true,
          },
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 0,
            visible: true,
          },
        ],
        filledAreasStyle: {
          fill_0: { color: "#00897B", transparency: 90, visible: true },
          fill_1: { color: "#4CAF50", transparency: 90, visible: true },
          fill_2: { color: "#9C27B0", transparency: 90, visible: true },
        },
        styles: {
          plot_0: {
            display: 15,
            color: "#2196F3",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
        },
      },
    },
    constructor: function (this) {
      this.init = function (ctx, inputs) {
        this._context = ctx;
        this._input = inputs;
        this.loopback = this._input(0);
      };

      this.main = function (ctx) {
        this._context = ctx;

        // Calculations based on 2-period highs/lows
        const high2 = PineJS.Std.highest(
          this._context.new_var(PineJS.Std.high(this._context)),
          2,
          this._context,
        ); // o
        const lowOfHigh2 = PineJS.Std.lowest(
          this._context.new_var(PineJS.Std.high(this._context)),
          2,
          this._context,
        ); // i (this is unusual, lowest of highs)
        const close2 = PineJS.Std.highest(
          this._context.new_var(PineJS.Std.close(this._context)),
          2,
          this._context,
        ); // a
        const lowClose2 = PineJS.Std.lowest(
          this._context.new_var(PineJS.Std.close(this._context)),
          2,
          this._context,
        ); // c
        const highOfLow2 = PineJS.Std.highest(
          this._context.new_var(PineJS.Std.low(this._context)),
          2,
          this._context,
        ); // l (highest of lows)
        const low2 = PineJS.Std.lowest(
          this._context.new_var(PineJS.Std.low(this._context)),
          2,
          this._context,
        ); // u

        const term1_2p = ((high2 - lowOfHigh2) / lowClose2) * 100; // d
        const term2_2p = ((close2 - lowClose2) / lowClose2) * 100; // p
        const term3_2p = ((highOfLow2 - low2) / low2) * 100; // f
        const avg_2p = (term1_2p + 1.5 * term2_2p + term3_2p) / 3; // M

        // Calculations based on 3-period highs/lows
        const high3 = PineJS.Std.highest(
          this._context.new_var(PineJS.Std.high(this._context)),
          3,
          this._context,
        ); // g
        const lowOfHigh3 = PineJS.Std.lowest(
          this._context.new_var(PineJS.Std.high(this._context)),
          3,
          this._context,
        ); // O
        const close3 = PineJS.Std.highest(
          this._context.new_var(PineJS.Std.close(this._context)),
          3,
          this._context,
        ); // v
        const lowClose3 = PineJS.Std.lowest(
          this._context.new_var(PineJS.Std.close(this._context)),
          3,
          this._context,
        ); // y

        const term1_3p = ((high3 - lowOfHigh3) / lowClose3) * 100; // A
        const term2_3p = 1.5 * ((close3 - lowClose3) / lowClose3) * 100; // _
        const avg_3p = (term1_3p + term2_3p) / 2; // C

        const combinedAvg = (3 * avg_2p + avg_3p) / 4; // S
        const combinedAvgSeries = this._context.new_var(combinedAvg);

        const highestCombinedAvg = PineJS.Std.highest(
          combinedAvgSeries,
          this.loopback,
          this._context,
        ); // x
        const lowestCombinedAvg = PineJS.Std.lowest(
          combinedAvgSeries,
          this.loopback,
          this._context,
        ); // R

        const rmvValue =
          ((combinedAvg - lowestCombinedAvg) /
            (highestCombinedAvg - lowestCombinedAvg)) *
          100;
        return [rmvValue];
      };
    },
  };
}
