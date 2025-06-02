import { CustomIndicator, PineJS } from "./pinejs";

interface RMEProps {
  loopback: number;
  smaLength: number;
}

export function RME(PineJS: PineJS): CustomIndicator<RMEProps> {
  return {
    name: "TM-RME",
    metainfo: {
      _metainfoVersion: 53,
      description: "TM-RME",
      id: "TM-RME@tv-basicstudies-1",
      shortDescription: "TM-RME",
      is_price_study: false, // !1
      isCustomIndicator: true, // !0
      format: { type: "inherit" },
      bands: [
        { id: "hline_0", isHidden: false, name: "Neutral" },
        { id: "hline_1", isHidden: false, name: "Overbought Zone Start" },
        { id: "hline_2", isHidden: false, name: "Overbought Zone End" },
        { id: "hline_3", isHidden: false, name: "Oversold Zone Start" },
        { id: "hline_4", isHidden: false, name: "Oversold Zone End" },
        { id: "hline_5", isHidden: false, name: "Level" }, // Used for fill_0
        { id: "hline_6", isHidden: false, name: "Level" }, // Used for fill_0
        { id: "hline_7", isHidden: false, name: "Level" }, // Used for fill_1
        { id: "hline_8", isHidden: false, name: "Level" }, // Used for fill_1
      ],
      filledAreas: [
        {
          fillgaps: false,
          id: "fill_0",
          isHidden: false,
          objAId: "hline_5",
          objBId: "hline_6",
          title: "Overbought Zone Fill",
          type: "hline_hline",
        },
        {
          fillgaps: false,
          id: "fill_1",
          isHidden: false,
          objAId: "hline_7",
          objBId: "hline_8",
          title: "Oversold Zone Fill",
          type: "hline_hline",
        },
      ],
      inputs: [
        {
          id: "lookback_period",
          name: "Lookback Period",
          type: "integer",
          defval: 250,
          min: 1,
        },
        {
          id: "sma_length",
          name: "SMA Length",
          type: "integer",
          defval: 50,
          min: 1,
        },
      ],
      plots: [{ id: "plot_osc", type: "line" }],
      styles: {
        plot_osc: {
          histogramBase: 0,
          isHidden: false,
          joinPoints: false,
          title: "Relative Extension",
        },
      },
      defaults: {
        bands: [
          {
            color: "#2962ff",
            linestyle: 2,
            linewidth: 1,
            value: 0,
            visible: true,
          }, // Neutral
          {
            color: "#FF5252",
            linestyle: 2,
            linewidth: 1,
            value: 70,
            visible: true,
          }, // Overbought Start
          {
            color: "#FF5252",
            linestyle: 2,
            linewidth: 1,
            value: 100,
            visible: true,
          }, // Overbought End
          {
            color: "#FF5252",
            linestyle: 2,
            linewidth: 1,
            value: -70,
            visible: true,
          }, // Oversold Start
          {
            color: "#FF5252",
            linestyle: 2,
            linewidth: 1,
            value: -100,
            visible: true,
          }, // Oversold End
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 70,
            visible: true,
          }, // hline_5
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: 100,
            visible: true,
          }, // hline_6
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: -70,
            visible: true,
          }, // hline_7
          {
            color: "#808080",
            linestyle: 2,
            linewidth: 1,
            value: -100,
            visible: true,
          }, // hline_8
        ],
        filledAreasStyle: {
          fill_0: { color: "#ff5252", transparency: 90, visible: true },
          fill_1: { color: "#ff5252", transparency: 90, visible: true },
        },
        inputs: {
          lookback_period: 250,
          sma_length: 50,
        },
        styles: {
          plot_osc: {
            color: "#2962ff",
            display: 15,
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
          },
        },
      },
    },
    constructor: function (this) {
      this.init = function (context, inputs) {
        this._context = context;
        this._input = inputs;
        this.loopback = this._input(0);
        this.smaLength = this._input(1);
      };
      this.main = function (context) {
        this._context = context;

        const closeSeries = context.new_unlimited_var(
          PineJS.Std.close(this._context),
        ); // i
        const currentHigh = PineJS.Std.high(this._context); // a
        const currentLow = PineJS.Std.low(this._context); // c

        // Calculate the percentage range of the current bar
        const highLowRangePercent =
          ((currentHigh - currentLow) / currentLow) * 100; // l

        // SMA of the high-low range percentage (fixed at 100 periods)
        const smaOfHighLowRangePercent = PineJS.Std.sma(
          context.new_var(highLowRangePercent),
          100,
          context,
        ); // u

        // SMA of the close price using the input smaLength
        const closeSma = PineJS.Std.sma(closeSeries, this.smaLength, context); // d

        // Determine reference price: if current close is above its SMA, use current high, else use current low.
        const referencePriceForExtension =
          closeSeries.get(0) > closeSma ? currentHigh : currentLow;

        // Calculate the raw extension value
        // It's the percentage difference of the referencePriceForExtension from closeSma,
        // then normalized by the rounded average bar range (smaOfHighLowRangePercent).
        const rawExtensionValue =
          (((referencePriceForExtension - closeSma) / closeSma) * 100) /
          Math.round(smaOfHighLowRangePercent); // M

        const rawExtensionSeries = context.new_var(rawExtensionValue);
        const highestExtension = PineJS.Std.highest(
          rawExtensionSeries,
          this.loopback,
          context,
        ); // g
        const lowestExtension = PineJS.Std.lowest(
          rawExtensionSeries,
          this.loopback,
          context,
        ); // O

        // Normalize the rawExtensionValue to a -100 to 100 range (like a stochastic oscillator)
        let finalOscillatorValue = 0;
        if (highestExtension - lowestExtension !== 0) {
          finalOscillatorValue =
            ((rawExtensionValue - lowestExtension) /
              (highestExtension - lowestExtension)) *
              200 -
            100;
        } else if (rawExtensionValue > 0) {
          // Avoid division by zero if high == low, assign max/min based on sign
          finalOscillatorValue = 100;
        } else if (rawExtensionValue < 0) {
          finalOscillatorValue = -100;
        }
        // If rawExtensionValue is 0 and high==low, it remains 0.

        // The second value '0' in the return array is often for a colorer,
        // but plot_osc doesn't have a colorer defined in its plots.
        // It might be a leftover or for potential future use.
        return [finalOscillatorValue, 0];
      };
    },
  };
}
