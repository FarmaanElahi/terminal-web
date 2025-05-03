import { CustomIndicator, LineStudyPlotStyle, PineJS } from "./pinejs";

interface PriceVolumeProps {
  absoluteThreshold: number;
  maThreshold: number;
  maMultipleTrigger: number;
}

export function PriceVolume(PineJS: PineJS): CustomIndicator<PriceVolumeProps> {
  return {
    name: "TM-PriceVolume",
    metainfo: {
      isCustomIndicator: true,
      _metainfoVersion: 53,
      shortDescription: "TM-PriceVolume",
      defaults: {
        inputs: {
          absoluteThreshold: 4,
          maThreshold: 1,
          maMultipleTrigger: 5,
        },
        styles: {
          priceVolume: {
            plottype: LineStudyPlotStyle.Histogram,
            color: "green",
          },
        },
        palettes: {},
      },
      description: "TM-PriceVolume",
      format: { type: "volume" },
      id: "TM-PriceVolume@tv-basicstudies-1",
      inputs: [
        {
          type: "float",
          name: "Trigger Threshold(Cr)",
          id: "absoluteThreshold",
        },
        {
          type: "float",
          name: "MA Trigger Threshold(Cr)",
          id: "maThreshold",
        },
        {
          type: "float",
          name: "MA Multiple Trigger",
          id: "maMultipleTrigger",
        },
      ],
      is_hidden_study: false,
      is_price_study: false,
      palettes: {},
      plots: [{ id: "priceVolume", type: "line" }],
      styles: {
        priceVolume: {
          title: "PriceVolume",
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
        this.absoluteThreshold = (this._input(0) as number) * 1_00_00_000;
        this.maThreshold = (this._input(1) as number) * 1_00_00_000;
        this.maMultipleTrigger = this._input(2);
      };
      this.main = function (ctx) {
        this._context = ctx;
        const open = PineJS.Std.close(this._context);
        const high = PineJS.Std.close(this._context);
        const avgPrice = (open + high) / 2;
        const volume = PineJS.Std.volume(this._context);
        const priceVolume = avgPrice * volume;
        const priceVolumeSer = this._context.new_unlimited_var(priceVolume);
        const priceVolumeSma = PineJS.Std.sma(
          priceVolumeSer,
          20,
          this._context,
        );

        const showCandle =
          (priceVolume > priceVolumeSma * this.maMultipleTrigger &&
            priceVolume > this.maThreshold) ||
          priceVolume > this.absoluteThreshold;

        return [showCandle ? priceVolume : NaN];
      };
    },
  };
}
